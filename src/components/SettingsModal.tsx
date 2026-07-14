import React from 'react';
import { Tenant } from '../types';
import { Settings, ShieldCheck, Database, Lock, RefreshCw } from 'lucide-react';

interface SettingsModalProps {
  tenant: Tenant;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ tenant }) => {
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">SaaS Enterprise Settings & Multi-Tenant Audit Logs</h1>
        <p className="text-xs text-slate-500">Configure multi-tenant data isolation, AES-256 encryption, automated cloud backups, and Role-Based Access Control (RBAC).</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Tenant Profile: {tenant.name}</h2>
              <p className="text-xs text-slate-500">Multi-tenant Cloud DB ID: {tenant.id}</p>
            </div>
          </div>
          <div className="text-xs space-y-2 text-slate-700 pt-2 border-t border-slate-100">
            <div><strong>Academic Year:</strong> {tenant.academicYear}</div>
            <div><strong>Currency:</strong> {tenant.currency} (INR)</div>
            <div><strong>Database Cluster:</strong> Primary Asia-Southeast1 (Encrypted)</div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Security & Audit Compliance</h2>
              <p className="text-xs text-slate-500">FERPA, GDPR and SOC-2 Type II Compliant</p>
            </div>
          </div>
          <div className="text-xs space-y-2 text-slate-700 pt-2 border-t border-slate-100">
            <div><strong>Data Encryption:</strong> AES-256 at rest & in transit</div>
            <div><strong>Disaster Recovery:</strong> Hourly automated snapshots</div>
            <div><strong>Audit Logs:</strong> Active & Immutable</div>
          </div>
        </div>
      </div>
    </div>
  );
};
