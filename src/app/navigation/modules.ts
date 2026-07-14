import {
  LayoutDashboard,
  Sparkles,
  Users,
  CreditCard,
  QrCode,
  Navigation,
  FileSpreadsheet,
  Briefcase,
  BookOpen,
  Video,
  Smartphone,
  Settings,
  LucideIcon
} from 'lucide-react';
import { Role } from '../../types';

export type AppModuleId =
  | 'dashboard'
  | 'ai_hub'
  | 'students'
  | 'fees'
  | 'attendance'
  | 'transport'
  | 'exams'
  | 'hrms'
  | 'library'
  | 'cctv'
  | 'mobile_apps'
  | 'settings';

export type AppModuleDefinition = {
  id: AppModuleId;
  label: string;
  description: string;
  icon: LucideIcon;
  badge?: string;
  allowedRoles: Role[];
  enterpriseDomain: 'insights' | 'academics' | 'finance' | 'operations' | 'people' | 'platform';
};

export const APP_MODULES: AppModuleDefinition[] = [
  { id: 'dashboard', label: 'BI Analytics Dashboard', description: 'Executive KPIs, occupancy, collections, and campus health.', icon: LayoutDashboard, allowedRoles: ['super_admin', 'principal'], enterpriseDomain: 'insights' },
  { id: 'ai_hub', label: 'AI Campus Suite', description: 'AI copilots for principals, teachers, students, and parents.', icon: Sparkles, badge: 'AI', allowedRoles: ['super_admin', 'principal', 'teacher'], enterpriseDomain: 'platform' },
  { id: 'students', label: 'Students & Admissions', description: 'Student lifecycle, admissions, profiles, and guardians.', icon: Users, allowedRoles: ['super_admin', 'principal', 'teacher'], enterpriseDomain: 'academics' },
  { id: 'fees', label: 'Fee & UPI Collection', description: 'Invoices, collections, dues, discounts, and receipts.', icon: CreditCard, allowedRoles: ['super_admin', 'principal', 'parent'], enterpriseDomain: 'finance' },
  { id: 'attendance', label: 'Face ID Attendance', description: 'Student and staff attendance with daily exception workflows.', icon: QrCode, allowedRoles: ['super_admin', 'principal', 'teacher', 'student', 'parent'], enterpriseDomain: 'academics' },
  { id: 'transport', label: 'Live GPS Bus Tracking', description: 'Routes, buses, drivers, live location, and parent visibility.', icon: Navigation, allowedRoles: ['super_admin', 'principal', 'parent', 'driver'], enterpriseDomain: 'operations' },
  { id: 'exams', label: 'Exams & OMR Scanner', description: 'Assessments, score capture, report cards, and exam analytics.', icon: FileSpreadsheet, allowedRoles: ['super_admin', 'principal', 'teacher', 'student', 'parent'], enterpriseDomain: 'academics' },
  { id: 'hrms', label: 'HRMS & Payroll', description: 'Faculty records, payroll, leaves, compliance, and documents.', icon: Briefcase, allowedRoles: ['super_admin', 'principal'], enterpriseDomain: 'people' },
  { id: 'library', label: 'Library & Inventory', description: 'Books, hostels, inventory, assets, and issue workflows.', icon: BookOpen, allowedRoles: ['super_admin', 'principal', 'teacher', 'student'], enterpriseDomain: 'operations' },
  { id: 'cctv', label: 'CCTV Security Feeds', description: 'Campus safety wall, incident review, and emergency status.', icon: Video, allowedRoles: ['super_admin', 'principal'], enterpriseDomain: 'operations' },
  { id: 'mobile_apps', label: 'Mobile App Previews', description: 'Preview student, parent, teacher, and driver mobile journeys.', icon: Smartphone, allowedRoles: ['super_admin', 'principal', 'teacher', 'student', 'parent', 'driver'], enterpriseDomain: 'platform' },
  { id: 'settings', label: 'SaaS Settings & Audit', description: 'Tenant settings, audit controls, localization, and governance.', icon: Settings, allowedRoles: ['super_admin'], enterpriseDomain: 'platform' },
];

export const DEFAULT_MODULE_ID: AppModuleId = 'dashboard';

export const getModuleById = (moduleId: string) => APP_MODULES.find((module) => module.id === moduleId);
