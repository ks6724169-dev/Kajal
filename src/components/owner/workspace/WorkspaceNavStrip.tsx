import React from 'react';
import { 
  Building2, 
  BookOpen, 
  Users, 
  Award, 
  Wallet, 
  MapPin, 
  MessageSquare, 
  Sparkles,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';

export interface WorkspaceItem {
  id: string;
  title: string;
  shortLabel: string;
  description: string;
  icon: React.ElementType;
  badge?: string;
  category: string;
}

export const CORE_WORKSPACES: WorkspaceItem[] = [
  {
    id: 'admin-governance',
    title: 'Institution Administration & Governance',
    shortLabel: 'Admin & Governance',
    description: 'Campuses, organization hierarchy, structure, compliance & policies',
    icon: Building2,
    badge: '15 Work Groups',
    category: 'Governance'
  },
  {
    id: 'academic-curriculum',
    title: 'Academic & Curriculum Management',
    shortLabel: 'Academics & Curriculum',
    description: 'Syllabus, class schedules, faculty assignments & department control',
    icon: BookOpen,
    badge: 'Core Academic',
    category: 'Academics'
  },
  {
    id: 'student-lifecycle',
    title: 'Student Lifecycle & Wellbeing',
    shortLabel: 'Student Lifecycle',
    description: 'Admissions, profiles, attendance, behavior & student health records',
    icon: Users,
    badge: 'Lifecycle',
    category: 'Students'
  },
  {
    id: 'assessment-exams',
    title: 'Assessment, Examination & Results',
    shortLabel: 'Examinations & Marks',
    description: 'Exams scheduling, report cards, gradebooks & evaluation boards',
    icon: Award,
    badge: 'Evaluations',
    category: 'Exams'
  },
  {
    id: 'finance-hr',
    title: 'Finance, HR & Resource Management',
    shortLabel: 'Finance & HR',
    description: 'Fee collection, payroll, staff management & institutional budgeting',
    icon: Wallet,
    badge: 'Operations',
    category: 'Finance'
  },
  {
    id: 'campus-services',
    title: 'Campus Services & Infrastructure',
    shortLabel: 'Campus Services',
    description: 'Transport fleets, hostel management, library & campus CCTV security',
    icon: MapPin,
    badge: 'Services',
    category: 'Facilities'
  },
  {
    id: 'communication-collaboration',
    title: 'Communication, Engagement & Collaboration',
    shortLabel: 'Communication',
    description: 'Parent-teacher portal, announcements, circulars & instant messaging',
    icon: MessageSquare,
    badge: 'Connect',
    category: 'Engagement'
  },
  {
    id: 'intelligence-analytics',
    title: 'Intelligence, Analytics, Reporting & AI',
    shortLabel: 'Intelligence & AI',
    description: 'Executive AI briefings, real-time analytics, audit logs & compliance',
    icon: Sparkles,
    badge: 'AI Powered',
    category: 'Analytics'
  }
];

interface WorkspaceNavStripProps {
  activeWorkspaceId: string;
  onSelectWorkspace: (id: string) => void;
  activeRole?: string;
}

export const WorkspaceNavStrip: React.FC<WorkspaceNavStripProps> = ({
  activeWorkspaceId,
  onSelectWorkspace,
  activeRole
}) => {
  return (
    <div className="w-full bg-white border-b border-slate-200/80 shadow-2xs sticky top-0 z-20">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6">
        {/* Horizontal Navigation Container */}
        <div className="flex items-center justify-between gap-2 overflow-x-auto py-2 custom-scrollbar no-scrollbar">
          <div className="flex items-center gap-1.5 min-w-max" role="tablist" aria-label="Institution Workspaces">
            {CORE_WORKSPACES.map((workspace) => {
              const Icon = workspace.icon;
              const isActive = activeWorkspaceId === workspace.id;

              return (
                <button
                  key={workspace.id}
                  role="tab"
                  aria-selected={isActive}
                  tabIndex={isActive ? 0 : -1}
                  onClick={() => onSelectWorkspace(workspace.id)}
                  title={workspace.description}
                  className={`
                    group relative flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer whitespace-nowrap select-none
                    ${isActive 
                      ? 'bg-indigo-600 text-white shadow-xs shadow-indigo-600/20 ring-1 ring-indigo-600' 
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 active:bg-slate-200/60'
                    }
                  `}
                >
                  <Icon className={`w-4 h-4 transition-transform group-hover:scale-105 ${isActive ? 'text-white' : 'text-slate-500 group-hover:text-indigo-600'}`} />
                  <span>{workspace.shortLabel}</span>
                  
                  {workspace.badge && (
                    <span 
                      className={`
                        text-[10px] px-1.5 py-0.2 rounded-md font-medium tracking-wide transition-colors
                        ${isActive 
                          ? 'bg-white/20 text-white' 
                          : 'bg-slate-100 text-slate-500 group-hover:bg-indigo-50 group-hover:text-indigo-600'
                        }
                      `}
                    >
                      {workspace.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
