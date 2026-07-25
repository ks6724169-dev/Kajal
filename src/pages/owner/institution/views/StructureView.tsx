import React, { useState, useEffect } from 'react';
import { GitBranch, Building, MapPin, Layers, Info, ChevronDown, ChevronRight, Plus, ExternalLink } from 'lucide-react';
import { Tenant } from '../../../../types';
import { CampusService, CampusRecord } from '../../../../services/CampusService';

interface StructureViewProps {
  tenant: Tenant;
  onNavigate: (path: string) => void;
}

export const StructureView: React.FC<StructureViewProps> = ({ tenant, onNavigate }) => {
  const [campuses, setCampuses] = useState<CampusRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const tenantId = tenant?.id || '00000000-0000-0000-0000-000000000001';

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await CampusService.getCampuses(tenantId);
        setCampuses(data);
      } catch (err) {
        console.error('Structure Load Error:', err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [tenantId]);

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Institutional Hierarchy</h2>
          <p className="text-sm text-slate-500 font-medium mt-1">Global administrative and operational reporting layers.</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-2xs hover:bg-slate-50 transition-all">
          <GitBranch className="w-4 h-4" /> Recalculate Tree
        </button>
      </div>

      <div className="bg-white rounded-[40px] border border-slate-200 shadow-sm p-16 flex flex-col items-center relative overflow-hidden">
         {/* Grid Background */}
         <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#4f46e5 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
         
         {/* Root: Institution */}
         <div className="relative flex flex-col items-center z-10">
            <div className="group relative">
               <div className="px-10 py-6 bg-indigo-600 text-white rounded-3xl shadow-2xl shadow-indigo-200 flex flex-col items-center gap-2 border-4 border-white ring-8 ring-indigo-50 relative z-10 transition-transform duration-500 hover:scale-105">
                  <Building className="w-8 h-8" />
                  <span className="text-lg font-black uppercase tracking-tight">{tenant?.name || 'Main Institution'}</span>
                  <span className="text-[10px] font-black text-indigo-200 uppercase opacity-80 tracking-[0.2em]">Root Authority</span>
               </div>
               
               {/* Context Menu for Root */}
               <div className="absolute top-1/2 left-full translate-x-8 -translate-y-1/2 hidden group-hover:flex items-center gap-2 animate-in slide-in-from-left-4 duration-300">
                  <button className="p-3 bg-white border border-slate-200 rounded-2xl shadow-xl hover:text-indigo-600 transition-colors">
                    <Plus className="w-4 h-4" />
                  </button>
                  <button className="p-3 bg-white border border-slate-200 rounded-2xl shadow-xl hover:text-indigo-600 transition-colors">
                    <ExternalLink className="w-4 h-4" />
                  </button>
               </div>
            </div>
            
            <div className="h-20 w-0.5 bg-indigo-100 relative">
               <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-indigo-200" />
            </div>

            {/* Level 2: Campuses */}
            <div className="flex gap-16 relative">
               <div className="absolute top-0 left-0 right-0 h-0.5 bg-indigo-100/50 -z-0" />
               
               {loading ? (
                 <div className="pt-10 flex flex-col items-center gap-4 text-slate-300">
                    <div className="w-8 h-8 border-2 border-slate-200 border-t-indigo-500 rounded-full animate-spin" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Expanding Nodes...</span>
                 </div>
               ) : campuses.length > 0 ? (
                 campuses.slice(0, 4).map((campus, idx) => (
                   <div key={campus.id} className="relative flex flex-col items-center pt-10">
                      {/* Connector Line to Top */}
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 h-10 w-0.5 bg-indigo-100/50" />
                      
                      {/* Horizontal Connectors */}
                      <div className={`absolute top-0 h-0.5 bg-indigo-100/50 ${idx === 0 ? 'left-1/2 w-1/2' : idx === (campuses.slice(0, 4).length - 1) ? 'right-1/2 w-1/2' : 'left-0 right-0'}`} />

                      <div className="px-6 py-4 bg-white border border-slate-200 rounded-2xl shadow-sm flex flex-col items-center gap-2 hover:border-indigo-400 hover:shadow-xl transition-all cursor-pointer group relative z-10">
                         <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                           <MapPin className="w-5 h-5" />
                         </div>
                         <span className="text-xs font-black text-slate-900 truncate max-w-[120px]">{campus.name}</span>
                         <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">Branch Hub</span>
                      </div>

                      <div className="h-10 w-0.5 bg-slate-100" />

                      {/* Level 3: Department Groups (Generic) */}
                      <div className="flex gap-4">
                         {[1, 2].map((j) => (
                           <div key={j} className="relative flex flex-col items-center">
                             <div className="px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl flex items-center gap-2 text-slate-500 hover:bg-white hover:border-indigo-200 hover:text-indigo-600 transition-all cursor-pointer group/leaf">
                                <Layers className="w-3.5 h-3.5 text-slate-300 group-hover/leaf:text-indigo-500" />
                                <span className="text-[10px] font-black uppercase tracking-tight">Dept 0{j}</span>
                             </div>
                           </div>
                         ))}
                      </div>
                   </div>
                 ))
               ) : (
                 <div className="pt-20 text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">
                   Provision campuses to visualize hierarchy
                 </div>
               )}
            </div>
         </div>

         <div className="mt-24 p-8 bg-slate-50 rounded-[32px] border border-slate-100 max-w-2xl text-center shadow-inner relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-5 text-indigo-900">
               <Info className="w-24 h-24" />
            </div>
            <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-indigo-600 shadow-sm mx-auto mb-4 group-hover:rotate-12 transition-transform">
              <Info className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-3">Governance Architecture</h4>
            <p className="text-xs text-slate-500 font-medium leading-relaxed">
              This dynamic tree reflects your current database-level Row Level Security (RLS) policies. Users assigned to a specific branch node are cryptographically isolated within that scope, ensuring zero cross-tenant leakage.
            </p>
         </div>
      </div>
    </div>
  );
};
