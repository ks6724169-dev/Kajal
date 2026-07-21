import { Request, Response } from 'express';
import { AnalyticsService } from '../services/AnalyticsService.js';
import { KPIEngine } from '../services/KPIEngine.js';
import { ExecutiveIntelligenceEngine } from '../services/ExecutiveIntelligenceEngine.js';
import { z } from 'zod';
import { DashboardSchema, ReportRequestSchema } from '../validators/AnalyticsValidator.js';

export class AnalyticsController {
  static async createDashboard(req: Request, res: Response) {
    try {
      const tenantId = (req as any).user.tenant_id;
      const userId = (req as any).user.id;
      
      const validatedData = DashboardSchema.parse(req.body);
      const service = new AnalyticsService(tenantId);
      const dashboard = await service.createDashboard(validatedData, userId);
      
      res.status(201).json(dashboard);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: error.issues });
      } else {
        res.status(500).json({ error: (error as Error).message });
      }
    }
  }

  static async getDashboards(req: Request, res: Response) {
    try {
      const tenantId = (req as any).user.tenant_id;
      const service = new AnalyticsService(tenantId);
      const dashboards = await service.getDashboards();
      res.status(200).json(dashboards);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }

  static async getExecutiveSummary(req: Request, res: Response) {
    try {
      const tenantId = (req as any).user.tenant_id;
      const engine = new ExecutiveIntelligenceEngine(tenantId);
      const summary = await engine.generateExecutiveSummary();
      res.status(200).json(summary);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }

  static async getKPIs(req: Request, res: Response) {
    try {
      const tenantId = (req as any).user.tenant_id;
      const engine = new KPIEngine(tenantId);
      
      const attendance = await engine.calculateAttendancePercentage();
      const pass = await engine.calculatePassPercentage();
      const revenue = await engine.calculateRevenue();
      
      res.status(200).json({
        attendance,
        pass,
        revenue
      });
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }
}
