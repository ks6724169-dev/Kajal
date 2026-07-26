import React from 'react';
import { Shield, Lock, AlertTriangle, Key, Users, CheckCircle, Activity, ArrowLeft } from 'lucide-react';

interface SecurityCenterPageProps {
  onNavigate?: (path: string) => void;
}

export const SecurityCenterPage: React.FC<SecurityCenterPageProps> = ({ onNavigate }) => {
  return (
    <div className="pt-6 px-6 pb-6 max-w-5xl mx-auto space-y-6">
      {/* Security Status Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase tracking-wider">
            <span>Database Authorization</span>
            <Lock className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-lg font-black text-slate-900">Supabase Auth JWT</div>
          <p className="text-[11px] text-slate-500">Tenant claims isolated via Row-Level Security.</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase tracking-wider">
            <span>Active Web Sessions</span>
            <Users className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-lg font-black text-slate-900">1 Verified Session</div>
          <p className="text-[11px] text-slate-500">Encrypted JWT tokens in Secure Cookie storage.</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase tracking-wider">
            <span>Threat Detection</span>
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-lg font-black text-slate-900">0 Alerts</div>
          <p className="text-[11px] text-slate-500">No suspicious IP addresses or failed logins detected.</p>
        </div>
      </div>

      {/* Security Audit Activity Log */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-xs">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-indigo-600" />
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Live Security Audit Log</h2>
          </div>
          <span className="text-xs text-slate-400 font-mono">Real-time Stream</span>
        </div>

        <div className="space-y-3">
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-100 text-indigo-700 rounded-lg">
                <Key className="w-4 h-4" />
              </div>
              <div>
                <p className="font-bold text-slate-800">Database RPC `get_owner_dashboard_stats` Executed</p>
                <p className="text-[11px] text-slate-500">Authenticated Owner Session • Tenant ID: 00000000-0000-0000-0000-000000000001</p>
              </div>
            </div>
            <span className="text-[11px] font-mono text-slate-400">Just now</span>
          </div>

          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-100 text-emerald-700 rounded-lg">
                <Shield className="w-4 h-4" />
              </div>
              <div>
                <p className="font-bold text-slate-800">Migration `020_owner_dashboard.sql` Executed</p>
                <p className="text-[11px] text-slate-500">Applied PostgreSQL tables & schema update</p>
              </div>
            </div>
            <span className="text-[11px] font-mono text-slate-400">20 mins ago</span>
          </div>
        </div>
      </div>
    </div>
  );
};
