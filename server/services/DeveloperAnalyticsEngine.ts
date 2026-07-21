export class DeveloperAnalyticsEngine {
  constructor(private tenantId: string) {}

  async getUsage(applicationId: string) {
    return { requests: 1000, errors: 5 };
  }
}
