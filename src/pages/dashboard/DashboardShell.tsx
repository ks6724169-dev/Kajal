import React, { useState } from 'react';
import { useStore } from '../../stores/StoreContext';
import { GalaxyLogo } from '../../components/common/GalaxyLogo';
import { getNavigationForRole } from '../../config/navigation';
import { 
  Menu, 
  X, 
  Bell, 
  Sparkles, 
  LayoutDashboard, 
  Command, 
  Star, 
  User, 
  Settings, 
  LogOut, 
  Grip, 
  Clock 
} from 'lucide-react';
import { Role } from '../../types';

interface DashboardShellProps {
  children: React.ReactNode;
  activeTab: string;
  onSelectTab: (tabId: string) => void;
}

export const DashboardShell: React.FC<DashboardShellProps> = ({
  children,
  activeTab,
  onSelectTab
}) => {
  const { user, currentTenant, logout, setCommandPaletteOpen, favorites, notifications } = useStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const activeRole: Role = user?.role || 'super_admin';
  const navItems = getNavigationForRole(activeRole);
  const unreadCount = notifications.filter(n => !n.read).length;

  const handleLogout = () => {
    logout();
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col font-sans transition-colors duration-150">
      
      {/* Top Banner Status Bar */}
      <div className="bg-indigo-600 text-white text-[10px] font-bold py-1 px-4 text-center select-none uppercase tracking-widest flex items-center justify-center gap-1.5 shadow-sm">
        <Sparkles className="w-3.5 h-3.5 animate-pulse text-indigo-200" />
        <span>SaaS Multi-Tenant Cloud Active: All regional clusters operational on Node 02 ap-south</span>
      </div>

      <div className="flex flex-1 flex-col md:flex-row relative">
        
        {/* DESKTOP SIDEBAR RAIL */}
        <aside className="hidden md:flex md:w-64 bg-slate-900 border-r border-slate-800 text-slate-300 flex-col justify-between shrink-0 h-auto">
          <div>
            {/* Header branding */}
            <div className="p-4 border-b border-slate-800/80 flex items-center justify-between">
              <GalaxyLogo size="sm" variant="dark" subtitle="Institution ERP" />
            </div>

            {/* Nav Menu */}
            <nav className="p-3 space-y-1">
              <div className="px-3 py-1.5 text-[9px] font-extrabold text-slate-500 uppercase tracking-widest">Main Modules</div>
              {navItems.map((item) => {
                const Icon = item.icon;
                const isSelected = activeTab === item.id;
                const isFav = favorites.includes(`/dashboard`) && item.id === 'dashboard'; // simulation
                
                return (
                  <button
                    key={item.id}
                    onClick={() => onSelectTab(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition font-semibold text-xs text-left cursor-pointer ${
                      isSelected 
                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/10' 
                        : 'hover:bg-slate-800/60 text-slate-400 hover:text-slate-100'
                    }`}
                  >
                    <div className="flex items-center space-x-2.5 min-w-0">
                      <Icon className="w-4 h-4 shrink-0" />
                      <span className="truncate">{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className="text-[8px] font-extrabold bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 px-1.5 py-0.5 rounded-full uppercase shrink-0">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* User Status Profile Card in sidebar footer */}
          <div className="p-4 border-t border-slate-800/80 bg-slate-950/40">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-8.5 h-8.5 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-lg select-none">
                👤
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-xs font-bold text-slate-200 block truncate">{user?.name || 'Dr. Rajesh Sharma'}</span>
                <span className="text-[9px] text-indigo-400 uppercase tracking-wider font-extrabold block truncate">{activeRole.replace('_', ' ')}</span>
              </div>
            </div>
            
            {/* Quick utility icons */}
            <div className="grid grid-cols-3 gap-1 border-t border-slate-800/40 pt-2.5 text-center">
              <button 
                onClick={() => setCommandPaletteOpen(true)}
                title="Command palette (Ctrl+K)"
                className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-500 hover:text-indigo-400 transition flex items-center justify-center"
              >
                <Command className="w-3.5 h-3.5" />
              </button>
              <button 
                onClick={() => onSelectTab('settings')}
                title="SaaS settings"
                className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-500 hover:text-indigo-400 transition flex items-center justify-center"
              >
                <Settings className="w-3.5 h-3.5" />
              </button>
              <button 
                onClick={handleLogout}
                title="Logout session"
                className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-500 hover:text-rose-400 transition flex items-center justify-center"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </aside>

        {/* MOBILE SIDEBAR PANEL OVERLAY */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 flex md:hidden">
            <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs" onClick={() => setMobileMenuOpen(false)} />
            <div className="relative w-72 bg-slate-900 text-slate-300 flex flex-col justify-between h-full p-5 shadow-2xl z-10 animate-slide-in">
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
                  <GalaxyLogo size="sm" variant="dark" subtitle="Institution ERP" />
                  <button onClick={() => setMobileMenuOpen(false)} className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <nav className="space-y-1">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    const isSelected = activeTab === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          onSelectTab(item.id);
                          setMobileMenuOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition font-semibold text-xs text-left ${
                          isSelected 
                            ? 'bg-indigo-600 text-white' 
                            : 'hover:bg-slate-800/60 text-slate-400 hover:text-slate-100'
                        }`}
                      >
                        <div className="flex items-center space-x-2.5 min-w-0">
                          <Icon className="w-4 h-4 shrink-0" />
                          <span className="truncate">{item.label}</span>
                        </div>
                      </button>
                    );
                  })}
                </nav>
              </div>
              <div className="border-t border-slate-800 pt-4 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-base">👤</div>
                  <div>
                    <span className="text-xs font-bold text-slate-200 block truncate">{user?.name}</span>
                    <span className="text-[9px] text-slate-500 font-bold uppercase">{activeRole}</span>
                  </div>
                </div>
                <button onClick={handleLogout} className="p-1.5 rounded-lg hover:bg-slate-800 text-rose-400 hover:text-rose-300 transition">
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MAIN DISPLAY REGION */}
        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          
          {/* Mobile Top Header */}
          <header className="flex items-center justify-between p-4 bg-slate-900 border-b border-slate-800 text-white md:hidden shrink-0 shadow-sm">
            <div className="flex items-center space-x-2">
              <button 
                onClick={() => setMobileMenuOpen(true)}
                className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-300 hover:text-white transition"
              >
                <Menu className="w-5 h-5" />
              </button>
              <span className="font-extrabold text-sm tracking-tight uppercase">Galaxy OS</span>
            </div>
            <div className="flex items-center space-x-3">
              <button onClick={() => setCommandPaletteOpen(true)} className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition">
                <Command className="w-4 h-4" />
              </button>
              <div className="relative">
                <span className="absolute top-0.5 right-0.5 w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <Bell className="w-4.5 h-4.5 text-slate-400" />
              </div>
            </div>
          </header>

          {/* Render Active Children views */}
          <main className="flex-1 overflow-y-auto">
            {children}
          </main>

        </div>

      </div>
    </div>
  );
};
export default DashboardShell;
