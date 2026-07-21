import React from 'react';
import { ShieldCheck, Wifi, Cpu } from 'lucide-react';

interface WorkspaceFooterProps {
  language?: string;
}

export const WorkspaceFooter: React.FC<WorkspaceFooterProps> = ({ language = 'en' }) => {
  return (
    <footer 
      id="enterprise-workspace-footer"
      className="mt-auto bg-slate-50 border-t border-slate-200 py-6 px-6 text-xs text-slate-400 select-none font-semibold shadow-xs"
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Left Segment: Active compliance & system uptime */}
        <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-slate-500">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="h-4 w-4 text-indigo-600 shrink-0" />
            <span>GALAXY SECURE • ACTIVE SOVEREIGN PROTOCOLS</span>
          </div>
          <span className="hidden md:inline text-slate-300">|</span>
          <div className="flex items-center gap-1.5">
            <Wifi className="h-3.5 w-3.5 text-emerald-500 shrink-0 animate-pulse" />
            <span className="text-emerald-700 font-bold bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full text-[9px] uppercase tracking-wider">
              ALL DISTRICT CHANNELS STABLE
            </span>
          </div>
        </div>

        {/* Right Segment: Institutional Legal Notice */}
        <div className="flex items-center gap-2 text-[11px] text-slate-400 font-medium">
          <Cpu className="h-3.5 w-3.5 text-slate-300" />
          <span>© 2026 GALAXY ERP SYSTEMS • SOC 2 TYPE II SECURED WORKSTATION</span>
        </div>

      </div>
    </footer>
  );
};
