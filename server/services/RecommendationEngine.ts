import { AgentRecommendationRepository } from '../repositories/AIAgentRepository.js';
import { TransactionManager } from '../database/transaction.js';

export class RecommendationEngine {
  constructor(private tenantId: string) {}

  async generateRecommendation(agentId: string, userId: string, module: string, suggestion: string, priority: number) {
    const tx = new TransactionManager();
    await tx.begin();
    try {
      const repo = new AgentRecommendationRepository(this.tenantId, tx);
      const rec = await repo.insert({
        agent_id: agentId,
        user_id: userId,
        module,
        suggestion,
        priority,
        status: 'PENDING'
      });
      await tx.commit();
      return rec;
    } catch (error) {
      await tx.rollback();
      throw error;
    }
  }
}
