import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GlobalOperationsService } from '../services/GlobalOperationsService.js';
import { 
  DeploymentReleaseRepository, 
  RollbackHistoryRepository, 
  KubernetesNodeRepository, 
  AutoscalingPolicyRepository, 
  GlobalRegionRepository 
} from '../repositories/index.js';
import { aiGateway } from '../ai/AIGateway.js';

vi.mock('../repositories/index.js', () => {
  return {
    DeploymentReleaseRepository: vi.fn(),
    DeploymentVersionRepository: vi.fn(),
    DeploymentStrategyRepository: vi.fn(),
    RollbackHistoryRepository: vi.fn(),
    GlobalOperationLogRepository: vi.fn().mockImplementation(() => ({
      insert: vi.fn().mockResolvedValue({ id: 'log-1' })
    })),
    KubernetesClusterRepository: vi.fn(),
    KubernetesNodeRepository: vi.fn(),
    GlobalRegionRepository: vi.fn(),
    DisasterStatusRepository: vi.fn(),
    EdgeLocationRepository: vi.fn(),
    EdgeCacheRepository: vi.fn(),
    CDNConfigurationRepository: vi.fn(),
    ServiceRegistryRepository: vi.fn(),
    ServiceDiscoveryRepository: vi.fn(),
    ServiceMeshRepository: vi.fn(),
    AutoscalingPolicyRepository: vi.fn(),
    SystemCapacityRepository: vi.fn(),
    CommandCenterDashboardRepository: vi.fn(),
    CommandCenterWidgetRepository: vi.fn(),
    CompliancePolicyRepository: vi.fn(),
    ComplianceAuditRepository: vi.fn(),
    InfrastructureCostRepository: vi.fn(),
    AIOrchestrationJobRepository: vi.fn().mockImplementation(() => ({
      insert: vi.fn().mockResolvedValue({ id: 'job-1' })
    })),
    AIClusterRepository: vi.fn(),
    AIModelRegistryGlobalRepository: vi.fn()
  };
});

vi.mock('../ai/AIGateway.js', () => {
  return {
    aiGateway: {
      generateJSON: vi.fn()
    }
  };
});

describe('GlobalOperationsService', () => {
  const tenantId = 'test-tenant-123';
  let service: GlobalOperationsService;

  beforeEach(() => {
    vi.clearAllMocks();
    service = new GlobalOperationsService(tenantId);
  });

  describe('Deployment & Release Management', () => {
    it('should trigger canary deployment successfully', async () => {
      const mockInsert = vi.fn().mockResolvedValue({ id: 'release-1', name: 'Canary Release', status: 'CANARY_IN_PROGRESS' });
      vi.mocked(DeploymentReleaseRepository).mockImplementation(() => ({
        insert: mockInsert
      } as any));

      const result = await service.orchestrateDeployment('env-1', 'Canary Release', 'v1.0.0', 'CANARY');
      expect(result.orchestrated.status).toBe('IN_PROGRESS');
      expect(result.orchestrated.release.id).toBe('release-1');
    });

    it('should successfully rollback a deployment release', async () => {
      const mockFindOne = vi.fn().mockResolvedValue({ id: 'release-1', version: 1 });
      const mockUpdate = vi.fn().mockResolvedValue({ id: 'release-1', status: 'ROLLED_BACK' });
      const mockRollbackInsert = vi.fn().mockResolvedValue({ id: 'rollback-1' });

      vi.mocked(DeploymentReleaseRepository).mockImplementation(() => ({
        findOne: mockFindOne,
        update: mockUpdate
      } as any));

      vi.mocked(RollbackHistoryRepository).mockImplementation(() => ({
        insert: mockRollbackInsert
      } as any));

      const result = await service.deployment.rollbackRelease('release-1', 'High error rates', 'user-admin');
      expect(result.status).toBe('SUCCESS');
      expect(result.rollback.id).toBe('rollback-1');
    });
  });

  describe('Kubernetes Engine Operations', () => {
    it('should register a node in a cluster successfully', async () => {
      const mockInsert = vi.fn().mockResolvedValue({ id: 'node-1', name: 'k8s-worker-1', role: 'worker' });
      vi.mocked(KubernetesNodeRepository).mockImplementation(() => ({
        insert: mockInsert
      } as any));

      const result = await service.kubernetes.registerNode('cluster-1', 'k8s-worker-1', 'worker', 4, 16);
      expect(result.id).toBe('node-1');
      expect(mockInsert).toHaveBeenCalled();
    });
  });

  describe('Autoscaling & Capacity Planning', () => {
    it('should configure auto scaling thresholds successfully', async () => {
      const mockInsert = vi.fn().mockResolvedValue({ id: 'policy-1', min_replicas: 2, max_replicas: 10 });
      vi.mocked(AutoscalingPolicyRepository).mockImplementation(() => ({
        insert: mockInsert
      } as any));

      const result = await service.scaling.configureScalingPolicy('cluster-1', 2, 10, 70, 80);
      expect(result.id).toBe('policy-1');
    });
  });

  describe('Multi Region Routing', () => {
    it('should route client traffic based on lowest region latency', async () => {
      const mockRegions = [
        { id: 'region-us', name: 'US East', code: 'us-east-1', latency_ms: 45 },
        { id: 'region-sg', name: 'Singapore', code: 'ap-southeast-1', latency_ms: 12 }
      ];
      vi.mocked(GlobalRegionRepository).mockImplementation(() => ({
        findMany: vi.fn().mockResolvedValue(mockRegions)
      } as any));

      const result = await service.region.routeTraffic('123.45.67.89');
      expect(result.assignedRegion.code).toBe('ap-southeast-1');
    });
  });

  describe('AI Recommendation Features', () => {
    it('should generate AI scaling recommendations from metrics', async () => {
      const aiResponse = { minReplicas: 3, maxReplicas: 12, cpuThreshold: 75, rationale: 'Upcoming traffic spike predicted' };
      vi.mocked(aiGateway.generateJSON).mockResolvedValue(aiResponse);

      const result = await service.aiAutoScalingRecommendation('{"currentCpu": 82}');
      expect(result.minReplicas).toBe(3);
      expect(result.maxReplicas).toBe(12);
      expect(result.cpuThreshold).toBe(75);
    });

    it('should predict release risk scores via AI', async () => {
      const aiResponse = { riskScore: 12, rollbackProbability: 0.05, mitigationStrategies: ['Monitor memory usage closely'] };
      vi.mocked(aiGateway.generateJSON).mockResolvedValue(aiResponse);

      const result = await service.aiReleaseRiskPrediction('v2.4.0');
      expect(result.riskScore).toBe(12);
      expect(result.rollbackProbability).toBe(0.05);
    });
  });

  describe('Command Center & Metrics Platform', () => {
    it('should retrieve global operational health matrices', async () => {
      const health = await service.commandCenter.getGlobalHealthStatus();
      expect(health.globalStatus).toBe('GREEN');
      expect(health.databaseHealth).toBe('CONNECTED_REPLICATED');
    });
  });
});
