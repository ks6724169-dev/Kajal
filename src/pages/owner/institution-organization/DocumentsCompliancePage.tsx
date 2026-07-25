import React, { useState } from 'react';
import { 
  FileText, 
  Search, 
  Filter, 
  Plus, 
  Download, 
  Eye, 
  Calendar, 
  AlertCircle, 
  CheckCircle2, 
  Clock,
  MoreVertical,
  ShieldCheck,
  ArrowUpRight,
  ChevronRight,
  Lock,
  History
} from 'lucide-react';
import { Tenant } from '../../../types';

interface DocumentsCompliancePageProps {
  tenant: Tenant;
  onNavigate: (path: string) => void;
}

const DOCUMENTS = [
  {
    id: 'doc-1',
    name: 'Institutional Registration Certificate',
    type: 'LEGAL',
    category: 'Registration',
    issueDate: '2010-06-15',
    expiryDate: '2030-06-15',
    status: 'ACTIVE',
    version: 'v2.0',
    issuer: 'State Education Dept'
  },
  {
    id: 'doc-2',
    name: 'Academic Board Affiliation Letter',
    type: 'REGULATORY',
    category: 'Affiliation',
    issueDate: '2025-04-01',
    expiryDate: '2026-03-31',
    status: 'EXPIRING_SOON',
    version: 'v1.1',
    issuer: 'Central Board of Education'
  },
  {
    id: 'doc-3',
    name: 'Campus Fire & Safety NOC',
    type: 'COMPLIANCE',
    category: 'Safety',
    issueDate: '2024-01-10',
    expiryDate: '2025-01-10',
    status: 'EXPIRED',
    version: 'v1.0',
    issuer: 'Municipal Fire Service'
  }
];

export const DocumentsCompliancePage: React.FC<DocumentsCompliancePageProps> = ({ tenant, onNavigate }) => {
  const [activeCategory, setActiveCategory] = useState<'all' | 'legal' | 'regulatory' | 'compliance'>('all');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'EXPIRING_SOON': return 'bg-amber-50 text-amber-600 border-amber-100';
      case 'EXPIRED': return 'bg-rose-50 text-rose-600 border-rose-100';
      default: return 'bg-slate-50 text-slate-500 border-slate-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ACTIVE': return <CheckCircle2 className="w-3 h-3" />;
      case 'EXPIRING_SOON': return <Clock className="w-3 h-3" />;
      case 'EXPIRED': return <AlertCircle className="w-3 h-3" />;
      default: return <Clock className="w-3 h-3" />;
    }
  };

  return (
    <div className="max-w-[1400px] mx-auto animate-in fade-in slide-in-from-bottom-2 duration-500 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-200 pb-6 mb-10">
        <div>
           <div className="flex items-center gap-2 text-[10px] font-bold text-indigo-600 uppercase tracking-widest mb-2">
             <div className="w-1.5 h-1.5 rounded-full bg-indigo-600" />
             Work Area: 08
           </div>
           <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Documents & Compliance</h1>
           <p className="text-slate-500 text-sm mt-1 max-w-xl">Centralized institutional vault for legal and regulatory compliance.</p>
        </div>

        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white rounded-lg text-xs font-semibold shadow-sm hover:bg-indigo-700 transition-all active:scale-[0.98]">
            <Plus className="w-4 h-4" /> Upload Document
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
        {/* Main Workspace */}
        <div className="xl:col-span-8 space-y-6">
           {/* Filters & Search */}
           <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm">
              <div className="flex items-center gap-1 overflow-x-auto no-scrollbar p-1 bg-slate-50 rounded-lg border border-slate-100">
                 {['all', 'legal', 'regulatory', 'compliance'].map(cat => (
                   <button 
                     key={cat}
                     onClick={() => setActiveCategory(cat as any)}
                     className={`px-4 py-2 rounded text-[9px] font-bold uppercase tracking-widest transition-all ${
                       activeCategory === cat ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-400 hover:text-slate-600'
                     }`}
                   >
                      {cat}
                   </button>
                 ))}
              </div>
              <div className="relative group w-full md:w-64">
                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                 <input 
                   type="text" 
                   placeholder="Search vault..."
                   className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-[10px] font-bold uppercase tracking-widest outline-none focus:ring-4 focus:ring-indigo-50 focus:bg-white focus:border-indigo-500 transition-all"
                 />
              </div>
           </div>

           {/* Documents List */}
           <div className="space-y-3">
              {DOCUMENTS.map(doc => (
                <div key={doc.id} className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 flex flex-col sm:flex-row items-center gap-6 group hover:shadow-md hover:border-indigo-200 transition-all">
                   <div className="w-14 h-14 rounded-lg bg-slate-50 border border-slate-100 shadow-sm flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform text-slate-200">
                      <FileText className="w-8 h-8" />
                   </div>

                   <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                         <h3 className="text-md font-bold text-slate-900 tracking-tight truncate">{doc.name}</h3>
                         <span className={`px-2 py-0.5 rounded border text-[8px] font-bold uppercase tracking-widest flex items-center gap-1.5 shrink-0 ${getStatusColor(doc.status)}`}>
                            {getStatusIcon(doc.status)} {doc.status.replace('_', ' ')}
                         </span>
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                         <div className="flex items-center gap-2">
                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Issuer:</span>
                            <span className="text-[11px] font-semibold text-slate-600">{doc.issuer}</span>
                         </div>
                         <div className="flex items-center gap-2">
                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Expiry:</span>
                            <span className="text-[11px] font-bold text-slate-900">{doc.expiryDate}</span>
                         </div>
                         <div className="flex items-center gap-2">
                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Version:</span>
                            <span className="text-[11px] font-bold text-indigo-600">{doc.version}</span>
                         </div>
                      </div>
                   </div>

                   <div className="flex items-center gap-2 shrink-0 border-l border-slate-100 pl-6 h-10 self-center">
                      <button className="p-2 bg-slate-50 hover:bg-white hover:shadow-sm text-slate-400 hover:text-indigo-600 rounded-lg transition-all border border-transparent hover:border-slate-200">
                         <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-2 bg-slate-50 hover:bg-white hover:shadow-sm text-slate-400 hover:text-indigo-600 rounded-lg transition-all border border-transparent hover:border-slate-200">
                         <Download className="w-4 h-4" />
                      </button>
                      <button className="p-2 bg-slate-50 hover:bg-white hover:shadow-sm text-slate-400 hover:text-slate-900 rounded-lg transition-all border border-transparent hover:border-slate-200">
                         <MoreVertical className="w-4 h-4" />
                      </button>
                   </div>
                </div>
              ))}
           </div>
        </div>

        {/* Info & Stats Sidebar */}
        <div className="xl:col-span-4 space-y-6 sticky top-32">
           <div className="bg-slate-900 rounded-xl p-8 text-white shadow-lg relative overflow-hidden border border-slate-800">
              <div className="relative z-10">
                 <div className="flex items-center gap-3 mb-8">
                    <ShieldCheck className="w-5 h-5 text-indigo-400" />
                    <h3 className="text-sm font-bold uppercase tracking-widest">Compliance Health</h3>
                 </div>
                 
                 <div className="space-y-6">
                    <div>
                       <div className="flex items-center justify-between mb-2">
                          <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Audit Score</span>
                          <span className="text-[9px] font-bold text-emerald-400 uppercase tracking-widest">High (85%)</span>
                       </div>
                       <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                          <div className="h-full w-[85%] bg-indigo-500" />
                       </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                       <div className="p-4 bg-white/5 rounded-lg border border-white/5">
                          <p className="text-xl font-bold text-white">12</p>
                          <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-1">Certs</p>
                       </div>
                       <div className="p-4 bg-white/5 rounded-lg border border-white/5">
                          <p className="text-xl font-bold text-rose-400">02</p>
                          <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-1">Pending</p>
                       </div>
                    </div>
                 </div>

                 <button className="w-full mt-10 py-3 bg-white/10 hover:bg-white/20 transition-all rounded-lg text-[10px] font-bold uppercase tracking-widest border border-white/5 flex items-center justify-center gap-2 group">
                    Audit History <History className="w-4 h-4" />
                 </button>
              </div>
              
              <div className="absolute -bottom-6 -right-6 opacity-[0.03] pointer-events-none">
                 <Lock className="w-48 h-48 rotate-12" />
              </div>
           </div>

           <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
              <div className="flex items-center gap-3 mb-6">
                 <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100">
                    <AlertCircle className="w-4 h-4" />
                 </div>
                 <h4 className="text-sm font-bold text-slate-900 tracking-tight">Risk Indicators</h4>
              </div>
              <div className="space-y-4">
                 <div className="flex gap-3 p-3 hover:bg-slate-50 rounded-lg transition-all cursor-pointer group border border-transparent hover:border-slate-100">
                    <div className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                    <div>
                       <p className="text-[11px] font-semibold text-slate-700 leading-tight mb-1">Fire Safety NOC expired</p>
                       <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">3 days ago</p>
                    </div>
                 </div>
                 <div className="flex gap-3 p-3 hover:bg-slate-50 rounded-lg transition-all cursor-pointer group border border-transparent hover:border-slate-100">
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                    <div>
                       <p className="text-[11px] font-semibold text-slate-700 leading-tight mb-1">Renewal due in 45 days</p>
                       <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">5 days ago</p>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};
