import { 
  Building, 
  School, 
  UserCheck, 
  Users, 
  Users2, 
  Heart, 
  BookOpen, 
  Calendar, 
  Award, 
  Laptop, 
  Briefcase, 
  CreditCard, 
  Truck, 
  MessageSquare, 
  Megaphone, 
  BarChart2, 
  Bot, 
  FlaskConical, 
  Library as LibraryIcon, 
  Shield, 
  Smartphone, 
  Share2, 
  FileText, 
  GitBranch, 
  ShoppingCart, 
  Boxes, 
  TrendingUp, 
  Globe,
  Settings,
  Activity,
  ArrowRight
} from 'lucide-react';

export interface ModuleInfo {
  id: string;
  name: string;
  description: string;
  path: string;
  iconName: string;
  category: string;
}

export interface CategoryGroup {
  name: string;
  icon: string;
  modules: ModuleInfo[];
}

export const MODULE_CATEGORIES: CategoryGroup[] = [
  {
    name: "🏢 Organization & Administration",
    icon: "Building",
    modules: [
      {
        id: "m1",
        name: "Institution & Organization",
        description: "Manage global multi-tenant profiles, school settings, branding, and high-level corporate hierarchy.",
        path: "module_institution",
        iconName: "Building",
        category: "Organization & Administration"
      },
      {
        id: "m2",
        name: "Campus Management",
        description: "Coordinate multiple school campus contexts, physical branches, infrastructures, and block assignments.",
        path: "module_campus_mgt",
        iconName: "School",
        category: "Organization & Administration"
      }
    ]
  },
  {
    name: "🎓 Student & Enrollment",
    icon: "Users",
    modules: [
      {
        id: "m3",
        name: "Admissions & Enrollment Management",
        description: "Automate inquiry lifecycles, application pipelines, eligibility checklists, and physical intake workflows.",
        path: "module_admissions",
        iconName: "UserCheck",
        category: "Student & Enrollment"
      },
      {
        id: "m4",
        name: "Student Information & Lifecycle",
        description: "Complete student record master from entry to alumni graduation tracking, transfer certificates, and status rules.",
        path: "module_student_lifecycle",
        iconName: "Users",
        category: "Student & Enrollment"
      },
      {
        id: "m5",
        name: "Parent & Family Engagement",
        description: "Direct parent portals, emergency communications, feedback loops, and family context consolidation.",
        path: "module_parent_family",
        iconName: "Users2",
        category: "Student & Enrollment"
      },
      {
        id: "m6",
        name: "Student Success & Wellbeing",
        description: "Track physical health indices, psychological counselor notes, disciplinary patterns, and progress plans.",
        path: "module_student_wellbeing",
        iconName: "Heart",
        category: "Student & Enrollment"
      }
    ]
  },
  {
    name: "📚 Academic",
    icon: "BookOpen",
    modules: [
      {
        id: "m7",
        name: "Academic & Curriculum",
        description: "Define syllabi templates, course matrices, lesson planning logs, and academic calendar frameworks.",
        path: "module_academic",
        iconName: "BookOpen",
        category: "Academic"
      },
      {
        id: "m8",
        name: "Scheduling & Timetable",
        description: "Resolve conflict-free period grids, teacher substitutions, exam schedules, and master resource routing.",
        path: "module_scheduling",
        iconName: "Calendar",
        category: "Academic"
      },
      {
        id: "m9",
        name: "Assessment & Examination",
        description: "Configure report card schemes, continuous evaluation, grading scale structures, and online results.",
        path: "module_exams",
        iconName: "Award",
        category: "Academic"
      },
      {
        id: "m10",
        name: "LMS & Digital Learning",
        description: "Drive online lecture rooms, digital handouts, homework submission portals, and grading pipelines.",
        path: "module_lms",
        iconName: "Laptop",
        category: "Academic"
      }
    ]
  },
  {
    name: "👨‍💼 People & Workforce",
    icon: "Briefcase",
    modules: [
      {
        id: "m11",
        name: "HR & Workforce",
        description: "Maintain employee master list, job roles, recruitment processes, tenure history, and professional profiles.",
        path: "module_hr_workforce",
        iconName: "Briefcase",
        category: "People & Workforce"
      }
    ]
  },
  {
    name: "💰 Finance",
    icon: "CreditCard",
    modules: [
      {
        id: "m12",
        name: "Finance & Accounting",
        description: "Track master ledgers, automate fee collection, disburse salary payroll, and compile financial statements.",
        path: "module_finance",
        iconName: "CreditCard",
        category: "Finance"
      }
    ]
  },
  {
    name: "🚌 Operations",
    icon: "Truck",
    modules: [
      {
        id: "m13",
        name: "Operations & Facilities",
        description: "Supervise school buses, coordinates hostels, monitors real-time library assets, and tracks inventory stock.",
        path: "module_operations",
        iconName: "Truck",
        category: "Operations"
      }
    ]
  },
  {
    name: "📱 Communication & Growth",
    icon: "MessageSquare",
    modules: [
      {
        id: "m14",
        name: "Communication Hub",
        description: "Orchestrate real-time emails, instant text broadcasts, WhatsApp notifications, and automated newsletters.",
        path: "module_comm_hub",
        iconName: "MessageSquare",
        category: "Communication & Growth"
      },
      {
        id: "m15",
        name: "Marketing & Enrollment CRM",
        description: "Oversee lead capture widgets, digital outreach templates, follow-up queues, and campaign analytics.",
        path: "module_marketing_crm",
        iconName: "Megaphone",
        category: "Communication & Growth"
      }
    ]
  },
  {
    name: "📊 Intelligence & AI",
    icon: "BarChart2",
    modules: [
      {
        id: "m16",
        name: "Analytics & Decision Intelligence",
        description: "Deep data visualization grids, executive dashboards, predictive drop-out signals, and growth indexes.",
        path: "module_analytics_intel",
        iconName: "BarChart2",
        category: "Intelligence & AI"
      },
      {
        id: "m17",
        name: "AI Education Intelligence",
        description: "Adaptive student learning engines, personalized remedial generators, and lesson outline generators.",
        path: "module_ai_education",
        iconName: "Bot",
        category: "Intelligence & AI"
      },
      {
        id: "m18",
        name: "AI Research & Knowledge Grounding",
        description: "Enterprise rag indexing, academic research query assistants, and scientific paper curation panels.",
        path: "module_ai_research",
        iconName: "FlaskConical",
        category: "Intelligence & AI"
      },
      {
        id: "m19",
        name: "Digital AI Library",
        description: "Search indexed books with semantic algorithms, track checkout history, and recommend digital materials.",
        path: "module_ai_library",
        iconName: "LibraryIcon",
        category: "Intelligence & AI"
      }
    ]
  },
  {
    name: "🔐 Enterprise & Platform",
    icon: "Shield",
    modules: [
      {
        id: "m20",
        name: "Enterprise Security & Compliance",
        description: "Audit Multi-Factor Authentication, configure RLS, check SSO logs, and monitor campus surveillance sensors.",
        path: "module_security",
        iconName: "Shield",
        category: "Enterprise & Platform"
      },
      {
        id: "m21",
        name: "Mobile & Offline Ecosystem",
        description: "Simulate and push hybrid mobile app content, offline database sync packets, and SMS-based data lookups.",
        path: "module_mobile_ecosystem",
        iconName: "Smartphone",
        category: "Enterprise & Platform"
      },
      {
        id: "m22",
        name: "Integrations & Developer Platform",
        description: "Connect standard REST APIs, Webhook triggers, external software connectors, and developer sandboxes.",
        path: "module_integrations",
        iconName: "Share2",
        category: "Enterprise & Platform"
      }
    ]
  },
  {
    name: "➕ Reserved Core Modules",
    icon: "Boxes",
    modules: [
      {
        id: "m23",
        name: "Document & Records Management",
        description: "Centralized file hosting, document signing, digital records preservation, and student/staff file folders.",
        path: "module_documents",
        iconName: "FileText",
        category: "Reserved Core Modules"
      },
      {
        id: "m24",
        name: "Workflow & Automation Engine",
        description: "Define logic rules, multi-stage approval processes, automatic form dispatches, and trigger conditions.",
        path: "module_workflows",
        iconName: "GitBranch",
        category: "Reserved Core Modules"
      },
      {
        id: "m25",
        name: "Procurement & Vendor Management",
        description: "Purchase order pipelines, bids evaluation, master vendor listings, service agreement tracking, and audit chains.",
        path: "module_procurement",
        iconName: "ShoppingCart",
        category: "Reserved Core Modules"
      },
      {
        id: "m26",
        name: "Assets & Resource Management",
        description: "Register capital physical assets, allocate classroom furniture, schedule smartboards, and track depreciations.",
        path: "module_assets",
        iconName: "Boxes",
        category: "Reserved Core Modules"
      },
      {
        id: "m27",
        name: "Business Intelligence & Reporting",
        description: "Compile customized corporate reports, compliance layouts, schedule emails, and template financial metrics.",
        path: "module_bi",
        iconName: "TrendingUp",
        category: "Reserved Core Modules"
      },
      {
        id: "m28",
        name: "Multi-Organization & Enterprise Governance",
        description: "Manage global corporate entities, educational trusts, group schools, unified guidelines, and board profiles.",
        path: "module_governance",
        iconName: "Globe",
        category: "Reserved Core Modules"
      }
    ]
  }
];

export const SHARED_PLATFORM_CAPABILITIES = [
  { name: "Authentication & Identity", description: "SSO, MFA, session hardening" },
  { name: "RBAC & Permission Engine", description: "Role-Based Access Control matrix" },
  { name: "Multi-Tenant & RLS", description: "Row-Level Security tenant isolation" },
  { name: "Campus Context Engine", description: "Dynamic school context routing" },
  { name: "Real-Time Sync", description: "Live updates, state propagation" },
  { name: "Offline-First Sync", description: "Offline caching, batch reconciliation" },
  { name: "Notification Engine", description: "In-app alerts, SMS, Push, Email channels" },
  { name: "Global Search Engine", description: "Full-text database querying" },
  { name: "Audit & Activity Logging", description: "Immutable logs for compliance" },
  { name: "API & Integration Gateway", description: "Secure developer endpoints" },
  { name: "AI Platform Services", description: "Gemini agent orchestration" },
  { name: "File & Storage Services", description: "S3-compatible bucket streaming" },
  { name: "Localization & Language Engine", description: "Multi-lingual translation tables" },
  { name: "Workflow Engine", description: "Automated business logic pipelines" }
];
