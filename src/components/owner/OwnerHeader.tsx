import React, { useState } from 'react';
import { Bell, Sparkles, Settings, MoreVertical, Building2, LayoutGrid, Home, Activity, X, ChevronRight, Sliders, Search, CheckCircle2 } from 'lucide-react';
import { CampusSwitcher } from './CampusSwitcher';
import { useAuth } from '../../hooks/useAuth';
import WorkspaceOnlyLauncher from './workspace/WorkspaceOnlyLauncher';

interface OwnerHeaderProps {
  tenantName: string;
  tenantType: string;
  currentCampus: string;
  onCampusChange: (campus: string) => void;
  onNavigate: (path: string) => void;
  campuses?: any[];
  activeWorkspaceId?: string;
}

export const OwnerHeader: React.FC<OwnerHeaderProps> = ({
  tenantName, tenantType, currentCampus, onCampusChange, onNavigate, campuses = []
}) => {
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [showWorkspaceLauncher, setShowWorkspaceLauncher] = useState(false);
  const { logout, user } = useAuth();

  const handleLogout = () => {
    logout();
    window.dispatchEvent(new CustomEvent('nav-to', { detail: '/login' }));
  };

  const getRoleTitle = () => {
    switch (user?.role) {
      case 'principal': return 'Principal';
      case 'vice_principal': return 'Vice Principal';
      case 'teacher': return 'Teacher';
      default: return 'Owner';
    }
  };

  return (
    <>
      <header className="bg-transparent sticky top-0 z-[210] px-3 sm:px-6 py-4 sm:py-5 transition-all">
        <div className="max-w-[1700px] mx-auto flex items-center justify-between gap-2.5 sm:gap-4">
          <div className="flex items-center gap-2.5 sm:gap-3 shrink-0 min-w-0">
            <div className="flex items-center gap-2.5 cursor-pointer group shrink-0" onClick={() => onNavigate('dashboard')} title="Go to Executive Overview">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 flex items-center justify-center text-white shadow-md shadow-slate-900/15 ring-1 ring-slate-900/10 group-hover:scale-105 transition-all duration-200 shrink-0">
                <Sparkles className="w-4.5 h-4.5 text-indigo-300" />
              </div>
              <div className="flex flex-col min-w-0 justify-center">
                <span className="font-black text-slate-900 text-sm sm:text-base tracking-tight leading-none">Galaxy ERP</span>
                <span className="text-[11px] sm:text-xs font-bold text-slate-500 tracking-tight truncate mt-1">Institution Management Panel</span>
              </div>
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-2 px-3.5 py-1.5 bg-slate-100/80 border border-slate-200/70 rounded-full text-xs font-bold text-slate-600 shadow-3xs shrink-0">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Academic Session 2026-2027</span>
            <span className="text-slate-300">•</span>
            <span className="text-indigo-600 font-extrabold flex items-center gap-1"><Activity className="w-3.5 h-3.5" /> All Systems Online</span>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <div className="flex items-center gap-1 bg-slate-100/70 p-1 border border-slate-200/60 rounded-2xl">
              <button onClick={() => onNavigate('dashboard')} className="w-8.5 h-8.5 flex items-center justify-center bg-white hover:bg-slate-50 border border-slate-200/80 rounded-xl shadow-2xs text-slate-700 hover:text-indigo-600 transition-all cursor-pointer active:scale-95" title="Home">
                <Home className="w-4 h-4 stroke-[2.2]" />
              </button>
              <CampusSwitcher currentCampus={currentCampus} onChange={onCampusChange} campuses={campuses} />
            </div>

            <button onClick={() => setShowWorkspaceLauncher(!showWorkspaceLauncher)} className={`h-8.5 px-3.5 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all duration-200 cursor-pointer whitespace-nowrap active:scale-95 shrink-0 ${showWorkspaceLauncher ? 'bg-indigo-700 text-white ring-2 ring-indigo-500/50 shadow-md' : 'bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white shadow-xs'}`} title="Open Workspaces">
              <LayoutGrid className="w-4 h-4 text-white stroke-[2.2]" />
              <span>Workspace</span>
            </button>

            <div className="flex items-center gap-1 bg-slate-100/70 p-1 border border-slate-200/60 rounded-2xl">
              <button onClick={() => onNavigate('search')} className="w-8.5 h-8.5 flex items-center justify-center bg-white hover:bg-slate-50 border border-slate-200/80 rounded-xl shadow-2xs text-slate-600 hover:text-slate-900 transition-all cursor-pointer active:scale-95" title="Global Search"><Search className="w-4 h-4" /></button>
              <button onClick={() => onNavigate('notifications')} className="w-8.5 h-8.5 flex items-center justify-center bg-white hover:bg-slate-50 border border-slate-200/80 rounded-xl shadow-2xs text-slate-600 hover:text-slate-900 transition-all relative cursor-pointer active:scale-95" title="Notifications"><Bell className="w-4 h-4" /><span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-rose-500 rounded-full border border-white" /></button>
              <button onClick={() => setShowMoreMenu(true)} className="w-8.5 h-8.5 flex items-center justify-center rounded-xl bg-white hover:bg-slate-50 border border-slate-200/80 text-slate-600 hover:text-slate-900 shadow-2xs transition-all cursor-pointer active:scale-95" title="Open Command Center Sidebar"><MoreVertical className="w-4 h-4 stroke-[2.2]" /></button>
            </div>
          </div>
        </div>
      </header>

      <WorkspaceOnlyLauncher isOpen={showWorkspaceLauncher} onClose={() => setShowWorkspaceLauncher(false)} onNavigate={onNavigate} />

      {showMoreMenu && (
        <div className="fixed inset-0 z-[200] flex justify-end animate-fade-in">
          <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs" onClick={() => setShowMoreMenu(false)} />
          <div className="relative w-full max-w-sm sm:max-w-md h-full bg-white shadow-2xl border-l border-slate-200 z-10 flex flex-col overflow-hidden">
            <div className="p-5 bg-slate-900 text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3"><div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center"><Sliders className="w-5 h-5" /></div><div><h3 className="font-extrabold text-base">Command & Control Center</h3><p className="text-xs text-slate-400 mt-0.5">Institution System Management</p></div></div>
              <button onClick={() => setShowMoreMenu(false)} className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl" title="Close Sidebar"><X className="w-4.5 h-4.5" /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-5 space-y-6 bg-[#FBFBFD]">
              <div className="p-4 bg-gradient-to-br from-indigo-50 via-white to-purple-50 rounded-2xl border border-indigo-100 flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white font-extrabold text-lg flex items-center justify-center">{user?.displayName ? user.displayName.charAt(0).toUpperCase() : 'U'}</div>
                <div className="min-w-0 flex-1"><h4 className="font-black text-slate-900 text-sm truncate">{user?.displayName || 'User'}</h4><p className="text-xs text-slate-500 truncate mt-0.5">{user?.email || ''}</p><div className="flex items-center gap-2 mt-2"><span className="px-2 py-0.5 bg-indigo-100 text-indigo-800 font-extrabold text-[10px] rounded-md uppercase">{getRoleTitle()}</span><span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md"><CheckCircle2 className="w-3 h-3" /> Active Session</span></div></div>
              </div>
              <div className="space-y-2">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">System Administration</p>
                <button onClick={() => { setShowMoreMenu(false); onNavigate('create_campus'); }} className="w-full flex items-center justify-between p-3.5 bg-white hover:bg-slate-100 border border-slate-200 rounded-2xl text-left"><div className="flex items-center gap-3"><Building2 className="w-5 h-5 text-blue-600" /><span className="font-bold text-xs">Create New Campus</span></div><ChevronRight className="w-4 h-4 text-slate-400" /></button>
                <button onClick={() => { setShowMoreMenu(false); onNavigate('settings'); }} className="w-full flex items-center justify-between p-3.5 bg-white hover:bg-slate-100 border border-slate-200 rounded-2xl text-left"><div className="flex items-center gap-3"><Settings className="w-5 h-5 text-indigo-600" /><span className="font-bold text-xs">System Settings</span></div><ChevronRight className="w-4 h-4 text-slate-400" /></button>
                <button onClick={handleLogout} className="w-full flex items-center justify-between p-3.5 bg-white hover:bg-rose-50 border border-slate-200 rounded-2xl text-left"><div className="flex items-center gap-3"><span className="font-bold text-xs text-rose-600">Sign Out</span></div><ChevronRight className="w-4 h-4 text-slate-400" /></button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
