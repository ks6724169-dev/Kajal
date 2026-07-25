import React, { useState, useEffect } from 'react';
import { 
  MapPin, 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Building, 
  Users, 
  ArrowRight,
  Shield,
  Loader2,
  Phone,
  Mail,
  User,
  ExternalLink,
  ChevronRight,
  Home,
  FileText,
  Settings,
  RefreshCw,
  MoreHorizontal,
  LayoutGrid,
  List
} from 'lucide-react';
import { Tenant } from '../../../types';
import { CampusService, CampusRecord } from '../../../services/CampusService';
import { motion, AnimatePresence } from 'motion/react';

interface CampusManagementPageProps {
  tenant: Tenant;
  onNavigate: (path: string) => void;
  subPath?: string;
}

export const CampusManagementPage: React.FC<CampusManagementPageProps> = ({ tenant, onNavigate, subPath }) => {
  const [loading, setLoading] = useState(true);
  const [campuses, setCampuses] = useState<CampusRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const effectiveTenantId = tenant?.id || '00000000-0000-0000-0000-000000000001';

  const loadCampuses = async () => {
    setLoading(true);
    try {
      const data = await CampusService.getCampuses(effectiveTenantId);
      setCampuses(data);
    } catch (err) {
      console.error('Error loading campuses:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCampuses();
  }, [effectiveTenantId]);

  const filteredCampuses = campuses.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.code?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // 1. CREATE FLOW
  if (subPath === 'create') {
     return (
       <div className="max-w-4xl mx-auto space-y-10 pb-32 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="flex items-center gap-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
            <button onClick={() => onNavigate('/owner/institution-organization/campuses')} className="hover:text-indigo-600 transition-all">Campuses</button>
            <ChevronRight className="w-3 h-3 text-slate-300" />
            <span className="text-slate-900">Provision New Branch</span>
          </div>

          <div className="bg-white rounded-[40px] border border-slate-100 shadow-2xl shadow-slate-200/50 overflow-hidden">
             <div className="p-12 border-b border-slate-100 bg-slate-900 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none">
                   <MapPin className="w-64 h-64 rotate-12 translate-x-12 -translate-y-12" />
                </div>
                <div className="relative z-10 flex flex-col items-start gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-xl flex items-center justify-center">
                    <Plus className="w-7 h-7 text-indigo-400" />
                  </div>
                  <h2 className="text-4xl font-black tracking-tighter">Provision New Campus</h2>
                  <p className="text-slate-400 text-lg font-medium max-w-xl">
                    Configure a new physical branch within your institutional network. This will initialize a new spatial isolation context.
                  </p>
                </div>
             </div>
             
             <div className="p-12 space-y-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                   <div className="space-y-3">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Campus Name</label>
                      <input 
                        type="text" 
                        className="w-full px-8 py-5 bg-slate-50 border border-slate-100 rounded-3xl text-sm font-black text-slate-900 outline-none focus:bg-white focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 transition-all placeholder:text-slate-300" 
                        placeholder="e.g. West Delhi Senior Campus" 
                      />
                   </div>
                   <div className="space-y-3">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Branch Code</label>
                      <input 
                        type="text" 
                        className="w-full px-8 py-5 bg-slate-50 border border-slate-100 rounded-3xl text-sm font-black text-slate-900 outline-none focus:bg-white focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 transition-all placeholder:text-slate-300" 
                        placeholder="e.g. WD-01" 
                      />
                   </div>
                </div>

                <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Statutory Address</label>
                    <textarea 
                      rows={3}
                      className="w-full px-8 py-5 bg-slate-50 border border-slate-100 rounded-3xl text-sm font-black text-slate-900 outline-none focus:bg-white focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 transition-all placeholder:text-slate-300" 
                      placeholder="Enter complete physical address for legal registration..." 
                    />
                </div>

                <div className="flex justify-end gap-4 pt-8 border-t border-slate-50">
                   <button 
                    onClick={() => onNavigate('/owner/institution-organization/campuses')} 
                    className="px-10 py-5 bg-white border border-slate-200 text-slate-500 rounded-3xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-slate-50 transition-all"
                   >
                    Cancel
                   </button>
                   <button className="px-10 py-5 bg-indigo-600 text-white rounded-3xl text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl shadow-indigo-200 hover:bg-indigo-700 hover:translate-y-[-2px] transition-all">
                    Initialize Branch
                   </button>
                </div>
             </div>
          </div>
       </div>
     );
  }

  // 2. MAIN LIST VIEW
  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-32 px-4 sm:px-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Section Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
        <div>
           <div className="flex items-center gap-3 text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em] mb-3">
             <div className="w-2 h-2 rounded-full bg-indigo-600" />
             Spatial Distribution
           </div>
           <h1 className="text-4xl font-black text-slate-900 tracking-tighter">Campus Management</h1>
           <p className="text-slate-500 font-medium mt-2 max-w-lg">
             Manage physical branches, local leadership assignments, and geographical policy enforcements.
           </p>
        </div>

        <div className="flex flex-wrap items-center gap-4">
           {/* Search & Filter Toolbar */}
           <div className="flex items-center bg-white p-1.5 rounded-[24px] border border-slate-100 shadow-xl shadow-slate-200/40">
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                <input 
                  type="text" 
                  placeholder="Search by name, city or code..." 
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="pl-12 pr-6 py-3.5 bg-slate-50 border-transparent rounded-2xl text-[11px] font-black w-72 outline-none focus:bg-white focus:ring-4 focus:ring-indigo-50 transition-all placeholder:text-slate-300 uppercase tracking-widest"
                />
              </div>
              
              <div className="h-8 w-px bg-slate-100 mx-2 hidden sm:block" />

              <div className="hidden sm:flex items-center gap-1">
                 <button 
                  onClick={() => setViewMode('grid')}
                  className={`p-3 rounded-xl transition-all ${viewMode === 'grid' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-400 hover:bg-slate-50'}`}
                 >
                   <LayoutGrid className="w-5 h-5" />
                 </button>
                 <button 
                  onClick={() => setViewMode('list')}
                  className={`p-3 rounded-xl transition-all ${viewMode === 'list' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-400 hover:bg-slate-50'}`}
                 >
                   <List className="w-5 h-5" />
                 </button>
              </div>
           </div>

           <button 
            onClick={() => onNavigate('/owner/institution-organization/campuses/create')}
            className="flex items-center gap-3 px-8 py-5 bg-indigo-600 text-white rounded-[24px] text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl shadow-indigo-200 hover:bg-indigo-700 hover:translate-y-[-2px] transition-all"
           >
            <Plus className="w-4 h-4" /> Add Campus
          </button>
        </div>
      </div>

      {/* Content Grid/List */}
      {loading ? (
        <div className="py-32 flex flex-col items-center justify-center text-slate-400">
          <RefreshCw className="w-12 h-12 animate-spin mb-6 text-indigo-600" />
          <p className="text-[10px] font-black uppercase tracking-[0.2em]">Querying Distributed Nodes...</p>
        </div>
      ) : filteredCampuses.length > 0 ? (
        <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" : "space-y-4"}>
          <AnimatePresence mode="popLayout">
            {filteredCampuses.map((campus, idx) => (
              <motion.div 
                layout
                key={campus.id} 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                className={`bg-white group ${
                  viewMode === 'grid' 
                  ? 'rounded-[40px] border border-slate-100 shadow-xl shadow-slate-200/40 hover:shadow-2xl hover:translate-y-[-4px] transition-all flex flex-col overflow-hidden' 
                  : 'rounded-3xl border border-slate-100 shadow-sm p-6 flex flex-col md:flex-row items-center gap-8 hover:bg-slate-50 transition-colors'
                }`}
              >
                {/* GRID VIEW HEADER / LIST VIEW LEFT */}
                <div className={`${viewMode === 'grid' ? 'p-8 border-b border-slate-50' : ''} flex items-start justify-between w-full`}>
                   <div className="flex items-center gap-6">
                      <div className="w-16 h-16 rounded-3xl bg-slate-900 text-white flex items-center justify-center font-black text-xl shadow-xl group-hover:scale-110 transition-transform">
                        {campus.name?.[0] || 'C'}
                      </div>
                      <div>
                         <h3 className="text-lg font-black text-slate-900 tracking-tight group-hover:text-indigo-600 transition-colors">{campus.name}</h3>
                         <div className="flex items-center gap-3 mt-1.5">
                           <span className={`text-[9px] font-black uppercase tracking-[0.2em] px-2.5 py-1 rounded-full ${
                             campus.type === 'MAIN' ? 'bg-amber-50 text-amber-600 border border-amber-100' : 'bg-slate-100 text-slate-600 border border-slate-200'
                           }`}>
                             {campus.type}
                           </span>
                           <span className="text-[10px] text-slate-400 font-black tracking-widest uppercase">{campus.code}</span>
                         </div>
                      </div>
                   </div>
                   <button className="p-3 text-slate-300 hover:text-slate-900 hover:bg-slate-100 rounded-2xl transition-all">
                     <MoreHorizontal className="w-5 h-5" />
                   </button>
                </div>
                
                {/* CONTENT AREA */}
                <div className={`${viewMode === 'grid' ? 'p-8 flex-1 space-y-6' : 'flex-1 grid grid-cols-1 sm:grid-cols-3 gap-6'} w-full`}>
                   <div className="flex items-start gap-4">
                     <div className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center shrink-0">
                       <MapPin className="w-4 h-4 text-slate-400" />
                     </div>
                     <p className="text-sm text-slate-600 font-medium leading-relaxed">
                       {campus.address}, {campus.city}, {campus.state}
                     </p>
                   </div>
                   
                   <div className="flex items-start gap-4">
                      <div className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center shrink-0">
                        <User className="w-4 h-4 text-slate-400" />
                      </div>
                      <div>
                         <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Leadership</p>
                         <p className="text-sm font-black text-slate-900 mt-0.5">{campus.principal_name || 'Unassigned'}</p>
                      </div>
                   </div>

                   <div className="flex items-start gap-4">
                      <div className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center shrink-0">
                        <Users className="w-4 h-4 text-slate-400" />
                      </div>
                      <div>
                         <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Entity Status</p>
                         <div className="flex items-center gap-2 mt-1">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-xs font-black text-emerald-600 uppercase tracking-widest">Active</span>
                         </div>
                      </div>
                   </div>
                </div>

                {/* FOOTER ACTIONS */}
                <div className={`${viewMode === 'grid' ? 'p-6 bg-slate-50/50 border-t border-slate-100' : ''} flex items-center gap-3 w-full sm:w-auto`}>
                   <button 
                    onClick={() => onNavigate(`/owner/institution-organization/campuses/${campus.id}`)}
                    className="flex-1 py-3.5 bg-white border border-slate-200 rounded-[20px] text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-all shadow-sm"
                   >
                    Manage Branch
                   </button>
                   <button className="p-3.5 bg-white border border-slate-200 rounded-[20px] text-slate-400 hover:text-indigo-600 hover:border-indigo-200 transition-all shadow-sm">
                    <ExternalLink className="w-4 h-4" />
                   </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <div className="py-40 text-center bg-white rounded-[40px] border-2 border-dashed border-slate-100 flex flex-col items-center justify-center">
           <div className="w-24 h-24 rounded-full bg-slate-50 flex items-center justify-center mb-8">
             <MapPin className="w-10 h-10 text-slate-200" />
           </div>
           <h3 className="text-2xl font-black text-slate-900 tracking-tight">No Campuses Found</h3>
           <p className="text-slate-400 font-medium mt-2 max-w-xs mx-auto">
             Refine your search parameters or provision a new branch to begin spatial expansion.
           </p>
           <button 
            onClick={() => setSearchQuery('')}
            className="mt-8 text-[11px] font-black text-indigo-600 uppercase tracking-[0.2em] hover:bg-indigo-50 px-8 py-4 rounded-2xl transition-all"
           >
            Clear Search Filter
           </button>
        </div>
      )}
    </div>
  );
};

