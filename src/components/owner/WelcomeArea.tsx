import React from 'react';
import { ShieldCheck, Activity, Database } from 'lucide-react';

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
    <div className="w-full py-4 md:py-6 flex flex-col lg:flex-row lg:items-center justify-between gap-6 transition-all">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900">
            Good Morning, {ownerName}
          </h2>
          <span className="text-2xl animate-bounce duration-1000">👋</span>
        </div>
        <p className="text-xs md:text-sm text-slate-400 font-medium tracking-wide">
          <span className="font-semibold text-slate-600">{tenantName}</span> &bull; Academic Session {academicSession}
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2.5">
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50/50 hover:bg-emerald-50 border border-emerald-100/50 rounded-full transition-colors cursor-default">
          <Activity className="w-3.5 h-3.5 text-emerald-500" />
          <span className="text-[11px] font-bold text-emerald-700">System Healthy</span>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50/50 hover:bg-blue-50 border border-blue-100/50 rounded-full transition-colors cursor-default">
          <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />
          <span className="text-[11px] font-bold text-blue-700">Protected</span>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50/50 hover:bg-indigo-50 border border-indigo-100/50 rounded-full transition-colors cursor-default">
          <Database className="w-3.5 h-3.5 text-indigo-500" />
          <span className="text-[11px] font-bold text-indigo-700">Live Sync</span>
        </div>
      </div>
    </div>
  );
};
