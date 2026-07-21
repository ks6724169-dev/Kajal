import { Role } from '../types';

export interface WorkspaceStats {
  label: string;
  value: string | number;
  change?: string;
  isPositive?: boolean;
}

export interface WorkspaceConfig {
  id: string;
  title: string;
  subtitle: string;
  color: string; // e.g. 'indigo' | 'emerald' | 'blue' | 'rose'
  textColor: string;
  role: Role;
  logo: string;
  stats: WorkspaceStats[];
  description: string;
}

export interface WorkspaceState {
  activeWorkspaceId: Role;
  currentWorkspace: WorkspaceConfig | null;
  availableWorkspaces: WorkspaceConfig[];
}

type Listener = (state: WorkspaceState) => void;

class WorkspaceStore {
  private state: WorkspaceState = {
    activeWorkspaceId: 'guest',
    currentWorkspace: null,
    availableWorkspaces: []
  };

  private listeners = new Set<Listener>();

  constructor() {
    this.initialize();
  }

  private initialize() {
    // Lazy loaded later based on user role
  }

  getState(): WorkspaceState {
    return this.state;
  }

  setState(newState: Partial<WorkspaceState>) {
    this.state = { ...this.state, ...newState };
    this.listeners.forEach((listener) => listener(this.state));
  }

  subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  setRoleWorkspaces(primaryRole: Role, allRoles: Role[]) {
    const workspaces = allRoles.map(role => this.getWorkspaceConfigForRole(role));
    const activeWorkspace = workspaces.find(w => w.role === primaryRole) || workspaces[0] || this.getWorkspaceConfigForRole('guest');
    
    this.setState({
      activeWorkspaceId: activeWorkspace.role,
      currentWorkspace: activeWorkspace,
      availableWorkspaces: workspaces
    });
  }

  switchWorkspace(role: Role) {
    const found = this.state.availableWorkspaces.find(w => w.role === role);
    if (found) {
      this.setState({
        activeWorkspaceId: role,
        currentWorkspace: found
      });
    } else {
      // Create it on the fly if allowed
      const config = this.getWorkspaceConfigForRole(role);
      this.setState({
        activeWorkspaceId: role,
        currentWorkspace: config,
        availableWorkspaces: [...this.state.availableWorkspaces, config]
      });
    }
  }

  private getWorkspaceConfigForRole(role: Role): WorkspaceConfig {
    const configs: Record<Role, Omit<WorkspaceConfig, 'role'>> = {
      super_admin: {
        id: 'ws-super-admin',
        title: 'Sovereign Command Center',
        subtitle: 'Enterprise Platform Control & Multi-Tenant Diagnostics',
        color: 'indigo',
        textColor: 'text-indigo-600',
        logo: '🌌',
        description: 'Global administrator panel with direct hardware telemetrics, tenant controls, system updates, and cross-district educational intelligence.',
        stats: [
          { label: 'Active Districts', value: '48', change: '+2', isPositive: true },
          { label: 'Total Ingress Users', value: '254.2k', change: '+12.4%', isPositive: true },
          { label: 'SSO Sync Success', value: '99.99%', change: 'Stable', isPositive: true },
          { label: 'Platform Load', value: '14.2%', change: 'Low', isPositive: true }
        ]
      },
      organization_owner: {
        id: 'ws-org-owner',
        title: 'Sovereign Trust HQ',
        subtitle: 'Strategic Portfolio Analytics & Governance',
        color: 'indigo',
        textColor: 'text-indigo-600',
        logo: '🏛️',
        description: 'Complete institutional governance over multi-academy structures, fiscal distributions, asset lifecycle tracking, and regional audit controls.',
        stats: [
          { label: 'Institutional Trust Value', value: '₹142.8 Cr', change: '+8.4%', isPositive: true },
          { label: 'Active Facilities', value: '12 campuses', change: 'Synced', isPositive: true },
          { label: 'FTE Employee Count', value: '1,420', change: '+14', isPositive: true }
        ]
      },
      school_admin: {
        id: 'ws-school-admin',
        title: 'Campus Ingress Hub',
        subtitle: 'Operational Workspace & Facilities Management',
        color: 'blue',
        textColor: 'text-blue-600',
        logo: '🏫',
        description: 'Operational center for class schedules, parent communication networks, fee tracking, bus telemetry, and localized security operations.',
        stats: [
          { label: 'Daily Gate Ingress', value: '2,482', change: '+1.2%', isPositive: true },
          { label: 'Pending Registrations', value: '14', change: 'Action Required', isPositive: false },
          { label: 'Operational Health', value: 'Excellent', change: 'Stable', isPositive: true }
        ]
      },
      principal: {
        id: 'ws-principal',
        title: 'Principal Strategic Panel',
        subtitle: 'Academic Excellence & School Quality Control',
        color: 'emerald',
        textColor: 'text-emerald-600',
        logo: '👑',
        description: 'Overview of educational statistics, student behaviour monitoring, teacher evaluations, performance grading distributions, and strategic parent advisory logs.',
        stats: [
          { label: 'Academic Performance', value: '88.4%', change: '+3.1%', isPositive: true },
          { label: 'Attendance Rate', value: '94.2%', change: '+0.8%', isPositive: true },
          { label: 'Active Incidents', value: '2', change: 'Resolved', isPositive: true },
          { label: 'Parent CSAT Score', value: '4.8/5.0', change: '+0.2', isPositive: true }
        ]
      },
      vice_principal: {
        id: 'ws-vice-principal',
        title: 'Academic Discipline & Operations',
        subtitle: 'Daily School Schedules & Academic Monitoring',
        color: 'emerald',
        textColor: 'text-emerald-600',
        logo: '🎓',
        description: 'Direct management of curriculum progress, period attendance enforcement, student disciplinary folders, counseling schedules, and daily rosters.',
        stats: [
          { label: 'Syllabus Coverage', value: '72.4%', change: 'On Track', isPositive: true },
          { label: 'Disciplinary Cases', value: '3', change: '-4', isPositive: true },
          { label: 'Teacher Proxies Active', value: '1', change: 'Assigned', isPositive: true }
        ]
      },
      teacher: {
        id: 'ws-teacher',
        title: 'Teacher Pedagogical Hub',
        subtitle: 'Classroom Instruction, Grading, and Attendance',
        color: 'violet',
        textColor: 'text-violet-600',
        logo: '🧑‍🏫',
        description: 'Instructional control board with class planners, smart gradebooks, instant behavior logs, student timeline portfolio trackers, and parent message triggers.',
        stats: [
          { label: 'Assigned Students', value: '142', change: 'Synced', isPositive: true },
          { label: 'Grading Tasks Left', value: '4 files', change: 'Pending', isPositive: false },
          { label: 'Daily Attendance Marked', value: '100%', change: 'Complete', isPositive: true }
        ]
      },
      class_teacher: {
        id: 'ws-class-teacher',
        title: 'Class homeroom Dashboard',
        subtitle: 'Homeroom Coordination & Pastoral Care',
        color: 'violet',
        textColor: 'text-violet-600',
        logo: '🎒',
        description: 'Comprehensive oversight of homeroom performance, pastoral counseling schedules, club participations, student health tracking, and dynamic timeline logs.',
        stats: [
          { label: 'Homeroom Cohort', value: '42', change: 'Active', isPositive: true },
          { label: 'MFA Verified Parents', value: '39/42', change: 'Action Required', isPositive: false },
          { label: 'Behavior Score', value: '96.2', change: 'Very Good', isPositive: true }
        ]
      },
      accountant: {
        id: 'ws-accountant',
        title: 'Treasury & Accounts Portal',
        subtitle: 'Fee Catalogs, Accounts Payable & Payroll Roster',
        color: 'amber',
        textColor: 'text-amber-600',
        logo: '💰',
        description: 'Financial accounting panel for tuition invoice generation, fine waivers, offline payment reconciliation, and automated fee remainder triggers.',
        stats: [
          { label: 'Fees Collected (Q3)', value: '₹42.8 Lakh', change: '84%', isPositive: true },
          { label: 'Overdue Receivables', value: '₹3.4 Lakh', change: '-12%', isPositive: true },
          { label: 'Pending Reconciliations', value: '12', change: 'Daily', isPositive: false }
        ]
      },
      hr: {
        id: 'ws-hr',
        title: 'HRMS & Employee Directory',
        subtitle: 'Payroll Distributions, Contracts, and Leaves',
        color: 'teal',
        textColor: 'text-teal-600',
        logo: '👥',
        description: 'Administration of staff hiring, employee profiles, performance trackers, salary dispersion checklists, and leave allocation schedules.',
        stats: [
          { label: 'Active Staff Members', value: '184', change: 'Verified', isPositive: true },
          { label: 'Pending Leave Approvals', value: '5', change: 'Action Required', isPositive: false },
          { label: 'Payroll Status', value: 'Disbursed', change: 'Current Month', isPositive: true }
        ]
      },
      receptionist: {
        id: 'ws-receptionist',
        title: 'Front Office & Visitor Ledger',
        subtitle: 'Visitor Gate Passes & Direct Queries',
        color: 'teal',
        textColor: 'text-teal-600',
        logo: '📞',
        description: 'Real-time visitor logs, inquiry boards, phone logs, outward dispatch records, and gate token generation dashboard.',
        stats: [
          { label: 'Visitor Logs Today', value: '28', change: 'Secure', isPositive: true },
          { label: 'Open Inquiries', value: '4', change: 'Follow-up', isPositive: false },
          { label: 'Dispatch Pending', value: '1', change: 'Outbox', isPositive: false }
        ]
      },
      transport_manager: {
        id: 'ws-transport-manager',
        title: 'Fleet & Route Telemetry',
        subtitle: 'Live GPS Tracking & Route Planning',
        color: 'orange',
        textColor: 'text-orange-600',
        logo: '🚌',
        description: 'Dynamic bus route coordinates, active driver monitoring, SOS alerts, speed notifications, and scheduled vehicle safety audits.',
        stats: [
          { label: 'Fleet Status', value: '42 Active', change: 'On-Track', isPositive: true },
          { label: 'Delay Alerts', value: '0', change: 'Perfect', isPositive: true },
          { label: 'Active Transits', value: '1,200', change: 'Students Safe', isPositive: true }
        ]
      },
      hostel_manager: {
        id: 'ws-hostel-manager',
        title: 'Hostel Residency Grid',
        subtitle: 'Room Allocations, Wardens, and Mess Menu',
        color: 'orange',
        textColor: 'text-orange-600',
        logo: '🏢',
        description: 'Complete management of residential room lists, warden shifts, late check-in alarms, mess nutrition logs, and student medical emergency files.',
        stats: [
          { label: 'Resident Count', value: '420', change: 'Full', isPositive: true },
          { label: 'Available Beds', value: '12', change: 'Allocating', isPositive: true },
          { label: 'Mess Supply Status', value: 'Replenished', change: 'Safe', isPositive: true }
        ]
      },
      librarian: {
        id: 'ws-librarian',
        title: 'Library Indexing & Catalog',
        subtitle: 'Book Issues, Return Reminders & Inventory',
        color: 'cyan',
        textColor: 'text-cyan-600',
        logo: '📚',
        description: 'Complete catalog system utilizing ISBN scans, automated fine calculations, reading level logs, and acquisition workflows.',
        stats: [
          { label: 'Total Volumes', value: '14,842', change: '+240', isPositive: true },
          { label: 'Issued Books Today', value: '62', change: 'Active', isPositive: true },
          { label: 'Overdue Returns', value: '8', change: 'Reminders Sent', isPositive: false }
        ]
      },
      exam_controller: {
        id: 'ws-exam-controller',
        title: 'Examination & Assessment Sovereign',
        subtitle: 'Exams, Question Banks, and Grading Integrity',
        color: 'cyan',
        textColor: 'text-cyan-600',
        logo: '✏️',
        description: 'Governance over institutional assessments, question bank distributions, grade thresholds, and direct marksheet verification.',
        stats: [
          { label: 'Active Question Papers', value: '42', change: 'Encrypted', isPositive: true },
          { label: 'Evaluation Speed', value: '84%', change: 'Progressing', isPositive: true },
          { label: 'Academic integrity', value: '100%', change: 'Audited', isPositive: true }
        ]
      },
      inventory_manager: {
        id: 'ws-inventory-manager',
        title: 'Asset Ledger & Store Inventory',
        subtitle: 'Purchase Orders, Laboratory Supplies, and Audits',
        color: 'sky',
        textColor: 'text-sky-600',
        logo: '📦',
        description: 'Complete materials control system spanning physics apparatus, classroom furniture, computing terminals, and staff notebooks.',
        stats: [
          { label: 'Total Asset SKU Count', value: '1,280', change: 'Active', isPositive: true },
          { label: 'Pending Requisitions', value: '4', change: 'Approve', isPositive: false },
          { label: 'Asset Value', value: '₹42 Lakh', change: 'Audited', isPositive: true }
        ]
      },
      parent: {
        id: 'ws-parent',
        title: 'Parent Guardianship Workspace',
        subtitle: 'Child Ward Trackers, Fees, and Communication',
        color: 'emerald',
        textColor: 'text-emerald-600',
        logo: '👨‍👩‍👦',
        description: 'Comprehensive dashboard allowing immediate view of school timetables, homework boards, behavioral feedback, live bus telemetry, and instant fee payments.',
        stats: [
          { label: 'Fee Payments due', value: 'None', change: 'Paid', isPositive: true },
          { label: 'Ward Performance', value: '84.2%', change: 'Good', isPositive: true },
          { label: 'Wards Enrolled', value: '2', change: 'Active', isPositive: true }
        ]
      },
      student: {
        id: 'ws-student',
        title: 'Student Academic Portal',
        subtitle: 'My Classes, Assignments, Results & Badges',
        color: 'indigo',
        textColor: 'text-indigo-600',
        logo: '🎓',
        description: 'Interactive workspace containing class timetables, online exams, homework submission triggers, merit badges, club feeds, and student portfolio.',
        stats: [
          { label: 'Active Assignments', value: '3', change: 'Pending', isPositive: false },
          { label: 'My GPA', value: '3.82', change: '+0.1', isPositive: true },
          { label: 'Attendance', value: '96.4%', change: 'Excellent', isPositive: true }
        ]
      },
      guest: {
        id: 'ws-guest',
        title: 'Guest Sandbox Access',
        subtitle: 'Interactive Feature Preview & Documentation',
        color: 'slate',
        textColor: 'text-slate-600',
        logo: '👤',
        description: 'Welcome to Galaxy! This is a guest environment. Register an institution to experience the full operational suite of the educational operating system.',
        stats: [
          { label: 'Sandbox Modules', value: '3', change: 'Restricted', isPositive: false },
          { label: 'API Queries Remaining', value: '100', change: 'Active', isPositive: true }
        ]
      },
      driver: {
        id: 'ws-driver',
        title: 'Driver Logistics Dashboard',
        subtitle: 'Route Maps, Passenger Counts, and Safety Logs',
        color: 'orange',
        textColor: 'text-orange-600',
        logo: '🚍',
        description: 'Transit operations board detailing student rosters, route stops, dynamic speed indicators, and safety checklists.',
        stats: [
          { label: 'Route Progress', value: '82%', change: 'Active', isPositive: true },
          { label: 'Speed Limit', value: '45 km/h', change: 'Safe', isPositive: true },
          { label: 'Riders Checked In', value: '28/32', change: 'Synced', isPositive: true }
        ]
      }
    };

    const config = configs[role] || configs.guest;
    return {
      ...config,
      role
    };
  }
}

export const workspaceStore = new WorkspaceStore();
