import { Request, Response, NextFunction } from 'express';
import { aiGateway } from '../ai/AIGateway.js';
import { sendSuccess } from '../core/response.js';
import { ValidationError } from '../errors/AppError.js';
import { UnitOfWork } from '../database/unitOfWork.js';
import {
  AIProviderRegistryRepository,
  AIModelRegistryRepository,
  AIUsageLogRepository,
  AICostTrackingRepository,
  AIProviderHealthRepository
} from '../repositories/AIRepository.js';
import { QuerySpecification } from '../repositories/QuerySpecification.js';
import {
  ChatRequestSchema,
  VisionRequestSchema,
  OCRRequestSchema,
  SummarizeRequestSchema,
  TranslateRequestSchema,
  EmbeddingRequestSchema,
  RecommendationRequestSchema
} from '../validators/AIValidator.js';

export class AIController {
  
  private getTenantId(req: Request): string {
    const tenantId = req.headers['x-tenant-id'] as string;
    if (!tenantId) {
      throw new ValidationError('Tenant ID (x-tenant-id) is required in headers');
    }
    return tenantId;
  }

  public async getProviders(req: Request, res: Response, next: NextFunction) {
    try {
      const tenantId = this.getTenantId(req);
      const uow = new UnitOfWork(tenantId);
      const repo = uow.getRepository(AIProviderRegistryRepository);
      
      let providers = await repo.findMany();
      if (providers.length === 0) {
        // Return default list if registry is empty
        providers = [
          { id: '1', tenantId, providerName: 'gemini', baseUrl: 'https://generativelanguage.googleapis.com', isActive: true, version: 1, status: 'ACTIVE', createdAt: new Date(), updatedAt: new Date() } as any,
          { id: '2', tenantId, providerName: 'openai', baseUrl: 'https://api.openai.com/v1', isActive: true, version: 1, status: 'ACTIVE', createdAt: new Date(), updatedAt: new Date() } as any,
          { id: '3', tenantId, providerName: 'claude', baseUrl: 'https://api.anthropic.com/v1', isActive: true, version: 1, status: 'ACTIVE', createdAt: new Date(), updatedAt: new Date() } as any
        ];
      }
      sendSuccess(res, providers);
    } catch (error) {
      next(error);
    }
  }

  public async getModels(req: Request, res: Response, next: NextFunction) {
    try {
      const tenantId = this.getTenantId(req);
      const uow = new UnitOfWork(tenantId);
      const repo = uow.getRepository(AIModelRegistryRepository);

      let models = await repo.findMany();
      if (models.length === 0) {
        // Return default model mapping
        models = [
          { id: '1', tenantId, providerName: 'gemini', modelName: 'gemini-3.5-flash', modelType: 'TEXT', contextWindow: 1000000, pricingInput: 0.000075, pricingOutput: 0.0003, isActive: true, version: 1, status: 'ACTIVE', createdAt: new Date(), updatedAt: new Date() } as any,
          { id: '2', tenantId, providerName: 'openai', modelName: 'gpt-4o', modelType: 'TEXT', contextWindow: 128000, pricingInput: 0.005, pricingOutput: 0.015, isActive: true, version: 1, status: 'ACTIVE', createdAt: new Date(), updatedAt: new Date() } as any,
          { id: '3', tenantId, providerName: 'claude', modelName: 'claude-3-5-sonnet-20241022', modelType: 'TEXT', contextWindow: 200000, pricingInput: 0.003, pricingOutput: 0.015, isActive: true, version: 1, status: 'ACTIVE', createdAt: new Date(), updatedAt: new Date() } as any
        ];
      }
      sendSuccess(res, models);
    } catch (error) {
      next(error);
    }
  }

  public async chat(req: Request, res: Response, next: NextFunction) {
    try {
      const tenantId = this.getTenantId(req);
      const parsed = ChatRequestSchema.safeParse(req.body);
      if (!parsed.success) {
        throw new ValidationError('Validation failed', parsed.error.format());
      }

      const { messages, ...options } = parsed.data;
      const result = await aiGateway.chat(tenantId, messages, options);
      sendSuccess(res, result);
    } catch (error) {
      next(error);
    }
  }

  public async analyzeImage(req: Request, res: Response, next: NextFunction) {
    try {
      const tenantId = this.getTenantId(req);
      const parsed = VisionRequestSchema.safeParse(req.body);
      if (!parsed.success) {
        throw new ValidationError('Validation failed', parsed.error.format());
      }

      const { image, mimeType, promptText, provider } = parsed.data;
      const buffer = Buffer.from(image, 'base64');
      const result = await aiGateway.analyzeImage(tenantId, buffer, mimeType, promptText, { provider });
      sendSuccess(res, { text: result });
    } catch (error) {
      next(error);
    }
  }

  public async analyzeDocument(req: Request, res: Response, next: NextFunction) {
    try {
      const tenantId = this.getTenantId(req);
      const parsed = OCRRequestSchema.safeParse(req.body);
      if (!parsed.success) {
        throw new ValidationError('Validation failed', parsed.error.format());
      }

      const { document, mimeType, promptText, provider } = parsed.data;
      const buffer = Buffer.from(document, 'base64');
      const result = await aiGateway.analyzeDocument(tenantId, buffer, mimeType, promptText, { provider });
      sendSuccess(res, { text: result });
    } catch (error) {
      next(error);
    }
  }

  public async summarize(req: Request, res: Response, next: NextFunction) {
    try {
      const tenantId = this.getTenantId(req);
      const parsed = SummarizeRequestSchema.safeParse(req.body);
      if (!parsed.success) {
        throw new ValidationError('Validation failed', parsed.error.format());
      }

      const { text } = parsed.data;
      const result = await aiGateway.summarize(tenantId, text);
      sendSuccess(res, { text: result });
    } catch (error) {
      next(error);
    }
  }

  public async translate(req: Request, res: Response, next: NextFunction) {
    try {
      const tenantId = this.getTenantId(req);
      const parsed = TranslateRequestSchema.safeParse(req.body);
      if (!parsed.success) {
        throw new ValidationError('Validation failed', parsed.error.format());
      }

      const { text, targetLanguage } = parsed.data;
      const result = await aiGateway.translate(tenantId, text, targetLanguage);
      sendSuccess(res, { text: result });
    } catch (error) {
      next(error);
    }
  }

  public async embed(req: Request, res: Response, next: NextFunction) {
    try {
      const tenantId = this.getTenantId(req);
      const parsed = EmbeddingRequestSchema.safeParse(req.body);
      if (!parsed.success) {
        throw new ValidationError('Validation failed', parsed.error.format());
      }

      const { text, provider } = parsed.data;
      const result = await aiGateway.embeddings(tenantId, text, { provider });
      sendSuccess(res, { embedding: result });
    } catch (error) {
      next(error);
    }
  }

  public async recommendation(req: Request, res: Response, next: NextFunction) {
    try {
      const tenantId = this.getTenantId(req);
      const parsed = RecommendationRequestSchema.safeParse(req.body);
      if (!parsed.success) {
        throw new ValidationError('Validation failed', parsed.error.format());
      }

      const { context } = parsed.data;
      const result = await aiGateway.recommendation(tenantId, context);
      sendSuccess(res, { text: result });
    } catch (error) {
      next(error);
    }
  }

  public async getUsage(req: Request, res: Response, next: NextFunction) {
    try {
      const tenantId = this.getTenantId(req);
      const uow = new UnitOfWork(tenantId);
      const repo = uow.getRepository(AIUsageLogRepository);
      const logs = await repo.findMany();
      sendSuccess(res, logs);
    } catch (error) {
      next(error);
    }
  }

  public async getCost(req: Request, res: Response, next: NextFunction) {
    try {
      const tenantId = this.getTenantId(req);
      const uow = new UnitOfWork(tenantId);
      const repo = uow.getRepository(AICostTrackingRepository);
      const costs = await repo.findMany();
      sendSuccess(res, costs);
    } catch (error) {
      next(error);
    }
  }

  public async getHealth(req: Request, res: Response, next: NextFunction) {
    try {
      const tenantId = this.getTenantId(req);
      const uow = new UnitOfWork(tenantId);
      const repo = uow.getRepository(AIProviderHealthRepository);
      const health = await repo.findMany();
      sendSuccess(res, health);
    } catch (error) {
      next(error);
    }
  }
}

export const aiController = new AIController();
