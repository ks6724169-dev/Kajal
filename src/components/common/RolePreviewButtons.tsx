import React from 'react';
import { Shield, Building2, GraduationCap, ArrowRight, Eye, Sparkles } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

interface RolePreviewButtonsProps {
  variant?: 'hero' | 'floating' | 'compact' | 'drawer';
  onNavigate?: (path: string) => void;
  className?: string;
}

export const RolePreviewButtons: React.FC<RolePreviewButtonsProps> = ({
  variant = 'hero',
  onNavigate,
  className = ''
}) => {
  const { startRolePreview } = useAuth();

  // Show ONLY in Development / Testing mode. In production builds, import.meta.env.DEV is false.
  const IS_DEV_MODE = import.meta.env.DEV || process.env.NODE_ENV === 'development';

  if (!IS_DEV_MODE) {
    return null;
  }

  const handleSelectRole = (role: 'organization_owner' | 'principal' | 'vice_principal') => {
    startRolePreview(role);
    if (onNavigate) {
      onNavigate('/app');
    } else {
      window.dispatchEvent(new CustomEvent('nav-to', { detail: '/app' }));
    }
  };

  if (variant === 'compact') {
    return (
      <div className={`flex flex-wrap items-center gap-2 ${className}`}>
        <span className="text-[10px] font-black uppercase tracking-widest text-amber-600 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200/60 flex items-center gap-1">
          <Eye className="w-3 h-3 text-amber-500" /> Dev Preview:
        </span>
        <button
          onClick={() => handleSelectRole('organization_owner')}
          className="px-3 py-1 bg-slate-900 hover:bg-slate-800 text-white rounded-full text-[11px] font-extrabold transition-all cursor-pointer shadow-xs active:scale-95 flex items-center gap-1.5"
          title="Preview UI as Institution Owner (Full Scope)"
        >
          <Shield className="w-3 h-3 text-amber-400" /> Owner
        </button>
        <button
          onClick={() => handleSelectRole('principal')}
          className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full text-[11px] font-extrabold transition-all cursor-pointer shadow-xs active:scale-95 flex items-center gap-1.5"
          title="Preview UI as Principal (Main Campus Scope)"
        >
          <Building2 className="w-3 h-3 text-indigo-200" /> Principal
        </button>
        <button
          onClick={() => handleSelectRole('vice_principal')}
          className="px-3 py-1 bg-teal-700 hover:bg-teal-600 text-white rounded-full text-[11px] font-extrabold transition-all cursor-pointer shadow-xs active:scale-95 flex items-center gap-1.5"
          title="Preview UI as Vice Principal (Sciences Dept Scope)"
        >
          <GraduationCap className="w-3 h-3 text-teal-200" /> Vice Principal
        </button>
      </div>
    );
  }

  if (variant === 'drawer') {
    return (
      <div className={`p-4 bg-slate-900/90 rounded-2xl border border-amber-500/30 text-white space-y-3 ${className}`}>
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-black uppercase tracking-widest text-amber-400 flex items-center gap-1.5">
            <Eye className="w-3.5 h-3.5" /> Testing Role Previews
          </span>
          <span className="text-[9px] font-bold bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded border border-amber-400/30">
            Dev Mode
          </span>
        </div>
        <div className="grid gap-2">
          <button
            onClick={() => handleSelectRole('organization_owner')}
            className="w-full px-3 py-2 bg-slate-800 hover:bg-amber-600 text-white rounded-xl text-xs font-bold transition flex items-center justify-between cursor-pointer border border-slate-700 hover:border-amber-400"
          >
            <span className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-amber-400" /> Institution Owner
            </span>
            <span className="text-[10px] opacity-75">Global Scope</span>
          </button>
          <button
            onClick={() => handleSelectRole('principal')}
            className="w-full px-3 py-2 bg-slate-800 hover:bg-indigo-600 text-white rounded-xl text-xs font-bold transition flex items-center justify-between cursor-pointer border border-slate-700 hover:border-indigo-400"
          >
            <span className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-indigo-400" /> Principal
            </span>
            <span className="text-[10px] opacity-75">Campus Scope</span>
          </button>
          <button
            onClick={() => handleSelectRole('vice_principal')}
            className="w-full px-3 py-2 bg-slate-800 hover:bg-teal-600 text-white rounded-xl text-xs font-bold transition flex items-center justify-between cursor-pointer border border-slate-700 hover:border-teal-400"
          >
            <span className="flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-teal-400" /> Vice Principal
            </span>
            <span className="text-[10px] opacity-75">Dept Scope</span>
          </button>
        </div>
      </div>
    );
  }

  // Default Hero / Main Landing Page Card Section
  return (
    <div className={`w-full bg-slate-900/95 backdrop-blur-md rounded-3xl p-5 md:p-6 border border-slate-800 text-white shadow-2xl ${className}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Eye className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-white tracking-tight flex items-center gap-2">
              Role Preview Mode
              <span className="text-[9px] font-black uppercase tracking-widest bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2 py-0.5 rounded-full">
                Dev & Testing Only
              </span>
            </h3>
            <p className="text-[11px] text-slate-400 font-medium">
              Explore the Institution Management Panel UI across operational authority levels
            </p>
          </div>
        </div>
        <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-800/80 px-2.5 py-1 rounded-lg self-start sm:self-auto">
          ✓ Non-Destructive UI Preview
        </span>
      </div>

      {/* 3 Role Preview Buttons Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* 1. Institution Owner Preview */}
        <button
          onClick={() => handleSelectRole('organization_owner')}
          className="group relative p-4 bg-slate-800/90 hover:bg-slate-800 hover:border-amber-500/60 rounded-2xl border border-slate-700/80 transition-all duration-300 text-left cursor-pointer flex flex-col justify-between shadow-xs hover:shadow-lg hover:shadow-amber-500/5 active:scale-[0.98]"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center group-hover:scale-110 group-hover:bg-amber-500 group-hover:text-slate-950 transition-all">
                <Shield className="w-5 h-5 stroke-[2.2]" />
              </div>
              <span className="text-[9px] font-black uppercase tracking-widest text-amber-400 bg-amber-950/80 border border-amber-800/60 px-2 py-0.5 rounded-full">
                Global Scope
              </span>
            </div>
            <h4 className="font-extrabold text-white text-sm mb-1 group-hover:text-amber-300 transition-colors">
              1. Institution Owner
            </h4>
            <p className="text-[11px] text-slate-400 leading-relaxed font-medium mb-3">
              Full institutional governance, multi-campus overview, and full admin rights.
            </p>
          </div>
          <div className="pt-2 border-t border-slate-700/50 flex items-center justify-between text-[11px] font-bold text-amber-400 group-hover:translate-x-1 transition-transform">
            <span>Launch Owner Panel</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </button>

        {/* 2. Principal Preview */}
        <button
          onClick={() => handleSelectRole('principal')}
          className="group relative p-4 bg-slate-800/90 hover:bg-slate-800 hover:border-indigo-500/60 rounded-2xl border border-slate-700/80 transition-all duration-300 text-left cursor-pointer flex flex-col justify-between shadow-xs hover:shadow-lg hover:shadow-indigo-500/5 active:scale-[0.98]"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 flex items-center justify-center group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                <Building2 className="w-5 h-5 stroke-[2.2]" />
              </div>
              <span className="text-[9px] font-black uppercase tracking-widest text-indigo-300 bg-indigo-950/80 border border-indigo-800/60 px-2 py-0.5 rounded-full">
                Campus Scope
              </span>
            </div>
            <h4 className="font-extrabold text-white text-sm mb-1 group-hover:text-indigo-300 transition-colors">
              2. Principal
            </h4>
            <p className="text-[11px] text-slate-400 leading-relaxed font-medium mb-3">
              Operational & academic management scoped to assigned campus (Main Campus).
            </p>
          </div>
          <div className="pt-2 border-t border-slate-700/50 flex items-center justify-between text-[11px] font-bold text-indigo-400 group-hover:translate-x-1 transition-transform">
            <span>Launch Principal Panel</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </button>

        {/* 3. Vice Principal Preview */}
        <button
          onClick={() => handleSelectRole('vice_principal')}
          className="group relative p-4 bg-slate-800/90 hover:bg-slate-800 hover:border-teal-500/60 rounded-2xl border border-slate-700/80 transition-all duration-300 text-left cursor-pointer flex flex-col justify-between shadow-xs hover:shadow-lg hover:shadow-teal-500/5 active:scale-[0.98]"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 rounded-xl bg-teal-500/10 border border-teal-500/30 text-teal-400 flex items-center justify-center group-hover:scale-110 group-hover:bg-teal-600 group-hover:text-white transition-all">
                <GraduationCap className="w-5 h-5 stroke-[2.2]" />
              </div>
              <span className="text-[9px] font-black uppercase tracking-widest text-teal-300 bg-teal-950/80 border border-teal-800/60 px-2 py-0.5 rounded-full">
                Dept Scope
              </span>
            </div>
            <h4 className="font-extrabold text-white text-sm mb-1 group-hover:text-teal-300 transition-colors">
              3. Vice Principal
            </h4>
            <p className="text-[11px] text-slate-400 leading-relaxed font-medium mb-3">
              Academic & departmental management scoped to Sciences Department.
            </p>
          </div>
          <div className="pt-2 border-t border-slate-700/50 flex items-center justify-between text-[11px] font-bold text-teal-400 group-hover:translate-x-1 transition-transform">
            <span>Launch Vice Principal Panel</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </button>
      </div>
    </div>
  );
};
