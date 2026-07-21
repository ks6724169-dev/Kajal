import { TransactionManager } from '../database/transaction.js';
import { DeveloperAccountRepository, APIApplicationRepository } from '../repositories/DeveloperPlatformRepository.js';

export class DeveloperPlatformService {
  constructor(private tenantId: string) {}

  async createDeveloper(data: any, userId: string) {
    const tx = new TransactionManager();
    await tx.begin();
    try {
      const repo = new DeveloperAccountRepository(this.tenantId, tx);
      const dev = await repo.insert({
        ...data,
        is_approved: true,
        status: 'ACTIVE',
        created_by: userId,
        updated_by: userId
      });
      await tx.commit();
      return dev;
    } catch (error) {
      await tx.rollback();
      throw error;
    }
  }

  async createApplication(data: any, userId: string) {
    const tx = new TransactionManager();
    await tx.begin();
    try {
      const repo = new APIApplicationRepository(this.tenantId, tx);
      const app = await repo.insert({
        ...data,
        status: 'ACTIVE',
        created_by: userId,
        updated_by: userId
      });
      await tx.commit();
      return app;
    } catch (error) {
      await tx.rollback();
      throw error;
    }
  }
}
