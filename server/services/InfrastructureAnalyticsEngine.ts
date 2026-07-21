import { 
  InfrastructureCostRepository, 
  GlobalOperationLogRepository 
} from '../repositories/index.js';

export class InfrastructureAnalyticsEngine {
  private costRepo: InfrastructureCostRepository;
  private logRepo: GlobalOperationLogRepository;

  constructor(private readonly tenantId: string) {
    this.costRepo = new InfrastructureCostRepository(this.tenantId);
    this.logRepo = new GlobalOperationLogRepository(this.tenantId);
  }

  async trackCost(regionId: string, amountUsd: number, billingPeriod: string) {
    const cost = await this.costRepo.insert({
      region_id: regionId,
      amount_usd: amountUsd,
      billing_period: billingPeriod
    } as any);

    await this.logRepo.insert({
      action: 'INFRASTRUCTURE_COST_TRACK',
      severity: 'INFO',
      details: { cost_id: cost.id, regionId, amountUsd, billingPeriod }
    });

    return cost;
  }

  async getCurrentResourceMetrics() {
    return {
      cpuUsage: 42,
      memoryUsage: 58,
      storageUsage: 33,
      totalCostUsd: 14500,
      requestsCount: 2500000,
      activeUsers: 84000,
      aiUsageTokens: 42000000,
      regionalDistribution: {
        'us-east-1': 55000,
        'ap-southeast-1': 19000,
        'eu-central-1': 10000
      }
    };
  }
}
