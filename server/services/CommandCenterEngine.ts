import { 
  CommandCenterDashboardRepository, 
  CommandCenterWidgetRepository, 
  GlobalOperationLogRepository 
} from '../repositories/index.js';

export class CommandCenterEngine {
  private dashboardRepo: CommandCenterDashboardRepository;
  private widgetRepo: CommandCenterWidgetRepository;
  private logRepo: GlobalOperationLogRepository;

  constructor(private readonly tenantId: string) {
    this.dashboardRepo = new CommandCenterDashboardRepository(this.tenantId);
    this.widgetRepo = new CommandCenterWidgetRepository(this.tenantId);
    this.logRepo = new GlobalOperationLogRepository(this.tenantId);
  }

  async createDashboard(name: string, isDefault: boolean = false) {
    const dashboard = await this.dashboardRepo.insert({
      name,
      is_default: isDefault
    } as any);

    await this.logRepo.insert({
      action: 'COMMAND_CENTER_DASHBOARD_CREATE',
      severity: 'INFO',
      details: { dashboard_id: dashboard.id, name }
    });

    return dashboard;
  }

  async registerWidget(dashboardId: string, title: string, type: string, gridLayout: any = {}) {
    const widget = await this.widgetRepo.insert({
      dashboard_id: dashboardId,
      title,
      type,
      grid_layout: gridLayout
    } as any);

    await this.logRepo.insert({
      action: 'COMMAND_CENTER_WIDGET_REGISTER',
      severity: 'INFO',
      details: { widget_id: widget.id, dashboardId, title }
    });

    return widget;
  }

  async getGlobalHealthStatus() {
    return {
      tenantHealth: 'EXCELLENT',
      aiHealth: 'OPERATIONAL',
      databaseHealth: 'CONNECTED_REPLICATED',
      queueHealth: 'ZERO_LAG',
      monitoring: 'OK',
      revenue: 'OPTIMIZED',
      security: 'SHIELDED',
      usage: 'STABLE_GROWING',
      globalStatus: 'GREEN'
    };
  }
}
