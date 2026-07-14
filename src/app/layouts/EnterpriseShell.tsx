import React, { useMemo, useState } from 'react';
import { ChevronDown, Grid3X3, LogOut, ShieldCheck } from 'lucide-react';
import { Tenant, Role } from '../../types';
import { Navbar } from '../../components/Navbar';
import { APP_MODULES, AppModuleId, DEFAULT_MODULE_ID } from '../navigation/modules';
import { canAccessModule } from '../../core/auth';

interface EnterpriseShellProps {
  currentTenant: Tenant;
  onSelectTenant: (tenant: Tenant) => void;
  currentRole: Role;
  onSelectRole: (role: Role) => void;
  language: string;
  onSelectLanguage: (lang: string) => void;
  activeTab: AppModuleId;
  onSelectTab: (tab: AppModuleId) => void;
  onLogout: () => void;
  children: React.ReactNode;
}

export const EnterpriseShell: React.FC<EnterpriseShellProps> = ({
  currentTenant,
  onSelectTenant,
  currentRole,
  onSelectRole,
  language,
  onSelectLanguage,
  activeTab,
  onSelectTab,
  onLogout,
  children
}) => {
  const [isNavigationOpen, setIsNavigationOpen] = useState(false);

  const activeModule = useMemo(
    () => APP_MODULES.find((module) => module.id === activeTab) ?? APP_MODULES.find((module) => module.id === DEFAULT_MODULE_ID),
    [activeTab]
  );

  const navigateToModule = (moduleId: AppModuleId) => {
    onSelectTab(moduleId);
    setIsNavigationOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans text-slate-900">
      <Navbar
        currentTenant={currentTenant}
        onSelectTenant={onSelectTenant}
        currentRole={currentRole}
        onSelectRole={onSelectRole}
        language={language}
        onSelectLanguage={onSelectLanguage}
        onOpenMobileApp={() => navigateToModule('mobile_apps')}
        onOpenSettings={() => navigateToModule('settings')}
      >
        <button
          onClick={onLogout}
          className="hidden items-center gap-2 rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs font-bold text-slate-200 transition hover:bg-slate-700 sm:flex"
          title="Logout"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>

        <div className="relative">
          <button
            onClick={() => setIsNavigationOpen((value) => !value)}
            className="flex items-center gap-2 rounded-xl border border-indigo-400/30 bg-indigo-500/15 px-3 py-2 text-xs font-bold text-indigo-100 shadow-lg shadow-indigo-950/20 transition hover:bg-indigo-500/25"
            aria-expanded={isNavigationOpen}
            aria-haspopup="menu"
          >
            <Grid3X3 className="h-4 w-4" />
            <span className="hidden sm:inline">Modules</span>
            <ChevronDown className={`h-3.5 w-3.5 transition ${isNavigationOpen ? 'rotate-180' : ''}`} />
          </button>

          {isNavigationOpen && (
            <div className="absolute right-0 mt-3 w-[min(92vw,720px)] rounded-3xl border border-slate-700 bg-slate-900/98 p-4 shadow-2xl shadow-slate-950/40 backdrop-blur" role="menu">
              <div className="mb-3 flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-indigo-300">Enterprise Navigation</p>
                  <p className="mt-1 text-xs text-slate-400">Top-right expandable module launcher keeps every ERP module accessible from the header.</p>
                </div>
                <div className="hidden items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1 text-[11px] font-bold text-emerald-300 sm:flex">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  RBAC-ready
                </div>
              </div>

              <div className="grid max-h-[65vh] grid-cols-1 gap-2 overflow-y-auto pr-1 sm:grid-cols-2 lg:grid-cols-3">
                {APP_MODULES.map((module) => {
                  const Icon = module.icon;
                  const isActive = module.id === activeTab;
                  const isAllowed = canAccessModule(currentRole, module.id);
                  return (
                    <button
                      key={module.id}
                      onClick={() => navigateToModule(module.id)}
                      className={`rounded-2xl border p-3 text-left transition ${
                        isActive
                          ? 'border-indigo-400 bg-indigo-500/20 shadow-lg shadow-indigo-950/30'
                          : isAllowed
                            ? 'border-slate-800 bg-slate-800/50 hover:border-slate-600 hover:bg-slate-800'
                            : 'border-slate-800 bg-slate-900/70 opacity-70 hover:border-amber-500/40'
                      }`}
                      role="menuitem"
                    >
                      <div className="flex items-start gap-3">
                        <div className={`rounded-xl p-2 ${isActive ? 'bg-indigo-500 text-white' : 'bg-slate-900 text-indigo-300'}`}>
                          <Icon className="h-4 w-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <p className="truncate text-sm font-bold text-white">{module.label}</p>
                            {module.badge && <span className="rounded-full bg-indigo-400/20 px-2 py-0.5 text-[10px] font-black text-indigo-200">{module.badge}</span>}
                            {!isAllowed && <span className="rounded-full bg-amber-400/10 px-2 py-0.5 text-[10px] font-black text-amber-200">RBAC</span>}
                          </div>
                          <p className="mt-1 line-clamp-2 text-[11px] leading-4 text-slate-400">{module.description}</p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </Navbar>

      <main className="flex-1 overflow-y-auto">
        <div className="border-b border-slate-200 bg-white/80 px-5 py-4 shadow-sm backdrop-blur">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400">{activeModule?.enterpriseDomain ?? 'platform'} domain</p>
          <h1 className="mt-1 text-2xl font-black text-slate-950">{activeModule?.label}</h1>
          <p className="mt-1 max-w-3xl text-sm text-slate-500">{activeModule?.description}</p>
        </div>
        {children}
      </main>
    </div>
  );
};
