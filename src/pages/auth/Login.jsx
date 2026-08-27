import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  ShieldCheck,
  UserCheck,
  GraduationCap,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Info
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      toast.warning('Please enter both your email address and password.');
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl w-full grid grid-cols-1 lg:grid-cols-12 bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100/10">
        {/* Left Col: Portal Intro */}
        <div className="lg:col-span-5 bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-800 p-8 sm:p-10 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="absolute -right-12 -top-12 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -left-12 -bottom-12 w-48 h-48 bg-purple-500/20 rounded-full blur-2xl pointer-events-none" />

          <div>
            <div className="inline-flex items-center gap-2.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-semibold text-indigo-100 border border-white/20 mb-6">
              <Sparkles className="w-3.5 h-3.5 text-indigo-200" />
              Role-Based Education Management
            </div>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center text-white border border-white/20 shadow-inner">
                <svg className="w-7 h-7 fill-current" viewBox="0 0 24 24">
                  <path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3z" />
                  <path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z" />
                </svg>
              </div>
              <h1 className="text-2xl font-extrabold tracking-tight">EduPortal</h1>
            </div>

            <p className="text-indigo-100 text-sm leading-relaxed">
              Integrated Student Attendance Verification, Private Grievance Redressal, and Academic Administration.
            </p>
          </div>

          <div className="space-y-3 my-8">
            <div className="flex items-center gap-3 text-xs text-indigo-100">
              <div className="p-1 rounded-lg bg-emerald-500/20 border border-emerald-400/30 text-emerald-300">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <span>Multi-tier Attendance Verification by Trainers</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-indigo-100">
              <div className="p-1 rounded-lg bg-indigo-500/20 border border-indigo-400/30 text-indigo-300">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <span>Strict Privacy-Isolated Student Grievances</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-indigo-100">
              <div className="p-1 rounded-lg bg-purple-500/20 border border-purple-400/30 text-purple-300">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <span>Comprehensive Reports with CSV & PDF Export</span>
            </div>
          </div>

          <div className="text-[11px] text-indigo-200/80 pt-4 border-t border-white/10">
            Secure SHA-256 JWT Authentication & Role-Based Access Control
          </div>
        </div>

        {/* Right Col: Sign In Form */}
        <div className="lg:col-span-7 p-8 sm:p-10 flex flex-col justify-between bg-white">
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Sign In to Your Account</h2>
                <p className="text-xs text-slate-500 mt-1">
                  Please enter your credentials below to access your dashboard
                </p>
              </div>
            </div>

            {/* Static Test Credentials Reference Box (Read-Only) */}
            <div className="mb-6 bg-slate-50 border border-slate-200/80 rounded-2xl p-3.5 text-xs">
              <div className="flex items-center gap-1.5 font-bold text-slate-700 uppercase tracking-wider text-[11px] mb-2">
                <Info className="w-3.5 h-3.5 text-indigo-600" />
                Demo Credentials Reference
              </div>
              <div className="space-y-1.5 font-mono text-[11px] text-slate-600 bg-white p-2.5 rounded-xl border border-slate-200/60">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-rose-700">Admin:</span>
                  <span>admin@portal.edu / admin123</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-indigo-700">Trainer:</span>
                  <span>trainer.alex@portal.edu / trainer123</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-emerald-700">Student:</span>
                  <span>student.john@portal.edu / student123</span>
                </div>
              </div>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="p-1 text-slate-400 hover:text-slate-600 absolute right-3 top-1/2 -translate-y-1/2"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md shadow-indigo-500/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50 cursor-pointer"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Verifying Credentials...</span>
                  </div>
                ) : (
                  <>
                    Sign In to Portal <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
            <span>Secure SHA-256 Encryption</span>
            <span className="font-mono text-[10px]">Active RBAC</span>
          </div>
        </div>
      </div>
    </div>
  );
}
