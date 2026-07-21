import { BaseEntity } from './BaseEntity.js';

export interface AIAgent extends BaseEntity {
  tenant_id: string;
  name: string;
  description?: string;
  model_provider: string;
  model_name: string;
  system_prompt: string;
  temperature: number;
  is_active: boolean;
}

export interface AgentSkill extends BaseEntity {
  tenant_id: string;
  agent_id: string;
  name: string;
  description: string;
  tool_schema: any;
}

export interface AgentMemory extends BaseEntity {
  tenant_id: string;
  agent_id: string;
  user_id?: string;
  context_key: string;
  content: string;
  importance_score: number;
  expires_at?: Date;
}

export interface AgentConversation extends BaseEntity {
  tenant_id: string;
  agent_id: string;
  user_id: string;
  title: string;
  status: 'ACTIVE' | 'ARCHIVED';
}

export interface AgentMessage extends BaseEntity {
  tenant_id: string;
  conversation_id: string;
  role: 'USER' | 'AGENT' | 'SYSTEM' | 'TOOL';
  content: string;
  tokens_used?: number;
}

export interface AgentTask extends BaseEntity {
  tenant_id: string;
  agent_id: string;
  name: string;
  description: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED' | 'REQUIRES_APPROVAL';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  result?: any;
}

export interface AgentExecution extends BaseEntity {
  tenant_id: string;
  task_id: string;
  step_number: number;
  action: string;
  result: any;
  status: 'SUCCESS' | 'FAILED';
}

export interface AgentWorkflow extends BaseEntity {
  tenant_id: string;
  agent_id: string;
  name: string;
  trigger_event: string;
  steps: any[];
  is_active: boolean;
}

export interface AgentReasoning extends BaseEntity {
  tenant_id: string;
  task_id?: string;
  execution_id?: string;
  thought_process: string;
  confidence_score: number;
}

export interface AgentDecision extends BaseEntity {
  tenant_id: string;
  agent_id: string;
  context: string;
  decision: string;
  confidence: number;
  is_autonomous: boolean;
  approved_by?: string;
}

export interface AgentRecommendation extends BaseEntity {
  tenant_id: string;
  agent_id: string;
  user_id: string;
  module: string;
  suggestion: string;
  priority: number;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
}

export interface AgentSchedule extends BaseEntity {
  tenant_id: string;
  agent_id: string;
  task_id: string;
  cron_expression: string;
  is_active: boolean;
}

export interface AgentNotification extends BaseEntity {
  tenant_id: string;
  agent_id: string;
  user_id: string;
  message: string;
  type: 'INFO' | 'APPROVAL' | 'ALERT';
  is_read: boolean;
}

export interface AgentAudit extends BaseEntity {
  tenant_id: string;
  agent_id: string;
  action: string;
  context: any;
}
