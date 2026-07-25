import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  Plus, 
  Search, 
  UserCheck, 
  Lock, 
  Key, 
  ChevronRight,
  RefreshCw,
  MoreHorizontal,
  LayoutGrid,
  List,
  Fingerprint,
  ShieldAlert,
  ArrowRight,
  CheckCircle2,
  Users
} from 'lucide-react';
import { Tenant } from '../../../types';
import { motion, AnimatePresence } from 'motion/react';

interface AdministrationPageProps {
  tenant: Tenant;
  onNavigate: (path: string) => void;
}

export const AdministrationPage: React.FC<AdministrationPageProps> = ({ tenant, onNavigate }) => {
  const [loading, setLoading] = useState(true);

  const adminRoles = [
    { id: '1', role: 'Owner / Super Admin', userCount: 1, access: 'FULL_CONTROL', status: 'VERIFIED' },
    { id: '2', role: 'Principal', userCount: 4, access: 'CAMPUS_SCOPE', status: 'ACTIVE' },
    { id: '3', role: 'Academic Coordinator', userCount: 12, access: 'DEPT_SCOPE', status: 'ACTIVE' },
    { id: '4', role: 'Finance Executive', userCount: 2, access: 'FINANCIAL_CORE', status: 'VERIFIED' },
    { id: '5', role: 'IT Administrator', userCount: 1, access: 'INFRA_CONTROL', status: 'ACTIVE' },
  ];

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-32 px-4 sm:px-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Section Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
        <div>
           <div className="flex items-center gap-3 text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em] mb-3">
             <div className="w-2 h-2 rounded-full bg-indigo-600" />
             Access Control & Policy
           </div>
           <h1 className="text-4xl font-black text-slate-900 tracking-tighter">Administration Console</h1>
           <p className="text-slate-500 font-medium mt-2 max-w-lg">
             Manage administrative role assignments, security policy enforcements, and institutional access protocols.
           </p>
        </div>

        <div className="flex flex-wrap items-center gap-4">
           <button className="flex items-center gap-3 px-8 py-5 bg-indigo-600 text-white rounded-[24px] text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl shadow-indigo-200 hover:bg-indigo-700 hover:translate-y-[-2px] transition-all">
            <Plus className="w-4 h-4" /> Provision New Role
          </button>
        </div>
      </div>

      {loading ? (
        <div className="py-32 flex flex-col items-center justify-center text-slate-400">
          <RefreshCw className="w-12 h-12 animate-spin mb-6 text-indigo-600" />
          <p className="text-[10px] font-black uppercase tracking-[0.2em]">Synchronizing Security Layers...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
           {/* Roles Column */}
           <div className="lg:col-span-8 space-y-8">
              <div className="flex items-center justify-between px-4">
                 <h3 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-3">
                   <Lock className="w-5 h-5 text-indigo-600" />
                   Administrative Roles
                 </h3>
                 <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    <Users className="w-3.5 h-3.5" />
                    20 Active Principals
                 </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {adminRoles.map((role, idx) => (
                  <motion.div 
                    key={role.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.1 }}
                    className="bg-white rounded-[32px] border border-slate-100 shadow-xl shadow-slate-200/40 p-8 hover:shadow-2xl hover:translate-y-[-4px] transition-all group overflow-hidden relative"
                  >
                    <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none group-hover:scale-125 transition-transform">
                       <Shield className="w-32 h-32" />
                    </div>
                    
                    <div className="relative z-10">
                       <div className="flex items-center justify-between mb-6">
                          <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-black shadow-lg">
                             <Fingerprint className="w-6 h-6 text-indigo-400" />
                          </div>
                          <span className={`text-[9px] font-black uppercase tracking-[0.2em] px-2.5 py-1 rounded-full ${
                             role.status === 'VERIFIED' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-blue-50 text-blue-600 border border-blue-100'
                          }`}>
                             {role.status}
                          </span>
                       </div>
                       
                       <h4 className="text-lg font-black text-slate-900 tracking-tight mb-1">{role.role}</h4>
                       <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">{role.access.replace('_', ' ')}</p>
                       
                       <div className="mt-8 pt-6 border-t border-slate-50 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                             <Users className="w-4 h-4 text-slate-400" />
                             <span className="text-sm font-black text-slate-900">{role.userCount}</span>
                             <span className="text-[10px] font-bold text-slate-400 uppercase">Users</span>
                          </div>
                          <button className="p-2 text-slate-300 hover:text-slate-900 transition-colors">
                             <ArrowRight className="w-5 h-5" />
                          </button>
                       </div>
                    </div>
                  </motion.div>
                ))}
              </div>
           </div>

           {/* Policy & Security Column */}
           <div className="lg:col-span-4 space-y-8">
              <div className="bg-slate-900 rounded-[40px] p-10 text-white relative overflow-hidden shadow-2xl">
                 <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none">
                    <ShieldAlert className="w-48 h-48 rotate-12" />
                 </div>
                 <h3 className="text-2xl font-black tracking-tighter mb-4">Security Policy</h3>
                 <p className="text-slate-400 text-sm font-medium leading-relaxed mb-8">
                   Administrative access is governed by zero-trust protocols. All sessions are monitored for behavioral anomalies.
                 </p>
                 
                 <div className="space-y-6">
                    {[
                      { label: '2FA Enforcement', active: true },
                      { label: 'IP Whitelisting', active: false },
                      { label: 'Audit Logging', active: true },
                      { label: 'Session Timeout', active: true },
                    ].map((policy, i) => (
                      <div key={i} className="flex items-center justify-between py-2 border-b border-white/5">
                        <span className="text-xs font-black text-slate-200 uppercase tracking-widest">{policy.label}</span>
                        <div className={`w-8 h-4 rounded-full relative transition-colors ${policy.active ? 'bg-indigo-600' : 'bg-slate-700'}`}>
                           <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all ${policy.active ? 'left-4.5' : 'left-0.5'}`} />
                        </div>
                      </div>
                    ))}
                 </div>
              </div>

              <div className="bg-white rounded-[40px] border border-slate-100 shadow-xl p-10 flex flex-col items-center text-center">
                 <div className="w-20 h-20 rounded-full bg-emerald-50 flex items-center justify-center mb-6">
                    <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                 </div>
                 <h4 className="text-lg font-black text-slate-900 tracking-tight">Compliance Status</h4>
                 <p className="text-[11px] font-black text-emerald-600 uppercase tracking-[0.2em] mt-2">Enterprise Ready</p>
                 <p className="text-xs text-slate-500 font-medium mt-4 leading-relaxed">
                   Your institutional instance meets the highest standards for data security and functional isolation.
                 </p>
                 <button className="mt-8 w-full py-4 bg-slate-50 border border-slate-100 text-slate-600 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-slate-100 transition-all">
                    Download Report
                 </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};
