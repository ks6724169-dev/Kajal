import { Role } from '../types';

export const RolePermissions: Record<string, string[]> = {
  super_admin: ['*'],
  organization_owner: ['*'],
  school_admin: [
    'manage_all', 'manage_users', 'view_reports', 'manage_fees', 'manage_tenant',
    'students.view', 'students.create', 'students.update', 'students.delete',
    'attendance.view', 'attendance.manage', 'fees.view', 'fees.manage',
    'exams.view', 'exams.manage', 'reports.view', 'reports.export', 'users.manage', 'settings.manage'
  ],
  principal: [
    'manage_tenant', 'edit_academic', 'view_reports', 'manage_users',
    'students.view', 'students.create', 'students.update',
    'attendance.view', 'attendance.manage', 'fees.view',
    'exams.view', 'exams.manage', 'reports.view', 'reports.export', 'users.manage'
  ],
  vice_principal: [
    'edit_academic', 'view_reports',
    'students.view', 'students.update', 'attendance.view', 'attendance.manage',
    'exams.view', 'exams.manage', 'reports.view'
  ],
  teacher: [
    'view_students', 'manage_attendance', 'manage_grades', 'edit_academic',
    'students.view', 'attendance.view', 'attendance.manage', 'exams.view', 'exams.manage'
  ],
  class_teacher: [
    'view_students', 'manage_attendance', 'manage_grades', 'edit_academic',
    'students.view', 'students.update', 'attendance.view', 'attendance.manage', 'exams.view', 'exams.manage'
  ],
  accountant: [
    'edit_finance', 'view_fees', 'generate_invoices', 'manage_fees',
    'fees.view', 'fees.manage', 'reports.view', 'reports.export'
  ],
  hr: [
    'manage_users', 'users.manage', 'reports.view'
  ],
  receptionist: [
    'students.view', 'attendance.view', 'users.manage'
  ],
  transport_manager: [
    'transport.manage', 'students.view'
  ],
  hostel_manager: [
    'hostel.manage', 'students.view'
  ],
  librarian: [
    'manage_library', 'view_books', 'library.manage'
  ],
  exam_controller: [
    'exams.view', 'exams.manage', 'reports.view', 'reports.export'
  ],
  inventory_manager: [
    'inventory.manage'
  ],
  student: [
    'view_attendance', 'view_grades', 'view_own_dashboard', 'view_academic_reports',
    'students.view_self', 'attendance.view_self', 'fees.view_self', 'exams.view_self'
  ],
  parent: [
    'view_attendance', 'view_grades', 'pay_fees', 'view_own_dashboard', 'view_academic_reports',
    'students.view_child', 'attendance.view_child', 'fees.view_child', 'fees.pay', 'exams.view_child'
  ],
  driver: [
    'transport.view_route'
  ],
  guest: [
    'view_public'
  ]
};

export const hasPermission = (role: Role, permission: string): boolean => {
  const permissions = RolePermissions[role] || RolePermissions['guest'] || [];
  if (permissions.includes('*') || permissions.includes('manage_all')) return true;
  return permissions.includes(permission);
};

export const getPermissionsForRole = (role: Role): string[] => {
  return RolePermissions[role] || ['view_own_dashboard'];
};
