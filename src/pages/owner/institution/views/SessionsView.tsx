import React, { useState, useEffect } from 'react';
import { Calendar, Plus, Search, MoreVertical, RefreshCw, Clock, CheckCircle2, AlertCircle, ArrowRight, Shield } from 'lucide-react';
import { Tenant } from '../../../../types';
import { InstitutionService, AcademicSession } from '../../../../services/InstitutionService';

interface SessionsViewProps {
  tenant: Tenant;
}

export const SessionsView: React.FC<SessionsViewProps> = ({ tenant }) => {
  const [loading, setLoading] = useState(true);
  const [sessions, setSessions] = useState<AcademicSession[]>([]);

  const tenantId = tenant?.id || '00000000-0000-0000-0000-000000000001';

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await InstitutionService.getSessions(tenantId);
        setSessions(data);
      } catch (err) {
        console.error('Sessions Load Error:', err);
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
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Academic Sessions Lifecycle</h2>
          <p className="text-sm text-slate-500 font-medium mt-1">Manage institutional terms, calendar boundaries, and active timelines.</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all">
          <Plus className="w-4 h-4" /> New Session
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
         <div className="lg:col-span-2 space-y-6">
            {loading ? (
              <div className="py-20 flex flex-col items-center justify-center gap-4 text-slate-400">
                <RefreshCw className="w-8 h-8 animate-spin" />
                <p className="text-[10px] font-black uppercase tracking-widest">Loading Timeline...</p>
              </div>
            ) : sessions.length > 0 ? (
               sessions.map((session) => (
                 <div key={session.id} className="bg-white rounded-[32px] border border-slate-200 shadow-sm p-8 flex items-center gap-8 group hover:shadow-xl hover:border-indigo-200 transition-all">
                    <div className={`w-20 h-20 rounded-[24px] flex flex-col items-center justify-center transition-colors ${
                      session.is_active ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'bg-slate-50 text-slate-400'
                    }`}>
                       <Calendar className="w-6 h-6 mb-1" />
                       <span className="text-[10px] font-black uppercase tracking-tight">{session.session_name.split('-')[0]}</span>
                    </div>

                    <div className="flex-1">
                       <div className="flex items-center gap-3">
                          <h3 className="text-xl font-black text-slate-900">{session.session_name}</h3>
                          {session.is_active && (
                            <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[9px] font-black rounded-full uppercase tracking-wider border border-emerald-200">
                              Current Active
                            </span>
                          )}
                          <span className={`px-2 py-0.5 text-[9px] font-black rounded-full uppercase tracking-wider border ${
                            session.status === 'COMPLETED' ? 'bg-slate-100 text-slate-500 border-slate-200' : 'bg-amber-100 text-amber-700 border-amber-200'
                          }`}>
                            {session.status}
                          </span>
                       </div>
                       
                       <div className="flex items-center gap-6 mt-4">
                          <div className="flex items-center gap-2">
                             <Clock className="w-3.5 h-3.5 text-slate-300" />
                             <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Timeline</span>
                             <span className="text-xs font-bold text-slate-700">{new Date(session.start_date).toLocaleDateString()} — {new Date(session.end_date).toLocaleDateString()}</span>
                          </div>
                       </div>
                    </div>

                    <div className="flex items-center gap-2">
                       {!session.is_active && session.status !== 'COMPLETED' && (
                         <button className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all shadow-2xs">
                           Set Active
                         </button>
                       )}
                       <button className="p-2.5 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all">
                         <MoreVertical className="w-5 h-5" />
                       </button>
                    </div>
                 </div>
               ))
            ) : (
              <div className="py-24 bg-white rounded-[40px] border border-slate-200 border-dashed flex flex-col items-center justify-center text-center">
                 <div className="w-20 h-20 rounded-full bg-slate-50 flex items-center justify-center mb-6">
                   <Calendar className="w-10 h-10 text-slate-200" />
                 </div>
                 <h3 className="text-xl font-black text-slate-900 tracking-tight">No Sessions Defined</h3>
                 <p className="text-sm text-slate-500 font-medium mt-2 max-w-sm">
                   Establish your first academic calendar session to start managing enrollments and grading periods.
                 </p>
                 <button className="mt-8 px-8 py-4 bg-indigo-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center gap-2">
                   <Plus className="w-4 h-4" /> Initialize Session
                 </button>
              </div>
            )}
         </div>

         <div className="space-y-8">
            <div className="bg-slate-900 rounded-[32px] p-8 text-white relative overflow-hidden group shadow-2xl">
               <div className="absolute top-0 right-0 p-8 opacity-10 text-indigo-400 pointer-events-none">
                 <Shield className="w-32 h-32 rotate-12 translate-x-8 -translate-y-8" />
               </div>
               <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-xl flex items-center justify-center mb-6">
                 <CheckCircle2 className="w-6 h-6 text-emerald-400" />
               </div>
               <h4 className="text-sm font-black uppercase tracking-widest mb-4">Lifecycle Enforcement</h4>
               <p className="text-xs text-slate-400 font-medium leading-relaxed mb-6">
                 Transitioning a session to "ARCHIVED" automatically locks all associated academic records, preventing retrospective data tampering.
               </p>
               <button className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all">
                 System Rules Configuration
               </button>
            </div>

            <div className="bg-white rounded-[32px] border border-slate-200 p-8">
               <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 border-b border-slate-50 pb-4">Recent Shifts</h4>
               <div className="space-y-6">
                  {[1, 2].map((i) => (
                    <div key={i} className="flex gap-4">
                       <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 shrink-0">
                          <RefreshCw className="w-4 h-4" />
                       </div>
                       <div>
                          <p className="text-xs font-bold text-slate-800">2026-27 Session Activated</p>
                          <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-1">July 20, 2026 • by Owner</p>
                       </div>
                    </div>
                  ))}
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};
