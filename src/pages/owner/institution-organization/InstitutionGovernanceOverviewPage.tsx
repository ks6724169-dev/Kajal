import React from 'react';
import { Activity, ArrowRight, Building2, CheckCircle2, FileCheck2, LockKeyhole, ShieldCheck, UsersRound } from 'lucide-react';
import { Tenant } from '../../../types';

interface InstitutionGovernanceOverviewPageProps {
  tenant: Tenant;
  onNavigate: (path: string) => void;
}

const controlAreas = [
  { id: 'identity-governance', title: 'Institution Identity & Governance', description: 'Core institutional identity, legal credentials, official contacts and governance records.', icon: Building2, status: 'Ready' },
  { id: 'campus-hierarchy', title: 'Campus & Organization Management', description: 'Multi-campus structure, organizational hierarchy and institutional units.', icon: UsersRound, status: 'Ready' },
  { id: 'leadership-roles', title: 'Executive Authority & RBAC', description: 'Leadership authority, role permissions and delegated access controls.', icon: LockKeyhole, status: 'Secure' },
  { id: 'compliance-policy', title: 'Compliance, Legal & Accreditation', description: 'Compliance posture, regulatory records, accreditation and audit evidence.', icon: FileCheck2, status: 'Monitor' },
  { id: 'system-configuration', title: 'System Configuration & Integrations', description: 'Institution-wide parameters, integrations, APIs and operational controls.', icon: Activity, status: 'Configure' },
  { id: 'emergency-command', title: 'Emergency & Incident Command', description: 'Critical incident response, emergency controls and institutional alerts.', icon: ShieldCheck, status: 'Standby' },
];

export const InstitutionGovernanceOverviewPage: React.FC<InstitutionGovernanceOverviewPageProps> = ({ tenant, onNavigate }) => {
  const institutionName = (tenant as any)?.name || 'Your Institution';

  return (
    <main className="min-h-full bg-[#FBFBFD] px-4 py-5 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1600px] space-y-6">
        <section className="overflow-hidden rounded-[28px] border border-slate-200/80 bg-white shadow-sm">
          <div className="relative bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 px-6 py-8 text-white sm:px-9 sm:py-10">
            <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-indigo-500/10 blur-3xl" />
            <div className="relative flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
              <div className="max-w-3xl">
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.16em] text-indigo-200">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Governance Command Center
                </div>
                <h1 className="text-2xl font-black tracking-tight sm:text-4xl">Institution Administration & Governance</h1>
                <p className="mt-3 text-sm leading-6 text-slate-300 sm:text-base">A single command surface for governing {institutionName}, campuses, leadership authority, compliance, system controls and emergency readiness.</p>
              </div>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {[
                  ['Campuses', '—'],
                  ['Governance', 'Active'],
                  ['Security', 'Protected'],
                  ['Incidents', '0 Open'],
                ].map(([label, value]) => (
                  <div key={label} className="min-w-[105px] rounded-2xl border border-white/10 bg-white/5 px-3 py-3 backdrop-blur">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{label}</p>
                    <p className="mt-1 text-sm font-black text-white">{value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid gap-3 border-t border-slate-100 bg-white p-4 sm:grid-cols-3 sm:p-5">
            {[
              ['Governance health', 'Institution controls are operational'],
              ['Access posture', 'Role-aware administration enabled'],
              ['Audit readiness', 'Activity monitoring available'],
            ].map(([title, detail]) => (
              <div key={title} className="flex items-start gap-3 rounded-2xl border border-slate-100 bg-slate-50/70 p-4">
                <div className="mt-0.5 h-2.5 w-2.5 shrink-0 rounded-full bg-emerald-500 ring-4 ring-emerald-100" />
                <div><p className="text-xs font-black text-slate-800">{title}</p><p className="mt-1 text-[11px] leading-5 text-slate-500">{detail}</p></div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <div className="mb-4 flex items-end justify-between gap-4 px-1">
            <div><h2 className="text-lg font-black tracking-tight text-slate-900 sm:text-xl">Institution Control Areas</h2><p className="mt-1 text-xs text-slate-500">Open an area to manage its complete operational workflow.</p></div>
            <span className="hidden rounded-full bg-slate-100 px-3 py-1.5 text-[10px] font-black text-slate-500 sm:block">6 CONTROL AREAS</span>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {controlAreas.map(({ id, title, description, icon: Icon, status }) => (
              <button key={id} onClick={() => onNavigate(`workspace/admin-governance/${id}`)} className="group rounded-[22px] border border-slate-200/80 bg-white p-5 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-lg hover:shadow-indigo-100/40">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 transition group-hover:bg-indigo-600 group-hover:text-white"><Icon className="h-5 w-5" /></div>
                  <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[9px] font-black uppercase tracking-wider text-slate-500">{status}</span>
                </div>
                <h3 className="mt-5 text-sm font-black text-slate-900">{title}</h3>
                <p className="mt-2 min-h-[48px] text-xs leading-5 text-slate-500">{description}</p>
                <div className="mt-5 flex items-center gap-1.5 text-xs font-black text-indigo-600">Open control area <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-1" /></div>
              </button>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
};

export default InstitutionGovernanceOverviewPage;
