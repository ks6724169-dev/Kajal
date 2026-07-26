import React, { useState, useEffect } from 'react';
import { 
  MapPin, 
  Search, 
  Filter, 
  ArrowUpRight, 
  Users, 
  Building2, 
  ShieldCheck,
  Globe,
  Plus,
  X,
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
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [creating, setCreating] = useState(false);

  const [newCampus, setNewCampus] = useState({
    name: '',
    code: '',
    type: 'PRIMARY',
    address: '',
    city: '',
    state: '',
    pincode: '',
    phone: '',
    email: '',
    capacity: 500
  });

  const effectiveTenantId = tenant?.id || 'apex_k12';

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

  useEffect(() => {
    loadCampuses();
  }, [effectiveTenantId]);

  const handleCreateCampus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCampus.name || !newCampus.code) return;

    setCreating(true);
    try {
      const { error } = await CampusService.createCampus(newCampus as any, effectiveTenantId);
      if (!error) {
        setShowAddModal(false);
        setNewCampus({
          name: '',
          code: '',
          type: 'PRIMARY',
          address: '',
          city: '',
          state: '',
          pincode: '',
          phone: '',
          email: '',
          capacity: 500
        });
        loadCampuses();
      }
    } catch (err) {
      console.error('Error creating campus:', err);
    } finally {
      setCreating(false);
    }
  };

  const filteredCampuses = campuses.filter(c => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      c.name.toLowerCase().includes(q) ||
      c.code.toLowerCase().includes(q) ||
      (c.city && c.city.toLowerCase().includes(q))
    );
  });

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-slate-400">
         <div className="w-16 h-16 border-4 border-indigo-600/10 border-t-indigo-600 rounded-full animate-spin mb-8" />
         <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Mapping Organizational Nodes...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300 pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
           <div className="flex items-center gap-2 text-[10px] font-bold text-indigo-600 uppercase tracking-widest mb-1">
             <div className="w-1.5 h-1.5 rounded-full bg-indigo-600" />
             Campus Overview
           </div>
           <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">Institutional Campus Nodes</h1>
           <p className="text-slate-500 text-xs mt-0.5 max-w-xl">Unified monitoring of institutional nodes across regions.</p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
           <div className="relative group w-full sm:w-56">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search campus..."
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all shadow-xs"
              />
           </div>
           <button 
             onClick={() => setShowAddModal(true)}
             className="flex items-center justify-center gap-1.5 px-3.5 py-2 bg-indigo-600 text-white rounded-lg text-xs font-semibold shadow-xs hover:bg-indigo-700 transition-all cursor-pointer whitespace-nowrap shrink-0"
           >
              <Plus className="w-4 h-4" /> Add Campus
           </button>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {filteredCampuses.length > 0 ? filteredCampuses.map((campus) => (
          <div 
            key={campus.id}
            className="bg-white rounded-xl border border-slate-200 shadow-xs p-4 sm:p-5 flex flex-col sm:flex-row gap-4 sm:gap-6 hover:shadow-md hover:border-indigo-200 transition-all group"
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
                      {campus.status || 'ACTIVE'}
                   </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2">
                   <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 border border-slate-100">
                         <MapPin className="w-4 h-4" />
                      </div>
                      <div>
                         <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Location</p>
                         <p className="text-[11px] font-bold text-slate-900">{campus.city || 'Central'}, {campus.state || 'Region'}</p>
                      </div>
                   </div>
                   <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 border border-slate-100">
                         <Users className="w-4 h-4" />
                      </div>
                      <div>
                         <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Capacity</p>
                         <p className="text-[11px] font-bold text-slate-900">{campus.student_count?.toLocaleString() || campus.capacity || '500'}</p>
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
                     className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 text-slate-500 hover:bg-indigo-600 hover:text-white rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all cursor-pointer"
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

      {/* Add Campus Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
           <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 space-y-6 animate-in zoom-in-95 duration-200 text-left">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                 <div>
                    <h3 className="text-lg font-bold text-slate-900">Add New Campus Node</h3>
                    <p className="text-xs text-slate-500">Register a new physical or virtual educational branch.</p>
                 </div>
                 <button onClick={() => setShowAddModal(false)} className="p-1 text-slate-400 hover:text-slate-600">
                    <X className="w-5 h-5" />
                 </button>
              </div>

              <form onSubmit={handleCreateCampus} className="space-y-4">
                 <div className="grid grid-cols-2 gap-4">
                    <div>
                       <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Campus Name *</label>
                       <input 
                         type="text" 
                         required
                         value={newCampus.name}
                         onChange={e => setNewCampus({...newCampus, name: e.target.value})}
                         placeholder="e.g. Westside Innovation Campus"
                         className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
                       />
                    </div>
                    <div>
                       <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Campus Code *</label>
                       <input 
                         type="text" 
                         required
                         value={newCampus.code}
                         onChange={e => setNewCampus({...newCampus, code: e.target.value})}
                         placeholder="e.g. CAMPUS-03"
                         className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
                       />
                    </div>
                 </div>

                 <div className="grid grid-cols-2 gap-4">
                    <div>
                       <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Node Type</label>
                       <select 
                         value={newCampus.type}
                         onChange={e => setNewCampus({...newCampus, type: e.target.value})}
                         className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
                       >
                          <option value="PRIMARY">PRIMARY</option>
                          <option value="SECONDARY">SECONDARY</option>
                          <option value="SATELLITE">SATELLITE</option>
                          <option value="ONLINE">ONLINE</option>
                       </select>
                    </div>
                    <div>
                       <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Capacity</label>
                       <input 
                         type="number" 
                         value={newCampus.capacity}
                         onChange={e => setNewCampus({...newCampus, capacity: parseInt(e.target.value) || 0})}
                         className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
                       />
                    </div>
                 </div>

                 <div className="grid grid-cols-2 gap-4">
                    <div>
                       <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">City</label>
                       <input 
                         type="text" 
                         value={newCampus.city}
                         onChange={e => setNewCampus({...newCampus, city: e.target.value})}
                         placeholder="e.g. San Francisco"
                         className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
                       />
                    </div>
                    <div>
                       <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">State / Province</label>
                       <input 
                         type="text" 
                         value={newCampus.state}
                         onChange={e => setNewCampus({...newCampus, state: e.target.value})}
                         placeholder="e.g. CA"
                         className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
                       />
                    </div>
                 </div>

                 <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Street Address</label>
                    <input 
                      type="text" 
                      value={newCampus.address}
                      onChange={e => setNewCampus({...newCampus, address: e.target.value})}
                      placeholder="e.g. 700 Innovation Blvd"
                      className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                 </div>

                 <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                    <button 
                      type="button" 
                      onClick={() => setShowAddModal(false)}
                      className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50"
                    >
                       Cancel
                    </button>
                    <button 
                      type="submit"
                      disabled={creating}
                      className="px-5 py-2 bg-indigo-600 text-white rounded-xl text-xs font-semibold hover:bg-indigo-700 transition-all shadow-xs flex items-center gap-2 disabled:opacity-50"
                    >
                       {creating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                       Create Campus
                    </button>
                 </div>
              </form>
           </div>
        </div>
      )}

      {/* Strategy Panel */}
      <div className="bg-white rounded-xl p-8 border border-slate-200 shadow-sm relative overflow-hidden group">
         <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div>
               <h3 className="text-xl font-bold text-slate-900 tracking-tight mb-2">Regional Scalability & Strategy</h3>
               <p className="text-slate-500 text-sm max-w-2xl leading-relaxed">
                  Nodes represent functional operational units. Ensure geographic distribution aligns with institutional growth targets and operational compliance.
               </p>
            </div>
            <button className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-lg text-[10px] font-bold uppercase tracking-widest shadow-md hover:bg-black transition-all cursor-pointer">
               Node Distribution Report <ArrowUpRight className="w-4 h-4 ml-1" />
            </button>
         </div>
      </div>
    </div>
  );
};
