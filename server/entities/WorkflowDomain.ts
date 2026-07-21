import { BaseEntity } from './BaseEntity.js';

export interface WorkflowMaster extends BaseEntity {
  name: string;
  module: string;
  description?: string;
  is_active: boolean;
}

export interface WorkflowVersion extends BaseEntity {
  workflow_id: string;
  version_number: number;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  published_at?: Date;
  published_by?: string;
  schema_definition: any;
}

export interface WorkflowStep extends BaseEntity {
  workflow_version_id: string;
  name: string;
  type: 'START' | 'APPROVAL' | 'CONDITION' | 'TASK' | 'AUTO_ACTION' | 'END';
  configuration: any;
}

export interface WorkflowTransition extends BaseEntity {
  workflow_version_id: string;
  from_step_id: string;
  to_step_id: string;
  condition?: string;
}

export interface WorkflowInstance extends BaseEntity {
  workflow_version_id: string;
  entity_type: string;
  entity_id: string;
  status: 'IN_PROGRESS' | 'COMPLETED' | 'REJECTED' | 'CANCELLED';
  current_step_id?: string;
  started_by: string;
  context_data?: any;
}

export interface WorkflowInstanceStep extends BaseEntity {
  instance_id: string;
  step_id: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'REJECTED' | 'SKIPPED';
  started_at: Date;
  completed_at?: Date;
  outcome?: string;
  comments?: string;
}

export interface WorkflowAssignment extends BaseEntity {
  instance_step_id: string;
  assigned_to_user?: string;
  assigned_to_role?: string;
  assigned_to_department?: string;
  status: 'PENDING' | 'COMPLETED';
}

export interface ApprovalMaster extends BaseEntity {
  instance_step_id: string;
  approver_id: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'DELEGATED';
  comments?: string;
  action_date?: Date;
}

export interface ApprovalHistory extends BaseEntity {
  approval_id: string;
  action: string;
  actor_id: string;
  comments?: string;
  action_date: Date;
}

export interface ApprovalMatrix extends BaseEntity {
  module: string;
  entity_type: string;
  condition: string;
  required_role: string;
  level: number;
}

export interface BusinessRule extends BaseEntity {
  module: string;
  name: string;
  condition_logic: string;
  action_logic: string;
  is_active: boolean;
}

export interface AutomationTrigger extends BaseEntity {
  event_name: string;
  condition: string;
  is_active: boolean;
}

export interface AutomationAction extends BaseEntity {
  trigger_id: string;
  action_type: 'WEBHOOK' | 'EMAIL' | 'NOTIFICATION' | 'WORKFLOW_START' | 'DB_UPDATE';
  configuration: any;
}

export interface WorkflowLog extends BaseEntity {
  instance_id: string;
  action: string;
  actor_id?: string;
  details?: any;
  timestamp: Date;
}

export interface TaskMaster extends BaseEntity {
  title: string;
  description?: string;
  module: string;
  entity_id?: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  status: 'TODO' | 'IN_PROGRESS' | 'DONE' | 'CANCELLED';
  due_date?: Date;
}

export interface TaskAssignment extends BaseEntity {
  task_id: string;
  assignee_id: string;
}

export interface EscalationRule extends BaseEntity {
  module: string;
  step_type: string;
  timeout_minutes: number;
  escalate_to_role: string;
  is_active: boolean;
}

export interface SLAPolicy extends BaseEntity {
  module: string;
  step_type: string;
  max_resolution_minutes: number;
  is_active: boolean;
}

export interface SchedulerJob extends BaseEntity {
  name: string;
  cron_expression: string;
  job_type: string;
  payload?: any;
  status: 'ACTIVE' | 'PAUSED' | 'FAILED';
  last_run_at?: Date;
  next_run_at?: Date;
}
