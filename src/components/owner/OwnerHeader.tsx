import React, { useState } from 'react';
import { Bell, Sparkles, User, Settings, MoreVertical, MapPin, Shield, LogOut, HelpCircle, UserCircle, Search, Building2, X, LayoutGrid, ChevronRight } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { CampusSwitcher } from './CampusSwitcher';
import { useAuth } from '../../hooks/useAuth';
import { MODULE_CATEGORIES } from '../../data/modulesRegistry';

interface OwnerHeaderProps {
  tenantName: string;
  tenantType: string;
  currentCampus: string;
  onCampusChange: (campus: string) => void;
  onNavigate: (path: string) => void;
  campuses?: any[];
}

export const OwnerHeader: React.FC<OwnerHeaderProps> = ({
  tenantName,
  tenantType,
  currentCampus,
  onCampusChange,
  onNavigate,
  campuses = []
}) => {
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showWorkMenu, setShowWorkMenu] = useState(false);
  const [moduleSearch, setModuleSearch] = useState('');
  const { logout, user } = useAuth();

  const handleLogout = () => {
    logout();
    window.dispatchEvent(new CustomEvent('nav-to', { detail: '/login' }));
  };

  // Flatten all 28 modules
  const allModules = MODULE_CATEGORIES.flatMap(cat => cat.modules);

  // Filter modules by search query
  const filteredModules = allModules.filter(mod => 
    mod.name.toLowerCase().includes(moduleSearch.toLowerCase()) ||
    mod.description.toLowerCase().includes(moduleSearch.toLowerCase())
  );

  const getModuleColors = (category: string) => {
    switch (category) {
      case "Organization & Administration":
        return {
          bg: "bg-sky-50/70 hover:bg-sky-100/40",
          border: "border-sky-100 hover:border-sky-400",
          iconBg: "bg-sky-100 text-sky-600 group-hover:bg-sky-600 group-hover:text-white",
          text: "text-sky-900 group-hover:text-sky-700",
          badge: "bg-sky-100/60 text-sky-700 border-sky-200/30"
        };
      case "Student & Enrollment":
        return {
          bg: "bg-emerald-50/70 hover:bg-emerald-100/40",
          border: "border-emerald-100 hover:border-emerald-400",
          iconBg: "bg-emerald-100 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white",
          text: "text-emerald-900 group-hover:text-emerald-700",
          badge: "bg-emerald-100/60 text-emerald-700 border-emerald-200/30"
        };
      case "Academic":
        return {
          bg: "bg-violet-50/70 hover:bg-violet-100/40",
          border: "border-violet-100 hover:border-violet-400",
          iconBg: "bg-violet-100 text-violet-600 group-hover:bg-violet-600 group-hover:text-white",
          text: "text-violet-900 group-hover:text-violet-700",
          badge: "bg-violet-100/60 text-violet-700 border-violet-200/30"
        };
      case "People & Workforce":
        return {
          bg: "bg-teal-50/70 hover:bg-teal-100/40",
          border: "border-teal-100 hover:border-teal-400",
          iconBg: "bg-teal-100 text-teal-600 group-hover:bg-teal-600 group-hover:text-white",
          text: "text-teal-900 group-hover:text-teal-700",
          badge: "bg-teal-100/60 text-teal-700 border-teal-200/30"
        };
      case "Finance":
        return {
          bg: "bg-rose-50/70 hover:bg-rose-100/40",
          border: "border-rose-100 hover:border-rose-400",
          iconBg: "bg-rose-100 text-rose-600 group-hover:bg-rose-600 group-hover:text-white",
          text: "text-rose-900 group-hover:text-rose-700",
          badge: "bg-rose-100/60 text-rose-700 border-rose-200/30"
        };
      case "Operations":
        return {
          bg: "bg-cyan-50/70 hover:bg-cyan-100/40",
          border: "border-cyan-100 hover:border-cyan-400",
          iconBg: "bg-cyan-100 text-cyan-600 group-hover:bg-cyan-600 group-hover:text-white",
          text: "text-cyan-900 group-hover:text-cyan-700",
          badge: "bg-cyan-100/60 text-cyan-700 border-cyan-200/30"
        };
      case "Communication & Growth":
        return {
          bg: "bg-pink-50/70 hover:bg-pink-100/40",
          border: "border-pink-100 hover:border-pink-400",
          iconBg: "bg-pink-100 text-pink-600 group-hover:bg-pink-600 group-hover:text-white",
          text: "text-pink-900 group-hover:text-pink-700",
          badge: "bg-pink-100/60 text-pink-700 border-pink-200/30"
        };
      case "Intelligence & AI":
        return {
          bg: "bg-purple-50/70 hover:bg-purple-100/40",
          border: "border-purple-100 hover:border-purple-400",
          iconBg: "bg-purple-100 text-purple-600 group-hover:bg-purple-600 group-hover:text-white",
          text: "text-purple-900 group-hover:text-purple-700",
          badge: "bg-purple-100/60 text-purple-700 border-purple-200/30"
        };
      case "Enterprise & Platform":
        return {
          bg: "bg-amber-50/70 hover:bg-amber-100/40",
          border: "border-amber-100 hover:border-amber-400",
          iconBg: "bg-amber-100 text-amber-600 group-hover:bg-amber-600 group-hover:text-white",
          text: "text-amber-900 group-hover:text-amber-700",
          badge: "bg-amber-100/60 text-amber-700 border-amber-200/30"
        };
      case "Reserved Core Modules":
      default:
        return {
          bg: "bg-indigo-50/70 hover:bg-indigo-100/40",
          border: "border-indigo-100 hover:border-indigo-400",
          iconBg: "bg-indigo-100 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white",
          text: "text-indigo-900 group-hover:text-indigo-700",
          badge: "bg-indigo-100/60 text-indigo-700 border-indigo-200/30"
        };
    }
  };

  return (
    <header className="bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between sticky top-0 z-50">
      {/* Left: Branding & Context */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => onNavigate('dashboard')}>
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-sm">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h1 className="font-bold text-slate-900 leading-tight">Galaxy ERP</h1>
            <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">{tenantName}</p>
          </div>
        </div>
        <div className="h-8 w-px bg-slate-200 hidden md:block"></div>
        <div className="hidden md:flex items-center">
          <CampusSwitcher currentCampus={currentCampus} onChange={onCampusChange} campuses={campuses} />
        </div>
      </div>

      {/* Right: Actions & Profile */}
      <div className="flex items-center gap-2">
        {/* Work / Modules Button */}
        <button 
          onClick={() => setShowWorkMenu(true)}
          className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded-lg shadow-sm hover:bg-slate-50 text-slate-700 text-xs font-bold transition cursor-pointer"
          title="Work & Modules Catalogue"
        >
          <LayoutGrid className="w-4 h-4 text-indigo-600" />
          <span className="text-xs font-bold text-slate-800 leading-none">Work / Modules</span>
        </button>

        {/* Global Search Button */}
        <button 
          onClick={() => onNavigate('search')}
          className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition cursor-pointer"
          title="Global Search (Search Button)"
        >
          <Search className="w-5 h-5" />
        </button>

        {/* Notifications Button */}
        <button 
          onClick={() => onNavigate('notifications')}
          className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition relative cursor-pointer"
          title="Notifications Center"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-500 rounded-full border-2 border-white"></span>
        </button>

        {/* Command Menu Dropdown */}
        <div className="relative">
          <button 
            onClick={() => setShowMoreMenu(!showMoreMenu)}
            className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition cursor-pointer"
            title="Command Menu"
          >
            <MoreVertical className="w-5 h-5" />
          </button>
          
          {showMoreMenu && (
            <div className="absolute top-full right-0 mt-2 w-56 bg-white border border-slate-200 rounded-xl shadow-lg z-50 py-2">
              <div className="px-4 py-2 border-b border-slate-100 flex justify-between items-center">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Command Menu</p>
                <button 
                  onClick={() => { setShowMoreMenu(false); onNavigate('command_menu'); }} 
                  className="text-[10px] text-indigo-600 font-bold hover:underline cursor-pointer"
                >
                  Full View
                </button>
              </div>
              <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-indigo-600 transition cursor-pointer" onClick={() => { setShowMoreMenu(false); onNavigate('create_campus'); }}>
                <Building2 className="w-4 h-4 text-indigo-600" /> ➕ Create New Campus
              </button>
              <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-indigo-600 transition cursor-pointer" onClick={() => { setShowMoreMenu(false); onNavigate('settings'); }}>
                <Settings className="w-4 h-4" /> Settings
              </button>
              <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-indigo-600 transition cursor-pointer" onClick={() => { setShowMoreMenu(false); onNavigate('security'); }}>
                <Shield className="w-4 h-4" /> Security Center
              </button>
              <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-indigo-600 transition cursor-pointer" onClick={() => { setShowMoreMenu(false); onNavigate('search'); }}>
                <Search className="w-4 h-4" /> Global Search
              </button>
              <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-indigo-600 transition cursor-pointer" onClick={() => { setShowMoreMenu(false); onNavigate('help'); }}>
                <HelpCircle className="w-4 h-4" /> Help & Support
              </button>
              <div className="h-px bg-slate-100 my-1"></div>
              <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-indigo-600 transition cursor-pointer" onClick={() => { setShowMoreMenu(false); onNavigate('profile'); }}>
                <UserCircle className="w-4 h-4" /> Profile & Security
              </button>
              <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition cursor-pointer" onClick={() => { setShowMoreMenu(false); handleLogout(); }}>
                <LogOut className="w-4 h-4" /> Sign Out
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 28 CORE MODULES LAUNCHER OVERLAY POPUP */}
      {showWorkMenu && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-[9999] animate-fade-in">
          {/* Overlay Background click to close */}
          <div className="absolute inset-0" onClick={() => setShowWorkMenu(false)}></div>
          
          {/* Normal-sized Popup box */}
          <div className="relative w-full max-w-4xl bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            
            {/* Popup Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <span className="text-xl">🧩</span>
                <div>
                  <h3 className="font-black text-slate-900 text-sm md:text-base leading-tight">
                    Galaxy Core Module Catalogue
                  </h3>
                  <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">
                    Registry of 28 Enterprise Systems & Platform Services
                  </p>
                </div>
              </div>
              
              <button 
                onClick={() => setShowWorkMenu(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 rounded-lg transition cursor-pointer"
                title="Close Panel"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Search Bar inside Popup */}
            <div className="px-6 py-3 border-b border-slate-100 bg-white">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search modules..."
                  value={moduleSearch}
                  onChange={(e) => setModuleSearch(e.target.value)}
                  className="w-full pl-9 pr-8 py-2 bg-slate-50 hover:bg-slate-100/60 focus:bg-white text-xs border border-slate-200 focus:border-indigo-500 rounded-xl outline-none transition"
                />
                {moduleSearch && (
                  <button 
                    onClick={() => setModuleSearch('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer text-xs"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>

            {/* Modules Grid - EXACTLY Horizontal lines of 4 modules each (grid-cols-4) */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {filteredModules.length === 0 ? (
                <div className="py-12 text-center space-y-2">
                  <p className="text-xs text-slate-500">No modules found matching "{moduleSearch}"</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4">
                  {filteredModules.map((mod) => {
                    const IconComp = (LucideIcons as any)[mod.iconName] || LucideIcons.HelpCircle;
                    const colors = getModuleColors(mod.category);
                    return (
                      <button
                        key={mod.id}
                        onClick={() => {
                          setShowWorkMenu(false);
                          onNavigate(mod.path);
                        }}
                        className={`flex flex-col items-center justify-between p-3.5 ${colors.bg} border ${colors.border} rounded-2xl transition-all duration-200 text-center group h-[125px] cursor-pointer hover:shadow-xs`}
                      >
                        <div className="flex flex-col items-center w-full">
                          {/* Beautiful icon element */}
                          <div className={`w-10 h-10 ${colors.iconBg} rounded-xl flex items-center justify-center transition duration-150 shadow-2xs`}>
                            <IconComp className="w-5 h-5" />
                          </div>
                          
                          {/* Module name */}
                          <span className={`text-[11px] font-black leading-tight text-center mt-2.5 line-clamp-2 w-full transition ${colors.text}`}>
                            {mod.name}
                          </span>
                        </div>
                        
                        {/* Status Label */}
                        <span className={`text-[8px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-widest border ${colors.badge} transition`}>
                          Soon
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Bottom: Dedicated Shared Platform Layer Access Bar */}
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs">🧩</span>
                <span className="text-[11px] font-bold text-slate-700">
                  Shared Platform Layer:
                </span>
                <span className="text-[10px] text-slate-500 hidden sm:inline">
                  SSO, RBAC, RLS Multi-Tenant Isolation, Notification and Workflow Engines
                </span>
              </div>
              
              <button
                onClick={() => {
                  setShowWorkMenu(false);
                  onNavigate('module_shared_platform');
                }}
                className="self-end sm:self-auto flex items-center gap-1 px-3 py-1.5 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 text-[10px] font-bold rounded-lg transition cursor-pointer shadow-2xs"
              >
                <span>View Platform Services</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>

          </div>
        </div>
      )}
    </header>
  );
};
