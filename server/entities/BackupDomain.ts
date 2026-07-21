import { BaseEntity } from './BaseEntity.js';

export interface BackupJob extends BaseEntity {
  tenant_id: string;
  job_name: string;
  backup_type: 'FULL' | 'INCREMENTAL' | 'DIFFERENTIAL';
  status: 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';
  storage_id: string;
  started_at?: Date;
  completed_at?: Date;
  size_bytes?: number;
}

export interface BackupSchedule extends BaseEntity {
  tenant_id: string;
  name: string;
  cron_expression: string;
  backup_type: 'FULL' | 'INCREMENTAL' | 'DIFFERENTIAL';
  policy_id: string;
  is_active: boolean;
}

export interface BackupPolicy extends BaseEntity {
  tenant_id: string;
  name: string;
  retention_days: number;
  encryption_enabled: boolean;
  compression_enabled: boolean;
}

export interface BackupHistory extends BaseEntity {
  tenant_id: string;
  job_id: string;
  status: string;
  message: string;
  details?: any;
}

export interface BackupStorage extends BaseEntity {
  tenant_id: string;
  name: string;
  provider: 'S3' | 'GCS' | 'AZURE' | 'LOCAL';
  configuration: any;
  is_active: boolean;
}

export interface Snapshot extends BaseEntity {
  tenant_id: string;
  name: string;
  source_id: string;
  size_bytes: number;
  status: 'CREATING' | 'AVAILABLE' | 'DELETING' | 'DELETED' | 'ERROR';
}

export interface RestoreRequest extends BaseEntity {
  tenant_id: string;
  backup_id?: string;
  snapshot_id?: string;
  target_location: string;
  status: 'PENDING' | 'RESTORING' | 'COMPLETED' | 'FAILED';
  requested_by: string;
}

export interface RestoreHistory extends BaseEntity {
  tenant_id: string;
  restore_id: string;
  status: string;
  message: string;
  details?: any;
}

export interface DisasterRecoveryPlan extends BaseEntity {
  tenant_id: string;
  name: string;
  description?: string;
  rpo_minutes: number;
  rto_minutes: number;
  is_active: boolean;
}

export interface RecoveryExecution extends BaseEntity {
  tenant_id: string;
  plan_id: string;
  execution_type: 'TEST' | 'ACTUAL';
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED';
  started_at: Date;
  completed_at?: Date;
}

export interface ArchivePolicy extends BaseEntity {
  tenant_id: string;
  name: string;
  retention_years: number;
  cold_storage_id: string;
  is_active: boolean;
}

export interface ArchiveJob extends BaseEntity {
  tenant_id: string;
  policy_id: string;
  status: 'PENDING' | 'ARCHIVING' | 'COMPLETED' | 'FAILED';
  total_records: number;
  size_bytes: number;
}

export interface ArchiveStorage extends BaseEntity {
  tenant_id: string;
  name: string;
  provider: 'S3_GLACIER' | 'GCS_COLDLINE' | 'AZURE_ARCHIVE';
  configuration: any;
}

export interface ArchiveHistory extends BaseEntity {
  tenant_id: string;
  job_id: string;
  status: string;
  message: string;
}

export interface RetentionPolicy extends BaseEntity {
  tenant_id: string;
  name: string;
  entity_type: string;
  retention_period_days: number;
  action: 'DELETE' | 'ARCHIVE';
}

export interface RestorePoint extends BaseEntity {
  tenant_id: string;
  name: string;
  point_in_time: Date;
  backup_id: string;
}

export interface ReplicationJob extends BaseEntity {
  tenant_id: string;
  source_storage_id: string;
  target_storage_id: string;
  status: 'SYNCING' | 'IN_SYNC' | 'ERROR';
}

export interface ReplicationStatus extends BaseEntity {
  tenant_id: string;
  job_id: string;
  last_sync_at: Date;
  lag_seconds: number;
  status: string;
}

export interface IntegrityCheck extends BaseEntity {
  tenant_id: string;
  backup_id: string;
  status: 'PENDING' | 'PASSED' | 'FAILED';
  hash_value?: string;
  checked_at?: Date;
}

export interface BackupNotification extends BaseEntity {
  tenant_id: string;
  event_type: string;
  recipient: string;
  channel: 'EMAIL' | 'SMS' | 'WEBHOOK';
  status: 'PENDING' | 'SENT' | 'FAILED';
}
