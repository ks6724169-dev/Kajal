import React from 'react';
import { LockKeyhole, ArrowLeft } from 'lucide-react';

export const UnauthorizedPage: React.FC<{ reason?: string; onBack?: () => void }> = ({ reason = 'You are not authorized to access this page.', onBack }) => (
  <div className="min-h-screen bg-slate-100 flex items-center justify-center px-6">
    <div className="max-w-md rounded-[2rem] bg-white p-8 text-center shadow-xl shadow-slate-200">
      <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-3xl bg-amber-50 text-amber-600">
        <LockKeyhole className="h-8 w-8" />
      </div>
      <h1 className="text-2xl font-black text-slate-950">Unauthorized</h1>
      <p className="mt-3 text-sm text-slate-500">{reason}</p>
      {onBack && (
        <button onClick={onBack} className="mt-6 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-sm font-bold text-white hover:bg-slate-800">
          <ArrowLeft className="h-4 w-4" />
          Go back
        </button>
      )}
    </div>
  </div>
);
