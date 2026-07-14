import React from 'react';
import { Compass } from 'lucide-react';

export const NotFoundPage: React.FC<{ onHome: () => void }> = ({ onHome }) => (
  <div className="min-h-screen bg-slate-100 flex items-center justify-center px-6">
    <div className="max-w-md rounded-[2rem] bg-white p-8 text-center shadow-xl shadow-slate-200">
      <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-3xl bg-indigo-50 text-indigo-600">
        <Compass className="h-8 w-8" />
      </div>
      <p className="text-xs font-black uppercase tracking-[0.3em] text-indigo-500">404</p>
      <h1 className="mt-2 text-2xl font-black text-slate-950">Page not found</h1>
      <p className="mt-3 text-sm text-slate-500">The page you requested does not exist in this ERP workspace.</p>
      <button onClick={onHome} className="mt-6 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-bold text-white hover:bg-indigo-500">
        Return home
      </button>
    </div>
  </div>
);
