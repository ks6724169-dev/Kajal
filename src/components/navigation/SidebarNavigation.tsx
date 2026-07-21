import React from 'react';
import { useNavigation } from '../../hooks/useNavigation';
import { useRole } from '../../hooks/useRole';
import { NavigationResolver } from '../../core/NavigationResolver';
import { RoleResolver } from '../../core/RoleResolver';
import { useAuth } from '../../hooks/useAuth';
import { 
  LayoutDashboard, 
  Sparkles, 
  Users, 
  CreditCard, 
  Calendar, 
  Bus, 
  FileText, 
  Briefcase, 
  BookOpen, 
  Video, 
  Smartphone, 
  Layers, 
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  HelpCircle
} from 'lucide-react';
import { motion } from 'motion/react';

interface SidebarNavigationProps {
  language?: string;
  onNavigate: (path: string) => void;
}

// Icon mapper helper
const iconsMap: Record<string, React.ComponentType<any>> = {
  LayoutDashboard,
  Sparkles,
  Users,
  CreditCard,
  Calendar,
  Bus,
  FileText,
  Briefcase,
  BookOpen,
  Video,
  Smartphone,
  Layers,
  Settings
};

export const SidebarNavigation: React.FC<SidebarNavigationProps> = ({ 
  language = 'en',
  onNavigate 
}) => {
  const { sidebarOpen, toggleSidebar, activePath, setActivePath } = useNavigation();
  const { currentRole } = useRole();
  const { logout, user } = useAuth();

  const navItems = NavigationResolver.resolveNavigationForRole(currentRole);
  const roleMeta = RoleResolver.getMeta(currentRole);

  const handleNavClick = (path: string) => {
    onNavigate(path);
  };

  return (
    <aside 
      id="enterprise-sidebar-navigation"
      className={`bg-slate-900 border-r border-slate-800 text-slate-300 flex flex-col transition-all duration-300 relative select-none shrink-0 ${
        sidebarOpen ? 'w-64' : 'w-20'
      }`}
    >
      {/* Brand Header */}
      <div className="h-20 border-b border-slate-800 flex items-center justify-between px-5 relative">
        <div className="flex items-center gap-3 overflow-hidden cursor-pointer" onClick={() => handleNavClick('dashboard')}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20 shrink-0">
            <span className="text-xl">🌌</span>
          </div>
          {sidebarOpen && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-left leading-none"
            >
              <span className="font-extrabold text-sm tracking-tight text-white flex items-center gap-1">
                GALAXY <span className="text-[10px] bg-indigo-500/20 border border-indigo-500/30 text-indigo-400 px-1.5 py-0.5 rounded-full font-bold leading-none">ERP</span>
              </span>
              <span className="text-[9px] text-slate-500 font-extrabold uppercase tracking-wider leading-none block mt-1">SOVEREIGN OS</span>
            </motion.div>
          )}
        </div>

        {/* Sidebar Toggle Trigger Button */}
        <button
          type="button"
          onClick={toggleSidebar}
          className="absolute right-[-14px] top-7 bg-indigo-600 text-white rounded-full p-1 hover:bg-indigo-500 border border-slate-800 transition shadow-lg cursor-pointer z-50 hidden md:block"
        >
          {sidebarOpen ? <ChevronLeft className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
        </button>
      </div>

      {/* Active Workstation Context Indicator */}
      {sidebarOpen && (
        <div className="px-4 py-3 bg-slate-950/40 border-b border-slate-800/40 flex items-center gap-2.5">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
          <div className="text-[10px] font-bold text-slate-400 tracking-wide uppercase">
            {language === 'hi' ? `${roleMeta.hindiLabel} वर्कस्टेशन` : `${roleMeta.label} Workstation`}
          </div>
        </div>
      )}

      {/* Navigation Scrollable Roster */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1.5 custom-scrollbar">
        {navItems.map((item) => {
          const IconComponent = iconsMap[item.icon] || HelpCircle;
          const isActive = activePath === item.path;
          const titleLabel = language === 'hi' && item.hindiTitle ? item.hindiTitle : item.title;

          return (
            <div key={item.id} className="relative group">
              <button
                type="button"
                onClick={() => handleNavClick(item.path)}
                className={`w-full flex items-center gap-3.5 px-4 py-3.5 rounded-xl text-xs font-bold transition-all duration-150 cursor-pointer ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/10'
                    : 'hover:bg-slate-800/60 hover:text-white text-slate-400'
                }`}
              >
                <IconComponent className={`h-4.5 w-4.5 shrink-0 transition-transform ${isActive ? 'scale-110' : 'group-hover:scale-105'}`} />
                {sidebarOpen ? (
                  <span className="truncate flex-1 text-left">{titleLabel}</span>
                ) : null}

                {/* Badge Overlay */}
                {item.badge && sidebarOpen && (
                  <span className="text-[9px] bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-1.5 py-0.5 rounded-full font-extrabold leading-none">
                    {item.badge}
                  </span>
                )}
              </button>

              {/* Tooltip Overlay in Collapsed Mode */}
              {!sidebarOpen && (
                <div className="absolute left-20 top-2.5 bg-slate-950 text-white text-xs font-bold px-3 py-2 rounded-lg border border-slate-800 shadow-2xl opacity-0 scale-95 origin-left pointer-events-none group-hover:opacity-100 group-hover:scale-100 transition-all z-50 whitespace-nowrap">
                  {titleLabel}
                  {item.badge && (
                    <span className="ml-1.5 text-[8px] bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-1 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Operational User Summary & Sign out Footer */}
      <div className="p-4 border-t border-slate-800 bg-slate-950/40">
        <div className={`flex items-center gap-3 ${sidebarOpen ? 'justify-between' : 'justify-center'}`}>
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="h-8.5 w-8.5 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-extrabold text-white shrink-0">
              {user?.name ? user.name.charAt(0) : 'U'}
            </div>
            {sidebarOpen && (
              <div className="text-left leading-tight truncate">
                <p className="text-xs font-extrabold text-white truncate">{user?.name || 'Academic Agent'}</p>
                <p className="text-[10px] text-slate-500 truncate">{user?.email || 'authenticated@galaxy.edu'}</p>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => {
              logout();
              window.dispatchEvent(new CustomEvent('nav-to', { detail: '/landing' }));
            }}
            className={`p-2 rounded-xl text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition cursor-pointer shrink-0`}
            title={language === 'hi' ? 'लॉगआउट' : 'Sign Out'}
          >
            <LogOut className="h-4.5 w-4.5" />
          </button>
        </div>
      </div>
    </aside>
  );
};
