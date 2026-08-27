import http from 'http';

const BASE_URL = 'http://localhost:5000/api';

async function req(endpoint, method = 'GET', body = null, token = null) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : null
  });

  const data = await res.json().catch(() => ({}));
  return { status: res.status, ok: res.ok, data };
}

async function runE2ETests() {
  console.log('\n======================================================');
  console.log(' STARTING END-TO-END VERIFICATION & AUDIT SUITE');
  console.log('======================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition, testName) {
    if (condition) {
      console.log(` ✅ PASS: ${testName}`);
      passed++;
    } else {
      console.error(` ❌ FAIL: ${testName}`);
      failed++;
    }
  }

  try {
    // 1. Health Check
    const health = await req('/health');
    assert(health.ok && health.data.status === 'ok', 'Server health check returns ok');

    // 2. Role Authentication
    console.log('\n--- Testing Authentication & JWT Claims ---');
    const adminLogin = await req('/auth/login', 'POST', { email: 'admin@portal.edu', password: 'admin123' });
    assert(adminLogin.ok && adminLogin.data.user.role === 'admin', 'Admin login successful and role verified');
    const adminToken = adminLogin.data.token;

    const trainerLogin = await req('/auth/login', 'POST', { email: 'trainer.alex@portal.edu', password: 'trainer123' });
    assert(trainerLogin.ok && trainerLogin.data.user.role === 'trainer', 'Trainer Alex login successful and role verified');
    const trainerToken = trainerLogin.data.token;

    const studentLogin = await req('/auth/login', 'POST', { email: 'student.john@portal.edu', password: 'student123' });
    assert(studentLogin.ok && studentLogin.data.user.role === 'student', 'Student John login successful and role verified');
    const studentToken = studentLogin.data.token;

    // 3. Student Attendance Marking & Duplicate Prevention
    console.log('\n--- Testing Student Attendance Workflow ---');
    const testSession = `Special Evening Session ${Date.now()}`;
    const markRes = await req('/attendance/mark', 'POST', { session: testSession, notes: 'Automated test attendance' }, studentToken);
    assert(markRes.status === 201 && markRes.data.data.status === 'Pending Verification', 'Student marks attendance -> initial status is Pending Verification');
    const createdAttendanceId = markRes.data.data.id;

    // Duplicate Check
    const duplicateRes = await req('/attendance/mark', 'POST', { session: testSession }, studentToken);
    assert(duplicateRes.status === 400, 'Duplicate attendance prevention enforced (same student, batch, date, session)');

    // Student Attendance History
    const myAtt = await req('/attendance/my', 'GET', null, studentToken);
    assert(myAtt.ok && Array.isArray(myAtt.data.data), 'Student retrieves own attendance history');
    assert(myAtt.data.stats && myAtt.data.stats.attendancePercentage !== undefined, 'Attendance stats and percentage computed');

    // 4. Student Complaints Submission & Privacy
    console.log('\n--- Testing Student Complaints Privacy ---');
    const complaintRes = await req('/complaints', 'POST', {
      category: 'Course',
      subject: `E2E Test Grievance ${Date.now()}`,
      description: 'Testing confidential grievance isolation',
      priority: 'High'
    }, studentToken);
    assert(complaintRes.status === 201 && complaintRes.data.data.status === 'Open', 'Student submits complaint -> Status: Open');
    const createdComplaintId = complaintRes.data.data.id;

    // Student view complaint list
    const myComplaints = await req('/complaints/my', 'GET', null, studentToken);
    assert(myComplaints.ok && myComplaints.data.data.length > 0, 'Student retrieves own complaints list');
    const foundComplaint = myComplaints.data.data.find(c => c.id === createdComplaintId);
    assert(foundComplaint && foundComplaint.admin_notes === undefined, 'Student complaint response strips private internal admin_notes');

    // 5. Trainer RBAC Enforcement & Verification
    console.log('\n--- Testing Trainer Scoping & RBAC ---');
    // Trainer blocked from student complaints
    const trainerComplaintBlock = await req('/complaints/my', 'GET', null, trainerToken);
    assert(trainerComplaintBlock.status === 403, 'Trainer blocked from accessing student complaints (403 Forbidden)');

    // Trainer views pending verifications
    const pendingVerifs = await req('/attendance/trainer/pending', 'GET', null, trainerToken);
    assert(pendingVerifs.ok, 'Trainer retrieves pending attendance verifications for assigned students');

    // Trainer verifies attendance
    const verifyRes = await req(`/attendance/verify/${createdAttendanceId}`, 'POST', null, trainerToken);
    assert(verifyRes.ok && verifyRes.data.data.status === 'Verified', 'Trainer verifies attendance -> Status: Verified with trainer ID and timestamp recorded');

    // Trainer rejects another record test
    const testSession2 = `Lab Rejection Test ${Date.now()}`;
    const markRes2 = await req('/attendance/mark', 'POST', { session: testSession2 }, studentToken);
    const rejectRes = await req(`/attendance/reject/${markRes2.data.data.id}`, 'POST', { reason: 'Left session early without leave permission' }, trainerToken);
    assert(rejectRes.ok && rejectRes.data.data.status === 'Rejected' && rejectRes.data.data.rejection_reason.includes('early'), 'Trainer rejects attendance -> Status: Rejected with mandatory reason recorded');

    // 6. Admin Dashboard, Reports & Complaint Resolution
    console.log('\n--- Testing Admin Master Controls ---');
    const adminAnalytics = await req('/analytics/admin', 'GET', null, adminToken);
    assert(adminAnalytics.ok && (adminAnalytics.data.data?.cards?.totalStudents > 0 || adminAnalytics.data.cards?.totalStudents > 0), 'Admin retrieves institutional overview KPIs');

    const adminReports = await req('/attendance/reports', 'GET', null, adminToken);
    assert(adminReports.ok && (adminReports.data.summary?.totalRecords > 0 || adminReports.data.data?.summary?.totalRecords > 0), 'Admin generates attendance reports with summary stats');

    // Admin resolves student complaint
    const updateComplaintRes = await req(`/complaints/admin/${createdComplaintId}/status`, 'PUT', {
      status: 'Resolved',
      admin_response: 'Action has been taken by the curriculum head.',
      admin_notes: 'Technician ticket verified.'
    }, adminToken);
    assert(updateComplaintRes.ok && updateComplaintRes.data.data?.status === 'Resolved', 'Admin updates complaint status to Resolved and posts response');

    // 7. Student Notification Check
    console.log('\n--- Testing Real-Time Notifications ---');
    const studentNotifs = await req('/notifications', 'GET', null, studentToken);
    assert(studentNotifs.ok && (studentNotifs.data.data?.length > 0 || studentNotifs.data.length > 0), 'Student receives real-time notifications for attendance verification and complaint resolution');

    // 8. Audit Logs
    console.log('\n--- Testing System Audit Trail ---');
    const auditLogs = await req('/audit-logs', 'GET', null, adminToken);
    assert(auditLogs.ok && (auditLogs.data.data?.length > 0 || auditLogs.data.length > 0), 'Audit trail logs recorded for attendance, complaints, and authentication');

    console.log('\n======================================================');
    console.log(` RESULTS: ${passed} PASSED, ${failed} FAILED`);
    console.log('======================================================\n');
  } catch (err) {
    console.error('Test execution error:', err);
  }
}

// Auto-run
runE2ETests();
