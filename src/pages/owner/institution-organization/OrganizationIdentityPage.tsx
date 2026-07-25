import React from 'react';
import { 
  Fingerprint, 
  Copy, 
  ShieldCheck, 
  Database, 
  Globe, 
  History, 
  Lock, 
  Cpu, 
  ExternalLink,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { Tenant } from '../../../types';

interface OrganizationIdentityPageProps {
  tenant: Tenant;
  onNavigate: (path: string) => void;
}

export const OrganizationIdentityPage: React.FC<OrganizationIdentityPageProps> = ({ tenant, onNavigate }) => {
  const technicalDetails = [
    { label: 'Organization ID', value: tenant?.id || 'APEX_K12_SYSTEM', icon: Fingerprint, isCopyable: true },
    { label: 'Master Tenant ID', value: '00000000-0000-0000-0000-000000000001', icon: Lock, isCopyable: true },
    { label: 'Instance Region', value: 'US-EAST-1 (PROD)', icon: Globe, isCopyable: false },
    { label: 'System Code', value: 'GALAXY-ERP-V1', icon: Cpu, isCopyable: true },
    { label: 'Registered On', value: '2023-11-24', icon: History, isCopyable: false },
    { label: 'Status', value: 'VERIFIED_PRODUCTION', icon: CheckCircle2, isCopyable: false }
  ];

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="max-w-[1400px] mx-auto animate-in fade-in slide-in-from-bottom-2 duration-500 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-200 pb-6 mb-10">
        <div>
           <div className="flex items-center gap-2 text-[10px] font-bold text-indigo-600 uppercase tracking-widest mb-2">
             <div className="w-1.5 h-1.5 rounded-full bg-indigo-600" />
             Work Area: 11
           </div>
           <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Organization Identity</h1>
           <p className="text-slate-500 text-sm mt-1 max-w-xl">Technical identifiers and master data ownership records.</p>
        </div>

        <div className="flex items-center gap-3">
           <div className="px-4 py-2 bg-slate-900 text-white rounded-lg flex items-center gap-2.5 shadow-md">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-[10px] font-bold uppercase tracking-widest">Instance Verified</span>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
        {/* Core Technical Keys */}
        <div className="xl:col-span-7 space-y-10">
           <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8 relative overflow-hidden">
              <h3 className="text-xl font-bold text-slate-900 tracking-tight mb-8">Technical Identification</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                 {technicalDetails.map((detail, idx) => (
                   <div key={idx} className="p-6 bg-slate-50 border border-slate-200 rounded-lg group hover:bg-white hover:shadow-md transition-all">
                      <div className="flex items-center justify-between mb-4">
                         <div className="w-9 h-9 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-400 group-hover:text-indigo-600 transition-colors">
                            <detail.icon className="w-4 h-4" />
                         </div>
                         {detail.isCopyable && (
                           <button 
                             onClick={() => handleCopy(detail.value)}
                             className="p-1.5 text-slate-400 hover:text-indigo-600 transition-colors"
                           >
                              <Copy className="w-3.5 h-3.5" />
                           </button>
                         )}
                      </div>
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1.5">{detail.label}</p>
                      <p className="text-xs font-bold text-slate-900 truncate tracking-tight">{detail.value}</p>
                   </div>
                 ))}
              </div>
           </div>

           <div className="bg-amber-50 border border-amber-100 rounded-xl p-8 flex gap-6 items-start relative overflow-hidden group">
              <div className="w-12 h-12 rounded-lg bg-white flex items-center justify-center text-amber-500 shadow-sm shrink-0 border border-amber-100">
                 <AlertTriangle className="w-6 h-6" />
              </div>
              <div className="space-y-3">
                 <h4 className="text-lg font-bold text-amber-900 tracking-tight">Security Protocol Notice</h4>
                 <p className="text-sm font-medium text-amber-800 leading-relaxed max-w-2xl">
                    Master Identity identifiers are critical system keys. Do not share these keys outside of authorized technical operations.
                 </p>
                 <div className="flex items-center gap-3 pt-1">
                    <button className="text-[10px] font-bold text-amber-900 uppercase tracking-widest hover:underline">Privacy Policy</button>
                    <div className="w-1 h-1 rounded-full bg-amber-200" />
                    <button className="text-[10px] font-bold text-amber-900 uppercase tracking-widest hover:underline">Access Logs</button>
                 </div>
              </div>
           </div>
        </div>

        {/* Data Ownership Panel */}
        <div className="xl:col-span-5 space-y-6 sticky top-32">
           <div className="bg-slate-900 rounded-xl p-8 text-white shadow-xl relative overflow-hidden flex flex-col h-full border border-slate-800">
              <div className="relative z-10 flex-1">
                 <div className="flex items-center gap-3 mb-10">
                    <Database className="w-5 h-5 text-indigo-400" />
                    <h3 className="text-sm font-bold uppercase tracking-widest">Master Data Sovereignty</h3>
                 </div>
                 
                 <div className="space-y-8">
                    <div>
                       <label className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block mb-3">Ownership Model</label>
                       <div className="p-4 bg-white/5 rounded-lg border border-white/5 flex items-center justify-between">
                          <span className="text-sm font-bold">Institutional Sovereignty</span>
                          <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 rounded text-[9px] font-bold uppercase tracking-widest border border-emerald-500/20">Verified</span>
                       </div>
                    </div>

                    <div>
                       <label className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block mb-3">Data Residency</label>
                       <div className="flex items-center gap-4 p-1">
                          <div className="w-10 h-10 rounded-lg bg-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0 border border-white/5">
                             <Globe className="w-5 h-5" />
                          </div>
                          <div>
                             <p className="text-sm font-bold text-white">United States Cluster</p>
                             <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Local Law Compliant</p>
                          </div>
                       </div>
                    </div>
                 </div>
              </div>
              
              <div className="mt-12 pt-8 border-t border-white/5">
                 <button className="w-full py-4 bg-white text-slate-900 rounded-lg text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-2.5 shadow-lg hover:bg-slate-100 transition-all active:scale-[0.98]">
                    Technical Report <ExternalLink className="w-4 h-4" />
                 </button>
              </div>

              <div className="absolute -bottom-6 -right-6 opacity-5 pointer-events-none">
                 <Database className="w-48 h-48 rotate-12" />
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};
