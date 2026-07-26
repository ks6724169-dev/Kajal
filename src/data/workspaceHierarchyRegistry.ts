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
  ShieldCheck,
  Layers,
  UserCheck,
  FileText,
  History,
  Calendar,
  CheckSquare,
  Bus,
  Library,
  Video,
  Bell,
  BarChart3,
  Sliders,
  Database,
  GraduationCap
} from 'lucide-react';

export interface WorkItem {
  id: string;
  title: string;
  description: string;
  iconName: string;
  status: 'active' | 'coming_soon' | 'planned';
  path?: string;
  allowedRoles?: string[];
}

export interface WorkGroup {
  id: string;
  title: string;
  description: string;
  iconName: string;
  allowedRoles?: string[];
  works: WorkItem[];
}

export interface WorkspaceHierarchy {
  id: string;
  title: string;
  shortLabel: string;
  description: string;
  category: string;
  iconName: string;
  badge?: string;
  allowedRoles: string[];
  workGroups: WorkGroup[];
}

export const WORKSPACE_HIERARCHY: WorkspaceHierarchy[] = [
  {
    id: 'admin-governance',
    title: 'Institution Administration & Governance',
    shortLabel: 'Admin & Governance',
    description: 'Campuses, organization hierarchy, structure, compliance & policies',
    category: 'Governance',
    iconName: 'Building2',
    badge: '5 Work Groups',
    allowedRoles: ['organization_owner', 'owner', 'institution_owner', 'principal', 'vice_principal'],
    workGroups: [
      {
        id: 'identity-governance',
        title: 'Identity & Governance',
        description: 'Statutory registration, legal identity & official contacts',
        iconName: 'ShieldCheck',
        works: [
          {
            id: 'institution-profile',
            title: 'Institution Profile',
            description: 'Core organizational metadata, established year, website',
            iconName: 'Building2',
            status: 'active',
            path: '/owner/institution-organization/profile'
          },
          {
            id: 'organization-identity',
            title: 'Registration & Statutory Credentials',
            description: 'Tax IDs, registration certificates & legal credentials',
            iconName: 'FileText',
            status: 'active',
            path: '/owner/institution-organization/identity'
          },
          {
            id: 'contacts-locations',
            title: 'Contacts & Official Locations',
            description: 'HQ address, primary phone numbers, official contacts',
            iconName: 'MapPin',
            status: 'active',
            path: '/owner/institution-organization/contacts'
          }
        ]
      },
      {
        id: 'campus-hierarchy',
        title: 'Campus & Organizational Hierarchy',
        description: 'Multi-campus node setup, departments & structural units',
        iconName: 'Layers',
        works: [
          {
            id: 'campus-overview',
            title: 'Campus Overview',
            description: 'View & monitor all regional institutional campus nodes',
            iconName: 'MapPin',
            status: 'active',
            path: '/owner/institution-organization/campuses'
          },
          {
            id: 'organization-structure',
            title: 'Organization Structure',
            description: 'Chart of operational divisions and institutional nodes',
            iconName: 'Layers',
            status: 'active',
            path: '/owner/institution-organization/structure'
          },
          {
            id: 'departments',
            title: 'Department Management',
            description: 'Manage academic and administrative departments',
            iconName: 'Building2',
            status: 'active',
            path: '/owner/institution-organization/departments'
          }
        ]
      },
      {
        id: 'leadership-roles',
        title: 'Leadership, Roles & Access',
        description: 'Executive directory, RBAC matrices & administrative oversight',
        iconName: 'UserCheck',
        allowedRoles: ['organization_owner', 'owner', 'institution_owner', 'principal'],
        works: [
          {
            id: 'administration',
            title: 'Executive Directory',
            description: 'Key institution officers, principals & directors',
            iconName: 'Users',
            status: 'active',
            path: '/owner/institution-organization/administration'
          },
          {
            id: 'academic-governance-leadership',
            title: 'Academic Leadership',
            description: 'Heads of department & academic committee members',
            iconName: 'GraduationCap',
            status: 'active',
            path: '/owner/institution-organization/academic-structure'
          },
          {
            id: 'role-permissions',
            title: 'Role & Permission Matrix',
            description: 'Configure granular RBAC scopes for campus users',
            iconName: 'ShieldCheck',
            status: 'active',
            path: 'security'
          }
        ]
      },
      {
        id: 'academic-governance',
        title: 'Academic Governance',
        description: 'Board affiliation, academic sessions & curriculum policies',
        iconName: 'BookOpen',
        works: [
          {
            id: 'academic-structure',
            title: 'Academic Session & Board Rules',
            description: 'CBSE / Board affiliation details and active session terms',
            iconName: 'BookOpen',
            status: 'active',
            path: '/owner/institution-organization/academic-structure'
          },
          {
            id: 'curriculum-approval',
            title: 'Board Approvals & Policies',
            description: 'Syllabus standards, passing criteria & institutional rules',
            iconName: 'FileText',
            status: 'active',
            path: '/owner/institution-organization/documents'
          }
        ]
      },
      {
        id: 'compliance-policy',
        title: 'Compliance, Audit & System Policy',
        description: 'Statutory compliance documents, audit trail & system rules',
        iconName: 'FileText',
        works: [
          {
            id: 'documents-compliance',
            title: 'Statutory Documents & Vault',
            description: 'NOC, affiliation letters, land safety certificates',
            iconName: 'FileText',
            status: 'active',
            path: '/owner/institution-organization/documents'
          },
          {
            id: 'audit-history',
            title: 'System Audit Trail',
            description: 'Verifiable log of administrative actions & data updates',
            iconName: 'History',
            status: 'active',
            path: '/owner/institution-organization/audit-history'
          },
          {
            id: 'organization-reports',
            title: 'Institutional Reports',
            description: 'Governance & operational summary reports for board review',
            iconName: 'BarChart3',
            status: 'active',
            path: '/owner/institution-organization/reports'
          },
          {
            id: 'security-policies',
            title: 'Security & Data Policies',
            description: 'Data encryption, backups & privacy compliance',
            iconName: 'ShieldCheck',
            status: 'coming_soon'
          },
          {
            id: 'system-settings',
            title: 'System Settings',
            description: 'Global institution parameters & system integrations',
            iconName: 'Sliders',
            status: 'active',
            path: 'settings'
          }
        ]
      }
    ]
  },
  {
    id: 'academic-curriculum',
    title: 'Academic & Curriculum Management',
    shortLabel: 'Academics & Curriculum',
    description: 'Syllabus, class schedules, faculty assignments & department control',
    category: 'Academics',
    iconName: 'BookOpen',
    badge: '3 Work Groups',
    allowedRoles: ['organization_owner', 'owner', 'institution_owner', 'principal', 'vice_principal', 'teacher'],
    workGroups: [
      {
        id: 'curriculum-syllabus',
        title: 'Syllabus & Course Mapping',
        description: 'Subject syllabi, course outcomes & textbook allocations',
        iconName: 'BookOpen',
        works: [
          {
            id: 'syllabus-tracker',
            title: 'Syllabus Coverage Tracker',
            description: 'Track unit-wise syllabus progress across classes',
            iconName: 'CheckSquare',
            status: 'active',
            path: '/owner/workspaces/academic-curriculum'
          },
          {
            id: 'textbooks-resources',
            title: 'Textbooks & Digital Content',
            description: 'Approved textbook lists and digital learning assets',
            iconName: 'FileText',
            status: 'coming_soon'
          }
        ]
      },
      {
        id: 'class-scheduling',
        title: 'Timetable & Class Schedules',
        description: 'Master timetable generation, period distribution & substitution',
        iconName: 'Calendar',
        works: [
          {
            id: 'master-timetable',
            title: 'Master Timetable',
            description: 'Weekly schedule grid for all grades and sections',
            iconName: 'Calendar',
            status: 'active',
            path: '/owner/workspaces/academic-curriculum'
          },
          {
            id: 'substitute-management',
            title: 'Teacher Substitutions',
            description: 'Automated substitution assignments for absent staff',
            iconName: 'Users',
            status: 'coming_soon'
          }
        ]
      },
      {
        id: 'faculty-assignments',
        title: 'Department & Faculty Control',
        description: 'Assign subjects and class teachers per department',
        iconName: 'Users',
        works: [
          {
            id: 'faculty-allocation',
            title: 'Subject Teacher Allocations',
            description: 'Assign teachers to subject sections across campuses',
            iconName: 'UserCheck',
            status: 'active',
            path: '/owner/workspaces/academic-curriculum'
          }
        ]
      }
    ]
  },
  {
    id: 'student-lifecycle',
    title: 'Student Lifecycle & Wellbeing',
    shortLabel: 'Student Lifecycle',
    description: 'Admissions, profiles, attendance, behavior & student health records',
    category: 'Students',
    iconName: 'Users',
    badge: '3 Work Groups',
    allowedRoles: ['organization_owner', 'owner', 'institution_owner', 'principal', 'vice_principal', 'teacher'],
    workGroups: [
      {
        id: 'admissions-enrollment',
        title: 'Admissions & Enrollment',
        description: 'New student intake, application reviews & roll generation',
        iconName: 'Users',
        works: [
          {
            id: 'student-directory',
            title: 'Student Master Directory',
            description: 'Search & manage enrolled student profiles and documents',
            iconName: 'Users',
            status: 'active',
            path: 'students'
          }
        ]
      },
      {
        id: 'attendance-tracking',
        title: 'Attendance & Leave Portal',
        description: 'Biometric, RFID & mobile attendance logging with leave requests',
        iconName: 'CheckSquare',
        works: [
          {
            id: 'attendance-portal',
            title: 'Daily Attendance Dashboard',
            description: 'Real-time campus-wide attendance monitoring',
            iconName: 'CheckSquare',
            status: 'active',
            path: 'attendance'
          }
        ]
      },
      {
        id: 'student-wellbeing',
        title: 'Student Health & Behavior',
        description: 'Medical health cards, disciplinary notes & counseling',
        iconName: 'ShieldCheck',
        works: [
          {
            id: 'health-records',
            title: 'Health & Medical Cards',
            description: 'Vaccination, allergy & infirmary logs',
            iconName: 'FileText',
            status: 'coming_soon'
          }
        ]
      }
    ]
  },
  {
    id: 'assessment-exams',
    title: 'Assessment, Examination & Results',
    shortLabel: 'Examinations & Marks',
    description: 'Exams scheduling, report cards, gradebooks & evaluation boards',
    category: 'Exams',
    iconName: 'Award',
    badge: '2 Work Groups',
    allowedRoles: ['organization_owner', 'owner', 'institution_owner', 'principal', 'vice_principal', 'teacher'],
    workGroups: [
      {
        id: 'exam-scheduling',
        title: 'Examination Management',
        description: 'Term exam schedules, seating arrangements & admit cards',
        iconName: 'Award',
        works: [
          {
            id: 'exam-portal',
            title: 'Exam Control Center',
            description: 'Schedule unit tests, term exams and invigilation duties',
            iconName: 'Award',
            status: 'active',
            path: 'exams'
          }
        ]
      },
      {
        id: 'marks-report-cards',
        title: 'Gradebook & Report Cards',
        description: 'Marks entry, CCE evaluation & PDF report card publishing',
        iconName: 'FileText',
        works: [
          {
            id: 'marks-entry',
            title: 'Marks Entry & Gradebooks',
            description: 'Subject-wise marks entry and grade computation',
            iconName: 'FileText',
            status: 'active',
            path: 'exams'
          }
        ]
      }
    ]
  },
  {
    id: 'finance-hr',
    title: 'Finance, HR & Resource Management',
    shortLabel: 'Finance & HR',
    description: 'Fee collection, payroll, staff management & institutional budgeting',
    category: 'Finance',
    iconName: 'Wallet',
    badge: '3 Work Groups',
    allowedRoles: ['organization_owner', 'owner', 'institution_owner', 'principal', 'vice_principal'],
    workGroups: [
      {
        id: 'fee-collection',
        title: 'Fee Collection & Dues',
        description: 'Fee structures, online receipts, overdue alerts & concessions',
        iconName: 'Wallet',
        works: [
          {
            id: 'fee-management',
            title: 'Fee Management Center',
            description: 'Process fee payments, view ledger & pending dues',
            iconName: 'Wallet',
            status: 'active',
            path: 'fees'
          }
        ]
      },
      {
        id: 'hrms-payroll',
        title: 'HRMS & Staff Payroll',
        description: 'Employee profiles, salary structures & leave management',
        iconName: 'Users',
        works: [
          {
            id: 'hrms-payroll',
            title: 'HRMS & Staff Directory',
            description: 'Manage teachers, administrative staff & payroll records',
            iconName: 'Users',
            status: 'active',
            path: 'hrms'
          }
        ]
      },
      {
        id: 'budgeting-expenses',
        title: 'Institutional Budgeting',
        description: 'Expense vouchers, capital investments & financial audits',
        iconName: 'BarChart3',
        works: [
          {
            id: 'budget-planner',
            title: 'Annual Budget Planner',
            description: 'Campus-wise revenue allocations & expenditure tracking',
            iconName: 'BarChart3',
            status: 'coming_soon'
          }
        ]
      }
    ]
  },
  {
    id: 'campus-services',
    title: 'Campus Services & Infrastructure',
    shortLabel: 'Campus Services',
    description: 'Transport fleets, hostel management, library & campus CCTV security',
    category: 'Facilities',
    iconName: 'MapPin',
    badge: '3 Work Groups',
    allowedRoles: ['organization_owner', 'owner', 'institution_owner', 'principal', 'vice_principal'],
    workGroups: [
      {
        id: 'transport-fleet',
        title: 'Transport & GPS Tracking',
        description: 'Bus routes, driver assignments, live GPS & student pickup logs',
        iconName: 'Bus',
        works: [
          {
            id: 'transport-portal',
            title: 'Transport Portal',
            description: 'Manage fleet buses, routes & live tracking',
            iconName: 'Bus',
            status: 'active',
            path: 'transport'
          }
        ]
      },
      {
        id: 'facility-hostel',
        title: 'Library & Hostel Infrastructure',
        description: 'Book cataloging, hostel room allotments & mess management',
        iconName: 'Library',
        works: [
          {
            id: 'inventory-library',
            title: 'Library & Inventory Control',
            description: 'Library book issuance, asset tracking & stock registers',
            iconName: 'Library',
            status: 'active',
            path: 'library'
          }
        ]
      },
      {
        id: 'cctv-security',
        title: 'CCTV & Campus Safety',
        description: 'Live IP camera feeds, security alerts & gate pass control',
        iconName: 'Video',
        works: [
          {
            id: 'cctv-security',
            title: 'CCTV Security Operations',
            description: 'Campus surveillance feeds & incident logging',
            iconName: 'Video',
            status: 'active',
            path: 'cctv'
          }
        ]
      }
    ]
  },
  {
    id: 'communication-collaboration',
    title: 'Communication, Engagement & Collaboration',
    shortLabel: 'Communication',
    description: 'Parent-teacher portal, announcements, circulars & instant messaging',
    category: 'Engagement',
    iconName: 'MessageSquare',
    badge: '2 Work Groups',
    allowedRoles: ['organization_owner', 'owner', 'institution_owner', 'principal', 'vice_principal', 'teacher'],
    workGroups: [
      {
        id: 'announcements-circulars',
        title: 'Announcements & Broadcasts',
        description: 'Official school circulars, SMS broadcasts & push notifications',
        iconName: 'Bell',
        works: [
          {
            id: 'notifications-center',
            title: 'Notifications Center',
            description: 'Create & publish school notices, emergency SMS alerts',
            iconName: 'Bell',
            status: 'active',
            path: 'notifications'
          }
        ]
      },
      {
        id: 'portal-collaboration',
        title: 'Parent & Faculty Hub',
        description: 'Parent-Teacher meetings, messaging & event calendar',
        iconName: 'MessageSquare',
        works: [
          {
            id: 'messaging-hub',
            title: 'Direct Messaging Hub',
            description: 'Secure communication channel between parents & faculty',
            iconName: 'MessageSquare',
            status: 'active',
            path: 'notifications'
          }
        ]
      }
    ]
  },
  {
    id: 'intelligence-analytics',
    title: 'Intelligence, Analytics, Reporting & AI',
    shortLabel: 'Intelligence & AI',
    description: 'Executive AI briefings, real-time analytics, audit logs & compliance',
    category: 'Analytics',
    iconName: 'Sparkles',
    badge: 'AI Powered',
    allowedRoles: ['organization_owner', 'owner', 'institution_owner', 'principal', 'vice_principal'],
    workGroups: [
      {
        id: 'ai-briefings',
        title: 'Executive AI Copilot & Briefings',
        description: 'AI-generated executive briefings, predictive student dropouts & recommendations',
        iconName: 'Sparkles',
        works: [
          {
            id: 'ai_hub',
            title: 'Galaxy AI Control Hub',
            description: 'Interact with AI assistant for institutional insights',
            iconName: 'Sparkles',
            status: 'active',
            path: 'ai_hub'
          }
        ]
      },
      {
        id: 'institutional-reporting',
        title: 'Real-Time Analytics & Audit',
        description: 'Aggregated statistical dashboards and data export tools',
        iconName: 'BarChart3',
        works: [
          {
            id: 'analytics-dashboard',
            title: 'Executive Analytics Engine',
            description: 'Multi-campus financial, academic & attendance charts',
            iconName: 'BarChart3',
            status: 'active',
            path: 'dashboard'
          }
        ]
      }
    ]
  }
];

export function getAccessibleWorkspaces(role?: string): WorkspaceHierarchy[] {
  if (!role) return WORKSPACE_HIERARCHY;
  const userRole = role.toLowerCase();
  
  return WORKSPACE_HIERARCHY.filter(ws => {
    if (ws.allowedRoles.includes(userRole)) return true;
    if (['owner', 'organization_owner', 'institution_owner'].includes(userRole)) return true;
    return false;
  }).map(ws => {
    // Filter work groups inside
    const filteredGroups = ws.workGroups.filter(wg => {
      if (!wg.allowedRoles) return true;
      if (wg.allowedRoles.includes(userRole)) return true;
      if (['owner', 'organization_owner', 'institution_owner'].includes(userRole)) return true;
      return false;
    });
    return { ...ws, workGroups: filteredGroups };
  });
}
