import { AIAgentRepository, AgentTaskRepository } from '../repositories/AIAgentRepository.js';
import { TransactionManager } from '../database/transaction.js';
import { CopilotEngine } from './CopilotEngine.js';
import { MemoryEngine } from './MemoryEngine.js';
import { AutonomousExecutionEngine } from './AutonomousExecutionEngine.js';
import { RecommendationEngine } from './RecommendationEngine.js';

export class AIAgentService {
  constructor(private tenantId: string) {}

  async createAgent(data: any) {
    const tx = new TransactionManager();
    await tx.begin();
    try {
      const repo = new AIAgentRepository(this.tenantId, tx);
      const agent = await repo.insert({
        ...data,
        is_active: true
      });
      await tx.commit();
      return agent;
    } catch (error) {
      await tx.rollback();
      throw error;
    }
  }

  async processChat(data: any, userId: string) {
    const copilot = new CopilotEngine(this.tenantId);
    return await copilot.chat(data.agent_id, userId, data.message, data.conversation_id);
  }

  async createTask(data: any) {
    const tx = new TransactionManager();
    await tx.begin();
    try {
      const repo = new AgentTaskRepository(this.tenantId, tx);
      const task = await repo.insert({
        ...data,
        status: 'PENDING'
      });
      await tx.commit();
      return task;
    } catch (error) {
      await tx.rollback();
      throw error;
    }
  }

  async executeTask(taskId: string) {
    const engine = new AutonomousExecutionEngine(this.tenantId);
    return await engine.executeTask(taskId);
  }
}
