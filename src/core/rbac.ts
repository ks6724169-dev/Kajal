import { Role } from '../types';

export const RolePermissions = {
  super_admin: ['*'],
  school_admin: ['manage_users', 'view_reports', 'manage_fees'],
  teacher: ['view_students', 'manage_attendance', 'manage_grades'],
  student: ['view_attendance', 'view_grades'],
  parent: ['view_attendance', 'view_grades', 'pay_fees'],
};

export const hasPermission = (role: Role, permission: string): boolean => {
  const permissions = RolePermissions[role as keyof typeof RolePermissions];
  if (!permissions) return false;
  return permissions.includes('*') || permissions.includes(permission);
};
