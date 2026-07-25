import React from 'react';
import { 
  BarChart3, 
  FileText, 
  Download, 
  Printer, 
  Filter, 
  Search, 
  TrendingUp, 
  PieChart, 
  Activity, 
  Calendar,
  ArrowUpRight,
  ChevronRight,
  ExternalLink,
  ShieldCheck,
  Building
} from 'lucide-react';
import { Tenant } from '../../../types';

interface OrganizationReportsPageProps {
  tenant: Tenant;
  onNavigate: (path: string) => void;
}

const REPORT_TYPES = [
  { id: 'summary', name: 'Institution Summary', description: 'Comprehensive profile and identity summary', icon: Building },
  { id: 'structure', name: 'Organization Structure', description: 'Institutional hierarchy and units report', icon: FileText },
  { id: 'campuses', name: 'Campus Summary', description: 'Regional node distribution and leadership', icon: PieChart },
  { id: 'departments', name: 'Department Overview', description: 'Functional units and resource distribution', icon: BarChart3 },
  { id: 'compliance', name: 'Compliance Summary', description: 'Statutory certificates and expiry status', icon: ShieldCheck },
  { id: 'completeness', name: 'Data Completeness', description: 'Institutional data health and sync status', icon: Activity }
];

export const OrganizationReportsPage: React.FC<OrganizationReportsPageProps> = ({ tenant, onNavigate }) => {
  return (
    <div className="max-w-[1400px] mx-auto animate-in fade-in slide-in-from-bottom-2 duration-500 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-200 pb-6 mb-10">
        <div>
           <div className="flex items-center gap-2 text-[10px] font-bold text-indigo-600 uppercase tracking-widest mb-2">
             <div className="w-1.5 h-1.5 rounded-full bg-indigo-600" />
             Work Area: 12
           </div>
           <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Organization Reports</h1>
           <p className="text-slate-500 text-sm mt-1 max-w-xl">Institution-level analytical reports and data completeness indicators.</p>
        </div>

        <div className="flex items-center gap-3">
           <div className="relative group w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search reports..."
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-[10px] font-bold uppercase tracking-widest outline-none focus:ring-4 focus:ring-indigo-50 focus:bg-white transition-all shadow-sm"
              />
           </div>
           <button className="p-2 bg-white border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 transition-all shadow-sm">
              <Filter className="w-4 h-4" />
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
        {/* Reports Grid */}
        <div className="xl:col-span-8">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {REPORT_TYPES.map((report) => (
                <div key={report.id} className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 flex flex-col group hover:shadow-md hover:border-indigo-200 transition-all relative overflow-hidden">
                   <div className="w-12 h-12 rounded-lg bg-slate-50 text-slate-400 flex items-center justify-center mb-6 group-hover:bg-indigo-600 group-hover:text-white transition-all border border-slate-100 shadow-sm">
                      <report.icon className="w-6 h-6" />
                   </div>
                                      
                   <div className="flex-1">
                      <h3 className="text-sm font-bold text-slate-900 tracking-tight mb-1.5 group-hover:text-indigo-600 transition-colors">{report.name}</h3>
                      <p className="text-[11px] font-medium text-slate-500 leading-relaxed">{report.description}</p>
                   </div>

                   <div className="mt-6 flex items-center justify-between pt-4 border-t border-slate-100">
                      <div className="flex items-center gap-2">
                         <button className="p-1.5 bg-slate-50 hover:bg-white hover:shadow-sm text-slate-400 hover:text-indigo-600 rounded border border-transparent hover:border-slate-200 transition-all">
                            <Download className="w-3.5 h-3.5" />
                         </button>
                         <button className="p-1.5 bg-slate-50 hover:bg-white hover:shadow-sm text-slate-400 hover:text-indigo-600 rounded border border-transparent hover:border-slate-200 transition-all">
                            <Printer className="w-3.5 h-3.5" />
                         </button>
                      </div>
                      <button className="flex items-center gap-1.5 text-[9px] font-bold text-slate-400 uppercase tracking-widest hover:text-indigo-600 transition-colors group-hover:translate-x-1 transition-transform">
                         Generate <ChevronRight className="w-3 h-3" />
                      </button>
                   </div>
                </div>
              ))}
           </div>
        </div>

        {/* Analytics Summary */}
        <div className="xl:col-span-4 space-y-6 sticky top-32">
           <div className="bg-slate-900 rounded-xl p-8 text-white shadow-xl relative overflow-hidden flex flex-col h-full border border-slate-800">
              <div className="relative z-10">
                 <div className="flex items-center gap-3 mb-8">
                    <TrendingUp className="w-5 h-5 text-indigo-400" />
                    <h3 className="text-sm font-bold uppercase tracking-widest">Institutional Analytics</h3>
                 </div>
                                  
                 <div className="space-y-4">
                    <div className="p-5 bg-white/5 rounded-lg border border-white/5 flex items-center justify-between group cursor-pointer hover:bg-white/10 transition-all">
                       <div>
                          <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest leading-none mb-1.5">Org Nodes</p>
                          <p className="text-2xl font-bold text-white">24</p>
                       </div>
                       <ArrowUpRight className="w-5 h-5 text-slate-700 group-hover:text-indigo-400 transition-colors" />
                    </div>
                    <div className="p-5 bg-white/5 rounded-lg border border-white/5 flex items-center justify-between group cursor-pointer hover:bg-white/10 transition-all">
                       <div>
                          <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest leading-none mb-1.5">Integrity</p>
                          <p className="text-2xl font-bold text-emerald-400">98.2%</p>
                       </div>
                       <div className="w-10 h-10 rounded-full border-2 border-white/5 border-t-emerald-500 flex items-center justify-center text-[10px] font-bold">98%</div>
                    </div>
                 </div>

                 <div className="mt-8 pt-6 border-t border-white/5 space-y-4">
                    <div className="flex items-center justify-between">
                       <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Active Campuses</span>
                       <span className="text-xs font-bold">04</span>
                    </div>
                    <div className="flex items-center justify-between">
                       <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Departments</span>
                       <span className="text-xs font-bold">12</span>
                    </div>
                    <div className="flex items-center justify-between">
                       <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Leadership Profile</span>
                       <span className="text-xs font-bold text-emerald-400">Verified</span>
                    </div>
                 </div>
              </div>

              <div className="mt-10">
                 <button className="w-full py-4 bg-indigo-600 text-white rounded-lg text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-2.5 shadow-md hover:bg-indigo-500 transition-all active:scale-[0.98]">
                    Master Executive Report <ExternalLink className="w-3.5 h-3.5" />
                 </button>
              </div>

              <div className="absolute bottom-0 right-0 p-10 opacity-[0.03] pointer-events-none">
                 <BarChart3 className="w-48 h-48" />
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};
