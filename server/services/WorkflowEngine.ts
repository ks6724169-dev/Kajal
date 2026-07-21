import { WorkflowMasterRepository, WorkflowVersionRepository } from '../repositories/WorkflowRepository.js';
import { TransactionManager } from '../database/transaction.js';

export class WorkflowEngine {
  constructor(private tenantId: string) {}

  async createWorkflow(data: any, userId: string): Promise<any> {
    const tx = new TransactionManager();
    await tx.begin();
    try {
      const repo = new WorkflowMasterRepository(this.tenantId, tx);
      const workflow = await repo.insert({
        ...data,
        created_by: userId
      });
      await tx.commit();
      return workflow;
    } catch (error) {
      await tx.rollback();
      throw error;
    }
  }

  async publishWorkflow(versionId: string, currentVersion: number, userId: string): Promise<any> {
    const tx = new TransactionManager();
    await tx.begin();
    try {
      const repo = new WorkflowVersionRepository(this.tenantId, tx);
      const updated = await repo.update(versionId, {
        status: 'PUBLISHED',
        published_at: new Date(),
        published_by: userId,
        updated_by: userId
      }, currentVersion);
      await tx.commit();
      return updated;
    } catch (error) {
      await tx.rollback();
      throw error;
    }
  }

  async startWorkflow(versionId: string, entityType: string, entityId: string, userId: string): Promise<any> {
    // Stub
    return { status: 'STARTED' };
  }
}
