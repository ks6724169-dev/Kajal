import React from 'react';
import { Sparkles, ArrowLeft, Building2, ShieldCheck, Clock, Layers, ChevronRight, CheckCircle2 } from 'lucide-react';
import { CORE_WORKSPACES } from './WorkspaceNavStrip';

interface WorkspaceComingSoonProps {
  workspaceId: string;
  workspaceTitle?: string;
  description?: string;
  onNavigate?: (path: string) => void;
}

const WORKSPACE_PLANNED_CAPABILITIES: Record<string, string[]> = {
  'academic-curriculum': [
    'Curriculum & Syllabus Mapping Matrix',
    'Automated Class Timetable & Substitute Resolver',
    'Department Academic Performance Benchmarks',
    'Faculty Workload Allocation & Lesson Plans'
  ],
  'student-lifecycle': [
    'Student Admission & Onboarding Pipeline',
    'Biometric & RFID Attendance Integration',
    'Behavioral & Student Wellbeing Tracking',
    'Medical, Allergy & Emergency Incident Logs'
  ],
  'assessment-exams': [
    'Term Examination & Class Test Scheduler',
    'CBSE / ICSE / IB Gradebook & Assessment Engine',
    'Report Card Generation & Digital Signatures',
    'Student Mark Analytics & Performance Radar'
  ],
  'finance-hr': [
    'Fee Structure & Automated Online Invoicing',
    'Staff Attendance, Leave & Biometric Payroll',
    'Institutional Expense Ledger & Budgeting',
    'Financial Compliance & Tax Audit Reports'
  ],
  'campus-services': [
    'GPS Fleet Tracking & Route Optimization',
    'Hostel Room Allotment & Mess Management',
    'Digital Library Access & ISBN Barcode Scanner',
    'CCTV Security Incident Monitor & Gate Pass'
  ],
  'communication-collaboration': [
    'Parent-Teacher Meeting Scheduler & Portal',
    'Instant Push Notifications & Emergency Circulars',
    'Institutional Event Calendar & Digital Noticeboard',
    'Multi-Campus Messaging & Broadcast Gateway'
  ],
  'intelligence-analytics': [
    'AI Executive Briefings & Daily Summary Engine',
    'Institutional Retention & Enrollment Predictor',
    'Cross-Campus Comparative KPI Dashboards',
    'Automated Compliance & Accreditation Reports'
  ]
};

export const WorkspaceComingSoon: React.FC<WorkspaceComingSoonProps> = ({
  workspaceId,
  workspaceTitle,
  description,
  onNavigate
}) => {
  const meta = CORE_WORKSPACES.find(w => w.id === workspaceId);
  const title = workspaceTitle || meta?.title || 'Core Workspace Module';
  const desc = description || meta?.description || 'Operational capabilities for this workspace are actively scheduled in the system roadmap.';
  const plannedFeatures = WORKSPACE_PLANNED_CAPABILITIES[workspaceId] || [
    'Role-Based Operational Workflows',
    'Real-time Data Integration & Analytics',
    'Institutional Governance & Audit Trails',
    'Automated Notification & Approval Queues'
  ];

  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto space-y-8 animate-fade-in text-left">
      {/* Top Banner */}
      <div className="bg-gradient-to-br from-indigo-900 via-slate-900 to-slate-950 text-white rounded-3xl p-8 md:p-10 shadow-xl border border-indigo-500/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 space-y-4 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/10 border border-indigo-400/20 text-indigo-300 text-xs font-semibold rounded-full">
            <Clock className="w-3.5 h-3.5 text-indigo-400" />
            <span>Workspace Phase 3 Implementation Scheduled</span>
          </div>

          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
            {title}
          </h2>

          <p className="text-slate-300 text-sm leading-relaxed">
            {desc}
          </p>

          {onNavigate && (
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={() => onNavigate('/owner/workspaces/admin-governance')}
                className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl transition-all shadow-md shadow-indigo-600/20 flex items-center gap-2 cursor-pointer"
              >
                <Building2 className="w-4 h-4" />
                <span>Open Administration & Governance</span>
              </button>

              <button
                onClick={() => onNavigate('dashboard')}
                className="px-4 py-2.5 bg-white/10 hover:bg-white/15 text-white border border-white/10 text-xs font-semibold rounded-xl transition-all flex items-center gap-2 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Return to Executive Dashboard</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Planned Capabilities Section */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 space-y-6 shadow-2xs">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-600" />
              <span>Target Capabilities & Work Groups</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              These functional modules will integrate into the {title} environment.
            </p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 bg-slate-100 text-slate-600 rounded-lg">
            Architectural Blueprint
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {plannedFeatures.map((feature, idx) => (
            <div 
              key={idx} 
              className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-3 hover:border-slate-200 transition-colors"
            >
              <div className="w-6 h-6 rounded-lg bg-indigo-100/80 text-indigo-600 flex items-center justify-center shrink-0 mt-0.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-800">{feature}</h4>
                <p className="text-[11px] text-slate-500 mt-0.5">Integrated RBAC & multi-campus support enabled</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
