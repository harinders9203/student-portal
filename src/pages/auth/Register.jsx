import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  Eye,
  EyeOff,
  GraduationCap,
  Lock,
  Mail,
  Phone,
  User,
  UserPlus
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { registerStudent } = useAuth();
  const toast = useToast();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!name.trim() || !email.trim() || !password) {
      toast.warning('Please complete your name, email address, and password.');
      return;
    }

    if (password.length < 6) {
      toast.warning('Your password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      toast.warning('Your password confirmation does not match.');
      return;
    }

    setLoading(true);
    try {
      await registerStudent({ name, email, phone, password });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl w-full grid grid-cols-1 lg:grid-cols-12 bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100/10">
        <section className="lg:col-span-5 bg-gradient-to-br from-emerald-600 via-teal-700 to-indigo-800 p-8 sm:p-10 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="absolute -right-12 -top-12 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -left-12 -bottom-12 w-48 h-48 bg-emerald-400/20 rounded-full blur-2xl pointer-events-none" />

          <div className="relative">
            <Link to="/login" className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-100 hover:text-white transition-colors">
              <ArrowLeft className="w-3.5 h-3.5" /> Back to sign in
            </Link>
            <div className="mt-10 flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-inner">
                <GraduationCap className="w-7 h-7" />
              </div>
              <h1 className="text-2xl font-extrabold tracking-tight">EduPortal</h1>
            </div>
            <h2 className="mt-8 text-3xl font-extrabold leading-tight">Start your student journey.</h2>
            <p className="mt-3 text-sm leading-relaxed text-emerald-100">
              Register your student account to track attendance, receive updates, and submit private grievances.
            </p>
          </div>

          <div className="relative mt-10 rounded-2xl border border-white/15 bg-white/10 p-4 text-xs leading-relaxed text-emerald-50">
            Your email address is your unique sign-in ID. It can only be used for one portal account.
          </div>
        </section>

        <section className="lg:col-span-7 p-8 sm:p-10 bg-white">
          <div className="max-w-md mx-auto">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <UserPlus className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">Student registration</h2>
                <p className="text-xs text-slate-500 mt-0.5">Your account will be ready immediately after registration.</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <Field label="Full name" icon={User}>
                <input
                  type="text"
                  required
                  autoComplete="name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Enter your full name"
                  className="field-input"
                />
              </Field>

              <Field label="Email address" icon={Mail}>
                <input
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@example.com"
                  className="field-input"
                />
              </Field>

              <Field label="Phone number (optional)" icon={Phone}>
                <input
                  type="tel"
                  autoComplete="tel"
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  placeholder="Enter your phone number"
                  className="field-input"
                />
              </Field>

              <Field label="Password" icon={Lock}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  minLength="6"
                  autoComplete="new-password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="At least 6 characters"
                  className="field-input pr-11"
                />
                <PasswordVisibilityButton showPassword={showPassword} setShowPassword={setShowPassword} />
              </Field>

              <Field label="Confirm password" icon={Lock}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  minLength="6"
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  placeholder="Re-enter your password"
                  className="field-input pr-11"
                />
                <PasswordVisibilityButton showPassword={showPassword} setShowPassword={setShowPassword} />
              </Field>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md shadow-indigo-500/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50 cursor-pointer"
              >
                {loading ? (
                  <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Creating account...</>
                ) : (
                  <>Create student account <ArrowRight className="w-4 h-4" /></>
                )}
              </button>
            </form>

            <p className="mt-6 text-center text-xs text-slate-500">
              Already registered?{' '}
              <Link to="/login" className="font-bold text-indigo-600 hover:text-indigo-700">Sign in to your account</Link>
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}

function Field({ label, icon: Icon, children }) {
  return (
    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
      {label}
      <span className="relative block mt-1.5">
        <Icon className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        {children}
      </span>
    </label>
  );
}

function PasswordVisibilityButton({ showPassword, setShowPassword }) {
  return (
    <button
      type="button"
      onClick={() => setShowPassword(!showPassword)}
      aria-label={showPassword ? 'Hide password' : 'Show password'}
      className="p-1 text-slate-400 hover:text-slate-600 absolute right-3 top-1/2 -translate-y-1/2"
    >
      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
    </button>
  );
}
