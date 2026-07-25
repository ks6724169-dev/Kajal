import React, { useState } from 'react';
import { Settings, Shield, Clock, Globe, Save, RefreshCw, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Tenant } from '../../../types';

interface SettingsPageProps {
  tenant: Tenant;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({ tenant }) => {
  const [saving, setSaving] = useState(false);
  const [settingsForm, setSettingsForm] = useState({
    operationMode: 'Multi-Campus Network',
    campusCodePrefix: 'CMP',
    departmentCodePrefix: 'DPT',
    divisionCodePrefix: 'DIV',
    timezone: 'Asia/Kolkata',
    dateFormat: 'DD/MM/YYYY',
    multiCampusEnabled: true,
    rlsStrictMode: true
  });

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
    }, 1000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Module Configuration</h2>
          <p className="text-sm text-slate-500 font-medium mt-1">Global preferences for Module 01 operations.</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white rounded-2xl text-xs font-bold uppercase tracking-wider shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all disabled:opacity-50"
        >
          {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {saving ? 'Applying...' : 'Save Settings'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
         <div className="md:col-span-2 space-y-6">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
               <div className="p-6 border-b border-slate-100 bg-slate-50/30">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <Globe className="w-4 h-4 text-indigo-600" /> Operational Behavior
                  </h3>
               </div>
               <div className="p-6 space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Network Architecture</label>
                    <select 
                      value={settingsForm.operationMode}
                      onChange={e => setSettingsForm({...settingsForm, operationMode: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
                    >
                      <option>Single Campus Model</option>
                      <option>Multi-Campus Network</option>
                      <option>Federated Institutions</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                     <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Campus ID Prefix</label>
                        <input 
                          type="text" 
                          value={settingsForm.campusCodePrefix}
                          onChange={e => setSettingsForm({...settingsForm, campusCodePrefix: e.target.value})}
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-indigo-500/20" 
                        />
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Dept ID Prefix</label>
                        <input 
                          type="text" 
                          value={settingsForm.departmentCodePrefix}
                          onChange={e => setSettingsForm({...settingsForm, departmentCodePrefix: e.target.value})}
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-indigo-500/20" 
                        />
                     </div>
                  </div>
               </div>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
               <div className="p-6 border-b border-slate-100 bg-slate-50/30">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <Clock className="w-4 h-4 text-emerald-600" /> Localization & Standards
                  </h3>
               </div>
               <div className="p-6 space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Timezone</label>
                      <select className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-indigo-500/20">
                        <option>Asia/Kolkata (IST)</option>
                        <option>UTC (GMT)</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Date Format</label>
                      <select className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-indigo-500/20">
                        <option>DD/MM/YYYY</option>
                        <option>MM/DD/YYYY</option>
                        <option>YYYY-MM-DD</option>
                      </select>
                    </div>
                  </div>
               </div>
            </div>
         </div>

         <div className="space-y-6">
            <div className="bg-indigo-600 rounded-3xl p-6 text-white shadow-xl shadow-indigo-100 relative overflow-hidden group">
               <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-50 pointer-events-none" />
               <Shield className="w-12 h-12 text-white/20 mb-4 group-hover:rotate-12 transition-transform" />
               <h3 className="text-sm font-bold uppercase tracking-widest mb-2">Strict RLS Mode</h3>
               <p className="text-xs text-indigo-100 font-medium leading-relaxed mb-6">
                 When enabled, database policies will strictly block any cross-tenant query even if application logic fails.
               </p>
               <div className="flex items-center justify-between bg-white/10 p-3 rounded-2xl border border-white/20">
                  <span className="text-[10px] font-bold uppercase tracking-widest">Enable Lockdown</span>
                  <div className="w-10 h-5 bg-emerald-400 rounded-full flex items-center justify-end px-1 cursor-pointer shadow-inner">
                     <div className="w-3 h-3 bg-white rounded-full shadow-sm" />
                  </div>
               </div>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4">
               <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-50 pb-2 flex items-center justify-between">
                  System Health <CheckCircle2 className="w-3 h-3 text-emerald-500" />
               </h3>
               <div className="space-y-3">
                  <div className="flex items-center justify-between">
                     <span className="text-xs text-slate-500 font-medium">API Connectivity</span>
                     <span className="text-[10px] font-bold text-emerald-600 uppercase">Excellent</span>
                  </div>
                  <div className="flex items-center justify-between">
                     <span className="text-xs text-slate-500 font-medium">DB Latency</span>
                     <span className="text-[10px] font-bold text-emerald-600 uppercase">24ms</span>
                  </div>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};
