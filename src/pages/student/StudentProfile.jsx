import React, { useState } from 'react';
import {
  User,
  Mail,
  Phone,
  BookOpen,
  Layers,
  UserCheck,
  Lock,
  CheckCircle2,
  Save,
  MapPin,
  HeartPulse
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { api } from '../../services/api';
import { StatusBadge } from '../../components/common/StatusBadge';

export function StudentProfile() {
  const { user, profile, refreshProfile } = useAuth();
  const toast = useToast();

  const [phone, setPhone] = useState(user?.phone || profile?.phone || '');
  const [avatar, setAvatar] = useState(user?.avatar || '');
  const [savingProfile, setSavingProfile] = useState(false);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [savingPassword, setSavingPassword] = useState(false);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      const res = await api.updateProfile({ phone, avatar });
      if (res.success) {
        toast.success('Profile details updated successfully.', 'Saved');
        refreshProfile();
      }
    } catch (err) {
      toast.error(err.message || 'Failed to update profile.');
    } finally {
      setSavingProfile(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error('New password and confirmation do not match.');
      return;
    }
    if (newPassword.length < 6) {
      toast.error('Password must be at least 6 characters.');
      return;
    }

    setSavingPassword(true);
    try {
      const res = await api.updatePassword({ currentPassword, newPassword });
      if (res.success) {
        toast.success('Password changed successfully.', 'Security Updated');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      }
    } catch (err) {
      toast.error(err.message || 'Failed to change password.');
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
          Student Profile & Credentials
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Review enrolled academic program, assigned trainer contacts, and manage account security.
        </p>
      </div>

      {/* Profile Header Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm flex flex-col sm:flex-row items-center gap-6">
        <img
          src={user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user?.name || 'User')}`}
          alt={user?.name}
          className="w-24 h-24 rounded-3xl bg-slate-100 object-cover ring-4 ring-indigo-50 shadow-md"
        />
        <div className="text-center sm:text-left flex-1 min-w-0">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
            <h2 className="text-xl font-bold text-slate-900">{user?.name}</h2>
            <StatusBadge status={profile?.status || 'active'} />
          </div>
          <p className="text-xs text-slate-500 font-mono mt-1">{user?.email}</p>
          <div className="mt-3 flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <span className="font-mono text-xs font-bold text-indigo-700 bg-indigo-50 px-3 py-1 rounded-lg border border-indigo-200">
              ID: {profile?.student_id || 'STU-PENDING'}
            </span>
            <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-3 py-1 rounded-lg">
              {profile?.batch_name || 'Assigned Batch'}
            </span>
          </div>
        </div>
      </div>

      {/* Academic & Trainer Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
          <h3 className="font-bold text-sm text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-indigo-600" />
            Enrolled Program Details
          </h3>

          <div className="space-y-3 text-xs">
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
              <span className="text-slate-400 font-medium">Course:</span>
              <span className="font-bold text-slate-800 text-right">{profile?.course_name || 'Enrolled Course'}</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
              <span className="text-slate-400 font-medium">Batch Schedule:</span>
              <span className="font-bold text-slate-800">{profile?.batch_name || 'Assigned Batch'}</span>
            </div>
            {profile?.address && (
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                <span className="text-slate-400 font-medium">Address:</span>
                <span className="font-medium text-slate-700 text-right">{profile.address}</span>
              </div>
            )}
            {profile?.emergency_contact && (
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                <span className="text-slate-400 font-medium">Emergency:</span>
                <span className="font-medium text-slate-700">{profile.emergency_contact}</span>
              </div>
            )}
          </div>
        </div>

        {/* Assigned Trainer Card */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
          <h3 className="font-bold text-sm text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-indigo-600" />
            Assigned Institute Trainer
          </h3>

          <div className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100 space-y-3 text-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold">
                {profile?.trainer_name ? profile.trainer_name[0] : 'T'}
              </div>
              <div>
                <div className="font-bold text-sm text-indigo-950">{profile?.trainer_name || 'Unassigned'}</div>
                <div className="text-[11px] text-indigo-600 font-semibold">Authorized Attendance Verifier</div>
              </div>
            </div>

            <div className="pt-2 border-t border-indigo-100/60 space-y-2">
              <div className="flex items-center gap-2 text-slate-600">
                <Mail className="w-3.5 h-3.5 text-indigo-600" />
                <span>{profile?.trainer_email || 'trainer@portal.edu'}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <Phone className="w-3.5 h-3.5 text-indigo-600" />
                <span>+1 (555) 234-5678 (Ext 104)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Update Contact & Password Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Contact Info Form */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm">
          <h3 className="font-bold text-sm text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
            <Phone className="w-4 h-4 text-indigo-600" />
            Contact & Avatar Info
          </h3>

          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Phone Number
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 (555) 000-0000"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Avatar Image URL (Optional)
              </label>
              <input
                type="url"
                value={avatar}
                onChange={(e) => setAvatar(e.target.value)}
                placeholder="https://..."
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>

            <button
              type="submit"
              disabled={savingProfile}
              className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-500/20 transition-all cursor-pointer"
            >
              {savingProfile ? 'Saving...' : 'Save Profile Changes'}
            </button>
          </form>
        </div>

        {/* Change Password Form */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm">
          <h3 className="font-bold text-sm text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
            <Lock className="w-4 h-4 text-indigo-600" />
            Security & Password
          </h3>

          <form onSubmit={handleChangePassword} className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Current Password
              </label>
              <input
                type="password"
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter current password"
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                New Password
              </label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Min 6 characters"
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Confirm New Password
              </label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-type new password"
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>

            <button
              type="submit"
              disabled={savingPassword}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs shadow-sm transition-all mt-2 cursor-pointer"
            >
              {savingPassword ? 'Updating Password...' : 'Update Password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
