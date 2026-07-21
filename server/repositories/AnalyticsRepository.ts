import { BaseRepository } from './BaseRepository.js';
import { Dashboard, KPI, Report, ExecutiveInsight } from '../entities/AnalyticsDomain.js';

export class DashboardRepository extends BaseRepository<Dashboard> {
  protected tableName = 'dashboard';
}

export class KPIRepository extends BaseRepository<KPI> {
  protected tableName = 'kpi';
}

export class ReportRepository extends BaseRepository<Report> {
  protected tableName = 'report';
}

export class ExecutiveInsightRepository extends BaseRepository<ExecutiveInsight> {
  protected tableName = 'executive_insight';
}
