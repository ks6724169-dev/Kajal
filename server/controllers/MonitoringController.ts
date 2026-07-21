import { Request, Response } from 'express';
import { HealthCheckEngine } from '../services/HealthCheckEngine.js';
import { IncidentEngine } from '../services/IncidentEngine.js';
import { FeatureFlagEngine } from '../services/FeatureFlagEngine.js';
import { DevOpsAnalyticsEngine } from '../services/DevOpsAnalyticsEngine.js';
import { PerformanceEngine } from '../services/PerformanceEngine.js';
import { z } from 'zod';
import { IncidentSchema, FeatureFlagSchema } from '../validators/MonitoringValidator.js';

export class MonitoringController {
  
  static async checkHealth(req: Request, res: Response) {
    try {
      const tenantId = (req as any).user?.tenant_id || 'system';
      const engine = new HealthCheckEngine(tenantId);
      const health = await engine.checkSystemHealth();
      res.status(200).json(health);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }

  static async getPerformance(req: Request, res: Response) {
    try {
      const tenantId = (req as any).user.tenant_id;
      const engine = new PerformanceEngine(tenantId);
      const perf = await engine.analyzePerformance();
      res.status(200).json(perf);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }

  static async createIncident(req: Request, res: Response) {
    try {
      const tenantId = (req as any).user.tenant_id;
      const userId = (req as any).user.id;
      const validatedData = IncidentSchema.parse(req.body);
      
      const engine = new IncidentEngine(tenantId);
      const incident = await engine.createIncident(validatedData, userId);
      
      res.status(201).json(incident);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: error.issues });
      } else {
        res.status(500).json({ error: (error as Error).message });
      }
    }
  }

  static async setFeatureFlag(req: Request, res: Response) {
    try {
      const tenantId = (req as any).user.tenant_id;
      const userId = (req as any).user.id;
      const validatedData = FeatureFlagSchema.parse(req.body);
      
      const engine = new FeatureFlagEngine(tenantId);
      const flag = await engine.createOrUpdateFlag(validatedData, userId);
      
      res.status(201).json(flag);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: error.issues });
      } else {
        res.status(500).json({ error: (error as Error).message });
      }
    }
  }

  static async analyzeIncident(req: Request, res: Response) {
    try {
      const tenantId = (req as any).user.tenant_id;
      const incidentId = req.params.incidentId;
      
      const engine = new DevOpsAnalyticsEngine(tenantId);
      const analysis = await engine.performRootCauseAnalysis(incidentId);
      
      res.status(200).json(analysis);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }
}
