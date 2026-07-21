export class MonitoringService {
  constructor(private tenantId: string) {}

  async getDashboardData(): Promise<any> {
    // Stub
    return {
      status: 'HEALTHY',
      active_incidents: 0,
      open_alerts: 0
    };
  }
}
