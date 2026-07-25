import React, { useState, useEffect } from 'react';
import { History, Search, Filter, Clock, UserCheck, Activity, Shield, Download, RefreshCw } from 'lucide-react';
import { Tenant } from '../../../types';

interface AuditHistoryPageProps {
  tenant: Tenant;
}

export const AuditHistoryPage: React.FC<AuditHistoryPageProps> = ({ tenant }) => {
  const [loading, setLoading] = useState(true);
  const [logs, setLogs] = useState<any[]>([]);
  const effectiveTenantId = tenant?.id || '00000000-0000-0000-0000-000000000001';

  const loadLogs = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/gateway/v1/organizations/audit-logs', {
        headers: { 'x-tenant-id': effectiveTenantId }
      });
      if (response.ok) {
        const result = await response.json();
        if (result.success) setLogs(result.data || []);
      }
    } catch (err) {
      console.error('Error loading audit logs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLogs();
  }, [effectiveTenantId]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">System Audit History</h2>
          <p className="text-sm text-slate-500 font-medium mt-1">Immutable trail of institutional modifications and security events.</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={loadLogs} className="p-2.5 bg-white border border-slate-200 rounded-2xl text-slate-500 hover:text-indigo-600 hover:border-indigo-200 transition-all shadow-2xs">
            <RefreshCw className="w-4 h-4" />
          </button>
          <button className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-2xl text-xs font-bold uppercase tracking-wider shadow-sm hover:bg-slate-50 transition-all">
            <Download className="w-4 h-4" /> Export Logs
          </button>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
         <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
            <div className="flex items-center gap-4">
               <div className="relative group">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                  <input type="text" placeholder="Filter by user or event..." className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-[10px] font-bold uppercase tracking-wider w-64 outline-none focus:ring-4 focus:ring-indigo-500/5 transition-all" />
               </div>
            </div>
            <div className="flex items-center gap-2">
               <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Retention: 365 Days</span>
               <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            </div>
         </div>

         <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
               <thead className="bg-slate-50/80">
                  <tr>
                     <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-slate-100">Event Context</th>
                     <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-slate-100">Action & Detail</th>
                     <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-slate-100">Performer</th>
                     <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-slate-100 text-right">Timestamp</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-50">
                  {loading ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-20 text-center">
                         <div className="flex flex-col items-center justify-center text-slate-400">
                            <Activity className="w-8 h-8 animate-spin mb-4" />
                            <p className="text-xs font-bold uppercase tracking-widest">Querying Audit Database...</p>
                         </div>
                      </td>
                    </tr>
                  ) : logs.length > 0 ? (
                    logs.map((log, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/50 transition-colors group">
                        <td className="px-6 py-4">
                           <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shadow-2xs group-hover:scale-110 transition-transform">
                                 <Shield className="w-4 h-4" />
                              </div>
                              <span className="text-xs font-bold text-indigo-600 tracking-tight uppercase">{log.event_type?.replace(/_/g, ' ')}</span>
                           </div>
                        </td>
                        <td className="px-6 py-4">
                           <p className="text-xs font-bold text-slate-800">{log.details}</p>
                           <p className="text-[10px] text-slate-400 font-medium mt-0.5 uppercase tracking-tight">Scope: Organization Root</p>
                        </td>
                        <td className="px-6 py-4">
                           <div className="flex items-center gap-2">
                              <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-[10px] text-slate-500 font-bold">
                                 {log.performer_name?.[0] || 'S'}
                              </div>
                              <span className="text-xs font-bold text-slate-700">{log.performer_name || 'System Auto'}</span>
                           </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                           <p className="text-xs font-bold text-slate-900">{new Date(log.created_at).toLocaleDateString()}</p>
                           <p className="text-[10px] text-slate-400 font-medium uppercase tracking-tight">{new Date(log.created_at).toLocaleTimeString()}</p>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="px-6 py-20 text-center text-slate-400 font-bold uppercase tracking-widest text-xs">
                        No audit records found
                      </td>
                    </tr>
                  )}
               </tbody>
            </table>
         </div>
      </div>
    </div>
  );
};
