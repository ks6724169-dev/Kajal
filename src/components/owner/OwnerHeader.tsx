import React, { useState } from 'react';
import { Bell, Sparkles, Settings, MoreVertical, MapPin, Shield, LogOut, HelpCircle, UserCircle, Search, Building2, LayoutGrid, Home, UserCheck, Activity, X, ChevronRight, Sliders, ExternalLink, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { CampusSwitcher } from './CampusSwitcher';
import { useAuth } from '../../hooks/useAuth';
import { WorkspaceLauncherModal } from './workspace/WorkspaceLauncherModal';

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
  tenantName,
  tenantType,
  currentCampus,
  onCampusChange,
  onNavigate,
  campuses = [],
  activeWorkspaceId
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
      case 'principal':
        return 'Principal';
      case 'vice_principal':
        return 'Vice Principal';
      case 'teacher':
        return 'Teacher';
      default:
        return 'Owner';
    }
  };

  return (
    <>
      <header className="bg-transparent sticky top-0 z-[210] px-3 sm:px-6 py-4 sm:py-5 transition-all">
        <div className="max-w-[1700px] mx-auto flex items-center justify-between gap-2.5 sm:gap-4">
          
          {/* LEFT: APPLE STYLE BRAND & ROLE IDENTIFIER */}
          <div className="flex items-center gap-2.5 sm:gap-3 shrink-0 min-w-0">
            <div 
              className="flex items-center gap-2.5 cursor-pointer group shrink-0" 
              onClick={() => onNavigate('dashboard')}
              title="Go to Executive Overview"
            >
              {/* Apple Squircle Icon */}
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 flex items-center justify-center text-white shadow-md shadow-slate-900/15 ring-1 ring-slate-900/10 group-hover:scale-105 transition-all duration-200 shrink-0">
                <Sparkles className="w-4.5 h-4.5 text-indigo-300" />
              </div>

              {/* Title & Scope Metadata */}
              <div className="flex flex-col min-w-0 justify-center">
                <span className="font-black text-slate-900 text-sm sm:text-base tracking-tight leading-none">
                  Galaxy ERP
                </span>

                <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                  <span className="text-[11px] sm:text-xs font-bold text-slate-500 tracking-tight truncate">
                    Institution Management Panel
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* CENTER: APPLE MACOS STATUS PILL (Hidden on small screens) */}
          <div className="hidden lg:flex items-center gap-2 px-3.5 py-1.5 bg-slate-100/80 border border-slate-200/70 rounded-full text-xs font-bold text-slate-600 shadow-3xs shrink-0">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Academic Session 2026-2027</span>
            <span className="text-slate-300">•</span>
            <span className="text-indigo-600 font-extrabold flex items-center gap-1">
              <Activity className="w-3.5 h-3.5" /> All Systems Online
            </span>
          </div>

          {/* RIGHT: COMPACT APPLE CONTROL TOOLBAR WITH SPACIOUS VERTICAL ALIGNMENT */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            
            {/* Control Group 1: Navigation & Campus Context */}
            <div className="flex items-center gap-1 bg-slate-100/70 p-1 border border-slate-200/60 rounded-2xl">
              {/* Home Icon Button */}
              <button 
                onClick={() => onNavigate('dashboard')}
                className="w-8.5 h-8.5 flex items-center justify-center bg-white hover:bg-slate-50 border border-slate-200/80 rounded-xl shadow-2xs text-slate-700 hover:text-indigo-600 transition-all cursor-pointer active:scale-95"
                title="Go to Executive Overview Dashboard"
              >
                <Home className="w-4 h-4 stroke-[2.2]" />
              </button>

              {/* Campus Switcher Component */}
              <CampusSwitcher currentCampus={currentCampus} onChange={onCampusChange} campuses={campuses} />
            </div>

            {/* Control Group 2: PROMINENT WORKSPACE BUTTON */}
            <button 
              onClick={() => setShowWorkspaceLauncher(!showWorkspaceLauncher)}
              className={`h-8.5 px-3.5 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all duration-200 cursor-pointer whitespace-nowrap active:scale-95 shrink-0 ${
                showWorkspaceLauncher
                  ? 'bg-indigo-700 text-white ring-2 ring-indigo-500/50 shadow-md shadow-indigo-600/30'
                  : 'bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white shadow-xs shadow-indigo-600/20'
              }`}
              title="Open Workspaces"
            >
              <LayoutGrid className="w-4 h-4 text-white stroke-[2.2]" />
              <span className="text-xs font-extrabold leading-none">Workspace</span>
            </button>

            {/* Control Group 3: Utility Icon Buttons */}
            <div className="flex items-center gap-1 bg-slate-100/70 p-1 border border-slate-200/60 rounded-2xl">
              {/* Global Search */}
              <button 
                onClick={() => onNavigate('search')}
                className="w-8.5 h-8.5 flex items-center justify-center bg-white hover:bg-slate-50 border border-slate-200/80 rounded-xl shadow-2xs text-slate-600 hover:text-slate-900 transition-all cursor-pointer active:scale-95"
                title="Global Search"
              >
                <Search className="w-4 h-4 stroke-[2]" />
              </button>

              {/* Notifications */}
              <button 
                onClick={() => onNavigate('notifications')}
                className="w-8.5 h-8.5 flex items-center justify-center bg-white hover:bg-slate-50 border border-slate-200/80 rounded-xl shadow-2xs text-slate-600 hover:text-slate-900 transition-all relative cursor-pointer active:scale-95"
                title="Notifications Center"
              >
                <Bell className="w-4 h-4 stroke-[2]" />
                <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-rose-500 rounded-full border border-white"></span>
              </button>

              {/* More Vertical Icon - Triggers Slide-Over Right Sidebar */}
              <button 
                onClick={() => setShowMoreMenu(true)}
                className={`w-8.5 h-8.5 flex items-center justify-center rounded-xl transition-all cursor-pointer active:scale-95 ${
                  showMoreMenu 
                    ? 'bg-indigo-600 text-white border border-indigo-700 shadow-xs' 
                    : 'bg-white hover:bg-slate-50 border border-slate-200/80 text-slate-600 hover:text-slate-900 shadow-2xs'
                }`}
                title="Open Command Center Sidebar"
              >
                <MoreVertical className="w-4 h-4 stroke-[2.2]" />
              </button>
            </div>

          </div>

        </div>
      </header>

      {/* APPLE STYLE RIGHT SLIDE-OVER SIDEBAR DRAWER */}
      {showMoreMenu && (
        <div className="fixed inset-0 z-[200] flex justify-end animate-fade-in">
          {/* Backdrop Blur Overlay */}
          <div 
            className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs transition-opacity"
            onClick={() => setShowMoreMenu(false)}
          ></div>

          {/* Right Slide-Over Panel */}
          <div className="relative w-full max-w-sm sm:max-w-md h-full bg-white shadow-[0_0_60px_rgba(0,0,0,0.2)] border-l border-slate-200/80 z-10 flex flex-col animate-slide-left overflow-hidden">
            
            {/* Drawer Top Header */}
            <div className="p-5 bg-slate-900 text-white flex items-center justify-between shrink-0 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-xs">
                  <Sliders className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-white tracking-tight leading-snug">
                    Command & Control Center
                  </h3>
                  <p className="text-xs text-slate-400 font-medium mt-0.5">
                    Institution System Management
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowMoreMenu(false)}
                className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl border border-slate-700 transition cursor-pointer"
                title="Close Sidebar"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </div>

            {/* Scrollable Content inside Sidebar */}
            <div className="flex-1 overflow-y-auto p-5 space-y-6 custom-scrollbar bg-[#FBFBFD]">
              
              {/* User Account Overview Card */}
              <div className="p-4 bg-gradient-to-br from-indigo-50/80 via-white to-purple-50/50 rounded-2xl border border-indigo-100 shadow-2xs flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white font-extrabold text-lg flex items-center justify-center shadow-xs shrink-0">
                  {user?.displayName ? user.displayName.charAt(0).toUpperCase() : 'S'}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-black text-slate-900 text-sm truncate">
                      {user?.displayName || 'Prof. Sarah Jenkins'}
                    </h4>
                  </div>
                  <p className="text-xs text-slate-500 font-medium truncate mt-0.5">
                    {user?.email || 'sarah.jenkins@apex.edu'}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="px-2 py-0.5 bg-indigo-100/80 text-indigo-800 font-extrabold text-[10px] rounded-md uppercase tracking-wider">
                      {getRoleTitle()}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/60">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Active Session
                    </span>
                  </div>
                </div>
              </div>

              {/* SECTION 1: SYSTEM ADMINISTRATION */}
              <div className="space-y-2">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">
                  System Administration
                </p>

                <div className="space-y-1.5">
                  <button
                    onClick={() => { setShowMoreMenu(false); onNavigate('create_campus'); }}
                    className="w-full flex items-center justify-between p-3.5 bg-white hover:bg-slate-100/80 border border-slate-200/70 hover:border-indigo-300 rounded-2xl transition group text-left cursor-pointer shadow-2xs"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 group-hover:bg-blue-600 group-hover:text-white transition">
                        <Building2 className="w-4.5 h-4.5" />
                      </div>
                      <div className="min-w-0">
                        <div className="font-bold text-slate-900 text-xs group-hover:text-blue-600 transition">
                          Create New Campus
                        </div>
                        <div className="text-[11px] text-slate-500 font-medium truncate mt-0.5">
                          Expand institutional network & locations
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform shrink-0" />
                  </button>

                  <button
                    onClick={() => { setShowMoreMenu(false); onNavigate('settings'); }}
                    className="w-full flex items-center justify-between p-3.5 bg-white hover:bg-slate-100/80 border border-slate-200/70 hover:border-indigo-300 rounded-2xl transition group text-left cursor-pointer shadow-2xs"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 group-hover:bg-indigo-600 group-hover:text-white transition">
                        <Settings className="w-4.5 h-4.5" />
                      </div>
                      <div className="min-w-0">
                        <div className="font-bold text-slate-900 text-xs group-hover:text-indigo-600 transition">
                          System Settings
                        </div>
                        <div className="text-[11px] text-slate-500 font-medium truncate mt-0.5">
                          Configure tenant parameters & defaults
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform shrink-0" />
                  </button>

                  <button
                    onClick={() => { setShowMoreMenu(false); onNavigate('security'); }}
                    className="w-full flex items-center justify-between p-3.5 bg-white hover:bg-slate-100/80 border border-slate-200/70 hover:border-indigo-300 rounded-2xl transition group text-left cursor-pointer shadow-2xs"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 group-hover:bg-purple-600 group-hover:text-white transition">
                        <ShieldCheck className="w-4.5 h-4.5" />
                      </div>
                      <div className="min-w-0">
                        <div className="font-bold text-slate-900 text-xs group-hover:text-purple-600 transition">
                          Security & Audit Center
                        </div>
                        <div className="text-[11px] text-slate-500 font-medium truncate mt-0.5">
                          RBAC permissions & access control logs
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform shrink-0" />
                  </button>
                </div>
              </div>

              {/* SECTION 2: UTILITIES & SUPPORT */}
              <div className="space-y-2">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">
                  Utilities & Quick Access
                </p>

                <div className="space-y-1.5">
                  <button
                    onClick={() => { setShowMoreMenu(false); onNavigate('search'); }}
                    className="w-full flex items-center justify-between p-3.5 bg-white hover:bg-slate-100/80 border border-slate-200/70 hover:border-indigo-300 rounded-2xl transition group text-left cursor-pointer shadow-2xs"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 group-hover:bg-amber-500 group-hover:text-white transition">
                        <Search className="w-4.5 h-4.5" />
                      </div>
                      <div className="min-w-0">
                        <div className="font-bold text-slate-900 text-xs group-hover:text-amber-600 transition">
                          Global Search Index
                        </div>
                        <div className="text-[11px] text-slate-500 font-medium truncate mt-0.5">
                          Search students, staff & academic records
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform shrink-0" />
                  </button>

                  <button
                    onClick={() => { setShowMoreMenu(false); onNavigate('command_menu'); }}
                    className="w-full flex items-center justify-between p-3.5 bg-white hover:bg-slate-100/80 border border-slate-200/70 hover:border-indigo-300 rounded-2xl transition group text-left cursor-pointer shadow-2xs"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center shrink-0 group-hover:bg-teal-600 group-hover:text-white transition">
                        <LayoutGrid className="w-4.5 h-4.5" />
                      </div>
                      <div className="min-w-0">
                        <div className="font-bold text-slate-900 text-xs group-hover:text-teal-600 transition">
                          Command Hub Full View
                        </div>
                        <div className="text-[11px] text-slate-500 font-medium truncate mt-0.5">
                          Complete directory of administrative tools
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform shrink-0" />
                  </button>

                  <button
                    onClick={() => { setShowMoreMenu(false); onNavigate('help'); }}
                    className="w-full flex items-center justify-between p-3.5 bg-white hover:bg-slate-100/80 border border-slate-200/70 hover:border-indigo-300 rounded-2xl transition group text-left cursor-pointer shadow-2xs"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0 group-hover:bg-rose-500 group-hover:text-white transition">
                        <HelpCircle className="w-4.5 h-4.5" />
                      </div>
                      <div className="min-w-0">
                        <div className="font-bold text-slate-900 text-xs group-hover:text-rose-600 transition">
                          Help & Support Desk
                        </div>
                        <div className="text-[11px] text-slate-500 font-medium truncate mt-0.5">
                          Documentation, tickets & contact support
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform shrink-0" />
                  </button>
                </div>
              </div>

              {/* SECTION 3: USER PROFILE & SIGN OUT */}
              <div className="space-y-2 pt-2 border-t border-slate-200/60">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">
                  Account Options
                </p>

                <div className="space-y-1.5">
                  <button
                    onClick={() => { setShowMoreMenu(false); onNavigate('profile'); }}
                    className="w-full flex items-center justify-between p-3.5 bg-white hover:bg-slate-100/80 border border-slate-200/70 hover:border-indigo-300 rounded-2xl transition group text-left cursor-pointer shadow-2xs"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center shrink-0 group-hover:bg-slate-800 group-hover:text-white transition">
                        <UserCircle className="w-4.5 h-4.5" />
                      </div>
                      <div className="min-w-0">
                        <div className="font-bold text-slate-900 text-xs group-hover:text-indigo-600 transition">
                          Profile & Account
                        </div>
                        <div className="text-[11px] text-slate-500 font-medium truncate mt-0.5">
                          Manage account credentials & security
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform shrink-0" />
                  </button>

                  <button
                    onClick={() => { setShowMoreMenu(false); handleLogout(); }}
                    className="w-full flex items-center justify-between p-3.5 bg-rose-50/70 hover:bg-rose-100/80 border border-rose-200/60 rounded-2xl transition group text-left cursor-pointer"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center shrink-0 group-hover:bg-rose-600 group-hover:text-white transition">
                        <LogOut className="w-4.5 h-4.5" />
                      </div>
                      <div className="min-w-0">
                        <div className="font-bold text-rose-700 text-xs">
                          Sign Out of Galaxy ERP
                        </div>
                        <div className="text-[11px] text-rose-500 font-medium truncate mt-0.5">
                          Terminate active administrative session
                        </div>
                      </div>
                    </div>
                  </button>
                </div>
              </div>

            </div>

            {/* Drawer Bottom Footer */}
            <div className="p-4 bg-white border-t border-slate-200/80 flex items-center justify-between text-[11px] text-slate-500 shrink-0">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span className="font-bold text-slate-700">Galaxy ERP v4.8</span>
              </div>
              <span className="text-slate-400 font-semibold">macOS Command Palette</span>
            </div>

          </div>
        </div>
      )}

      {/* WORKSPACE LAUNCHER MODAL */}
      <WorkspaceLauncherModal 
        isOpen={showWorkspaceLauncher}
        onClose={() => setShowWorkspaceLauncher(false)}
        onNavigate={onNavigate}
        activeWorkspaceId={activeWorkspaceId}
      />
    </>
  );
};


