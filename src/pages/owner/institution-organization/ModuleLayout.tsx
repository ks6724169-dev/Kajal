import React, { useState } from 'react';
import { 
  Building, 
  Home, 
  Grid, 
  ChevronRight, 
  X, 
  Search,
  LayoutGrid,
  Users,
  MapPin,
  Layers,
  GraduationCap,
  Shield,
  FileText,
  Settings,
  History,
  Fingerprint,
  BarChart3,
  ExternalLink
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface WorkArea {
  id: string;
  name: string;
  icon: React.ElementType;
  description: string;
  path: string;
}

const WORK_AREAS: WorkArea[] = [
  { id: 'institution-profile', name: 'Institution Identity', icon: Building, description: 'Profile, registration and branding', path: 'institution-profile' },
  { id: 'organization-structure', name: 'Organization Structure', icon: LayoutGrid, description: 'Manage organizational hierarchy', path: 'organization-structure' },
  { id: 'campus-overview', name: 'Campus Overview', icon: MapPin, description: 'Organization-wide campus structure', path: 'campus-overview' },
  { id: 'departments', name: 'Departments', icon: Layers, description: 'Manage organizational units', path: 'departments' },
  { id: 'academic-organization', name: 'Academic Organization', icon: GraduationCap, description: 'Manage academic timeline', path: 'academic-organization' },
  { id: 'administration-governance', name: 'Administration & Governance', icon: Shield, description: 'Manage leadership and policy', path: 'administration-governance' },
  { id: 'contacts-locations', name: 'Contacts & Locations', icon: MapPin, description: 'Official addresses and contacts', path: 'contacts-locations' },
  { id: 'documents-compliance', name: 'Documents & Compliance', icon: FileText, description: 'Institutional documents and legal', path: 'documents-compliance' },
  { id: 'organization-settings', name: 'Organization Settings', icon: Settings, description: 'Master configuration and defaults', path: 'organization-settings' },
  { id: 'audit-history', name: 'Audit & History', icon: History, description: 'System-wide activity logs', path: 'audit-history' },
  { id: 'organization-identity', name: 'Organization Identity', icon: Fingerprint, description: 'Technical IDs and ownership', path: 'organization-identity' },
  { id: 'organization-reports', name: 'Organization Reports', icon: BarChart3, description: 'Institution-level analytical reports', path: 'organization-reports' }
];

interface ModuleLayoutProps {
  children: React.ReactNode;
  activeTab: string;
  onNavigate: (path: string) => void;
  pageTitle: string;
  breadcrumbs: { label: string; path?: string }[];
}

export const ModuleLayout: React.FC<ModuleLayoutProps> = ({ 
  children, 
  activeTab, 
  onNavigate,
  pageTitle,
  breadcrumbs
}) => {
  const [showWorkAreas, setShowWorkAreas] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 selection:bg-indigo-600 selection:text-white flex flex-col font-sans">
      {/* 🚀 GALAXY ERP — MODULE HEADER (3 PRIMARY ELEMENTS) */}
      <header className="sticky top-0 z-50 bg-white border-b border-slate-200 h-16 px-6 flex items-center justify-between shrink-0 shadow-sm">
        {/* Left: Module Identity */}
        <div 
          className="flex items-center gap-3 cursor-pointer hover:bg-slate-50 px-2 py-1.5 rounded-lg transition-colors"
          onClick={() => onNavigate('/owner/institution-organization/overview')}
        >
          <div className="w-9 h-9 rounded-md bg-slate-900 text-white flex items-center justify-center shadow-sm">
            <Building className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-slate-900 tracking-tight">Institution & Organization</h1>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Master Control</span>
            </div>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setShowWorkAreas(!showWorkAreas)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all border ${
              showWorkAreas ? 'bg-indigo-600 text-white border-indigo-600 shadow-md' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <Grid className="w-4 h-4" /> Work Areas
          </button>
          
          <div className="h-6 w-px bg-slate-200" />
          
          <button 
            onClick={() => onNavigate('/owner/dashboard')}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg text-xs font-semibold hover:bg-slate-50 transition-all"
          >
            <Home className="w-4 h-4" /> Home
          </button>
        </div>
      </header>

      {/* 🧭 WORK AREAS PANEL (COMMAND CENTER) */}
      <AnimatePresence>
        {showWorkAreas && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowWorkAreas(false)}
              className="fixed inset-0 bg-slate-900/20 backdrop-blur-[2px] z-[60]"
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.2 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white z-[70] shadow-2xl flex flex-col border-l border-slate-200"
            >
              <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Module Navigator</h2>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">Switch Context</p>
                </div>
                <button 
                  onClick={() => setShowWorkAreas(false)}
                  className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                <div className="space-y-1">
                  {WORK_AREAS.map((area) => (
                    <button
                      key={area.id}
                      onClick={() => {
                        onNavigate(`/owner/institution-organization/${area.path}`);
                        setShowWorkAreas(false);
                      }}
                      className={`w-full flex items-center gap-4 p-3 rounded-xl text-left transition-all group border ${
                        activeTab === area.id 
                          ? 'bg-indigo-50 border-indigo-200 ring-1 ring-indigo-200' 
                          : 'bg-white border-transparent hover:bg-slate-50 hover:border-slate-100'
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 transition-all ${
                        activeTab === area.id ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500 group-hover:bg-white group-hover:text-indigo-600 border border-slate-200'
                      }`}>
                        <area.icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <p className={`text-sm font-bold ${activeTab === area.id ? 'text-indigo-900' : 'text-slate-900'}`}>{area.name}</p>
                        <p className="text-[10px] text-slate-500 mt-0.5 leading-snug">{area.description}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="p-6 border-t border-slate-100 bg-white">
                 <button className="w-full py-3 bg-slate-50 border border-slate-200 text-slate-600 rounded-xl text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-slate-100 transition-all">
                    System Documentation <ExternalLink className="w-3 h-3" />
                 </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto relative custom-scrollbar">
        <div className="max-w-[1400px] mx-auto p-6 sm:p-10">
          {/* Internal Breadcrumbs */}
          <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-10 border-b border-slate-200 pb-4">
            {breadcrumbs.map((crumb, idx) => (
              <React.Fragment key={idx}>
                {crumb.path ? (
                  <button onClick={() => onNavigate(crumb.path!)} className="hover:text-indigo-600 transition-colors">{crumb.label}</button>
                ) : (
                  <span className="text-slate-700">{crumb.label}</span>
                )}
                {idx < breadcrumbs.length - 1 && <ChevronRight className="w-3 h-3 text-slate-300" />}
              </React.Fragment>
            ))}
          </div>

          {children}
        </div>
      </main>
    </div>
  );
};
