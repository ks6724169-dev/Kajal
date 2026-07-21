import React from 'react';

export const AuthSkeleton: React.FC = () => {
  return (
    <div id="auth-skeleton-container" className="space-y-6 w-full max-w-md p-6 bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-xl shadow-lg">
      <div className="space-y-3 flex flex-col items-center">
        <div className="h-12 w-12 rounded-full bg-slate-200 dark:bg-slate-800 animate-pulse" />
        <div className="h-6 w-48 rounded bg-slate-200 dark:bg-slate-800 animate-pulse" />
        <div className="h-4 w-32 rounded bg-slate-200 dark:bg-slate-800 animate-pulse" />
      </div>

      <div className="space-y-4 pt-4">
        <div className="space-y-2">
          <div className="h-3 w-16 rounded bg-slate-200 dark:bg-slate-800 animate-pulse" />
          <div className="h-10 w-full rounded bg-slate-200 dark:bg-slate-800 animate-pulse" />
        </div>
        <div className="space-y-2">
          <div className="h-3 w-16 rounded bg-slate-200 dark:bg-slate-800 animate-pulse" />
          <div className="h-10 w-full rounded bg-slate-200 dark:bg-slate-800 animate-pulse" />
        </div>
      </div>

      <div className="h-10 w-full rounded bg-indigo-200 dark:bg-indigo-900 animate-pulse" />

      <div className="flex justify-between items-center text-xs text-slate-300 dark:text-slate-700">
        <div className="h-4 w-24 rounded bg-slate-200 dark:bg-slate-800 animate-pulse" />
        <div className="h-4 w-24 rounded bg-slate-200 dark:bg-slate-800 animate-pulse" />
      </div>
    </div>
  );
};
