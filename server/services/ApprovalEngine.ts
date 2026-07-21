import { ApprovalMasterRepository } from '../repositories/WorkflowRepository.js';
import { TransactionManager } from '../database/transaction.js';

export class ApprovalEngine {
  constructor(private tenantId: string) {}

  async approve(approvalId: string, currentVersion: number, comments: string | undefined, userId: string): Promise<any> {
    const tx = new TransactionManager();
    await tx.begin();
    try {
      const repo = new ApprovalMasterRepository(this.tenantId, tx);
      const updated = await repo.update(approvalId, {
        status: 'APPROVED',
        comments,
        action_date: new Date(),
        updated_by: userId
      }, currentVersion);
      await tx.commit();
      return updated;
    } catch (error) {
      await tx.rollback();
      throw error;
    }
  }

  async reject(approvalId: string, currentVersion: number, comments: string | undefined, userId: string): Promise<any> {
    const tx = new TransactionManager();
    await tx.begin();
    try {
      const repo = new ApprovalMasterRepository(this.tenantId, tx);
      const updated = await repo.update(approvalId, {
        status: 'REJECTED',
        comments,
        action_date: new Date(),
        updated_by: userId
      }, currentVersion);
      await tx.commit();
      return updated;
    } catch (error) {
      await tx.rollback();
      throw error;
    }
  }

  async delegate(approvalId: string, currentVersion: number, delegateToId: string, comments: string | undefined, userId: string): Promise<any> {
    // Stub
    return { status: 'DELEGATED' };
  }
}
