export interface BaseEntity {
  id: string;
}

export interface AuditableEntity extends BaseEntity {
  created_at: string;
  updated_at: string;
  created_by?: string | null;
  updated_by?: string | null;
}

export interface SoftDeletableEntity extends AuditableEntity {
  is_deleted: boolean;
  deleted_at?: string | null;
  deleted_by?: string | null;
}

export interface TenantEntity extends SoftDeletableEntity {
  organization_id: string;
}
