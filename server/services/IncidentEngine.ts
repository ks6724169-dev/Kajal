import { IncidentRepository } from '../repositories/MonitoringRepository.js';
import { TransactionManager } from '../database/transaction.js';

export class IncidentEngine {
  constructor(private tenantId: string) {}

  async createIncident(data: any, userId: string): Promise<any> {
    const tx = new TransactionManager();
    await tx.begin();
    try {
      const repo = new IncidentRepository(this.tenantId, tx);
      const incident = await repo.insert({
        ...data,
        status: 'OPEN',
        created_by: userId
      });
      await tx.commit();
      return incident;
    } catch (error) {
      await tx.rollback();
      throw error;
    }
  }

  async getIncidents(): Promise<any[]> {
    // Stub
    return [];
  }
}
