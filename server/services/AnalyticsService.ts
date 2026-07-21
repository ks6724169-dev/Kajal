import { DashboardRepository, KPIRepository, ReportRepository } from '../repositories/AnalyticsRepository.js';
import { TransactionManager } from '../database/transaction.js';
import { Dashboard, Report } from '../entities/AnalyticsDomain.js';

export class AnalyticsService {
  constructor(private tenantId: string) {}

  async createDashboard(data: Partial<Dashboard>, userId: string): Promise<Dashboard> {
    const tx = new TransactionManager();
    await tx.begin();
    try {
      const repo = new DashboardRepository(this.tenantId, tx);
      const dashboard = await repo.insert({
        ...data,
        created_by: userId
      });
      await tx.commit();
      return dashboard;
    } catch (error) {
      await tx.rollback();
      throw error;
    }
  }

  async getDashboards(): Promise<Dashboard[]> {
    const repo = new DashboardRepository(this.tenantId);
    return repo.findMany();
  }

  async requestReport(data: Partial<Report>, userId: string): Promise<Report> {
    const tx = new TransactionManager();
    await tx.begin();
    try {
      const repo = new ReportRepository(this.tenantId, tx);
      const report = await repo.insert({
        ...data,
        report_status: 'PENDING',
        created_by: userId
      });
      await tx.commit();
      return report;
    } catch (error) {
      await tx.rollback();
      throw error;
    }
  }
}
