import React, { useState, useRef, useEffect } from 'react';
import { 
  Search, 
  Sparkles, 
  Bell, 
  Globe, 
  Moon, 
  Maximize, 
  UserCircle,
  User,
  LogOut,
  Grid,
  Home
} from 'lucide-react';
import { teacherModules } from './modulesData';

interface TeacherHeaderProps {
  onLogout: () => void;
  onNavigateHome: () => void;
  onAiClick?: () => void;
  onOpenProfile?: () => void;
  onOpenNotifications?: () => void;
  currentModuleId?: string | null;
  onSelectModule?: (moduleId: string) => void;
}

export const TeacherHeader: React.FC<TeacherHeaderProps> = ({ 
  onLogout, 
  onNavigateHome, 
  onAiClick, 
  onOpenProfile, 
  onOpenNotifications,
  currentModuleId,
  onSelectModule
}) => {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isLauncherOpen, setIsLauncherOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const launcherRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false);
      }
      if (launcherRef.current && !launcherRef.current.contains(event.target as Node)) {
        setIsLauncherOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-xl border-b border-slate-200 shadow-sm transition-all">
      <div className="flex h-16 items-center px-4 md:px-6 gap-4">
        {/* Logo and Brand */}
        <div className="flex items-center gap-2 cursor-pointer" onClick={onNavigateHome}>
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-md">
            <Sparkles className="w-5 h-5" />
          </div>
          <div className="hidden md:flex flex-col">
            <span className="font-bold text-lg leading-none text-slate-900 tracking-tight">Galaxy ERP</span>
            <span className="text-[10px] text-slate-500 font-semibold tracking-widest uppercase">Teacher Panel</span>
          </div>
        </div>

        {/* School Info Divider */}
        <div className="hidden lg:flex items-center gap-3 ml-4 pl-4 border-l border-slate-200">
          <div className="flex flex-col">
            <span className="text-sm font-bold text-slate-800">Delhi Public School</span>
            <div className="flex items-center gap-2 text-[11px] text-slate-500 font-medium">
              <span>Academic Year: 2026-27</span>
              <span className="w-1 h-1 rounded-full bg-slate-300"></span>
              <span>ID: TCH-9021</span>
            </div>
          </div>
        </div>

        {/* Global Search */}
        <div className="flex-1 max-w-xl ml-auto mr-4 hidden md:flex">
          <div className="relative w-full group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
            </div>
            <input
              type="text"
              placeholder="Search students, classes, modules (Press '/')"
              className="w-full bg-slate-100/50 border border-slate-200 text-sm rounded-xl pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-400"
            />
            <div className="absolute inset-y-0 right-0 pr-2 flex items-center pointer-events-none">
              <span className="text-[10px] font-medium text-slate-400 border border-slate-200 bg-white px-1.5 rounded">/</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2 ml-auto md:ml-0">
          {/* Mobile Search Icon */}
          <button className="md:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors">
            <Search className="w-5 h-5" />
          </button>
          
          {/* Action Icons */}
          <div className="flex items-center gap-1 border-r border-slate-200 pr-2 sm:pr-4 mr-1 sm:mr-2">
            <button onClick={onAiClick} className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors relative group" title="AI Assistant">
              <Sparkles className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-500 rounded-full border-2 border-white"></span>
            </button>
            <button onClick={onOpenNotifications} className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors relative" title="Notifications">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
            </button>

            {/* Module App Launcher */}
            <div className="relative" ref={launcherRef}>
              <button 
                onClick={() => setIsLauncherOpen(!isLauncherOpen)}
                className={`p-2 rounded-lg transition-all ${isLauncherOpen ? 'bg-indigo-50 text-indigo-600' : 'text-slate-500 hover:bg-slate-100'}`} 
                title="Module Launcher"
              >
                <Grid className="w-5 h-5" />
              </button>

              {isLauncherOpen && (
                <div className="absolute right-0 mt-3 w-80 bg-white rounded-3xl shadow-2xl border border-slate-200 p-4 z-50 animate-in fade-in zoom-in-95 duration-200">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
                    <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">Module Launcher</span>
                    <button 
                      onClick={onNavigateHome}
                      className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-1 rounded-md hover:bg-indigo-50 hover:text-indigo-600 transition flex items-center gap-1"
                    >
                      <Home className="w-3 h-3" /> Dashboard
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 max-h-[300px] overflow-y-auto pr-1">
                    {teacherModules.map((mod) => {
                      const Icon = mod.icon;
                      const isActive = currentModuleId === mod.id;
                      return (
                        <button
                          key={mod.id}
                          onClick={() => {
                            if (onSelectModule) onSelectModule(mod.id);
                            setIsLauncherOpen(false);
                          }}
                          className={`flex flex-col items-center p-3 rounded-2xl transition border text-center ${
                            isActive 
                              ? 'bg-indigo-50/50 border-indigo-200 text-indigo-600 font-bold' 
                              : 'bg-slate-50/50 border-transparent hover:bg-slate-100 text-slate-700 hover:text-slate-900'
                          }`}
                        >
                          <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${mod.color} flex items-center justify-center text-white mb-2 shadow-sm`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <span className="text-[10px] font-semibold leading-tight line-clamp-1">{mod.title}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Utility Icons */}
          <div className="flex items-center gap-1 border-r border-slate-200 pr-2 sm:pr-4 mr-1 sm:mr-2 hidden lg:flex">
            <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors" title="Language">
              <Globe className="w-5 h-5" />
            </button>
            <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors" title="Dark Mode">
              <Moon className="w-5 h-5" />
            </button>
            <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors" title="Full Screen">
              <Maximize className="w-5 h-5" />
            </button>
          </div>

          {/* Profile & Dropdown Menu */}
          <div className="relative" ref={menuRef}>
            <div className="flex items-center gap-3 cursor-pointer group" onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setIsProfileMenuOpen(!isProfileMenuOpen);
                }}
                className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center hover:ring-2 ring-indigo-500 ring-offset-2 transition-all shadow-sm"
              >
                <UserCircle className="w-6 h-6" />
              </button>
            </div>

            {isProfileMenuOpen && (
              <div className="absolute right-0 mt-3 w-48 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-200">
                <div className="px-4 py-2 border-b border-slate-100">
                  <p className="text-xs font-bold text-slate-900">Sarah Johnson</p>
                  <p className="text-[11px] text-slate-500">Senior Mathematics</p>
                </div>
                <button
                  onClick={() => {
                    setIsProfileMenuOpen(false);
                    if (onOpenProfile) onOpenProfile();
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                >
                  <User className="w-4 h-4 text-slate-400 group-hover:text-indigo-500" />
                  <span>Profile</span>
                </button>
                <button
                  onClick={() => {
                    setIsProfileMenuOpen(false);
                    onLogout();
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors border-t border-slate-100"
                >
                  <LogOut className="w-4 h-4 text-rose-500" />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
