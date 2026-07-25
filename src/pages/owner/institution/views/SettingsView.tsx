import React, { useState } from 'react';
import { Settings, Shield, Clock, Globe, Save, RefreshCw, CheckCircle2, Lock, LayoutGrid, Zap } from 'lucide-react';
import { Tenant } from '../../../../types';

interface SettingsViewProps {
  tenant: Tenant;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ tenant }) => {
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    operationMode: 'Multi-Campus Network',
    campusPrefix: 'CMP',
    strictRls: true,
    realtimeSync: true,
    timezone: 'Asia/Kolkata',
    dateFormat: 'DD/MM/YYYY'
  });

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => setSaving(false), 1000);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-10 animate-in fade-in duration-700">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Module Configuration</h2>
          <p className="text-sm text-slate-500 font-medium mt-1">Institutional-wide rules and operational defaults.</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-8 py-3 bg-indigo-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all disabled:opacity-50"
        >
          {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {saving ? 'Synchronizing...' : 'Save Configuration'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
         <div className="lg:col-span-2 space-y-8">
            {/* Global Rules */}
            <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm overflow-hidden">
               <div className="p-8 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <Globe className="w-4 h-4 text-indigo-600" /> Operational Framework
                  </h3>
                  <Zap className="w-4 h-4 text-amber-500 animate-pulse" />
               </div>
               <div className="p-8 space-y-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Network Architecture</label>
                    <div className="grid grid-cols-3 gap-4">
                       {['Single Campus', 'Multi-Campus Network', 'Federated Trust'].map((mode) => (
                         <button 
                          key={mode}
                          onClick={() => setSettings({...settings, operationMode: mode})}
                          className={`px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-tight border transition-all ${
                            settings.operationMode === mode 
                            ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-100' 
                            : 'bg-white text-slate-500 border-slate-200 hover:border-indigo-300'
                          }`}
                         >
                           {mode}
                         </button>
                       ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-8 pt-8 border-t border-slate-50">
                     <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Campus ID Prefix</label>
                        <input 
                          type="text" 
                          value={settings.campusPrefix}
                          onChange={e => setSettings({...settings, campusPrefix: e.target.value.toUpperCase()})}
                          className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 focus:bg-white transition-all" 
                        />
                     </div>
                     <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Reporting Timezone</label>
                        <select className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 focus:bg-white transition-all appearance-none cursor-pointer">
                          <option>Asia/Kolkata (IST)</option>
                          <option>UTC (GMT)</option>
                        </select>
                     </div>
                  </div>
               </div>
            </div>

            {/* Feature Flags */}
            <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm p-8 space-y-6">
               <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 border-b border-slate-50 pb-4">
                  <LayoutGrid className="w-4 h-4 text-emerald-600" /> Platform Interactivity
               </h3>
               <div className="space-y-6">
                  {[
                    { key: 'strictRls', label: 'Strict Multi-Tenant RLS', desc: 'Enforce cryptographic isolation at the database layer (Supabase Policies).', icon: Lock },
                    { key: 'realtimeSync', label: 'Real-time WebSocket Sync', desc: 'Auto-refresh UI across all connected owner devices on data changes.', icon: Zap },
                  ].map((flag) => (
                    <div key={flag.key} className="flex items-center justify-between group p-2 hover:bg-slate-50 rounded-2xl transition-colors">
                       <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-white group-hover:text-indigo-600 transition-all">
                             <flag.icon className="w-4 h-4" />
                          </div>
                          <div>
                             <p className="text-xs font-black text-slate-900 uppercase tracking-tight">{flag.label}</p>
                             <p className="text-[10px] text-slate-500 font-medium mt-0.5">{flag.desc}</p>
                          </div>
                       </div>
                       <button 
                        onClick={() => setSettings({...settings, [flag.key]: !(settings as any)[flag.key]})}
                        className={`w-12 h-6 rounded-full transition-all relative ${
                          (settings as any)[flag.key] ? 'bg-indigo-600' : 'bg-slate-200'
                        }`}
                       >
                          <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${
                            (settings as any)[flag.key] ? 'right-1' : 'left-1 shadow-sm'
                          }`} />
                       </button>
                    </div>
                  ))}
               </div>
            </div>
         </div>

         <div className="space-y-8">
            <div className="bg-indigo-600 rounded-[32px] p-8 text-white shadow-2xl shadow-indigo-100 relative overflow-hidden group">
               <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-50 pointer-events-none" />
               <Shield className="w-16 h-16 text-white/20 mb-6 group-hover:rotate-12 transition-transform duration-500" />
               <h3 className="text-lg font-black uppercase tracking-widest mb-3">Governance Lockdown</h3>
               <p className="text-xs text-indigo-100 font-medium leading-relaxed mb-8 opacity-80">
                 Changes to core organizational architecture (like deleting a campus) require multi-factor owner verification when Strict Mode is active.
               </p>
               <div className="flex items-center justify-between bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20">
                  <span className="text-[10px] font-black uppercase tracking-widest">Auth Status</span>
                  <div className="flex items-center gap-1.5 text-[9px] font-black text-emerald-300">
                     <CheckCircle2 className="w-3 h-3" /> VERIFIED
                  </div>
               </div>
            </div>

            <div className="bg-slate-50 rounded-[32px] border border-slate-200 p-8 space-y-6">
               <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-200 pb-4">Cluster Health</h4>
               <div className="space-y-4">
                  {[
                    { label: 'Edge Latency', value: '18ms', status: 'Optimal' },
                    { label: 'RLS Filter Accuracy', value: '100%', status: 'Perfect' },
                    { label: 'Auth Bridge', value: 'Active', status: 'Connected' },
                  ].map((stat, i) => (
                    <div key={i} className="flex items-center justify-between">
                       <span className="text-[10px] font-bold text-slate-500 uppercase">{stat.label}</span>
                       <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">{stat.value}</span>
                    </div>
                  ))}
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};
