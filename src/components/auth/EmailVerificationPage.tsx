import React, { useEffect, useState } from 'react';
import { MailCheck } from 'lucide-react';
import { useAuth } from '../../core/auth';

export const EmailVerificationPage: React.FC<{ onContinue: () => void }> = ({ onContinue }) => {
  const auth = useAuth();
  const [message, setMessage] = useState('Verifying your email session...');

  useEffect(() => {
    auth.refreshSession()
      .then(() => setMessage('Email verification completed. Continue to your ERP workspace.'))
      .catch(() => setMessage('Verification link processed. Please sign in if your session is not active.'));
  }, []);

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center px-6">
      <div className="max-w-md rounded-[2rem] bg-white p-8 text-center shadow-xl shadow-slate-200">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-3xl bg-emerald-50 text-emerald-600">
          <MailCheck className="h-8 w-8" />
        </div>
        <h1 className="text-2xl font-black text-slate-950">Email Verification</h1>
        <p className="mt-3 text-sm text-slate-500">{message}</p>
        <button onClick={onContinue} className="mt-6 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-bold text-white hover:bg-emerald-500">
          Continue
        </button>
      </div>
    </div>
  );
};
