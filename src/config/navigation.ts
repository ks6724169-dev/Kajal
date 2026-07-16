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
  Settings 
} from 'lucide-react';
import React from 'react';

export interface NavItem {
  id: string;
  label: string;
  icon: React.ElementType;
  badge?: string;
  roles: string[];
}

export const navigationConfig: NavItem[] = [
  { id: 'dashboard', label: 'BI Analytics Dashboard', icon: LayoutDashboard, roles: ['super_admin', 'school_admin', 'teacher'] },
  { id: 'ai_hub', label: 'AI Campus Suite (Gemini)', icon: Sparkles, badge: 'AI', roles: ['super_admin', 'school_admin'] },
  { id: 'students', label: 'Students & Admissions', icon: Users, roles: ['super_admin', 'school_admin', 'teacher'] },
  { id: 'fees', label: 'Fee & UPI Collection', icon: CreditCard, roles: ['super_admin', 'school_admin'] },
  { id: 'attendance', label: 'Face ID Attendance', icon: QrCode, roles: ['super_admin', 'school_admin', 'teacher'] },
  { id: 'transport', label: 'Live GPS Bus Tracking', icon: Navigation, roles: ['super_admin', 'school_admin'] },
  { id: 'exams', label: 'Exams & OMR Scanner', icon: FileSpreadsheet, roles: ['super_admin', 'school_admin', 'teacher'] },
  { id: 'hrms', label: 'HRMS & Payroll', icon: Briefcase, roles: ['super_admin', 'school_admin'] },
  { id: 'library', label: 'Library & Inventory', icon: BookOpen, roles: ['super_admin', 'school_admin'] },
  { id: 'cctv', label: 'CCTV Security Feeds', icon: Video, roles: ['super_admin'] },
  { id: 'mobile_apps', label: 'Mobile App Previews', icon: Smartphone, roles: ['super_admin', 'school_admin'] },
  { id: 'settings', label: 'SaaS Settings & Audit', icon: Settings, roles: ['super_admin'] },
];

export const getNavigationForRole = (role: string) => {
  return navigationConfig.filter(item => item.roles.includes(role));
};
