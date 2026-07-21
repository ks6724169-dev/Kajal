import { Request, Response } from 'express';
import { DataPlatformService } from '../services/DataPlatformService.js';
import { ETLEngine } from '../services/ETLEngine.js';
import { MLPipelineEngine } from '../services/MLPipelineEngine.js';
import { z } from 'zod';
import { DataPipelineSchema, ETLJobSchema, TrainingJobSchema } from '../validators/DataPlatformValidator.js';

export class DataPlatformController {
  static async createPipeline(req: Request, res: Response) {
    try {
      const tenantId = (req as any).user.tenant_id;
      const userId = (req as any).user.id;
      const validatedData = DataPipelineSchema.parse(req.body);
      
      const service = new DataPlatformService(tenantId);
      const pipeline = await service.createPipeline(validatedData, userId);
      
      res.status(201).json(pipeline);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: error.issues });
      } else {
        res.status(500).json({ error: (error as Error).message });
      }
    }
  }

  static async triggerETL(req: Request, res: Response) {
    try {
      const tenantId = (req as any).user.tenant_id;
      const validatedData = ETLJobSchema.parse(req.body);
      
      const engine = new ETLEngine(tenantId);
      const job = await engine.executeJob(validatedData.pipeline_id, validatedData.step_name);
      
      res.status(201).json(job);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: error.issues });
      } else {
        res.status(500).json({ error: (error as Error).message });
      }
    }
  }

  static async startTraining(req: Request, res: Response) {
    try {
      const tenantId = (req as any).user.tenant_id;
      const validatedData = TrainingJobSchema.parse(req.body);
      
      const engine = new MLPipelineEngine(tenantId);
      const job = await engine.startTraining(validatedData.dataset_id, validatedData.model_name);
      
      res.status(201).json(job);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: error.issues });
      } else {
        res.status(500).json({ error: (error as Error).message });
      }
    }
  }
}
