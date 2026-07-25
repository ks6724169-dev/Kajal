import React, { useState, useEffect } from 'react';
import { 
  MapPin, 
  Search, 
  Filter, 
  ArrowUpRight, 
  Users, 
  Building2, 
  ShieldCheck,
  ChevronRight,
  Globe,
  Loader2
} from 'lucide-react';
import { Tenant } from '../../../types';
import { CampusService, CampusRecord } from '../../../services/CampusService';

interface CampusOverviewPageProps {
  tenant: Tenant;
  onNavigate: (path: string) => void;
}

export const CampusOverviewPage: React.FC<CampusOverviewPageProps> = ({ tenant, onNavigate }) => {
  const [loading, setLoading] = useState(true);
  const [campuses, setCampuses] = useState<CampusRecord[]>([]);

  const effectiveTenantId = tenant?.id || 'apex_k12';

  useEffect(() => {
    const loadCampuses = async () => {
      setLoading(true);
      try {
        const data = await CampusService.getCampuses(effectiveTenantId);
        setCampuses(data);
      } catch (err) {
        console.error('Campus Load Error:', err);
      } finally {
        setLoading(false);
      }
    };
    loadCampuses();
  }, [effectiveTenantId]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-slate-400">
         <div className="w-16 h-16 border-4 border-indigo-600/10 border-t-indigo-600 rounded-full animate-spin mb-8" />
         <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Mapping Organizational Nodes...</p>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-500 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-200 pb-6">
        <div>
           <div className="flex items-center gap-2 text-[10px] font-bold text-indigo-600 uppercase tracking-widest mb-2">
             <div className="w-1.5 h-1.5 rounded-full bg-indigo-600" />
             Work Area: 03
           </div>
           <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Campus Overview</h1>
           <p className="text-slate-500 text-sm mt-1 max-w-xl">Unified monitoring of institutional nodes across regions.</p>
        </div>

        <div className="flex items-center gap-3">
           <div className="relative group">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search campus..."
                className="pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-900 focus:bg-white focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 outline-none transition-all w-64 shadow-sm"
              />
           </div>
           <button className="p-2.5 bg-white border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 transition-all shadow-sm">
              <Filter className="w-4 h-4" />
           </button>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {campuses.length > 0 ? campuses.map((campus) => (
          <div 
            key={campus.id}
            className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 flex flex-col sm:flex-row gap-8 hover:shadow-md hover:border-indigo-200 transition-all group"
          >
             <div className="w-24 h-24 rounded-lg bg-slate-50 flex items-center justify-center shrink-0 border border-slate-100 shadow-sm overflow-hidden group-hover:scale-105 transition-transform">
                <div className="text-slate-200">
                   <Building2 className="w-10 h-10" />
                </div>
             </div>

             <div className="flex-1 space-y-4">
                <div className="flex items-start justify-between">
                   <div>
                      <h3 className="text-lg font-bold text-slate-900 tracking-tight group-hover:text-indigo-600 transition-colors">{campus.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                         <span className="px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded text-[9px] font-bold uppercase tracking-widest border border-indigo-100">{campus.code}</span>
                         <span className="px-2 py-0.5 bg-slate-50 text-slate-500 rounded text-[9px] font-bold uppercase tracking-widest border border-slate-100">{campus.type}</span>
                      </div>
                   </div>
                   <div className="flex items-center gap-1.5 px-2 py-1 bg-emerald-50 text-emerald-600 rounded text-[9px] font-bold uppercase tracking-widest border border-emerald-100">
                      <div className="w-1 h-1 rounded-full bg-emerald-500" />
                      {campus.status}
                   </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2">
                   <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 border border-slate-100">
                         <MapPin className="w-4 h-4" />
                      </div>
                      <div>
                         <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Location</p>
                         <p className="text-[11px] font-bold text-slate-900">{campus.city}, {campus.state}</p>
                      </div>
                   </div>
                   <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 border border-slate-100">
                         <Users className="w-4 h-4" />
                      </div>
                      <div>
                         <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Students</p>
                         <p className="text-[11px] font-bold text-slate-900">{campus.student_count?.toLocaleString() || '0'}</p>
                      </div>
                   </div>
                </div>

                <div className="pt-4 mt-2 border-t border-slate-100 flex items-center justify-between">
                   <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-slate-50 flex items-center justify-center border border-slate-100">
                         <ShieldCheck className="w-3 h-3 text-indigo-500" />
                      </div>
                      <p className="text-[10px] font-semibold text-slate-500">Lead: {campus.principal_name || 'Administrator'}</p>
                   </div>
                   <button 
                     onClick={() => onNavigate(`/owner/dashboard`)}
                     className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 text-slate-500 hover:bg-indigo-600 hover:text-white rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all"
                   >
                      Manage <ArrowUpRight className="w-3 h-3" />
                   </button>
                </div>
             </div>
          </div>
        )) : (
          <div className="col-span-full py-20 bg-white rounded-xl border border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-300">
             <Globe className="w-10 h-10 mb-4 opacity-50" />
             <p className="text-xs font-bold uppercase tracking-widest">No institutional nodes registered</p>
          </div>
        )}
      </div>

      {/* Strategy Panel (Microsoft Fluent Style) */}
      <div className="bg-white rounded-xl p-8 border border-slate-200 shadow-sm relative overflow-hidden group">
         <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div>
               <h3 className="text-xl font-bold text-slate-900 tracking-tight mb-2">Regional Scalability & Strategy</h3>
               <p className="text-slate-500 text-sm max-w-2xl leading-relaxed">
                  Nodes represent functional operational units. Ensure geographic distribution aligns with institutional growth targets and operational compliance.
               </p>
            </div>
            <button className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-lg text-[10px] font-bold uppercase tracking-widest shadow-md hover:bg-black transition-all">
               Node Distribution Report <ArrowUpRight className="w-4 h-4 ml-1" />
            </button>
         </div>
      </div>
    </div>
  );
};
