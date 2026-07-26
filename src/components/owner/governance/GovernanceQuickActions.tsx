import React from 'react';
import { Plus, Layers, History, FileText, Building2, Shield, Settings } from 'lucide-react';

interface GovernanceQuickActionsProps {
  onNavigate: (path: string) => void;
  onSelectWorkGroup?: (workGroupId: string) => void;
}

export const GovernanceQuickActions: React.FC<GovernanceQuickActionsProps> = ({
  onNavigate,
  onSelectWorkGroup
}) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-3 sm:p-5 shadow-2xs mb-4 sm:mb-6 text-left">
      <div className="flex items-center justify-between mb-2.5 sm:mb-3">
        <div className="flex items-center gap-2">
          <Shield className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-indigo-600" />
          <h3 className="text-[11px] sm:text-xs font-bold text-slate-900 uppercase tracking-wider">
            Governance Quick Actions
          </h3>
        </div>
        <span className="text-[10px] text-slate-400 font-medium hidden xs:inline">Real Operational Shortcuts</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 sm:gap-2.5">
        <button
          onClick={() => onNavigate('/owner/create-campus')}
          className="flex items-center gap-2 px-2.5 py-2 sm:px-3 sm:py-2.5 rounded-xl bg-indigo-50/70 hover:bg-indigo-100/80 border border-indigo-200/60 text-indigo-900 text-xs font-semibold transition-all cursor-pointer group"
        >
          <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-lg bg-indigo-600 text-white flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <Plus className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
          </div>
          <span className="truncate">Add Campus</span>
        </button>

        <button
          onClick={() => onSelectWorkGroup?.('campus-hierarchy')}
          className="flex items-center gap-2 px-2.5 py-2 sm:px-3 sm:py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200/70 text-slate-800 text-xs font-semibold transition-all cursor-pointer group"
        >
          <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-lg bg-slate-200 text-slate-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <Layers className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
          </div>
          <span className="truncate">Departments</span>
        </button>

        <button
          onClick={() => onSelectWorkGroup?.('compliance-policy')}
          className="flex items-center gap-2 px-2.5 py-2 sm:px-3 sm:py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200/70 text-slate-800 text-xs font-semibold transition-all cursor-pointer group"
        >
          <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-lg bg-slate-200 text-slate-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <FileText className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
          </div>
          <span className="truncate">Compliance Docs</span>
        </button>

        <button
          onClick={() => onSelectWorkGroup?.('compliance-policy')}
          className="flex items-center gap-2 px-2.5 py-2 sm:px-3 sm:py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200/70 text-slate-800 text-xs font-semibold transition-all cursor-pointer group"
        >
          <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-lg bg-slate-200 text-slate-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <History className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
          </div>
          <span className="truncate">Audit Trail</span>
        </button>

        <button
          onClick={() => onSelectWorkGroup?.('identity-governance')}
          className="flex items-center gap-2 px-2.5 py-2 sm:px-3 sm:py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200/70 text-slate-800 text-xs font-semibold transition-all cursor-pointer group col-span-2 sm:col-span-1"
        >
          <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-lg bg-slate-200 text-slate-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <Building2 className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
          </div>
          <span className="truncate">Profile</span>
        </button>
      </div>
    </div>
  );
};
