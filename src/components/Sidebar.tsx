import React from 'react';
import { 
  LayoutDashboard, 
  Sparkles, 
  Users, 
  CreditCard, 
  QrCode, 
  Navigation, 
  FileSpreadsheet, 
  Briefcase, 
  BookOpen, 
  Video, 
  Smartphone, 
  Settings 
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, onSelectTab }) => {
  const menuItems = [
    { id: 'dashboard', label: 'BI Analytics Dashboard', icon: LayoutDashboard },
    { id: 'ai_hub', label: 'AI Campus Suite (Gemini)', icon: Sparkles, badge: 'AI' },
    { id: 'students', label: 'Students & Admissions', icon: Users },
    { id: 'fees', label: 'Fee & UPI Collection', icon: CreditCard },
    { id: 'attendance', label: 'Face ID Attendance', icon: QrCode },
    { id: 'transport', label: 'Live GPS Bus Tracking', icon: Navigation },
    { id: 'exams', label: 'Exams & OMR Scanner', icon: FileSpreadsheet },
    { id: 'hrms', label: 'HRMS & Payroll', icon: Briefcase },
    { id: 'library', label: 'Library & Inventory', icon: BookOpen },
    { id: 'cctv', label: 'CCTV Security Feeds', icon: Video },
    { id: 'mobile_apps', label: 'Mobile App Previews', icon: Smartphone },
    { id: 'settings', label: 'SaaS Settings & Audit', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col h-[calc(100vh-61px)] sticky top-[61px] overflow-y-auto">
      <div className="p-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
        Enterprise Modules
      </div>
      <nav className="space-y-1 px-2.5 pb-6">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition group ${
                isActive 
                  ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-600/30' 
                  : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-indigo-400'}`} />
                <span className="truncate">{item.label}</span>
              </div>
              {item.badge && (
                <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                  isActive ? 'bg-white/20 text-white' : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                }`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Cloud SaaS Status Card */}
      <div className="mt-auto p-3 m-3 bg-slate-800/60 border border-slate-700/60 rounded-2xl">
        <div className="flex items-center justify-between text-[11px] text-slate-300 mb-1">
          <span className="font-semibold flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Cloud Cluster</span>
          </span>
          <span className="font-mono text-emerald-400">99.99%</span>
        </div>
        <div className="text-[10px] text-slate-400">Multi-tenant isolation active. Real-time sync enabled.</div>
      </div>
    </aside>
  );
};
