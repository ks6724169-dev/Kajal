import React, { useState, useEffect } from 'react';
import { 
  GraduationCap, 
  Plus, 
  Search, 
  Calendar, 
  Clock, 
  RefreshCw,
  MoreHorizontal,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  History,
  X,
  Loader2
} from 'lucide-react';
import { Tenant } from '../../../types';
import { motion, AnimatePresence } from 'motion/react';
import { InstitutionService, AcademicSession } from '../../../services/InstitutionService';

interface AcademicStructurePageProps {
  tenant: Tenant;
  onNavigate: (path: string) => void;
}

export const AcademicStructurePage: React.FC<AcademicStructurePageProps> = ({ tenant, onNavigate }) => {
  const [loading, setLoading] = useState(true);
  const [sessions, setSessions] = useState<any[]>([]);
  const [showSessionModal, setShowSessionModal] = useState(false);
  const [creating, setCreating] = useState(false);

  const [newSession, setNewSession] = useState({
    session_name: '',
    start_date: '',
    end_date: '',
    status: 'ACTIVE' as const
  });

  const effectiveTenantId = tenant?.id || 'apex_k12';

  const loadSessions = async () => {
    setLoading(true);
    try {
      const fetched = await InstitutionService.getSessions(effectiveTenantId);
      if (fetched && fetched.length > 0) {
        setSessions(fetched.map(s => ({
          id: s.id,
          year: s.session_name,
          status: s.status || (s.is_active ? 'ACTIVE' : 'COMPLETED'),
          start: s.start_date ? new Date(s.start_date).toLocaleDateString() : 'April 2026',
          end: s.end_date ? new Date(s.end_date).toLocaleDateString() : 'March 2027',
          isDefault: s.is_active
        })));
      } else {
        setSessions([
          { id: '1', year: '2026-27', status: 'ACTIVE', start: 'April 2026', end: 'March 2027', isDefault: true },
          { id: '2', year: '2025-26', status: 'COMPLETED', start: 'April 2025', end: 'March 2026', isDefault: false },
          { id: '3', year: '2027-28', status: 'PLANNING', start: 'April 2027', end: 'March 2028', isDefault: false },
        ]);
      }
    } catch (err) {
      console.error('Error fetching sessions:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSessions();
  }, [effectiveTenantId]);

  const handleCreateSession = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSession.session_name) return;

    setCreating(true);
    try {
      const payload: Partial<AcademicSession> = {
        session_name: newSession.session_name,
        start_date: newSession.start_date || new Date().toISOString(),
        end_date: newSession.end_date || new Date(Date.now() + 31536000000).toISOString(),
        status: newSession.status,
        is_active: newSession.status === 'ACTIVE'
      };

      const { error } = await InstitutionService.createSession(payload, effectiveTenantId);
      if (!error) {
        setShowSessionModal(false);
        setNewSession({ session_name: '', start_date: '', end_date: '', status: 'ACTIVE' });
        loadSessions();
      }
    } catch (err) {
      console.error('Create session error:', err);
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-32 px-4 sm:px-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Section Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
        <div>
           <div className="flex items-center gap-3 text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em] mb-3">
             <div className="w-2 h-2 rounded-full bg-indigo-600" />
             Temporal Governance
           </div>
           <h1 className="text-4xl font-black text-slate-900 tracking-tighter">Academic Sessions</h1>
           <p className="text-slate-500 font-medium mt-2 max-w-lg">
             Define institutional timelines, manage session transitions, and configure admission cycles.
           </p>
        </div>

        <div className="flex flex-wrap items-center gap-4">
           <button 
             onClick={() => setShowSessionModal(true)}
             className="flex items-center gap-3 px-8 py-5 bg-indigo-600 text-white rounded-[24px] text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl shadow-indigo-200 hover:bg-indigo-700 hover:translate-y-[-2px] transition-all cursor-pointer"
           >
            <Plus className="w-4 h-4" /> Provision New Session
          </button>
        </div>
      </div>

      {loading ? (
        <div className="py-32 flex flex-col items-center justify-center text-slate-400">
          <RefreshCw className="w-12 h-12 animate-spin mb-6 text-indigo-600" />
          <p className="text-[10px] font-black uppercase tracking-[0.2em]">Synchronizing Temporal Cycles...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           {/* Primary Timeline Column */}
           <div className="lg:col-span-2 space-y-6">
              <h3 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-3">
                <History className="w-5 h-5 text-indigo-600" />
                Session Timeline
              </h3>
              
              <div className="space-y-4">
                {sessions.map((session, idx) => (
                  <motion.div 
                    key={session.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className={`bg-white rounded-[32px] border ${session.status === 'ACTIVE' ? 'border-indigo-200 ring-4 ring-indigo-50 shadow-xl' : 'border-slate-100 shadow-sm'} p-8 group hover:border-indigo-100 transition-all`}
                  >
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                       <div className="flex items-center gap-6">
                          <div className={`w-16 h-16 rounded-2xl ${session.status === 'ACTIVE' ? 'bg-indigo-600' : 'bg-slate-100'} text-white flex items-center justify-center shadow-lg`}>
                             <Calendar className={`w-7 h-7 ${session.status === 'ACTIVE' ? 'text-white' : 'text-slate-400'}`} />
                          </div>
                          <div>
                             <div className="flex items-center gap-3">
                               <h4 className="text-xl font-black text-slate-900 tracking-tight">Academic Year {session.year}</h4>
                               {session.isDefault && (
                                 <span className="px-3 py-1 bg-indigo-50 text-indigo-600 text-[9px] font-black rounded-full uppercase tracking-widest border border-indigo-100">Default</span>
                               )}
                             </div>
                             <div className="flex items-center gap-4 mt-2">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                                   <Clock className="w-3.5 h-3.5" />
                                   {session.start} - {session.end}
                                </span>
                                <div className="w-1.5 h-1.5 rounded-full bg-slate-200" />
                                <span className={`text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 ${
                                  session.status === 'ACTIVE' ? 'text-emerald-600' : session.status === 'PLANNING' ? 'text-amber-600' : 'text-slate-400'
                                }`}>
                                   {session.status}
                                </span>
                             </div>
                          </div>
                       </div>

                       <div className="flex items-center gap-3">
                          <button className="px-6 py-3.5 bg-slate-50 border border-slate-100 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-600 hover:bg-slate-100 transition-all">
                             Manage Config
                          </button>
                          <button className={`p-3.5 rounded-xl border transition-all ${
                            session.status === 'ACTIVE' ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg' : 'bg-white text-slate-300 border-slate-100 hover:text-slate-900'
                          }`}>
                            <MoreHorizontal className="w-5 h-5" />
                          </button>
                       </div>
                    </div>
                  </motion.div>
                ))}
              </div>
           </div>

           {/* Insights Column */}
           <div className="space-y-8">
              <div className="bg-slate-900 rounded-[40px] p-10 text-white relative overflow-hidden shadow-2xl">
                 <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none">
                    <ShieldCheck className="w-48 h-48 rotate-12" />
                 </div>
                 <h3 className="text-2xl font-black tracking-tighter mb-4">Governance Logic</h3>
                 <p className="text-slate-400 text-sm font-medium leading-relaxed mb-8">
                   Academic sessions enforce temporal isolation. Financial records and academic results are compartmentalized by session year to maintain data integrity.
                 </p>
                 <div className="space-y-4">
                    <div className="flex items-start gap-4">
                       <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2 shrink-0" />
                       <p className="text-xs text-slate-200 font-bold">Session transition requires full inventory reconciliation.</p>
                    </div>
                    <div className="flex items-start gap-4">
                       <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2 shrink-0" />
                       <p className="text-xs text-slate-200 font-bold">Only one "Active" session can exist per campus.</p>
                    </div>
                 </div>
              </div>

              <div className="bg-white rounded-[40px] border border-slate-100 shadow-xl p-8 space-y-6">
                 <h4 className="text-sm font-black text-slate-900 uppercase tracking-[0.2em] flex items-center gap-3">
                    <AlertCircle className="w-4 h-4 text-amber-500" />
                    Critical Alerts
                 </h4>
                 <div className="p-5 bg-amber-50 rounded-3xl border border-amber-100">
                    <p className="text-[11px] font-black text-amber-800 uppercase tracking-widest leading-normal">
                       2025-26 Session reconciliation is pending. 14 departments have not locked academic records.
                    </p>
                    <button className="mt-4 flex items-center gap-2 text-[10px] font-black text-amber-900 uppercase tracking-widest group">
                       Audit Records <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                    </button>
                 </div>
              </div>
           </div>
        </div>
      )}

      {/* Provision Session Modal */}
      {showSessionModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
           <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-md w-full p-6 space-y-6 animate-in zoom-in-95 duration-200 text-left">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                 <div>
                    <h3 className="text-lg font-black text-slate-900">Provision Academic Session</h3>
                    <p className="text-xs text-slate-500 font-medium">Register a new temporal academic cycle.</p>
                 </div>
                 <button onClick={() => setShowSessionModal(false)} className="p-1 text-slate-400 hover:text-slate-600">
                    <X className="w-5 h-5" />
                 </button>
              </div>

              <form onSubmit={handleCreateSession} className="space-y-4">
                 <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Session Year / Name *</label>
                    <input 
                      type="text" 
                      required
                      value={newSession.session_name}
                      onChange={e => setNewSession({...newSession, session_name: e.target.value})}
                      placeholder="e.g. 2027-28"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                 </div>

                 <div className="grid grid-cols-2 gap-4">
                    <div>
                       <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Start Date</label>
                       <input 
                         type="date" 
                         value={newSession.start_date}
                         onChange={e => setNewSession({...newSession, start_date: e.target.value})}
                         className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
                       />
                    </div>
                    <div>
                       <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">End Date</label>
                       <input 
                         type="date" 
                         value={newSession.end_date}
                         onChange={e => setNewSession({...newSession, end_date: e.target.value})}
                         className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
                       />
                    </div>
                 </div>

                 <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Initial Status</label>
                    <select 
                      value={newSession.status}
                      onChange={e => setNewSession({...newSession, status: e.target.value as any})}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
                    >
                       <option value="ACTIVE">ACTIVE</option>
                       <option value="UPCOMING">UPCOMING</option>
                       <option value="PLANNING">PLANNING</option>
                    </select>
                 </div>

                 <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                    <button 
                      type="button" 
                      onClick={() => setShowSessionModal(false)}
                      className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50"
                    >
                       Cancel
                    </button>
                    <button 
                      type="submit"
                      disabled={creating}
                      className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-semibold hover:bg-indigo-700 transition-all shadow-xs flex items-center gap-2 disabled:opacity-50 cursor-pointer"
                    >
                       {creating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                       Provision Session
                    </button>
                 </div>
              </form>
           </div>
        </div>
      )}
    </div>
  );
};
