# Student Attendance & Complaint Management Portal

A modern, secure, responsive **Student Attendance & Complaint Management Portal** built for educational and training institutes. The platform features strict role-based access control (RBAC), multi-tier attendance verification by assigned trainers, confidential grievance redressal, real-time analytics, and multi-format report exports (CSV, Excel, PDF).

---

## 📋 Table of Contents
1. [Quick Start & Installation](#-quick-start--installation)
2. [Login Credentials for Testing](#-login-credentials-for-testing)
3. [User Roles & Permissions Matrix](#-user-roles--permissions-matrix)
4. [Step-by-Step Testing Guide](#-step-by-step-testing-guide)
   - [Student Workflow](#1-student-workflow)
   - [Trainer Workflow](#2-trainer-workflow)
   - [Admin Workflow](#3-admin-workflow-including-trainer-crud)
5. [Attendance Verification Lifecycle](#-attendance-verification-lifecycle)
6. [Confidential Complaint Privacy Logic](#-confidential-complaint-privacy-logic)
7. [Security & Authentication Architecture](#-security--authentication-architecture)
8. [Exporting Reports](#-exporting-reports)

---

## 🚀 Quick Start & Installation

### 1. Prerequisites
- **Node.js** (v18 or higher recommended)
- **npm** (v9 or higher)

### 2. Install Dependencies
```bash
npm install
```

### 3. Seed Database with Realistic Demo Data
```bash
npm run seed
```

### 4. Start the Application
You can run the application in development or unified production mode:

#### Option A: Unified Production Mode (Recommended)
```bash
npm run build
npm start
```
Open **[http://localhost:5000](http://localhost:5000)** in your web browser.

#### Option B: Development Mode (with Hot Reloading)
```bash
npm run dev
```
- Frontend UI: `http://localhost:5173`
- Backend REST API: `http://localhost:5000`

---

## 🔑 Login Credentials for Testing

To test the role separation and security, use the following credentials. On the login page, you can enter the credentials manually or click the testing helper badges to quickly populate the fields before clicking **"Sign In to Portal"** (password authentication is strictly verified on every login).

| Role | User Name | Email Address | Password | Role Description & Assigned Scope |
| :--- | :--- | :--- | :--- | :--- |
| **Admin** | Dr. Robert Sterling | `admin@portal.edu` | `admin123` | Master Administrator (Full institute control, faculty CRUD, reports, grievance resolution) |
| **Trainer** | Alex Rivera | `trainer.alex@portal.edu` | `trainer123` | Lead Trainer for *Full-Stack Web Dev (Batch FSWD-2026-A)* |
| **Trainer** | Sarah Jenkins | `trainer.sarah@portal.edu` | `trainer123` | Specialist for *Data Science & AI (Batch DSAI-2026-B)* |
| **Trainer** | Marcus Chen | `trainer.marcus@portal.edu` | `trainer123` | Instructor for *Cybersecurity & Cloud (Batch CYBER-2026-C)* |
| **Student** | John Doe | `student.john@portal.edu` | `student123` | Student ID `STU-2026-001` (*Batch FSWD-2026-A*, Assigned Trainer: Alex Rivera) |
| **Student** | Emily Watson | `student.emily@portal.edu` | `student123` | Student ID `STU-2026-002` (*Batch FSWD-2026-A*, Assigned Trainer: Alex Rivera) |
| **Student** | Michael Chang | `student.michael@portal.edu` | `student123` | Student ID `STU-2026-003` (*Batch DSAI-2026-B*, Assigned Trainer: Sarah Jenkins) |
| **Student** | Sophia Martinez | `student.sophia@portal.edu` | `student123` | Student ID `STU-2026-004` (*Batch DSAI-2026-B*, Assigned Trainer: Sarah Jenkins) |

---

## 🛡️ User Roles & Permissions Matrix

| Feature / Capability | Student | Trainer | Admin |
| :--- | :---: | :---: | :---: |
| **Sign In with Encrypted Password & JWT** | ✅ | ✅ | ✅ |
| **Mark Class Session Attendance** | ✅ | ❌ | ❌ |
| **View Personal Attendance History & Compliance %** | ✅ | ❌ | ❌ |
| **Submit Confidential Grievances / Complaints** | ✅ | ❌ | ❌ |
| **View Personal Complaints & Admin Responses** | ✅ | ❌ | ❌ |
| **View Student Profile & Assigned Trainer Contact** | ✅ | ❌ | ❌ |
| **Verify / Reject Assigned Students' Attendance** | ❌ | ✅ | ✅ (Override) |
| **View Assigned Batches & Students Directory** | ❌ | ✅ | ✅ |
| **Update Personal Trainer Profile (Bio, Domain, Phone)** | ❌ | ✅ | ✅ |
| **Access Student Complaints & Staff Notes** | ❌ | ❌ *(Strict 403 Block)* | ✅ *(Exclusive)* |
| **CRUD Operations on Trainers (Create, Read, Edit, Delete)** | ❌ | ❌ | ✅ *(Full CRUD)* |
| **CRUD Operations on Students (Create, Read, Edit, Delete)** | ❌ | ❌ | ✅ *(Full CRUD)* |
| **Course & Batch Management** | ❌ | ❌ | ✅ |
| **Attendance Oversight Across Institute** | ❌ | ❌ | ✅ |
| **Generate Multi-Filter Attendance Reports** | ❌ | ✅ *(Assigned Cohorts)* | ✅ *(All Cohorts)* |
| **Export Reports to CSV, Excel (.xlsx), and PDF** | ✅ *(Self)* | ✅ *(Assigned)* | ✅ *(Global)* |
| **System Security & Audit Trail Logs** | ❌ | ❌ | ✅ |
| **Broadcast Campus Announcements** | ❌ | ❌ | ✅ |

---

## 🧪 Step-by-Step Testing Guide

### 1. Student Workflow
1. **Sign In**: Navigate to `http://localhost:5000/login`, enter `student.john@portal.edu` / `student123`, and click **"Sign In to Portal"**.
2. **Dashboard**: Notice the **Student Profile card**, today's check-in status, and circular **Attendance Compliance Gauge**.
3. **Mark Attendance**:
   - Click **"Mark Attendance Today"** or **"Mark Check-In"**.
   - Select the class session (e.g. *Morning Lecture* or *Afternoon Practical Lab*).
   - Enter optional notes and submit.
   - Notice the status updates to **`Pending Verification`** (Students cannot approve their own attendance).
   - Try marking attendance for the same session again: Notice the system prevents duplicate attendance with a clear message.
4. **Report a Confidential Grievance**:
   - Go to **"Report Complaint"** in the sidebar.
   - Click **"Report a Complaint"**, select a category (*Course*, *Infrastructure*, *Trainer*, etc.), set priority, and write a subject and description.
   - Submit the grievance. Notice it appears in the table with status **`Open`**.
   - Notice that internal admin staff notes are hidden from the student view.

---

### 2. Trainer Workflow
1. **Sign In**: Log in with `trainer.alex@portal.edu` / `trainer123`.
2. **Dashboard Overview**:
   - View assigned cohorts (*Batch FSWD-2026-A*), student count, and pending verifications badge.
3. **Verify Attendance**:
   - Go to **"Attendance Verification"**.
   - Notice the attendance record submitted by John Doe (*Pending Verification*).
   - Click **"Verify"** -> Status changes immediately to **`Verified`**, recording the verification timestamp and trainer identity.
4. **Reject Attendance with Mandatory Reason**:
   - On a pending record, click **"Reject"**.
   - A modal appears requiring a mandatory explanation (e.g., *"Checked in late without prior approval"*).
   - Submit rejection -> Status becomes **`Rejected`** with the reason stored and dispatched to the student.
5. **Trainer Isolation Verification**:
   - Notice trainers have **no access to student complaints**. Any attempt to access grievance endpoints is blocked at the backend level with `403 Forbidden`.
6. **Trainer Profile Management**:
   - Go to **"Trainer Profile"**.
   - Edit name, domain specialization, direct phone, biography, or change password. Click **"Save Profile Changes"**.

---

### 3. Admin Workflow (Including Trainer CRUD)
1. **Sign In**: Log in with `admin@portal.edu` / `admin123`.
2. **Executive Oversight Dashboard**:
   - Review live KPIs (Total Students, Trainers, Batches, Today's Attendance, Grievance Resolution Rate).
   - Check the **"Low Attendance Alerts (< 75%)"** table.
   - View real-time **Daily Attendance Trends** and **Grievance Categories** charts.
3. **Full CRUD on Trainers (`/admin/trainers`)**:
   - **Create (Add Trainer)**: Click **"Add New Trainer"**, fill in Name, Email, Password, Trainer ID Code, Specialization, Phone, and Bio. Submit to create account.
   - **Read (View Trainer)**: Click the **Eye icon** on any trainer row to view their detailed profile, assigned cohorts, and enrolled student list.
   - **Update (Edit Trainer)**: Click the **Edit icon** to update their name, email, specialization, phone, status (Active/Inactive), or reset their password.
   - **Delete / Deactivate**: Click the **Trash icon** to either soft deactivate the trainer (blocking login access) or permanently delete their record.
4. **Full CRUD on Students (`/admin/students`)**:
   - Add new students, assign them to courses, batches, and trainers, edit details, or deactivate accounts.
   - Click the **Eye icon** to view full student profile + complete attendance history + complete grievance history.
5. **Course & Batch Management (`/admin/courses` & `/admin/batches`)**:
   - Create, edit, and delete courses and batches; assign trainers and set student capacity limits.
6. **Complaints Hub (`/admin/complaints`)**:
   - View all confidential grievances across the institute.
   - Click **"Manage"** on a complaint:
     - Change status (*Open*, *Under Review*, *Resolved*, *Closed*).
     - Write the **Official Administrative Response** (sent to student notification and portal view).
     - Write **Private Internal Staff Notes** (visible only to administrators).
7. **Dedicated Attendance Reports Engine (`/admin/reports`)**:
   - Filter by Course, Batch, Trainer, Student, Date Range, and Status.
   - View aggregate metrics and batch-wise compliance charts.
   - Export reports in **CSV**, **Excel (.xlsx)**, and printable **PDF**.
8. **Security & Audit Logs (`/admin/audit-logs`)**:
   - Review the immutable audit trail of logins, attendance verifications, rejections, and administrative actions.
9. **Broadcast Announcements (`/admin/settings`)**:
   - Broadcast notifications to all users, students only, or faculty only.

---

## 🔄 Attendance Verification Lifecycle

```
[Student Logs In]
       │
       ▼
[Selects Session & Marks Check-In]
       │
       ▼
[Backend Checks Duplicate Constraint (Student + Batch + Date + Session)]
       │
       ▼
[Status Initialized: "Pending Verification"]
       │
       ▼
[Real-Time Notification Sent to Assigned Trainer]
       │
       ▼
[Trainer Reviews Submission in Verification Console]
       │
       ├───► [VERIFY] ──► Status: "Verified" + Timestamp + Trainer ID
       │
       └───► [REJECT] ──► Requires Mandatory Reason ──► Status: "Rejected" + Reason
       │
       ▼
[Student Receives Alert & Compliance % Automatically Recalculated]
```

---

## 🔒 Confidential Complaint Privacy Logic

```
[Student Submits Grievance with Optional Attachment]
       │
       ▼
[Stored Securely with Status "Open"]
       │
       ├───► [TRAINER ACCESS] ──► STRICTLY BLOCKED (403 Forbidden)
       │
       └───► [ADMIN ACCESS ONLY]
                   │
                   ▼
       [Admin Reviews in Complaints Hub]
                   │
                   ▼
       [Admin Updates Status & Submits:]
          • Official Public Response (Visible to Student)
          • Private Staff Notes (Hidden from Student)
                   │
                   ▼
       [Student Receives Notification & Reads Official Response]
```

---

## 🔐 Security & Authentication Architecture

1. **Explicit Password Verification**:
   - Authentication uses SHA-256 bcrypt password hashing with salt rounds.
   - Automatic login bypass is disabled; credentials must be authenticated against the backend database on every sign-in.
2. **JWT Token Authorization**:
   - Authenticated sessions issue signed JSON Web Tokens (JWT) containing encoded user IDs and role claims.
3. **Backend Role-Based Access Control (RBAC)**:
   - Backend API endpoints are protected by role-checking middleware:
     - `requireAuth`: Validates bearer tokens and checks that account status is active.
     - `requireAdmin`: Enforces administrative permissions.
     - `requireTrainer`: Ensures trainer-only endpoints cannot be breached by students.
     - `requireTrainerOrAdmin`: Scopes verification access to assigned trainers or administrators.
     - `requireStudent`: Protects student-specific operations.
4. **Data Isolation**:
   - Direct database queries enforce trainer-to-batch and student-to-record isolation.
   - direct API calls attempting to cross role boundaries return `403 Forbidden`.
5. **Audit Trail**:
   - All critical actions (Logins, Attendance markings, Verifications, Rejections, Complaint status updates, Account modifications) are recorded in the system audit log with timestamps and IP addresses.

---

## 📊 Exporting Reports

From the **Attendance Reports** section (`/admin/reports` or `/trainer/reports` or `/student/attendance`), click the **"Export Report"** dropdown:
- **CSV Export**: Clean comma-separated format for data analysis.
- **Excel (.xlsx)**: Formatted multi-column spreadsheet with headers and student metadata.
- **PDF Document**: Formatted landscape printable report with metadata header, summary statistics, and styled table.

---

## 💻 Technical Stack

- **Backend**: Node.js, Express, JSON/SQLite Relational Database Engine, JWT, BcryptJS, Multer.
- **Frontend**: React 18, Vite, Tailwind CSS, Lucide Icons, Recharts, XLSX, jsPDF.
- **Architecture**: Single Page Application (SPA) with RESTful API.
