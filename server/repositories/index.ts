import { BaseRepository } from './BaseRepository.js';
import { BaseEntity } from '../entities/BaseEntity.js';

export class UserRepository extends BaseRepository<BaseEntity> {
  protected tableName = 'universal_user';
}

export class RoleRepository extends BaseRepository<BaseEntity> {
  protected tableName = 'role_registry';
}

export class PermissionRepository extends BaseRepository<BaseEntity> {
  protected tableName = 'permission_registry';
}

export class TenantRepository extends BaseRepository<BaseEntity> {
  protected tableName = 'tenant_registry';
}

export class OrganizationRepository extends BaseRepository<BaseEntity> {
  protected tableName = 'organization_registry';
}

export class CampusRepository extends BaseRepository<BaseEntity> {
  protected tableName = 'campus_registry';
}

export class AcademicRepository extends BaseRepository<BaseEntity> {
  protected tableName = 'academic_session_registry';
}

export class AuditRepository extends BaseRepository<BaseEntity> {
  protected tableName = 'core_audit';
}

export class ConfigurationRepository extends BaseRepository<BaseEntity> {
  protected tableName = 'system_configuration';
}

export * from './ParentRepository.js';
export * from './ExaminationRepository.js';
export * from './AIRepository.js';
export * from './AcademicIntelligenceRepository.js';
export * from './CommunicationRepository.js';
export * from './LibraryRepository.js';
export * from './FinanceRepository.js';
export * from './TransportRepository.js';
export * from './HRPayrollRepository.js';
export * from './InventoryRepository.js';
export * from './TimetableRepository.js';
export * from './AssessmentRepository.js';
export * from './AnalyticsRepository.js';
export * from './WorkflowRepository.js';
export * from './IntegrationRepository.js';
export * from './SecurityRepository.js';
export * from './MonitoringRepository.js';
export * from './BackupRepository.js';
export * from './AIAgentRepository.js';
export * from './DeveloperPlatformRepository.js';



export * from './DataPlatformRepository.js';
export * from './GlobalOperationsRepository.js';

// Explicitly export conflicting repositories to resolve TS2308 ambiguity
export { ArchivePolicyRepository, RetentionPolicyRepository } from './BackupRepository.js';
export { ArchivePolicyRepository as DataPlatformArchivePolicyRepository, RetentionPolicyRepository as DataPlatformRetentionPolicyRepository } from './DataPlatformRepository.js';

