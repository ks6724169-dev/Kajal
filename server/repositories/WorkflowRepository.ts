import { BaseRepository } from './BaseRepository.js';
import { 
  WorkflowMaster, 
  WorkflowVersion, 
  WorkflowInstance, 
  ApprovalMaster, 
  TaskMaster, 
  BusinessRule, 
  SchedulerJob 
} from '../entities/WorkflowDomain.js';

export class WorkflowMasterRepository extends BaseRepository<WorkflowMaster> {
  protected tableName = 'workflow_master';
}

export class WorkflowVersionRepository extends BaseRepository<WorkflowVersion> {
  protected tableName = 'workflow_version';
}

export class WorkflowInstanceRepository extends BaseRepository<WorkflowInstance> {
  protected tableName = 'workflow_instance';
}

export class ApprovalMasterRepository extends BaseRepository<ApprovalMaster> {
  protected tableName = 'approval_master';
}

export class TaskMasterRepository extends BaseRepository<TaskMaster> {
  protected tableName = 'task_master';
}

export class BusinessRuleRepository extends BaseRepository<BusinessRule> {
  protected tableName = 'business_rule';
}

export class SchedulerJobRepository extends BaseRepository<SchedulerJob> {
  protected tableName = 'scheduler_job';
}
