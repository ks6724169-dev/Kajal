import { SyncJobRepository } from '../repositories/IntegrationRepository.js';
import { TransactionManager } from '../database/transaction.js';

export class SynchronizationEngine {
  constructor(private tenantId: string) {}

  async triggerSync(data: any, userId: string) {
    const tx = new TransactionManager();
    await tx.begin();
    try {
      const repo = new SyncJobRepository(this.tenantId, tx);
      const job = await repo.insert({
        ...data,
        status: 'QUEUED',
        created_by: userId
      });
      await tx.commit();
      return job;
    } catch (error) {
      await tx.rollback();
      throw error;
    }
  }

  async retryFailedSync(jobId: string, userId: string) {
    // Fetch job, requeue
    return { status: 'REQUEUED' };
  }
}
