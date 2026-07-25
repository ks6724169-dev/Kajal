import React from 'react';
import { 
  Building, 
  LayoutGrid, 
  MapPin, 
  Layers, 
  GraduationCap, 
  Shield, 
  FileText, 
  Settings, 
  History, 
  Fingerprint, 
  BarChart3,
  ChevronRight,
  ArrowUpRight,
  Activity,
  Globe
} from 'lucide-react';
import { motion } from 'motion/react';
import { Tenant } from '../../../types';

interface OverviewPageProps {
  tenant: Tenant;
  onNavigate: (path: string) => void;
}

const WORK_AREAS = [
  { 
    id: 'institution-profile', 
    name: 'Institution Identity', 
    icon: Building, 
    description: 'Institution profile, registration and branding identity',
    color: 'bg-blue-600',
    path: 'institution-profile'
  },
  { 
    id: 'organization-structure', 
    name: 'Organization Structure', 
    icon: LayoutGrid, 
    description: 'Manage organizational hierarchy and reporting lines',
    color: 'bg-indigo-600',
    path: 'organization-structure'
  },
  { 
    id: 'campus-overview', 
    name: 'Campus Overview', 
    icon: MapPin, 
    description: 'Organization-wide campus structure and locations',
    color: 'bg-emerald-600',
    path: 'campus-overview'
  },
  { 
    id: 'departments', 
    name: 'Departments', 
    icon: Layers, 
    description: 'Manage organizational units and functional blocks',
    color: 'bg-violet-600',
    path: 'departments'
  },
  { 
    id: 'academic-organization', 
    name: 'Academic Organization', 
    icon: GraduationCap, 
    description: 'Manage academic timeline, years, and sessions',
    color: 'bg-amber-600',
    path: 'academic-organization'
  },
  { 
    id: 'administration-governance', 
    name: 'Administration & Governance', 
    icon: Shield, 
    description: 'Manage leadership, policy and governance structure',
    color: 'bg-rose-600',
    path: 'administration-governance'
  },
  { 
    id: 'contacts-locations', 
    name: 'Contacts & Locations', 
    icon: Globe, 
    description: 'Manage official contacts and regional offices',
    color: 'bg-sky-600',
    path: 'contacts-locations'
  },
  { 
    id: 'documents-compliance', 
    name: 'Documents & Compliance', 
    icon: FileText, 
    description: 'Institutional documents, legal and compliance',
    color: 'bg-teal-600',
    path: 'documents-compliance'
  },
  { 
    id: 'organization-settings', 
    name: 'Organization Settings', 
    icon: Settings, 
    description: 'Master organization configuration and defaults',
    color: 'bg-slate-600',
    path: 'organization-settings'
  },
  { 
    id: 'audit-history', 
    name: 'Audit & History', 
    icon: History, 
    description: 'System-wide activity logs and security events',
    color: 'bg-orange-600',
    path: 'audit-history'
  },
  { 
    id: 'organization-identity', 
    name: 'Organization Identity', 
    icon: Fingerprint, 
    description: 'Technical organization IDs and data ownership',
    color: 'bg-gray-900',
    path: 'organization-identity'
  },
  { 
    id: 'organization-reports', 
    name: 'Organization Reports', 
    icon: BarChart3, 
    description: 'Institution-level analytics and summary reports',
    color: 'bg-cyan-600',
    path: 'organization-reports'
  }
];

export const OverviewPage: React.FC<OverviewPageProps> = ({ tenant, onNavigate }) => {
  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-500 pb-20">
      {/* 🏛️ INSTITUTIONAL CONTEXT HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
           <div className="flex items-center gap-2 text-[10px] font-bold text-indigo-600 uppercase tracking-widest mb-2">
             <div className="w-1.5 h-1.5 rounded-full bg-indigo-600" />
             Institutional Core
           </div>
           <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Organization Overview</h1>
           <p className="text-slate-500 text-sm mt-1 max-w-xl">Unified control center for managing institutional nodes, governance structure, and compliance status.</p>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => onNavigate('institution-profile')}
            className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-lg text-xs font-semibold shadow-sm hover:bg-indigo-700 hover:shadow-md transition-all active:scale-[0.98]"
          >
            <Settings className="w-4 h-4" /> Edit Profile
          </button>
        </div>
      </div>

      {/* 📊 KEY PERFORMANCE INDICATORS (FLUENT STYLE) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'System Health', value: 'Operational', icon: Activity, color: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-100', desc: 'Core synchronized' },
          { label: 'Security Level', value: '92%', icon: Shield, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100', desc: 'Policy monitored' },
          { label: 'Registered ID', value: tenant?.id || 'APEX_K12', icon: Globe, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100', desc: 'Org identifier' },
          { label: 'Data Integrity', value: '98.4%', icon: Activity, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100', desc: 'Health status' },
        ].map((stat, i) => (
          <div key={i} className={`bg-white border ${stat.border} rounded-xl p-5 shadow-sm hover:shadow-md transition-all group`}>
            <div className="flex items-center justify-between mb-4">
               <div className={`w-10 h-10 ${stat.bg} ${stat.color} rounded-lg flex items-center justify-center border ${stat.border} group-hover:scale-105 transition-transform`}>
                  <stat.icon className="w-5 h-5" />
               </div>
               <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Live</div>
            </div>
            <p className="text-xl font-bold text-slate-900 truncate">{stat.value}</p>
            <p className="text-xs font-semibold text-slate-500 mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 🏢 INSTITUTION SUMMARY (GITHUB STYLE) */}
        <div className="lg:col-span-2 space-y-6">
           <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                 <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Identity Details</h3>
                 <button className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest hover:underline">View History</button>
              </div>
              <div className="p-8">
                 <div className="flex flex-col md:flex-row gap-10">
                    <div className="w-20 h-20 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center shrink-0">
                       <Building className="w-8 h-8 text-slate-300" />
                    </div>
                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-12">
                       <div>
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Entity Name</label>
                          <p className="text-sm font-bold text-slate-900 leading-tight">Galaxy International Education Group</p>
                       </div>
                       <div>
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Status</label>
                          <div className="flex items-center gap-2">
                             <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                             <p className="text-sm font-bold text-slate-900">Active (Tier 1)</p>
                          </div>
                       </div>
                       <div>
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Established</label>
                          <p className="text-sm font-bold text-slate-900">2010</p>
                       </div>
                       <div>
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Primary Type</label>
                          <p className="text-sm font-bold text-slate-900">K-12 Education</p>
                       </div>
                    </div>
                 </div>
              </div>
           </div>

           {/* 🧭 NAVIGATION HUB (MATERIAL STYLE) */}
           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {WORK_AREAS.slice(0, 6).map((area) => (
                <button
                  key={area.id}
                  onClick={() => onNavigate(area.path)}
                  className="flex items-start gap-4 p-4 bg-white border border-slate-200 rounded-xl hover:border-indigo-300 hover:bg-slate-50 transition-all text-left group"
                >
                   <div className="w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-white group-hover:text-indigo-600 border border-slate-200 shadow-sm shrink-0 transition-colors">
                      <area.icon className="w-5 h-5" />
                   </div>
                   <div>
                      <p className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{area.name}</p>
                      <p className="text-[10px] text-slate-500 mt-0.5 leading-snug">{area.description}</p>
                   </div>
                </button>
              ))}
           </div>
        </div>

        {/* 📊 SIDEBAR WIDGETS (MICROSOFT STYLE) */}
        <div className="space-y-6">
           <div className="bg-slate-900 rounded-xl p-6 text-white shadow-lg relative overflow-hidden">
              <div className="relative z-10">
                 <div className="flex items-center gap-3 mb-6">
                    <Shield className="w-5 h-5 text-indigo-400" />
                    <h4 className="text-xs font-bold uppercase tracking-widest">Compliance Health</h4>
                 </div>
                 <div className="space-y-4">
                    <div className="flex items-center justify-between text-xs font-bold">
                       <span className="text-slate-400">Master Level</span>
                       <span className="text-indigo-400">Certified</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                       <div className="h-full w-[92%] bg-indigo-500" />
                    </div>
                    <p className="text-[10px] font-medium text-slate-500 leading-relaxed italic">Last master audit completed on Nov 12, 2024</p>
                 </div>
              </div>
           </div>

           <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
              <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6">Recent System Activity</h4>
              <div className="space-y-6 relative before:absolute before:left-2 before:top-2 before:bottom-2 before:w-px before:bg-slate-100">
                 {[
                   { event: 'Org node added', time: '2h ago', detail: 'North Tech Campus' },
                   { event: 'Profile updated', time: '5h ago', detail: 'Statutory info' },
                   { event: 'Session initialized', time: '1d ago', detail: 'Academic 2025-26' },
                 ].map((log, i) => (
                   <div key={i} className="pl-6 relative">
                      <div className="absolute left-1 top-1.5 w-2 h-2 rounded-full bg-slate-300 ring-4 ring-white" />
                      <p className="text-[11px] font-bold text-slate-900 leading-tight">{log.event}</p>
                      <p className="text-[10px] text-slate-500 mt-1">{log.detail} • {log.time}</p>
                   </div>
                 ))}
              </div>
              <button className="w-full mt-8 py-2 text-[9px] font-bold text-indigo-600 uppercase tracking-widest border border-slate-100 rounded-lg hover:bg-slate-50 transition-colors">
                 Full Audit Log
              </button>
           </div>
        </div>
      </div>

      {/* 🚀 QUICK ACCESS GRID (ADDITIONAL AREAS) */}
      <div className="pt-10 border-t border-slate-200">
         <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest mb-6">Technical & Management Areas</h3>
         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {WORK_AREAS.slice(6).map((area) => (
              <button
                key={area.id}
                onClick={() => onNavigate(area.path)}
                className="flex flex-col items-center justify-center p-6 bg-white border border-slate-100 rounded-xl hover:border-indigo-300 hover:shadow-md transition-all group text-center"
              >
                 <div className={`w-12 h-12 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all mb-4 border border-slate-100`}>
                    <area.icon className="w-6 h-6" />
                 </div>
                 <p className="text-xs font-bold text-slate-900 group-hover:text-indigo-600 transition-colors leading-tight">{area.name}</p>
              </button>
            ))}
         </div>
      </div>
    </div>
  );
};
