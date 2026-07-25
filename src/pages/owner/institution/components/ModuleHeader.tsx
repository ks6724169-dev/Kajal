import React from 'react';
import { 
  Building, 
  Home, 
  Search, 
  Plus, 
  MoreVertical, 
  ChevronRight,
  LayoutDashboard,
  MapPin,
  GitBranch,
  Calendar,
  Award,
  Settings,
  Command,
  Briefcase
} from 'lucide-react';
import { motion } from 'motion/react';

interface ModuleHeaderProps {
  activeTab: string;
  onNavigate: (path: string) => void;
  breadcrumbs: { label: string; path?: string }[];
  onTabChange: (tabId: string) => void;
}

export const ModuleHeader: React.FC<ModuleHeaderProps> = ({ 
  activeTab, 
  onNavigate, 
  breadcrumbs,
  onTabChange
}) => {
  const tabs = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'campuses', label: 'Campuses', icon: MapPin },
    { id: 'structure', label: 'Structure', icon: GitBranch },
    { id: 'departments', label: 'Departments', icon: Briefcase },
    { id: 'sessions', label: 'Sessions', icon: Calendar },
    { id: 'affiliations', label: 'Affiliations', icon: Award },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="bg-white border-b border-slate-200 sticky top-0 z-40">
      {/* Upper Header: Context & Global Search */}
      <div className="h-16 flex items-center justify-between px-6 border-b border-slate-100">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-100 ring-4 ring-indigo-50">
            <Building className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-sm font-black text-slate-900 tracking-tight leading-none">Institution & Organization</h1>
            <div className="flex items-center gap-1.5 mt-1.5 overflow-hidden">
              {breadcrumbs.map((bc, idx) => (
                <React.Fragment key={idx}>
                  {idx > 0 && <ChevronRight className="w-3 h-3 text-slate-300 shrink-0" />}
                  <button 
                    onClick={() => bc.path && onNavigate(bc.path)}
                    className={`text-[10px] font-bold uppercase tracking-widest transition-colors whitespace-nowrap ${
                      bc.path ? 'text-slate-400 hover:text-indigo-600' : 'text-slate-900'
                    }`}
                  >
                    {bc.label}
                  </button>
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Quick Search */}
          <div className="hidden md:flex items-center gap-2 px-3 py-2 bg-slate-100 border border-slate-200 rounded-xl text-slate-500 cursor-pointer hover:bg-slate-200 transition-all group">
            <Search className="w-3.5 h-3.5 group-hover:text-indigo-600 transition-colors" />
            <span className="text-[10px] font-bold uppercase tracking-widest pr-4">Search Workspace</span>
            <div className="flex items-center gap-1 px-1.5 py-0.5 bg-white border border-slate-200 rounded text-[9px] font-bold text-slate-400">
              <Command className="w-2.5 h-2.5" /> K
            </div>
          </div>

          <button className="p-2.5 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all">
            <MoreVertical className="w-5 h-5" />
          </button>
          
          <button 
            onClick={() => onNavigate('/owner/dashboard')}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-slate-50 hover:text-indigo-600 hover:border-indigo-200 transition-all shadow-2xs"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Dashboard</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="px-6 flex items-center justify-between overflow-x-auto scrollbar-hide">
        <nav className="flex items-center gap-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`relative py-4 text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap flex items-center gap-2 ${
                activeTab === tab.id ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <tab.icon className={`w-3.5 h-3.5 ${activeTab === tab.id ? 'text-indigo-600' : 'text-slate-300'}`} />
              {tab.label}
              {activeTab === tab.id && (
                <motion.div 
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 rounded-full"
                />
              )}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-2 py-2">
           <button className="flex items-center gap-2 px-4 py-1.5 bg-indigo-600 text-white rounded-lg text-[10px] font-black uppercase tracking-widest shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all">
             <Plus className="w-3.5 h-3.5" /> Quick Create
           </button>
        </div>
      </div>
    </div>
  );
};
