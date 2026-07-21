import { Request, Response } from 'express';
import { DeveloperPlatformService } from '../services/DeveloperPlatformService.js';
import { APIKeyEngine } from '../services/APIKeyEngine.js';
import { OpenAPIEngine } from '../services/OpenAPIEngine.js';
import { DeveloperAIEngine } from '../services/DeveloperAIEngine.js';
import { z } from 'zod';
import { DeveloperAccountSchema, APIApplicationSchema, APIKeySchema } from '../validators/DeveloperPlatformValidator.js';

export class DeveloperPlatformController {
  
  static async createDeveloper(req: Request, res: Response) {
    try {
      const tenantId = (req as any).user.tenant_id;
      const userId = (req as any).user.id;
      const validatedData = DeveloperAccountSchema.parse(req.body);
      
      const service = new DeveloperPlatformService(tenantId);
      const dev = await service.createDeveloper(validatedData, userId);
      
      res.status(201).json(dev);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: error.issues });
      } else {
        res.status(500).json({ error: (error as Error).message });
      }
    }
  }

  static async createApplication(req: Request, res: Response) {
    try {
      const tenantId = (req as any).user.tenant_id;
      const userId = (req as any).user.id;
      const validatedData = APIApplicationSchema.parse(req.body);
      
      const service = new DeveloperPlatformService(tenantId);
      const app = await service.createApplication(validatedData, userId);
      
      res.status(201).json(app);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: error.issues });
      } else {
        res.status(500).json({ error: (error as Error).message });
      }
    }
  }

  static async createAPIKey(req: Request, res: Response) {
    try {
      const tenantId = (req as any).user.tenant_id;
      const validatedData = APIKeySchema.parse(req.body);
      
      const engine = new APIKeyEngine(tenantId);
      const key = await engine.generateKey(validatedData.application_id, validatedData.name, validatedData.scopes);
      
      res.status(201).json(key);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: error.issues });
      } else {
        res.status(500).json({ error: (error as Error).message });
      }
    }
  }

  static async getOpenAPI(req: Request, res: Response) {
    try {
      const tenantId = (req as any).user.tenant_id;
      const engine = new OpenAPIEngine(tenantId);
      const schema = await engine.getOpenAPI();
      
      res.status(200).json(schema);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }

  static async generatePluginBoilerplate(req: Request, res: Response) {
    try {
      const tenantId = (req as any).user.tenant_id;
      const engine = new DeveloperAIEngine(tenantId);
      const boilerplate = await engine.generatePluginBoilerplate(req.body.description || 'Basic Plugin');
      
      res.status(200).json(boilerplate);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }
}
