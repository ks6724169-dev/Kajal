import React, { useState } from 'react';
import { Lock, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../core/auth';

export const ResetPasswordPage: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const auth = useAuth();
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const token = new URLSearchParams(window.location.hash.replace(/^#/, '') || window.location.search).get('access_token') ?? '';

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage('');
    try {
      await auth.resetPassword(token, password);
      setMessage('Password updated successfully. You can now sign in.');
      window.history.replaceState({}, '', '/login');
      onComplete();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Unable to reset password.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center px-6">
      <form onSubmit={handleSubmit} className="w-full max-w-md rounded-[2rem] bg-white p-8 shadow-xl shadow-slate-200">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
            <ShieldCheck className="h-7 w-7" />
          </div>
          <h1 className="text-2xl font-black text-slate-950">Reset Password</h1>
          <p className="mt-2 text-sm text-slate-500">Enter your new password to complete account recovery.</p>
        </div>
        <label className="text-xs font-bold text-slate-700">New Password</label>
        <div className="relative mt-1.5">
          <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
          <input value={password} onChange={(event) => setPassword(event.target.value)} type="password" minLength={8} required className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-4 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        </div>
        {message && <p className="mt-4 rounded-xl bg-slate-50 p-3 text-xs font-semibold text-slate-600">{message}</p>}
        <button disabled={isSubmitting} className="mt-6 w-full rounded-xl bg-indigo-600 py-3 text-sm font-bold text-white disabled:opacity-60">
          {isSubmitting ? 'Updating...' : 'Update Password'}
        </button>
      </form>
    </div>
  );
};
