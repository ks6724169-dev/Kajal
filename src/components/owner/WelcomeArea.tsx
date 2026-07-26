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
    <div className="w-full bg-white rounded-2xl border border-slate-200/50 p-6 md:p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6 shadow-[0_4px_20px_rgba(0,0,0,0.02)] transition-all">
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
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 hover:bg-slate-100/80 border border-slate-100 rounded-full transition-colors cursor-default">
          <Activity className="w-3.5 h-3.5 text-emerald-500" />
          <span className="text-[11px] font-semibold text-slate-600">System Healthy</span>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 hover:bg-slate-100/80 border border-slate-100 rounded-full transition-colors cursor-default">
          <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />
          <span className="text-[11px] font-semibold text-slate-600">Security Protected</span>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 hover:bg-slate-100/80 border border-slate-100 rounded-full transition-colors cursor-default">
          <Database className="w-3.5 h-3.5 text-indigo-500" />
          <span className="text-[11px] font-semibold text-slate-600">Live Data Connected</span>
        </div>
      </div>
    </div>
  );
};
