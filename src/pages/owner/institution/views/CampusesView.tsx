import React, { useState, useEffect } from 'react';
import { 
  MapPin, 
  Plus, 
  Search, 
  MoreVertical, 
  User, 
  Phone, 
  ArrowRight,
  Loader2,
  ExternalLink,
  ChevronRight,
  Filter,
  Users,
  Grid,
  List
} from 'lucide-react';
import { Tenant } from '../../../../types';
import { CampusService, CampusRecord } from '../../../../services/CampusService';
import { supabase } from '../../../../services/supabase';

interface CampusesViewProps {
  tenant: Tenant;
  onNavigate: (path: string) => void;
}

export const CampusesView: React.FC<CampusesViewProps> = ({ tenant, onNavigate }) => {
  const [loading, setLoading] = useState(true);
  const [campuses, setCampuses] = useState<CampusRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const tenantId = tenant?.id || '00000000-0000-0000-0000-000000000001';

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await CampusService.getCampuses(tenantId);
      setCampuses(data);
    } catch (err) {
      console.error('Campuses Load Error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();

    const channel = supabase
      .channel('campus-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'campuses', filter: `tenant_id=eq.${tenantId}` }, () => loadData())
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [tenantId]);

  const filtered = campuses.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.code?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.city?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
      {/* Search & Actions Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-[24px] border border-slate-200 shadow-sm">
        <div className="flex items-center gap-4 flex-1">
          <div className="relative group flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
            <input 
              type="text" 
              placeholder="Filter by name, code, or city..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 focus:bg-white transition-all"
            />
          </div>
          <div className="hidden sm:flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
             <button 
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
             >
               <Grid className="w-4 h-4" />
             </button>
             <button 
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
             >
               <List className="w-4 h-4" />
             </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
           <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all">
             <Filter className="w-3.5 h-3.5" /> Filter
           </button>
           <button className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all">
             <Plus className="w-4 h-4" /> New Campus
           </button>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="flex items-center gap-4 overflow-x-auto pb-2 scrollbar-hide">
         {[
           { label: 'Total Branches', count: campuses.length, color: 'indigo' },
           { label: 'Operational', count: campuses.filter(c => c.status === 'ACTIVE').length, color: 'emerald' },
           { label: 'Draft / Pending', count: campuses.filter(c => c.status === 'DRAFT').length, color: 'amber' },
         ].map((s, i) => (
           <div key={i} className="px-6 py-3 bg-white border border-slate-200 rounded-2xl flex items-center gap-4 shrink-0 shadow-xs">
              <div className={`w-2 h-2 rounded-full bg-${s.color}-500 shadow-[0_0_8px_rgba(var(--color-${s.color}-500),0.4)]`} />
              <div className="flex flex-col">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">{s.label}</span>
                <span className="text-lg font-black text-slate-900 mt-1">{s.count}</span>
              </div>
           </div>
         ))}
      </div>

      {/* Main Grid / List */}
      {loading ? (
        <div className="py-32 flex flex-col items-center justify-center gap-4 text-slate-400">
           <Loader2 className="w-10 h-10 animate-spin text-indigo-600" />
           <p className="text-[10px] font-black uppercase tracking-widest">Synchronizing Campus Map...</p>
        </div>
      ) : filtered.length > 0 ? (
        <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" : "space-y-4"}>
          {filtered.map((campus) => (
            <div 
              key={campus.id} 
              className={`bg-white border border-slate-200 transition-all group overflow-hidden ${
                viewMode === 'grid' 
                ? 'rounded-[32px] hover:shadow-2xl hover:border-indigo-200 flex flex-col p-8' 
                : 'rounded-2xl hover:shadow-md flex items-center p-4'
              }`}
            >
              {viewMode === 'grid' ? (
                <>
                  <div className="flex items-start justify-between mb-8">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-3xl bg-slate-50 border border-slate-100 flex items-center justify-center text-indigo-600 font-black text-2xl shadow-inner group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500">
                        {campus.name[0]}
                      </div>
                      <div>
                        <h3 className="font-black text-slate-900 group-hover:text-indigo-600 transition-colors tracking-tight">{campus.name}</h3>
                        <div className="flex items-center gap-2 mt-1.5">
                           <span className="px-1.5 py-0.5 bg-slate-100 text-slate-500 text-[9px] font-black rounded border border-slate-200 uppercase tracking-wider">
                             {campus.code}
                           </span>
                           <div className={`w-1.5 h-1.5 rounded-full ${campus.status === 'ACTIVE' ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                           <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{campus.status}</span>
                        </div>
                      </div>
                    </div>
                    <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all">
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="flex-1 space-y-6">
                    <div className="flex items-start gap-3">
                       <MapPin className="w-4 h-4 text-slate-300 mt-0.5" />
                       <p className="text-sm text-slate-500 font-medium leading-relaxed">
                         {campus.address}, {campus.city}, {campus.state}
                       </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-6 border-t border-slate-50">
                       <div className="space-y-1">
                          <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest flex items-center gap-1.5">
                            <User className="w-3 h-3" /> Principal
                          </p>
                          <p className="text-xs font-bold text-slate-800 truncate">{campus.principal_name || 'Not Assigned'}</p>
                       </div>
                       <div className="space-y-1">
                          <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest flex items-center gap-1.5">
                            <Users className="w-3 h-3" /> Population
                          </p>
                          <p className="text-xs font-bold text-slate-800 truncate">{campus.student_count || 0} Students</p>
                       </div>
                    </div>
                  </div>

                  <button 
                    onClick={() => onNavigate(`/owner/institution/campus/${campus.id}`)}
                    className="mt-8 w-full py-4 bg-slate-50 border border-slate-100 text-slate-600 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-indigo-600 hover:text-white hover:border-indigo-500 hover:shadow-xl hover:shadow-indigo-100 transition-all flex items-center justify-center gap-2 group/btn"
                  >
                    Manage Workspace <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </>
              ) : (
                <>
                  <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-indigo-600 font-black text-lg mr-6">
                    {campus.name[0]}
                  </div>
                  <div className="flex-1 grid grid-cols-4 items-center gap-4">
                    <div className="col-span-1">
                      <h3 className="text-sm font-black text-slate-900 truncate">{campus.name}</h3>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{campus.code}</p>
                    </div>
                    <div className="col-span-1 flex items-center gap-2">
                       <MapPin className="w-3.5 h-3.5 text-slate-300" />
                       <span className="text-xs text-slate-500 font-medium truncate">{campus.city}</span>
                    </div>
                    <div className="col-span-1 flex items-center gap-2">
                       <User className="w-3.5 h-3.5 text-slate-300" />
                       <span className="text-xs text-slate-500 font-medium truncate">{campus.principal_name || 'Unassigned'}</span>
                    </div>
                    <div className="col-span-1 flex justify-end gap-2">
                       <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all">
                         <ExternalLink className="w-4 h-4" />
                       </button>
                       <button 
                        onClick={() => onNavigate(`/owner/institution/campus/${campus.id}`)}
                        className="px-4 py-2 bg-slate-100 text-slate-600 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all"
                       >
                         View Details
                       </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="py-32 bg-white rounded-[40px] border border-slate-200 border-dashed flex flex-col items-center justify-center text-center animate-in zoom-in-95 duration-500">
           <div className="w-24 h-24 rounded-full bg-slate-50 flex items-center justify-center mb-6">
             <MapPin className="w-10 h-10 text-slate-200" />
           </div>
           <h3 className="text-xl font-black text-slate-900 tracking-tight">No Active Campuses</h3>
           <p className="text-sm text-slate-500 font-medium mt-2 max-w-sm">
             Your institutional network doesn't have any physical branches registered in our database.
           </p>
           <button className="mt-8 px-8 py-4 bg-indigo-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center gap-2">
             <Plus className="w-4 h-4" /> Provision First Campus
           </button>
        </div>
      )}
    </div>
  );
};
