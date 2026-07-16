export interface BaseEntity {
  id: string;
  tenant_id: string;
  organization_id?: string;
  campus_id?: string;
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date | null;
  created_by?: string;
  updated_by?: string;
  version: number;
  status: string;
  metadata?: Record<string, any>;
}
