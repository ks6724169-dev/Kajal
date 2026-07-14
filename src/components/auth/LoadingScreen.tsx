import React from 'react';
import { Loader2, ShieldCheck } from 'lucide-react';

export const LoadingScreen: React.FC<{ message?: string }> = ({ message = 'Loading Galaxy ERP...' }) => (
  <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-6">
    <div className="text-center">
      <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-3xl bg-indigo-500/15 ring-1 ring-indigo-400/30">
        <ShieldCheck className="h-7 w-7 text-indigo-300" />
      </div>
      <Loader2 className="mx-auto h-6 w-6 animate-spin text-indigo-300" />
      <p className="mt-4 text-sm font-semibold text-slate-300">{message}</p>
    </div>
  </div>
);
