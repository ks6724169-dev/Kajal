import { Request, Response } from 'express';
import { AIAgentService } from '../services/AIAgentService.js';
import { RecommendationEngine } from '../services/RecommendationEngine.js';
import { z } from 'zod';
import { CreateAgentSchema, ChatMessageSchema, AgentTaskSchema, AgentRecommendationSchema } from '../validators/AIAgentValidator.js';

export class AIAgentController {
  
  static async createAgent(req: Request, res: Response) {
    try {
      const tenantId = (req as any).user.tenant_id;
      const validatedData = CreateAgentSchema.parse(req.body);
      
      const service = new AIAgentService(tenantId);
      const agent = await service.createAgent(validatedData);
      
      res.status(201).json(agent);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: error.issues });
      } else {
        res.status(500).json({ error: (error as Error).message });
      }
    }
  }

  static async chat(req: Request, res: Response) {
    try {
      const tenantId = (req as any).user.tenant_id;
      const userId = (req as any).user.id;
      const validatedData = ChatMessageSchema.parse(req.body);
      
      const service = new AIAgentService(tenantId);
      const response = await service.processChat(validatedData, userId);
      
      res.status(200).json(response);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: error.issues });
      } else {
        res.status(500).json({ error: (error as Error).message });
      }
    }
  }

  static async createTask(req: Request, res: Response) {
    try {
      const tenantId = (req as any).user.tenant_id;
      const validatedData = AgentTaskSchema.parse(req.body);
      
      const service = new AIAgentService(tenantId);
      const task = await service.createTask(validatedData);
      
      res.status(201).json(task);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: error.issues });
      } else {
        res.status(500).json({ error: (error as Error).message });
      }
    }
  }

  static async createRecommendation(req: Request, res: Response) {
    try {
      const tenantId = (req as any).user.tenant_id;
      const validatedData = AgentRecommendationSchema.parse(req.body);
      
      const engine = new RecommendationEngine(tenantId);
      const rec = await engine.generateRecommendation(
        validatedData.agent_id,
        validatedData.user_id,
        validatedData.module,
        validatedData.suggestion,
        validatedData.priority
      );
      
      res.status(201).json(rec);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: error.issues });
      } else {
        res.status(500).json({ error: (error as Error).message });
      }
    }
  }
}
