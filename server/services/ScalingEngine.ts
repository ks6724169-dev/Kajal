import { 
  AutoscalingPolicyRepository, 
  SystemCapacityRepository, 
  GlobalOperationLogRepository 
} from '../repositories/index.js';

export class ScalingEngine {
  private autoscalingRepo: AutoscalingPolicyRepository;
  private capacityRepo: SystemCapacityRepository;
  private logRepo: GlobalOperationLogRepository;

  constructor(private readonly tenantId: string) {
    this.autoscalingRepo = new AutoscalingPolicyRepository(this.tenantId);
    this.capacityRepo = new SystemCapacityRepository(this.tenantId);
    this.logRepo = new GlobalOperationLogRepository(this.tenantId);
  }

  async configureScalingPolicy(
    clusterId: string, 
    minReplicas: number, 
    maxReplicas: number, 
    cpuThreshold: number, 
    memThreshold: number
  ) {
    const policy = await this.autoscalingRepo.insert({
      cluster_id: clusterId,
      min_replicas: minReplicas,
      max_replicas: maxReplicas,
      cpu_threshold: cpuThreshold,
      mem_threshold: memThreshold
    } as any);

    await this.logRepo.insert({
      action: 'AUTOSCALING_POLICY_CONFIGURE',
      severity: 'INFO',
      details: { policy_id: policy.id, clusterId, minReplicas, maxReplicas }
    });

    return policy;
  }

  async calculateCapacityNeed(resourceType: string, allocated: number, used: number) {
    const capacity = await this.capacityRepo.insert({
      resource_type: resourceType,
      allocated,
      used
    } as any);

    await this.logRepo.insert({
      action: 'CAPACITY_CALCULATE',
      severity: 'INFO',
      details: { capacity_id: capacity.id, resourceType, utilization: used / allocated }
    });

    return {
      capacity,
      utilizationPercentage: (used / allocated) * 100,
      scaleUpRecommended: (used / allocated) > 0.75
    };
  }

  async predictCapacityLoad() {
    return {
      predictedLoadRatio: 0.84,
      peakHourUtc: 14,
      recommendation: 'Pre-scale clusters at 13:30 UTC'
    };
  }
}
