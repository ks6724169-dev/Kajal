import { Request, Response } from 'express';
import { BackupService } from '../services/BackupService.js';
import { BackupAnalyticsEngine } from '../services/BackupAnalyticsEngine.js';
import { z } from 'zod';
import { BackupJobSchema, RestoreRequestSchema } from '../validators/BackupValidator.js';

export class BackupController {
  
  static async triggerBackup(req: Request, res: Response) {
    try {
      const tenantId = (req as any).user.tenant_id;
      const userId = (req as any).user.id;
      const validatedData = BackupJobSchema.parse(req.body);
      
      const service = new BackupService(tenantId);
      const job = await service.triggerBackup(validatedData, userId);
      
      res.status(201).json(job);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: error.issues });
      } else {
        res.status(500).json({ error: (error as Error).message });
      }
    }
  }

  static async triggerRestore(req: Request, res: Response) {
    try {
      const tenantId = (req as any).user.tenant_id;
      const userId = (req as any).user.id;
      const validatedData = RestoreRequestSchema.parse(req.body);
      
      const service = new BackupService(tenantId);
      const request = await service.triggerRestore(validatedData, userId);
      
      res.status(201).json(request);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: error.issues });
      } else {
        res.status(500).json({ error: (error as Error).message });
      }
    }
  }

  static async getAnalytics(req: Request, res: Response) {
    try {
      const tenantId = (req as any).user.tenant_id;
      const engine = new BackupAnalyticsEngine(tenantId);
      const health = await engine.analyzeBackupHealth();
      const capacity = await engine.predictStorageCapacity();
      
      res.status(200).json({ health, capacity });
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }
}
