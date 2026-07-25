import React, { useState, useEffect } from 'react';
import { Award, Plus, Search, MoreVertical, Shield, FileText, CheckCircle2, Calendar, ExternalLink, RefreshCw, AlertCircle } from 'lucide-react';
import { Tenant } from '../../../../types';
import { InstitutionService, Affiliation } from '../../../../services/InstitutionService';

interface AffiliationsViewProps {
  tenant: Tenant;
}

export const AffiliationsView: React.FC<AffiliationsViewProps> = ({ tenant }) => {
  const [loading, setLoading] = useState(true);
  const [affiliations, setAffiliations] = useState<Affiliation[]>([]);

  const tenantId = tenant?.id || '00000000-0000-0000-0000-000000000001';

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await InstitutionService.getAffiliations(tenantId);
        setAffiliations(data);
      } catch (err) {
        console.error('Affiliations Load Error:', err);
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
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Board & Statutory Affiliations</h2>
          <p className="text-sm text-slate-500 font-medium mt-1">Registry of educational boards, government licenses, and statutory accreditations.</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all">
          <Plus className="w-4 h-4" /> Add Affiliation
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {loading ? (
          <div className="col-span-full py-20 flex flex-col items-center justify-center gap-4 text-slate-400">
            <RefreshCw className="w-8 h-8 animate-spin" />
            <p className="text-[10px] font-black uppercase tracking-widest">Querying Accreditation Records...</p>
          </div>
        ) : affiliations.length > 0 ? (
          affiliations.map((aff) => (
            <div key={aff.id} className="bg-white rounded-[32px] border border-slate-200 shadow-sm p-8 flex flex-col group hover:shadow-2xl hover:border-indigo-200 transition-all overflow-hidden relative">
               <div className="absolute top-0 right-0 p-8 opacity-[0.03] text-indigo-900">
                  <Award className="w-32 h-32 rotate-12 translate-x-12 -translate-y-12" />
               </div>
               
               <div className="flex items-start justify-between mb-8 relative z-10">
                  <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shadow-inner group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500">
                    <Award className="w-7 h-7" />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[9px] font-black rounded-full uppercase tracking-wider border border-emerald-200">
                      Verified
                    </span>
                    <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all">
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </div>
               </div>

               <div className="flex-1 space-y-6 relative z-10">
                  <div>
                    <h3 className="text-xl font-black text-slate-900 group-hover:text-indigo-600 transition-colors tracking-tight">{aff.board_name}</h3>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Institutional Licensing Body</p>
                  </div>

                  <div className="space-y-4 pt-6 border-t border-slate-50">
                     <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                           <FileText className="w-3.5 h-3.5 text-slate-300" />
                           <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Affiliation ID</span>
                        </div>
                        <span className="text-xs font-bold text-slate-700">{aff.affiliation_number}</span>
                     </div>
                     <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                           <Calendar className="w-3.5 h-3.5 text-slate-300" />
                           <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Renewal Date</span>
                        </div>
                        <span className={`text-xs font-bold ${new Date(aff.valid_upto) < new Date() ? 'text-rose-600' : 'text-slate-700'}`}>
                          {new Date(aff.valid_upto).toLocaleDateString()}
                        </span>
                     </div>
                  </div>
               </div>

               <button className="mt-8 w-full py-4 bg-slate-50 border border-slate-100 text-slate-600 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 transition-all flex items-center justify-center gap-2">
                 View Credentials <ExternalLink className="w-3.5 h-3.5" />
               </button>
            </div>
          ))
        ) : (
          <div className="col-span-full py-24 bg-white rounded-[40px] border border-slate-200 border-dashed flex flex-col items-center justify-center text-center">
             <div className="w-20 h-20 rounded-full bg-slate-50 flex items-center justify-center mb-6">
               <Award className="w-10 h-10 text-slate-200" />
             </div>
             <h3 className="text-xl font-black text-slate-900 tracking-tight">No Accreditations Registered</h3>
             <p className="text-sm text-slate-500 font-medium mt-2 max-w-sm">
               Digitalize your institutional certifications and board affiliations for easier compliance management.
             </p>
             <button className="mt-8 px-8 py-4 bg-indigo-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center gap-2">
               <Plus className="w-4 h-4" /> Registry Certification
             </button>
          </div>
        )}
      </div>

      <div className="bg-slate-50 rounded-[40px] p-10 flex items-center gap-10 border border-slate-100 relative overflow-hidden group">
         <div className="absolute top-0 right-0 p-12 opacity-[0.02] text-indigo-900 pointer-events-none group-hover:scale-110 transition-transform">
            <Shield className="w-64 h-64" />
         </div>
         <div className="w-16 h-16 rounded-3xl bg-white text-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-100 shrink-0">
            <Shield className="w-8 h-8" />
         </div>
         <div className="flex-1">
            <h4 className="text-lg font-black text-slate-900 tracking-tight">Statutory Compliance Health</h4>
            <p className="text-sm text-slate-500 font-medium mt-1">
               System monitors renewal dates for board certifications across all campuses and will trigger alerts 90 days before expiration.
            </p>
         </div>
         <button className="px-6 py-3 bg-white border border-slate-200 text-indigo-600 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-2xs hover:bg-indigo-50 transition-all relative z-10">
            Check Compliance Status
         </button>
      </div>
    </div>
  );
};
