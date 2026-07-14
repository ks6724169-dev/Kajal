import React, { useState } from 'react';
import { Role, Tenant } from '../types';
import { TENANTS } from '../data/mockData';
import { 
  Building2, 
  ShieldAlert, 
  Bell, 
  Globe, 
  Smartphone, 
  Sparkles, 
  ChevronDown, 
  Check, 
  UserCheck 
} from 'lucide-react';

interface NavbarProps {
  currentTenant: Tenant;
  onSelectTenant: (tenant: Tenant) => void;
  currentRole: Role;
  onSelectRole: (role: Role) => void;
  language: string;
  onSelectLanguage: (lang: string) => void;
  onOpenMobileApp: () => void;
  onOpenSettings: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTenant,
  onSelectTenant,
  currentRole,
  onSelectRole,
  language,
  onSelectLanguage,
  onOpenMobileApp,
  onOpenSettings
}) => {
  const [showTenantMenu, setShowTenantMenu] = useState(false);
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const roles: { id: Role; label: string; icon: string }[] = [
    { id: 'super_admin', label: 'Super Admin / Owner', icon: '👑' },
    { id: 'principal', label: 'Principal / Director', icon: '🏛️' },
    { id: 'teacher', label: 'Faculty / Teacher', icon: '👨‍🏫' },
    { id: 'student', label: 'Student Portal', icon: '🎓' },
    { id: 'parent', label: 'Parent Portal', icon: '👨‍👩‍👦' },
    { id: 'driver', label: 'Bus Driver', icon: '🚌' }
  ];

  const languages = [
    { id: 'en', label: 'English (US)' },
    { id: 'hi', label: 'हिन्दी (Hindi)' },
    { id: 'hinglish', label: 'Hinglish' },
    { id: 'es', label: 'Español' }
  ];

  const notifications = [
    { id: 1, title: 'Fee Payment Received', desc: 'Aarav Sharma paid ₹45,000 via UPI GPay', time: '5m ago' },
    { id: 2, title: 'Bus #4 On Time', desc: 'Route #4 reached Sector 12 checkpost', time: '12m ago' },
    { id: 3, title: 'AI Principal Alert', desc: 'Attendance dropped by 1.2% in Grade 11-B', time: '1h ago' }
  ];

  return (
    <header className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-40 px-4 py-2.5 flex items-center justify-between shadow-md">
      {/* Left: Logo & Tenant Switcher */}
      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center text-xl shadow-lg shadow-indigo-500/30">
            {currentTenant.logo}
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white via-indigo-200 to-indigo-400 bg-clip-text text-transparent">
                Galaxy ERP
              </span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                SaaS Enterprise v4.5
              </span>
            </div>
            
            {/* Tenant Dropdown */}
            <div className="relative">
              <button 
                onClick={() => setShowTenantMenu(!showTenantMenu)}
                className="flex items-center space-x-1 text-xs text-slate-300 hover:text-white transition mt-0.5"
              >
                <Building2 className="w-3.5 h-3.5 text-indigo-400" />
                <span className="font-medium max-w-[220px] truncate">{currentTenant.name}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {showTenantMenu && (
                <div className="absolute left-0 mt-2 w-72 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl py-2 z-50">
                  <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    Switch Institution (Multi-Tenant)
                  </div>
                  {TENANTS.map(t => (
                    <button
                      key={t.id}
                      onClick={() => {
                        onSelectTenant(t);
                        setShowTenantMenu(false);
                      }}
                      className={`w-full text-left px-3 py-2.5 flex items-center justify-between hover:bg-slate-700/60 transition ${
                        currentTenant.id === t.id ? 'bg-indigo-600/20 text-indigo-300 border-l-2 border-indigo-500' : 'text-slate-200'
                      }`}
                    >
                      <div className="flex items-center space-x-2.5">
                        <span className="text-lg">{t.logo}</span>
                        <div>
                          <div className="text-sm font-medium">{t.name}</div>
                          <div className="text-[11px] text-slate-400 uppercase">{t.type} • {t.academicYear}</div>
                        </div>
                      </div>
                      {currentTenant.id === t.id && <Check className="w-4 h-4 text-indigo-400" />}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center space-x-3">
        {/* Role Switcher */}
        <div className="relative">
          <button
            onClick={() => setShowRoleMenu(!showRoleMenu)}
            className="flex items-center space-x-2 bg-slate-800 hover:bg-slate-700/80 border border-slate-700 px-3 py-1.5 rounded-lg text-xs font-medium transition shadow-sm"
          >
            <span className="text-sm">
              {roles.find(r => r.id === currentRole)?.icon}
            </span>
            <span className="hidden md:inline text-slate-200">
              Role: <strong className="text-indigo-300">{roles.find(r => r.id === currentRole)?.label}</strong>
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {showRoleMenu && (
            <div className="absolute right-0 mt-2 w-64 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl py-2 z-50">
              <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Switch Role / Portal View
              </div>
              {roles.map(r => (
                <button
                  key={r.id}
                  onClick={() => {
                    onSelectRole(r.id);
                    setShowRoleMenu(false);
                  }}
                  className={`w-full text-left px-3 py-2 flex items-center justify-between hover:bg-slate-700/60 transition text-sm ${
                    currentRole === r.id ? 'bg-indigo-600/20 text-indigo-300 font-semibold' : 'text-slate-300'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <span>{r.icon}</span>
                    <span>{r.label}</span>
                  </div>
                  {currentRole === r.id && <Check className="w-4 h-4 text-indigo-400" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Language Switcher */}
        <div className="relative">
          <button
            onClick={() => setShowLangMenu(!showLangMenu)}
            className="p-2 bg-slate-800 hover:bg-slate-700/80 border border-slate-700 rounded-lg text-slate-300 hover:text-white transition flex items-center space-x-1 text-xs"
            title="Change Language"
          >
            <Globe className="w-4 h-4 text-slate-400" />
            <span className="hidden sm:inline uppercase font-mono font-medium">{language}</span>
          </button>

          {showLangMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl py-2 z-50">
              <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Select Language
              </div>
              {languages.map(l => (
                <button
                  key={l.id}
                  onClick={() => {
                    onSelectLanguage(l.id);
                    setShowLangMenu(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-700/60 transition ${
                    language === l.id ? 'bg-indigo-600/20 text-indigo-300 font-bold' : 'text-slate-300'
                  }`}
                >
                  <span>{l.label}</span>
                  {language === l.id && <Check className="w-3.5 h-3.5 text-indigo-400" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Mobile App Simulator Button */}
        <button
          onClick={onOpenMobileApp}
          className="hidden lg:flex items-center space-x-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white px-3 py-1.5 rounded-lg text-xs font-semibold shadow-lg shadow-purple-500/25 transition"
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span>Mobile Apps</span>
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 bg-slate-800 hover:bg-slate-700/85 border border-slate-700 rounded-lg text-slate-300 hover:text-white transition relative"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl py-3 z-50">
              <div className="px-4 pb-2 border-b border-slate-700 flex items-center justify-between">
                <span className="text-xs font-bold text-white uppercase tracking-wider">Campus Live Alerts</span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-medium">3 New</span>
              </div>
              <div className="divide-y divide-slate-700/50 max-h-72 overflow-y-auto">
                {notifications.map(n => (
                  <div key={n.id} className="px-4 py-2.5 hover:bg-slate-700/40 transition">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-indigo-300">{n.title}</span>
                      <span className="text-[10px] text-slate-400">{n.time}</span>
                    </div>
                    <p className="text-xs text-slate-300 mt-0.5">{n.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
