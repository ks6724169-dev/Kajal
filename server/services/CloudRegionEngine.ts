import { 
  GlobalRegionRepository, 
  DisasterStatusRepository, 
  GlobalOperationLogRepository 
} from '../repositories/index.js';

export class CloudRegionEngine {
  private regionRepo: GlobalRegionRepository;
  private disasterRepo: DisasterStatusRepository;
  private logRepo: GlobalOperationLogRepository;

  constructor(private readonly tenantId: string) {
    this.regionRepo = new GlobalRegionRepository(this.tenantId);
    this.disasterRepo = new DisasterStatusRepository(this.tenantId);
    this.logRepo = new GlobalOperationLogRepository(this.tenantId);
  }

  async registerRegion(name: string, code: string, provider: string = 'AWS', latencyMs: number = 20) {
    const region = await this.regionRepo.insert({
      name,
      code,
      provider,
      latency_ms: latencyMs
    } as any);

    await this.logRepo.insert({
      action: 'CLOUD_REGION_REGISTER',
      severity: 'INFO',
      details: { region_id: region.id, name, code }
    });

    return region;
  }

  async routeTraffic(clientIp: string) {
    const regions = await this.regionRepo.findMany();
    // Simulate smart geographic routing by selecting the region with minimal latency
    const sortedRegions = [...regions].sort((a, b) => (a.latency_ms || 0) - (b.latency_ms || 0));
    const targetRegion = sortedRegions[0] || null;

    return {
      clientIp,
      assignedRegion: targetRegion,
      allRegions: sortedRegions,
      routingStrategy: 'LATENCY_BASED'
    };
  }

  async triggerGeoFailover(sourceRegionId: string, targetRegionId: string) {
    const disaster = await this.disasterRepo.insert({
      region_id: sourceRegionId,
      is_active: true,
      recovery_point_objective_seconds: 300,
      recovery_time_objective_seconds: 1800
    } as any);

    await this.logRepo.insert({
      action: 'GEO_FAILOVER_TRIGGERED',
      severity: 'CRITICAL',
      details: { sourceRegionId, targetRegionId, disasterId: disaster.id }
    });

    return {
      status: 'FAILOVER_COMPLETED',
      disasterId: disaster.id,
      sourceRegionId,
      targetRegionId,
      fallbackTimestamp: new Date()
    };
  }
}
