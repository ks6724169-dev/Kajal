import { APIConnectorRepository, IntegrationProviderRepository } from '../repositories/IntegrationRepository.js';
import { TransactionManager } from '../database/transaction.js';

export class IntegrationService {
  constructor(private tenantId: string) {}

  async registerProvider(data: any, userId: string) {
    const tx = new TransactionManager();
    await tx.begin();
    try {
      const repo = new IntegrationProviderRepository(this.tenantId, tx);
      const provider = await repo.insert({
        ...data,
        is_active: true,
        created_by: userId
      });
      await tx.commit();
      return provider;
    } catch (error) {
      await tx.rollback();
      throw error;
    }
  }

  async configureConnector(data: any, userId: string) {
    const tx = new TransactionManager();
    await tx.begin();
    try {
      const repo = new APIConnectorRepository(this.tenantId, tx);
      const connector = await repo.insert({
        ...data,
        status: 'ACTIVE',
        created_by: userId
      });
      await tx.commit();
      return connector;
    } catch (error) {
      await tx.rollback();
      throw error;
    }
  }
}
