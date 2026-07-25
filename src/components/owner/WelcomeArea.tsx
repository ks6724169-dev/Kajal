import React from 'react';
import { ShieldCheck, Activity, Database, CheckCircle2 } from 'lucide-react';

interface WelcomeAreaProps {
  ownerName: string;
  tenantName: string;
  academicSession: string;
}

export const WelcomeArea: React.FC<WelcomeAreaProps> = ({
  ownerName,
  tenantName,
  academicSession
}) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
      <div>
        <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          Good Morning, {ownerName} <span className="text-2xl">👋</span>
        </h2>
        <p className="text-slate-500 mt-1">
          <span className="font-semibold text-slate-700">{tenantName}</span> • Academic Session {academicSession}
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 border border-green-100 rounded-full">
          <Activity className="w-3.5 h-3.5 text-green-600" />
          <span className="text-xs font-medium text-green-700">System Healthy</span>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-indigo-50 border border-indigo-100 rounded-full">
          <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
          <span className="text-xs font-medium text-indigo-700">Security Protected</span>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 border border-blue-100 rounded-full">
          <Database className="w-3.5 h-3.5 text-blue-600" />
          <span className="text-xs font-medium text-blue-700">Live Data Connected</span>
        </div>
      </div>
    </div>
  );
};
