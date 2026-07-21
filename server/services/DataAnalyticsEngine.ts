export class DataAnalyticsEngine {
  constructor(private tenantId: string) {}
  async getCrossModuleAnalytics() {
    return { total_records: 1000000 };
  }
}
