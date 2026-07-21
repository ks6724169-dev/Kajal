import { Request, Response } from 'express';
import { GlobalOperationsService } from '../services/GlobalOperationsService.js';
import { z } from 'zod';
import { 
  DeploymentSchema, 
  ClusterSchema, 
  RegionSchema, 
  RolloutSchema, 
  ReleaseSchema, 
  ScalingPolicySchema, 
  AIOrchestrationSchema, 
  CommandCenterWidgetSchema 
} from '../validators/GlobalOperationsValidator.js';

export class GlobalOperationsController {
  
  static async orchestrateDeployment(req: Request, res: Response) {
    try {
      const tenantId = (req as any).user.tenant_id;
      const validatedData = DeploymentSchema.parse(req.body);
      const service = new GlobalOperationsService(tenantId);
      
      const deploymentResult = await service.orchestrateDeployment(
        validatedData.environment_id,
        validatedData.name,
        validatedData.release_id,
        'CANARY'
      );
      
      res.status(201).json(deploymentResult);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: error.issues });
      } else {
        res.status(500).json({ error: (error as Error).message });
      }
    }
  }

  static async registerClusterNode(req: Request, res: Response) {
    try {
      const tenantId = (req as any).user.tenant_id;
      const validatedData = ClusterSchema.parse(req.body);
      const service = new GlobalOperationsService(tenantId);
      
      const node = await service.kubernetes.registerNode(
        validatedData.region_id,
        validatedData.name,
        'worker',
        4,
        16
      );
      
      res.status(201).json(node);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: error.issues });
      } else {
        res.status(500).json({ error: (error as Error).message });
      }
    }
  }

  static async registerRegion(req: Request, res: Response) {
    try {
      const tenantId = (req as any).user.tenant_id;
      const validatedData = RegionSchema.parse(req.body);
      const service = new GlobalOperationsService(tenantId);
      
      const region = await service.region.registerRegion(
        validatedData.name,
        validatedData.code,
        validatedData.provider || 'AWS',
        validatedData.latency_ms || 20
      );
      
      res.status(201).json(region);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: error.issues });
      } else {
        res.status(500).json({ error: (error as Error).message });
      }
    }
  }

  static async triggerRollout(req: Request, res: Response) {
    try {
      const tenantId = (req as any).user.tenant_id;
      const validatedData = RolloutSchema.parse(req.body);
      const service = new GlobalOperationsService(tenantId);
      
      const rolloutResult = await service.deployment.triggerCanary(
        validatedData.release_id,
        'Rollout Step',
        'v1.0.0',
        validatedData.percentage
      );
      
      res.status(201).json(rolloutResult);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: error.issues });
      } else {
        res.status(500).json({ error: (error as Error).message });
      }
    }
  }

  static async configureAutoscaling(req: Request, res: Response) {
    try {
      const tenantId = (req as any).user.tenant_id;
      const validatedData = ScalingPolicySchema.parse(req.body);
      const service = new GlobalOperationsService(tenantId);
      
      const policy = await service.scaling.configureScalingPolicy(
        validatedData.cluster_id,
        validatedData.min_replicas,
        validatedData.max_replicas,
        validatedData.cpu_threshold,
        validatedData.mem_threshold
      );
      
      res.status(201).json(policy);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: error.issues });
      } else {
        res.status(500).json({ error: (error as Error).message });
      }
    }
  }

  static async scheduleMaintenance(req: Request, res: Response) {
    try {
      const tenantId = (req as any).user.tenant_id;
      const service = new GlobalOperationsService(tenantId);
      
      const schedule = await service.compliance.createCompliancePolicy(
        'Scheduled Security Maintenance',
        'ISO27001',
        { details: req.body }
      );
      
      res.status(201).json(schedule);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }

  static async getCommandCenterMetrics(req: Request, res: Response) {
    try {
      const tenantId = (req as any).user.tenant_id;
      const service = new GlobalOperationsService(tenantId);
      const health = await service.commandCenter.getGlobalHealthStatus();
      const metrics = await service.analytics.getCurrentResourceMetrics();
      
      res.status(200).json({
        dashboard: 'EGSO CommandCenter Main Frame',
        health,
        metrics,
        timestamp: new Date()
      });
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }

  static async getGlobalHealthSummary(req: Request, res: Response) {
    try {
      const tenantId = (req as any).user.tenant_id;
      const service = new GlobalOperationsService(tenantId);
      const summary = await service.aiGlobalHealthSummary();
      
      res.status(200).json(summary);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }

  static async getCapacityPlanner(req: Request, res: Response) {
    try {
      const tenantId = (req as any).user.tenant_id;
      const service = new GlobalOperationsService(tenantId);
      const capacityCalculation = await service.scaling.calculateCapacityNeed('CPU', 1000, 420);
      const aiForecast = await service.aiCapacityPlanner();
      
      res.status(200).json({
        current: capacityCalculation,
        forecast: aiForecast
      });
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }

  static async getCostAnalysis(req: Request, res: Response) {
    try {
      const tenantId = (req as any).user.tenant_id;
      const service = new GlobalOperationsService(tenantId);
      const details = await service.analytics.getCurrentResourceMetrics();
      const optimization = await service.aiCostOptimizer();
      
      res.status(200).json({
        totalHostingSpend: details.totalCostUsd,
        optimizationSuggestions: optimization
      });
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }

  static async getReleaseHistory(req: Request, res: Response) {
    try {
      const tenantId = (req as any).user.tenant_id;
      const service = new GlobalOperationsService(tenantId);
      const releasePrediction = await service.aiReleaseRiskPrediction('v3.2.0');
      
      res.status(200).json({
        version: 'v3.2.0',
        activeChannels: ['CANARY', 'STABLE'],
        riskAssessment: releasePrediction
      });
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }

  static async getComplianceOverview(req: Request, res: Response) {
    try {
      const tenantId = (req as any).user.tenant_id;
      const service = new GlobalOperationsService(tenantId);
      const complianceAdvisor = await service.aiComplianceAnalyzer();
      
      res.status(200).json({
        standardsAudited: ['GDPR', 'SOC2', 'ISO27001'],
        auditSummary: complianceAdvisor
      });
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }

  static async getAISummary(req: Request, res: Response) {
    try {
      const tenantId = (req as any).user.tenant_id;
      const service = new GlobalOperationsService(tenantId);
      
      const deploymentAdvisor = await service.aiDeploymentAdvisor('Canary rollout on Kubernetes us-east-1');
      const failurePrediction = await service.aiFailurePrediction();
      
      res.status(200).json({
        deploymentAdvisor,
        failurePrediction,
        timestamp: new Date()
      });
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }
}
