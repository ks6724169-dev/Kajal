import React from 'react';
import { ArrowLeft, Building2, BookOpen, Users, Award, Wallet, MapPin, MessageSquare, Sparkles, Clock3 } from 'lucide-react';

interface WorkspaceComingSoonPageProps {
  workspaceId: string;
  onNavigate: (path: string) => void;
}

const WORKSPACES: Record<string, { title: string; description: string; icon: React.ElementType }> = {
  'admin-governance': { title: 'Institution Administration & Governance', description: 'Institution identity, campus network, governance, compliance, security and system administration.', icon: Building2 },
  'ws-academics': { title: 'Academic & Curriculum Management', description: 'Curriculum, syllabus, academic calendar, scheduling and faculty structure.', icon: BookOpen },
  'ws-student': { title: 'Student Lifecycle & Wellbeing', description: 'Admissions, enrollment, student records, attendance, conduct and student support.', icon: Users },
  'ws-examination': { title: 'Assessment, Examination & Results', description: 'Examination planning, marks, grading, report cards and academic results.', icon: Award },
  'ws-finance': { title: 'Finance, HR & Resource Management', description: 'Fees, payroll, staff administration, accounting, budgeting and resources.', icon: Wallet },
  'ws-campus': { title: 'Campus Services & Infrastructure', description: 'Assets, procurement, transport, fleet, hostel, facilities and maintenance.', icon: MapPin },
  'ws-communication': { title: 'Communication, Engagement & Collaboration', description: 'Announcements, emergency broadcasts, parent engagement and community communication.', icon: MessageSquare },
  'ws-intelligence': { title: 'Intelligence, Analytics, Reporting & AI', description: 'Executive dashboards, business intelligence, reporting and AI-powered insights.', icon: Sparkles },
};

export const WorkspaceComingSoonPage: React.FC<WorkspaceComingSoonPageProps> = ({ workspaceId, onNavigate }) => {
  const workspace = WORKSPACES[workspaceId] || WORKSPACES['admin-governance'];
  const Icon = workspace.icon;

  return (
    <main className="min-h-[calc(100vh-90px)] bg-[#FBFBFD] px-4 py-8 sm:px-8 lg:px-12">
      <div className="mx-auto flex min-h-[70vh] max-w-5xl flex-col justify-center">
        <button onClick={() => onNavigate('dashboard')} className="mb-8 inline-flex w-fit items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-600 shadow-sm transition hover:bg-slate-50 hover:text-indigo-600">
          <ArrowLeft className="h-4 w-4" /> Back to Executive Overview
        </button>

        <section className="overflow-hidden rounded-[28px] border border-slate-200/80 bg-white shadow-xl shadow-slate-200/30">
          <div className="bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 px-6 py-12 text-white sm:px-12 sm:py-16">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-3xl border border-white/10 bg-white/10 shadow-inner backdrop-blur">
                <Icon className="h-10 w-10 text-indigo-200" />
              </div>
              <div>
                <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-amber-300/20 bg-amber-300/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-amber-200">
                  <Clock3 className="h-3.5 w-3.5" /> Workspace Foundation
                </div>
                <h1 className="text-2xl font-black tracking-tight sm:text-4xl">{workspace.title}</h1>
                <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300 sm:text-base">{workspace.description}</p>
              </div>
            </div>
          </div>

          <div className="px-6 py-10 sm:px-12 sm:py-12">
            <div className="max-w-3xl">
              <h2 className="text-xl font-black tracking-tight text-slate-900 sm:text-2xl">Workspace is ready for implementation</h2>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                This dedicated Workspace page is now established as the single entry point for this area of Galaxy ERP. The complete operational tools and workflows will be implemented directly inside this Workspace in the next development phase.
              </p>
            </div>
            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {['Workspace foundation', 'Role-aware access', 'Future tools ready'].map((item) => (
                <div key={item} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-xs font-bold text-slate-700">✓ {item}</div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default WorkspaceComingSoonPage;
