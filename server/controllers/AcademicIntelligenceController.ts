import { Request, Response, NextFunction } from 'express';
import { academicIntelligenceService } from '../services/AcademicIntelligenceService.js';
import { sendSuccess } from '../core/response.js';
import { ValidationError } from '../errors/AppError.js';
import {
  AnalyzeStudentSchema,
  AnalyzeSubjectSchema,
  GenerateStudyPlanSchema,
  PredictPromotionSchema,
  PredictDropoutSchema,
  PredictAttendanceSchema,
  GenerateAIRecommendationSchema
} from '../validators/AcademicIntelligenceValidator.js';

export class AcademicIntelligenceController {
  
  private getTenantId(req: Request): string {
    const tenantId = req.headers['x-tenant-id'] as string;
    if (!tenantId) {
      throw new ValidationError('Tenant ID (x-tenant-id) is required in headers');
    }
    return tenantId;
  }

  public async analyzeStudent(req: Request, res: Response, next: NextFunction) {
    try {
      const tenantId = this.getTenantId(req);
      const parsed = AnalyzeStudentSchema.safeParse(req.body);
      if (!parsed.success) {
        throw new ValidationError('Validation failed', parsed.error.format());
      }
      const { studentId, academicYear, term } = parsed.data;
      const result = await academicIntelligenceService.analyzeStudent(tenantId, studentId, academicYear, term);
      sendSuccess(res, result);
    } catch (error) {
      next(error);
    }
  }

  public async analyzeSubject(req: Request, res: Response, next: NextFunction) {
    try {
      const tenantId = this.getTenantId(req);
      const parsed = AnalyzeSubjectSchema.safeParse(req.body);
      if (!parsed.success) {
        throw new ValidationError('Validation failed', parsed.error.format());
      }
      const { subjectId, academicYear, term } = parsed.data;
      const result = await academicIntelligenceService.analyzeSubject(tenantId, subjectId, academicYear, term);
      sendSuccess(res, result);
    } catch (error) {
      next(error);
    }
  }

  public async generateStudyPlan(req: Request, res: Response, next: NextFunction) {
    try {
      const tenantId = this.getTenantId(req);
      const parsed = GenerateStudyPlanSchema.safeParse(req.body);
      if (!parsed.success) {
        throw new ValidationError('Validation failed', parsed.error.format());
      }
      const { studentId, planType } = parsed.data;
      const result = await academicIntelligenceService.generateStudyPlan(tenantId, studentId, planType);
      sendSuccess(res, result);
    } catch (error) {
      next(error);
    }
  }

  public async generateRecommendation(req: Request, res: Response, next: NextFunction) {
    try {
      const tenantId = this.getTenantId(req);
      const parsed = GenerateAIRecommendationSchema.safeParse(req.body);
      if (!parsed.success) {
        throw new ValidationError('Validation failed', parsed.error.format());
      }
      const { studentId, context } = parsed.data;
      const result = await academicIntelligenceService.generateAIRecommendation(tenantId, studentId, context);
      sendSuccess(res, result);
    } catch (error) {
      next(error);
    }
  }

  public async predictPromotion(req: Request, res: Response, next: NextFunction) {
    try {
      const tenantId = this.getTenantId(req);
      const parsed = PredictPromotionSchema.safeParse(req.body);
      if (!parsed.success) {
        throw new ValidationError('Validation failed', parsed.error.format());
      }
      const { studentId, academicYear } = parsed.data;
      const result = await academicIntelligenceService.predictPromotion(tenantId, studentId, academicYear);
      sendSuccess(res, result);
    } catch (error) {
      next(error);
    }
  }

  public async predictDropout(req: Request, res: Response, next: NextFunction) {
    try {
      const tenantId = this.getTenantId(req);
      const parsed = PredictDropoutSchema.safeParse(req.body);
      if (!parsed.success) {
        throw new ValidationError('Validation failed', parsed.error.format());
      }
      const { studentId } = parsed.data;
      const result = await academicIntelligenceService.predictDropout(tenantId, studentId);
      sendSuccess(res, result);
    } catch (error) {
      next(error);
    }
  }

  public async predictAttendance(req: Request, res: Response, next: NextFunction) {
    try {
      const tenantId = this.getTenantId(req);
      const parsed = PredictAttendanceSchema.safeParse(req.body);
      if (!parsed.success) {
        throw new ValidationError('Validation failed', parsed.error.format());
      }
      const { studentId } = parsed.data;
      const result = await academicIntelligenceService.predictAttendance(tenantId, studentId);
      sendSuccess(res, result);
    } catch (error) {
      next(error);
    }
  }
}

export const academicIntelligenceController = new AcademicIntelligenceController();
