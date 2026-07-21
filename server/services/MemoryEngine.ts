import { AgentMemoryRepository } from '../repositories/AIAgentRepository.js';
import { TransactionManager } from '../database/transaction.js';

export class MemoryEngine {
  constructor(private tenantId: string) {}

  async storeMemory(agentId: string, userId: string, contextKey: string, content: string, importance: number): Promise<any> {
    const tx = new TransactionManager();
    await tx.begin();
    try {
      const repo = new AgentMemoryRepository(this.tenantId, tx);
      const memory = await repo.insert({
        agent_id: agentId,
        user_id: userId,
        context_key: contextKey,
        content,
        importance_score: importance
      });
      await tx.commit();
      return memory;
    } catch (error) {
      await tx.rollback();
      throw error;
    }
  }

  async retrieveContext(agentId: string, userId: string, query: string): Promise<string> {
    // Stub retrieval logic
    return "Retrieved memory context based on query.";
  }
}
