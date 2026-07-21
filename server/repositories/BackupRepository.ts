import { BaseRepository } from './BaseRepository.js';
import { 
  BackupJob, BackupSchedule, BackupPolicy, BackupHistory, BackupStorage,
  Snapshot, RestoreRequest, RestoreHistory, DisasterRecoveryPlan, RecoveryExecution,
  ArchivePolicy, ArchiveJob, ArchiveStorage, ArchiveHistory, RetentionPolicy,
  RestorePoint, ReplicationJob, ReplicationStatus, IntegrityCheck, BackupNotification
} from '../entities/BackupDomain.js';

export class BackupJobRepository extends BaseRepository<BackupJob> {
  protected tableName = 'backup_job';
}
export class BackupScheduleRepository extends BaseRepository<BackupSchedule> {
  protected tableName = 'backup_schedule';
}
export class BackupPolicyRepository extends BaseRepository<BackupPolicy> {
  protected tableName = 'backup_policy';
}
export class BackupHistoryRepository extends BaseRepository<BackupHistory> {
  protected tableName = 'backup_history';
}
export class BackupStorageRepository extends BaseRepository<BackupStorage> {
  protected tableName = 'backup_storage';
}
export class SnapshotRepository extends BaseRepository<Snapshot> {
  protected tableName = 'snapshot';
}
export class RestoreRequestRepository extends BaseRepository<RestoreRequest> {
  protected tableName = 'restore_request';
}
export class RestoreHistoryRepository extends BaseRepository<RestoreHistory> {
  protected tableName = 'restore_history';
}
export class DisasterRecoveryPlanRepository extends BaseRepository<DisasterRecoveryPlan> {
  protected tableName = 'disaster_recovery_plan';
}
export class RecoveryExecutionRepository extends BaseRepository<RecoveryExecution> {
  protected tableName = 'recovery_execution';
}
export class ArchivePolicyRepository extends BaseRepository<ArchivePolicy> {
  protected tableName = 'archive_policy';
}
export class ArchiveJobRepository extends BaseRepository<ArchiveJob> {
  protected tableName = 'archive_job';
}
export class ArchiveStorageRepository extends BaseRepository<ArchiveStorage> {
  protected tableName = 'archive_storage';
}
export class ArchiveHistoryRepository extends BaseRepository<ArchiveHistory> {
  protected tableName = 'archive_history';
}
export class RetentionPolicyRepository extends BaseRepository<RetentionPolicy> {
  protected tableName = 'retention_policy';
}
export class RestorePointRepository extends BaseRepository<RestorePoint> {
  protected tableName = 'restore_point';
}
export class ReplicationJobRepository extends BaseRepository<ReplicationJob> {
  protected tableName = 'replication_job';
}
export class ReplicationStatusRepository extends BaseRepository<ReplicationStatus> {
  protected tableName = 'replication_status';
}
export class IntegrityCheckRepository extends BaseRepository<IntegrityCheck> {
  protected tableName = 'integrity_check';
}
export class BackupNotificationRepository extends BaseRepository<BackupNotification> {
  protected tableName = 'backup_notification';
}
