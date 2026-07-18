import { Request, Response, NextFunction } from 'express';
import { libraryService } from '../services/LibraryService.js';
import { digitalKnowledgeEngine } from '../services/DigitalKnowledgeEngine.js';
import { aiKnowledgeEngine } from '../services/AIKnowledgeEngine.js';
import { knowledgeSearchEngine } from '../services/KnowledgeSearchEngine.js';
import { libraryAnalyticsEngine } from '../services/LibraryAnalyticsEngine.js';
import { sendSuccess } from '../core/response.js';
import { ValidationError } from '../errors/AppError.js';
import {
  RegisterBookSchema,
  IssueBookSchema,
  ReturnBookSchema,
  ReserveBookSchema,
  UploadDigitalResourceSchema,
  AIRecommendationSchema,
  SmartSearchSchema
} from '../validators/LibraryValidator.js';

export class LibraryController {
  
  private getTenantId(req: Request): string {
    const tenantId = req.headers['x-tenant-id'] as string;
    if (!tenantId) {
      throw new ValidationError('Tenant ID (x-tenant-id) is required in headers');
    }
    return tenantId;
  }

  public async registerBook(req: Request, res: Response, next: NextFunction) {
    try {
      const tenantId = this.getTenantId(req);
      const parsed = RegisterBookSchema.safeParse(req.body);
      if (!parsed.success) {
        throw new ValidationError('Validation failed', parsed.error.format());
      }
      const result = await libraryService.registerBook(tenantId, parsed.data);
      sendSuccess(res, result);
    } catch (error) {
      next(error);
    }
  }

  public async issueBook(req: Request, res: Response, next: NextFunction) {
    try {
      const tenantId = this.getTenantId(req);
      const parsed = IssueBookSchema.safeParse(req.body);
      if (!parsed.success) {
        throw new ValidationError('Validation failed', parsed.error.format());
      }
      const { memberId, copyId, dueDate } = parsed.data;
      const result = await libraryService.issueBook(tenantId, memberId, copyId, new Date(dueDate));
      sendSuccess(res, result);
    } catch (error) {
      next(error);
    }
  }

  public async returnBook(req: Request, res: Response, next: NextFunction) {
    try {
      const tenantId = this.getTenantId(req);
      const parsed = ReturnBookSchema.safeParse(req.body);
      if (!parsed.success) {
        throw new ValidationError('Validation failed', parsed.error.format());
      }
      const { issueId, conditionOnReturn, fineAmount } = parsed.data;
      const result = await libraryService.returnBook(tenantId, issueId, conditionOnReturn, fineAmount);
      sendSuccess(res, result);
    } catch (error) {
      next(error);
    }
  }

  public async reserveBook(req: Request, res: Response, next: NextFunction) {
    try {
      const tenantId = this.getTenantId(req);
      const parsed = ReserveBookSchema.safeParse(req.body);
      if (!parsed.success) {
        throw new ValidationError('Validation failed', parsed.error.format());
      }
      const { memberId, bookId, expiryDate } = parsed.data;
      const result = await libraryService.reserveBook(tenantId, memberId, bookId, expiryDate ? new Date(expiryDate) : undefined);
      sendSuccess(res, result);
    } catch (error) {
      next(error);
    }
  }

  public async uploadDigitalResource(req: Request, res: Response, next: NextFunction) {
    try {
      const tenantId = this.getTenantId(req);
      const parsed = UploadDigitalResourceSchema.safeParse(req.body);
      if (!parsed.success) {
        throw new ValidationError('Validation failed', parsed.error.format());
      }
      const { specificDetails, ...resourceData } = parsed.data;
      if (resourceData.publishedDate) {
         resourceData.publishedDate = new Date(resourceData.publishedDate) as any;
      }
      const result = await digitalKnowledgeEngine.uploadDigitalResource(tenantId, resourceData, specificDetails || {});
      sendSuccess(res, result);
    } catch (error) {
      next(error);
    }
  }

  public async aiRecommendation(req: Request, res: Response, next: NextFunction) {
    try {
      const tenantId = this.getTenantId(req);
      const parsed = AIRecommendationSchema.safeParse(req.body);
      if (!parsed.success) {
        throw new ValidationError('Validation failed', parsed.error.format());
      }
      const { memberId } = parsed.data;
      const result = await aiKnowledgeEngine.getBookRecommendation(tenantId, memberId);
      sendSuccess(res, result);
    } catch (error) {
      next(error);
    }
  }

  public async smartSearch(req: Request, res: Response, next: NextFunction) {
    try {
      const tenantId = this.getTenantId(req);
      const parsed = SmartSearchSchema.safeParse(req.query);
      if (!parsed.success) {
        throw new ValidationError('Validation failed', parsed.error.format());
      }
      const { query } = parsed.data;
      const result = await knowledgeSearchEngine.smartSearch(tenantId, query);
      sendSuccess(res, result);
    } catch (error) {
      next(error);
    }
  }

  public async getDashboardMetrics(req: Request, res: Response, next: NextFunction) {
    try {
      const tenantId = this.getTenantId(req);
      const result = await libraryAnalyticsEngine.getLibraryDashboardMetrics(tenantId);
      sendSuccess(res, result);
    } catch (error) {
      next(error);
    }
  }
}

export const libraryController = new LibraryController();
