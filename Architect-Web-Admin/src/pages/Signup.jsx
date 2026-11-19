import { useState } from 'react';
import { UserPlus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { apiRequest } from '../lib/apiClient';

export default function Signup() {
  const { login } = useAuth();
  const toast = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !password || !confirmPassword) {
      toast.showError('All fields are required');
      return;
    }
    
    if (password.length < 6) {
      toast.showError('Password must be at least 6 characters long');
      return;
    }
    
    if (password !== confirmPassword) {
      toast.showError('Passwords do not match');
      return;
    }
    
    setSubmitting(true);
    try {
      const res = await apiRequest('/auth/register', {
        method: 'POST',
        body: { email, password },
      });
      
      if (!res?.token) {
        throw new Error(res?.message || 'Registration failed');
      }
      
      login(res.token);
      toast.showSuccess('Account created successfully');
    } catch (err) {
      toast.showError(err.message || 'Failed to create account');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--bg-main)] px-4">
      <div className="w-full max-w-md rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-card)] px-6 py-6 shadow-xl sm:px-8 sm:py-8">
        <div className="mb-6 flex items-center gap-3">
          <img
            src="/images/Monda%20Brothers%20Logo%20Fiall.png"
            alt="Monda Brother"
            className="h-10 w-auto max-w-[160px] object-contain"
          />
          <div>
            <h1 className="text-base font-semibold text-[var(--text-primary)]">
              Create Admin Account
            </h1>
            <p className="text-xs text-[var(--text-muted)]">
              Register to manage projects, services, team & more.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-[var(--text-primary)]">
              Email
            </label>
            <input
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-elevated)] px-3 py-2 text-sm text-[var(--text-primary)] outline-none ring-0 focus:border-amber-500/70"
              placeholder="admin@example.com"
            />
          </div>
          
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-[var(--text-primary)]">
              Password
            </label>
            <input
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-elevated)] px-3 py-2 text-sm text-[var(--text-primary)] outline-none ring-0 focus:border-amber-500/70"
              placeholder="Min. 6 characters"
            />
          </div>
          
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-[var(--text-primary)]">
              Confirm Password
            </label>
            <input
              type="password"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-elevated)] px-3 py-2 text-sm text-[var(--text-primary)] outline-none ring-0 focus:border-amber-500/70"
              placeholder="Confirm password"
            />
          </div>
          
          <button
            type="submit"
            disabled={submitting}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-amber-500 to-amber-400 px-3 py-2 text-sm font-semibold text-slate-950 shadow-md transition hover:from-amber-400 hover:to-amber-300 disabled:cursor-not-allowed disabled:opacity-70"
          >
            <UserPlus className="h-4 w-4" />
            {submitting ? 'Creating account…' : 'Create Account'}
          </button>
        </form>

        <div className="mt-4 text-center">
          <p className="text-[11px] text-[var(--text-muted)]">
            Already have an account?{' '}
            <a 
              href="/login" 
              className="text-amber-500 hover:text-amber-400 underline"
            >
              Sign in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
