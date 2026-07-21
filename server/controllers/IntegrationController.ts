import { Request, Response } from 'express';
import { IntegrationService } from '../services/IntegrationService.js';
import { WebhookEngine } from '../services/WebhookEngine.js';
import { SynchronizationEngine } from '../services/SynchronizationEngine.js';
import { IntegrationAnalyticsEngine } from '../services/IntegrationAnalyticsEngine.js';
import { z } from 'zod';
import { 
  IntegrationProviderSchema, 
  APIConnectorSchema,
  WebhookEndpointSchema,
  SyncJobSchema
} from '../validators/IntegrationValidator.js';

export class IntegrationController {
  
  static async registerProvider(req: Request, res: Response) {
    try {
      const tenantId = (req as any).user.tenant_id;
      const userId = (req as any).user.id;
      const validatedData = IntegrationProviderSchema.parse(req.body);
      
      const service = new IntegrationService(tenantId);
      const provider = await service.registerProvider(validatedData, userId);
      
      res.status(201).json(provider);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: error.issues });
      } else {
        res.status(500).json({ error: (error as Error).message });
      }
    }
  }

  static async configureConnector(req: Request, res: Response) {
    try {
      const tenantId = (req as any).user.tenant_id;
      const userId = (req as any).user.id;
      const validatedData = APIConnectorSchema.parse(req.body);
      
      const service = new IntegrationService(tenantId);
      const connector = await service.configureConnector(validatedData, userId);
      
      res.status(201).json(connector);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: error.issues });
      } else {
        res.status(500).json({ error: (error as Error).message });
      }
    }
  }

  static async registerWebhook(req: Request, res: Response) {
    try {
      const tenantId = (req as any).user.tenant_id;
      const userId = (req as any).user.id;
      const validatedData = WebhookEndpointSchema.parse(req.body);
      
      const engine = new WebhookEngine(tenantId);
      const endpoint = await engine.registerEndpoint(validatedData, userId);
      
      res.status(201).json(endpoint);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: error.issues });
      } else {
        res.status(500).json({ error: (error as Error).message });
      }
    }
  }

  static async triggerSync(req: Request, res: Response) {
    try {
      const tenantId = (req as any).user.tenant_id;
      const userId = (req as any).user.id;
      const validatedData = SyncJobSchema.parse(req.body);
      
      const engine = new SynchronizationEngine(tenantId);
      const job = await engine.triggerSync(validatedData, userId);
      
      res.status(201).json(job);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: error.issues });
      } else {
        res.status(500).json({ error: (error as Error).message });
      }
    }
  }

  static async suggestMapping(req: Request, res: Response) {
    try {
      const tenantId = (req as any).user.tenant_id;
      
      const engine = new IntegrationAnalyticsEngine(tenantId);
      const suggestion = await engine.suggestDataMapping(req.body.source, req.body.target);
      
      res.status(200).json(suggestion);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }
}
