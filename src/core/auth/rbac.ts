import { Role } from '../../types';
import { APP_MODULES, AppModuleId } from '../../app/navigation/modules';

export type Permission =
  | 'analytics:read'
  | 'ai:use'
  | 'students:manage'
  | 'fees:manage'
  | 'attendance:read'
  | 'transport:read'
  | 'exams:manage'
  | 'hrms:manage'
  | 'resources:manage'
  | 'security:read'
  | 'mobile:preview'
  | 'settings:manage';

export type AuthenticatedUser = {
  id: string;
  email: string;
  displayName: string;
  tenantId: string;
  role: Role;
  permissions: Permission[];
};

export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  super_admin: ['analytics:read', 'ai:use', 'students:manage', 'fees:manage', 'attendance:read', 'transport:read', 'exams:manage', 'hrms:manage', 'resources:manage', 'security:read', 'mobile:preview', 'settings:manage'],
  principal: ['analytics:read', 'ai:use', 'students:manage', 'fees:manage', 'attendance:read', 'transport:read', 'exams:manage', 'hrms:manage', 'resources:manage', 'security:read', 'mobile:preview'],
  teacher: ['ai:use', 'students:manage', 'attendance:read', 'exams:manage', 'resources:manage', 'mobile:preview'],
  student: ['attendance:read', 'exams:manage', 'resources:manage', 'mobile:preview'],
  parent: ['fees:manage', 'attendance:read', 'transport:read', 'exams:manage', 'mobile:preview'],
  driver: ['transport:read', 'mobile:preview']
};

export const hasPermission = (role: Role, permission: Permission) => ROLE_PERMISSIONS[role].includes(permission);

export const canAccessModule = (role: Role, moduleId: AppModuleId) => {
  const module = APP_MODULES.find((item) => item.id === moduleId);
  return Boolean(module?.allowedRoles.includes(role));
};
