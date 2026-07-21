import { ApplicationLogRepository } from '../repositories/MonitoringRepository.js';
import { TransactionManager } from '../database/transaction.js';

export class LoggingEngine {
  constructor(private tenantId: string) {}

  async logInfo(module: string, message: string, details?: any): Promise<void> {
    const tx = new TransactionManager();
    await tx.begin();
    try {
      const repo = new ApplicationLogRepository(this.tenantId, tx);
      await repo.insert({
        level: 'INFO',
        module,
        message,
        details,
        timestamp: new Date()
      });
      await tx.commit();
    } catch (error) {
      await tx.rollback();
      throw error;
    }
  }

  async getLogs(query: any): Promise<any[]> {
    // Stub
    return [];
  }
}
