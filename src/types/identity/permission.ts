import { AuditableEntity, TenantEntity } from '../database/base';

export interface RoleEntity extends TenantEntity {
  name: string;
  code: string;
  description?: string | null;
  is_system: boolean;
}

export interface PermissionEntity extends AuditableEntity {
  resource: string;
  action: 'create' | 'read' | 'update' | 'delete' | 'manage';
  description?: string | null;
}

export interface RolePermissionEntity extends AuditableEntity {
  role_id: string;
  permission_id: string;
}

export interface UserRoleEntity extends TenantEntity {
  user_id: string;
  role_id: string;
  school_id?: string | null;
  campus_id?: string | null;
}
