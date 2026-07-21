import { TaskMasterRepository } from '../repositories/WorkflowRepository.js';
import { TransactionManager } from '../database/transaction.js';

export class TaskEngine {
  constructor(private tenantId: string) {}

  async completeTask(taskId: string, currentVersion: number, outcome: string | undefined, comments: string | undefined, userId: string): Promise<any> {
    const tx = new TransactionManager();
    await tx.begin();
    try {
      const repo = new TaskMasterRepository(this.tenantId, tx);
      const updated = await repo.update(taskId, {
        status: 'DONE',
        updated_by: userId
      }, currentVersion);
      // Stub: additional logic like saving comments, etc.
      await tx.commit();
      return updated;
    } catch (error) {
      await tx.rollback();
      throw error;
    }
  }
}
