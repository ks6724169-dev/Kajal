import React from 'react';
import { motion } from 'motion/react';
import { 
  Menu, 
  X, 
  Bell, 
  Search, 
  Sparkles, 
  Globe, 
  Compass, 
  Settings as SettingsIcon,
  ChevronRight,
  Shield,
  Heart,
  HelpCircle,
  FolderLock
} from 'lucide-react';
import { useStore } from '../stores/StoreContext';
import { getTranslation } from '../theme/translations';
import { Avatar, Button } from '../design-system/CoreComponents';

// 1. LOGIN LAYOUT
export const LoginLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden font-sans selection:bg-indigo-500 selection:text-white">
      {/* Decorative ambient background blur lights */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-500/10 dark:bg-indigo-500/5 rounded-full blur-3xl" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-sky-500/10 dark:bg-sky-500/5 rounded-full blur-3xl" />
      
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xl rounded-2xl p-8 relative z-10"
      >
        {children}
      </motion.div>
    </div>
  );
};

// 2. DASHBOARD LAYOUT (with elegant sidebar & header)
export const DashboardLayout: React.FC<{
  children: React.ReactNode;
  sidebarContent: React.ReactNode;
  onSearchClick?: () => void;
}> = ({ children, sidebarContent, onSearchClick }) => {
  const {
    theme,
    setTheme,
    language,
    setLanguage,
    sidebarOpen,
    setSidebarOpen,
    notifications,
    markNotificationAsRead,
    currentTenant,
    user
  } = useStore();

  const [notifHubOpen, setNotifHubOpen] = React.useState(false);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      {/* Dynamic Status Ticker Header */}
      <div className="bg-indigo-900 text-indigo-100 dark:bg-slate-900 dark:text-slate-300 text-[10px] px-4 py-1.5 flex justify-between items-center font-mono border-b border-indigo-950 dark:border-slate-800">
        <div className="flex items-center space-x-2">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>{getTranslation(language, 'statusOperational')}</span>
        </div>
        <div className="flex items-center space-x-4">
          <span>LATENCY: 14ms (us-east-1)</span>
          <span>TENANT_ID: {currentTenant?.id.toUpperCase()}</span>
        </div>
      </div>

      <div className="flex flex-1 relative">
        {/* Collapsible Enterprise Sidebar */}
        <aside
          className={`fixed inset-y-0 left-0 z-40 md:relative bg-white dark:bg-slate-900 border-r border-slate-200/80 dark:border-slate-800 transition-all duration-300 flex flex-col ${
            sidebarOpen ? 'w-64' : 'w-0 md:w-20 overflow-hidden'
          }`}
        >
          {sidebarContent}
        </aside>

        {/* Primary Content Panel */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Header */}
          <header className="h-16 border-b border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-30">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500"
              >
                {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
              
              {/* Trigger Search/CommandPalette */}
              <button
                onClick={onSearchClick}
                className="hidden md:flex items-center space-x-2 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200/70 dark:hover:bg-slate-700/70 transition-colors border border-transparent rounded-lg text-slate-400 text-xs w-64"
              >
                <Search className="h-4 w-4" />
                <span className="flex-1 text-left">{getTranslation(language, 'searchPlaceholder')}</span>
              </button>
            </div>

            {/* Topbar Utility Actions */}
            <div className="flex items-center space-x-3.5">
              {/* Language Switch */}
              <button
                onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
                className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center space-x-1"
                title="Toggle Language"
              >
                <Globe className="h-4 w-4" />
                <span className="text-[10px] font-bold uppercase">{language}</span>
              </button>

              {/* Theme Selector */}
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : theme === 'light' ? 'high-contrast' : 'dark')}
                className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"
                title="Cycle Theme"
              >
                <Sparkles className="h-4 w-4" />
              </button>

              {/* Notification Bell Hub */}
              <div className="relative">
                <button
                  onClick={() => setNotifHubOpen(!notifHubOpen)}
                  className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 relative"
                >
                  <Bell className="h-4 w-4" />
                  {notifications.some(n => !n.read) && (
                    <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-indigo-600" />
                  )}
                </button>

                {notifHubOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl rounded-xl py-2 z-50">
                    <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                        {getTranslation(language, 'notifications')}
                      </span>
                    </div>
                    <div className="divide-y divide-slate-100 dark:divide-slate-800 max-h-64 overflow-y-auto">
                      {notifications.map((n) => (
                        <div
                          key={n.id}
                          onClick={() => markNotificationAsRead(n.id)}
                          className={`p-3 text-xs hover:bg-slate-50 dark:hover:bg-slate-800/40 cursor-pointer transition-colors ${
                            !n.read ? 'bg-indigo-50/40 dark:bg-indigo-950/20' : ''
                          }`}
                        >
                          <div className="font-bold text-slate-800 dark:text-slate-200">{n.title}</div>
                          <div className="text-slate-500 mt-1">{n.message}</div>
                          <span className="text-[9px] text-slate-400 block mt-1">{n.timestamp}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* User profile avatar */}
              <div className="flex items-center space-x-2 border-l border-slate-200 dark:border-slate-800 pl-3.5">
                <Avatar alt={user?.name || 'Administrator'} size="sm" status="online" />
                <div className="hidden lg:block text-left">
                  <div className="text-xs font-bold text-slate-800 dark:text-slate-200 leading-tight">
                    {user?.name}
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono leading-tight">
                    {user?.role.toUpperCase()}
                  </div>
                </div>
              </div>
            </div>
          </header>

          {/* Page content wrapper */}
          <main className="flex-1 p-6 overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};

// 3. MODULE LAYOUT (Splitscreen with left operations rail and right action view)
export const ModuleLayout: React.FC<{
  leftRail: React.ReactNode;
  rightView: React.ReactNode;
}> = ({ leftRail, rightView }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-full items-start">
      <div className="lg:col-span-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 sticky top-20">
        {leftRail}
      </div>
      <div className="lg:col-span-3 space-y-6">
        {rightView}
      </div>
    </div>
  );
};

// 4. FULLSCREEN LAYOUT
export const FullscreenLayout: React.FC<{ children: React.ReactNode; onClose?: () => void }> = ({ children, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 bg-slate-950 text-slate-100 flex flex-col overflow-hidden">
      <div className="h-14 border-b border-slate-900 bg-slate-900/50 backdrop-blur-md px-6 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Compass className="h-5 w-5 text-indigo-400" />
          <span className="text-sm font-mono font-bold tracking-wider">IMMERSIVE MONITORING HUD</span>
        </div>
        {onClose && (
          <Button variant="ghost" size="sm" onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
      <div className="flex-1 overflow-auto p-6 bg-slate-950">
        {children}
      </div>
    </div>
  );
};

// 5. PUBLIC LAYOUT (Elegant Minimal Landing template)
export const PublicLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col">
      <nav className="h-16 px-6 border-b border-slate-200 dark:border-slate-800/60 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center space-x-2">
          <Sparkles className="h-6 w-6 text-indigo-600" />
          <span className="font-extrabold tracking-tight text-lg text-slate-900 dark:text-white">GALAXY <span className="text-indigo-600">ERP</span></span>
        </div>
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm">Explore</Button>
          <Button size="sm">Sign In</Button>
        </div>
      </nav>
      <div className="flex-1 max-w-7xl mx-auto w-full p-6 md:p-12">
        {children}
      </div>
    </div>
  );
};

// 6. SETTINGS LAYOUT
export const SettingsLayout: React.FC<{
  navItems: { id: string; label: string; active: boolean; onClick: () => void }[];
  children: React.ReactNode;
}> = ({ navItems, children }) => {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm flex flex-col md:flex-row overflow-hidden">
      <div className="w-full md:w-64 border-r border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20 p-4 space-y-1">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-3 mb-3">Enterprise Setup</h3>
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={item.onClick}
            className={`w-full text-left px-3 py-2 rounded-lg text-xs font-bold transition-all ${
              item.active
                ? 'bg-indigo-600 text-white'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/40'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>
      <div className="flex-1 p-6">
        {children}
      </div>
    </div>
  );
};

// 7. AI WORKSPACE LAYOUT (Integrated dual panel workspace)
export const AIWorkspaceLayout: React.FC<{
  leftCanvas: React.ReactNode;
  rightAIPanel: React.ReactNode;
}> = ({ leftCanvas, rightAIPanel }) => {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 h-full items-stretch">
      <div className="xl:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col">
        {leftCanvas}
      </div>
      <div className="xl:col-span-1 bg-slate-900 text-slate-100 rounded-2xl border border-slate-800 shadow-xl overflow-hidden flex flex-col min-h-[500px]">
        {rightAIPanel}
      </div>
    </div>
  );
};
