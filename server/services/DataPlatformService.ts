import { TransactionManager } from '../database/transaction.js';
import { DataPipelineRepository } from '../repositories/DataPlatformRepository.js';

export class DataPlatformService {
  constructor(private tenantId: string) {}

  async createPipeline(data: any, userId: string) {
    const tx = new TransactionManager();
    await tx.begin();
    try {
      const repo = new DataPipelineRepository(this.tenantId, tx);
      const pipeline = await repo.insert({
        ...data,
        status: 'ACTIVE',
        created_by: userId,
        updated_by: userId
      });
      await tx.commit();
      return pipeline;
    } catch (error) {
      await tx.rollback();
      throw error;
    }
  }
}
