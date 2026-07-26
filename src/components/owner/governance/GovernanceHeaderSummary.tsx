import React from 'react';
import { Tenant } from '../../../types';
import { Building2, MapPin, ShieldCheck, UserCheck, ChevronDown } from 'lucide-react';
import { useAuth } from '../../../hooks/useAuth';

interface GovernanceHeaderSummaryProps {
  tenant: Tenant;
  currentCampus?: string;
  activeWorkGroupName?: string;
  onCampusChange?: (campusName: string) => void;
  availableCampuses?: string[];
}

export const GovernanceHeaderSummary: React.FC<GovernanceHeaderSummaryProps> = ({
  tenant,
  currentCampus = 'All Campuses',
  activeWorkGroupName = 'Identity & Governance',
  onCampusChange,
  availableCampuses = ['All Campuses', 'Main Heritage Campus', 'Science & Innovation Node', 'West Valley Branch']
}) => {
  const { user, previewConfig } = useAuth();

  const getRoleLabel = (role?: string) => {
    if (previewConfig) {
      return `${previewConfig.roleTitle} (${previewConfig.scopeType} Scope)`;
    }
    switch (role) {
      case 'principal':
        return 'Principal (Academic & Operational Admin)';
      case 'vice_principal':
        return 'Vice Principal (Delegated Admin)';
      default:
        return 'Institution Owner (Global Governance)';
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-3.5 sm:p-5 lg:p-6 shadow-2xs mb-4 sm:mb-6 text-left">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 sm:gap-4 pb-4 sm:pb-5 border-b border-slate-100">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-xs shadow-indigo-600/20">
            <Building2 className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight leading-tight">
                {tenant?.name || 'Galaxy International Institution'}
              </h2>
              <span className="px-2 py-0.5 rounded-full bg-indigo-50 border border-indigo-200/60 text-indigo-700 text-[10px] sm:text-[11px] font-semibold shrink-0">
                {tenant?.type || 'K-12 Education'}
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5 truncate">
              Work Group: <span className="font-semibold text-slate-800">{activeWorkGroupName}</span>
            </p>
          </div>
        </div>

        {/* Status Indicators & Campus Context Switcher */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 px-2.5 py-1 sm:px-3 sm:py-1.5 bg-emerald-50 border border-emerald-200/60 rounded-xl text-[11px] sm:text-xs font-semibold text-emerald-800 shrink-0">
            <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600" />
            <span>Governance Compliant</span>
          </div>

          {/* Interactive Campus Context Switcher */}
          <div className="relative inline-flex items-center bg-slate-100/90 border border-slate-200 rounded-xl px-2.5 py-1 text-[11px] sm:text-xs font-medium text-slate-700 hover:border-slate-300 transition-colors shrink-0">
            <MapPin className="w-3.5 h-3.5 text-slate-500 mr-1.5 shrink-0" />
            <select
              value={currentCampus}
              onChange={(e) => onCampusChange?.(e.target.value)}
              className="bg-transparent text-slate-800 font-semibold focus:outline-none cursor-pointer pr-4 appearance-none text-[11px] sm:text-xs"
            >
              {availableCampuses.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 pointer-events-none" />
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1 sm:px-3 sm:py-1.5 bg-indigo-50/60 border border-indigo-100 rounded-xl text-[11px] sm:text-xs font-medium text-indigo-900 shrink-0 max-w-full truncate">
            <UserCheck className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
            <span className="truncate">{getRoleLabel(user?.role)}</span>
          </div>
        </div>
      </div>

      {/* Metrics & Context Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 pt-3 sm:pt-4 text-xs">
        <div className="p-2 sm:p-2.5 rounded-xl bg-slate-50 border border-slate-100">
          <p className="text-[10px] sm:text-[11px] font-medium text-slate-500">Board Affiliation</p>
          <p className="text-[11px] sm:text-xs font-bold text-slate-800 mt-0.5 truncate">{tenant?.settings?.board || 'CBSE Affiliated'}</p>
        </div>
        <div className="p-2 sm:p-2.5 rounded-xl bg-slate-50 border border-slate-100">
          <p className="text-[10px] sm:text-[11px] font-medium text-slate-500">Academic Session</p>
          <p className="text-[11px] sm:text-xs font-bold text-slate-800 mt-0.5 truncate">2026 – 2027 Active</p>
        </div>
        <div className="p-2 sm:p-2.5 rounded-xl bg-slate-50 border border-slate-100">
          <p className="text-[10px] sm:text-[11px] font-medium text-slate-500">Active Campus Context</p>
          <p className="text-[11px] sm:text-xs font-bold text-indigo-600 mt-0.5 truncate">{currentCampus}</p>
        </div>
        <div className="p-2 sm:p-2.5 rounded-xl bg-slate-50 border border-slate-100">
          <p className="text-[10px] sm:text-[11px] font-medium text-slate-500">Audit Status</p>
          <p className="text-[11px] sm:text-xs font-bold text-slate-800 mt-0.5 truncate">Logged & Verified</p>
        </div>
      </div>
    </div>
  );
};

