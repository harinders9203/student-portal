import express from 'express';
import bcrypt from 'bcryptjs';
import { db } from '../db/database.js';
import { generateToken, requireAuth } from '../middleware/auth.js';
import { logAudit } from '../middleware/audit.js';

const router = express.Router();

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const user = db.findOne('users', u => u.email.toLowerCase() === cleanEmail);

    if (!user) {
      logAudit(req, 'LOGIN_FAILED', `Failed login attempt for non-existent email: ${cleanEmail}`);
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    if (user.status !== 'active') {
      logAudit(req, 'LOGIN_BLOCKED', `Blocked login attempt for deactivated user: ${user.email}`, user);
      return res.status(403).json({ success: false, message: 'Your account is deactivated. Please contact the administrator.' });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      logAudit(req, 'LOGIN_FAILED', `Failed login attempt (wrong password) for: ${user.email}`, user);
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    // Generate JWT
    const token = generateToken(user);

    // Fetch role-specific profile
    let profile = null;
    if (user.role === 'student') {
      const student = db.findOne('students', s => String(s.user_id) === String(user.id));
      profile = db.getEnrichedStudent(student);
    } else if (user.role === 'trainer') {
      const trainer = db.findOne('trainers', t => String(t.user_id) === String(user.id));
      profile = db.getEnrichedTrainer(trainer);
    }

    // Log successful login
    logAudit(req, 'LOGIN_SUCCESS', `User logged in successfully: ${user.name} (${user.role})`, user);

    const safeUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
      phone: user.phone,
      avatar: user.avatar
    };

    return res.json({
      success: true,
      message: 'Login successful',
      token,
      user: safeUser,
      profile
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ success: false, message: 'Internal server error during login.' });
  }
});

// GET /api/auth/me
router.get('/me', requireAuth, (req, res) => {
  try {
    const user = db.findById('users', req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    let profile = null;
    if (user.role === 'student') {
      const student = db.findOne('students', s => String(s.user_id) === String(user.id));
      profile = db.getEnrichedStudent(student);
    } else if (user.role === 'trainer') {
      const trainer = db.findOne('trainers', t => String(t.user_id) === String(user.id));
      profile = db.getEnrichedTrainer(trainer);
    }

    const safeUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
      phone: user.phone,
      avatar: user.avatar
    };

    return res.json({
      success: true,
      user: safeUser,
      profile
    });
  } catch (err) {
    console.error('Get profile error:', err);
    return res.status(500).json({ success: false, message: 'Failed to fetch user profile.' });
  }
});

// PUT /api/auth/profile
router.put('/profile', requireAuth, (req, res) => {
  try {
    const { name, phone, avatar, bio, specialization } = req.body;
    const updates = {};
    if (name) updates.name = name.trim();
    if (phone !== undefined) updates.phone = phone.trim();
    if (avatar !== undefined) updates.avatar = avatar;

    const updatedUser = db.update('users', req.user.id, updates);

    // If student/trainer has role-specific fields, update them
    if (req.user.role === 'student' && phone !== undefined) {
      const student = db.findOne('students', s => String(s.user_id) === String(req.user.id));
      if (student) db.update('students', student.id, { phone: phone.trim() });
    } else if (req.user.role === 'trainer') {
      const trainer = db.findOne('trainers', t => String(t.user_id) === String(req.user.id));
      if (trainer) {
        const trnUpdates = {};
        if (phone !== undefined) trnUpdates.phone = phone.trim();
        if (bio !== undefined) trnUpdates.bio = bio.trim();
        if (specialization !== undefined) trnUpdates.specialization = specialization.trim();
        db.update('trainers', trainer.id, trnUpdates);
      }
    }

    logAudit(req, 'PROFILE_UPDATED', `User updated profile information.`);

    return res.json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        status: updatedUser.status,
        phone: updatedUser.phone,
        avatar: updatedUser.avatar
      }
    });
  } catch (err) {
    console.error('Update profile error:', err);
    return res.status(500).json({ success: false, message: 'Failed to update profile.' });
  }
});

// PUT /api/auth/password
router.put('/password', requireAuth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, message: 'Current password and new password are required.' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ success: false, message: 'New password must be at least 6 characters long.' });
    }

    const user = db.findById('users', req.user.id);
    const isMatch = await bcrypt.compare(currentPassword, user.password_hash);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Current password does not match.' });
    }

    const newHash = await bcrypt.hash(newPassword, 10);
    db.update('users', user.id, { password_hash: newHash });

    logAudit(req, 'PASSWORD_CHANGED', `User changed account password.`);

    return res.json({ success: true, message: 'Password updated successfully.' });
  } catch (err) {
    console.error('Change password error:', err);
    return res.status(500).json({ success: false, message: 'Failed to change password.' });
  }
});

// POST /api/auth/logout
router.post('/logout', requireAuth, (req, res) => {
  logAudit(req, 'USER_LOGOUT', `User logged out.`);
  return res.json({ success: true, message: 'Logged out successfully.' });
});

export default router;
