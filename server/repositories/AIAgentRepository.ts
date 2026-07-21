import { BaseRepository } from './BaseRepository.js';
import { 
  AIAgent, AgentSkill, AgentMemory, AgentConversation, AgentMessage, 
  AgentTask, AgentExecution, AgentWorkflow, AgentReasoning, 
  AgentDecision, AgentRecommendation, AgentSchedule, AgentNotification, AgentAudit 
} from '../entities/AIAgentDomain.js';

export class AIAgentRepository extends BaseRepository<AIAgent> {
  protected tableName = 'ai_agent';
}
export class AgentSkillRepository extends BaseRepository<AgentSkill> {
  protected tableName = 'ai_skill';
}
export class AgentMemoryRepository extends BaseRepository<AgentMemory> {
  protected tableName = 'ai_memory';
}
export class AgentConversationRepository extends BaseRepository<AgentConversation> {
  protected tableName = 'ai_conversation';
}
export class AgentMessageRepository extends BaseRepository<AgentMessage> {
  protected tableName = 'ai_message';
}
export class AgentTaskRepository extends BaseRepository<AgentTask> {
  protected tableName = 'ai_task';
}
export class AgentExecutionRepository extends BaseRepository<AgentExecution> {
  protected tableName = 'ai_execution';
}
export class AgentWorkflowRepository extends BaseRepository<AgentWorkflow> {
  protected tableName = 'ai_workflow';
}
export class AgentReasoningRepository extends BaseRepository<AgentReasoning> {
  protected tableName = 'ai_reasoning';
}
export class AgentDecisionRepository extends BaseRepository<AgentDecision> {
  protected tableName = 'ai_decision';
}
export class AgentRecommendationRepository extends BaseRepository<AgentRecommendation> {
  protected tableName = 'ai_recommendation';
}
export class AgentScheduleRepository extends BaseRepository<AgentSchedule> {
  protected tableName = 'ai_schedule';
}
export class AgentNotificationRepository extends BaseRepository<AgentNotification> {
  protected tableName = 'ai_notification';
}
export class AgentAuditRepository extends BaseRepository<AgentAudit> {
  protected tableName = 'ai_audit';
}
