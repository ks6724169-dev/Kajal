import { APIMetricRepository } from '../repositories/MonitoringRepository.js';
import { TransactionManager } from '../database/transaction.js';

export class MetricsEngine {
  constructor(private tenantId: string) {}

  async recordAPIMetric(endpoint: string, method: string, statusCode: number, responseTimeMs: number): Promise<void> {
    const tx = new TransactionManager();
    await tx.begin();
    try {
      const repo = new APIMetricRepository(this.tenantId, tx);
      await repo.insert({
        endpoint,
        method,
        status_code: statusCode,
        response_time_ms: responseTimeMs,
        timestamp: new Date()
      });
      await tx.commit();
    } catch (error) {
      await tx.rollback();
      throw error;
    }
  }

  async getMetrics(query: any): Promise<any[]> {
    // Stub
    return [];
  }
}
