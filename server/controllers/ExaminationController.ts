import { Request, Response, NextFunction } from 'express';
import { examinationService } from '../services/ExaminationService.js';
import { academicIntelligenceEngine } from '../services/AcademicIntelligenceEngine.js';
import { sendSuccess } from '../core/response.js';
import { ValidationError } from '../errors/AppError.js';
import { UnitOfWork } from '../database/unitOfWork.js';
import { ExaminationRepository } from '../repositories/ExaminationRepository.js';
import {
  CreateExaminationSchema,
  UpdateExaminationSchema,
  CreateExaminationScheduleSchema,
  CreateMarksEntrySchema,
  UpdateMarksEntrySchema,
  CreateResultSchema
} from '../validators/ExaminationValidator.js';

export class ExaminationController {
  private getTenantId(req: Request): string {
    const tenantId = req.headers['x-tenant-id'] as string;
    if (!tenantId) {
      throw new ValidationError('Tenant ID (x-tenant-id) is required in headers');
    }
    return tenantId;
  }

  public async createExamination(req: Request, res: Response, next: NextFunction) {
    try {
      const tenantId = this.getTenantId(req);
      const parsed = CreateExaminationSchema.safeParse(req.body);
      if (!parsed.success) {
        throw new ValidationError('Validation failed', parsed.error.format());
      }
      const exam = await examinationService.createExamination(tenantId, parsed.data);
      sendSuccess(res, exam, 201);
    } catch (error) {
      next(error);
    }
  }

  public async getExamination(req: Request, res: Response, next: NextFunction) {
    try {
      const tenantId = this.getTenantId(req);
      const examId = req.params.id;
      const uow = new UnitOfWork(tenantId);
      const repo = uow.getRepository(ExaminationRepository);
      const exam = await repo.findOne(examId);
      if (!exam) {
        return res.status(404).json({ success: false, error: 'Examination not found' });
      }
      sendSuccess(res, exam);
    } catch (error) {
      next(error);
    }
  }

  public async updateExamination(req: Request, res: Response, next: NextFunction) {
    try {
      const tenantId = this.getTenantId(req);
      const examId = req.params.id;
      const { version, ...updateData } = req.body;
      if (version === undefined) {
        throw new ValidationError('Version is required for optimistic locking');
      }
      const parsed = UpdateExaminationSchema.safeParse(updateData);
      if (!parsed.success) {
        throw new ValidationError('Validation failed', parsed.error.format());
      }
      const uow = new UnitOfWork(tenantId);
      const repo = uow.getRepository(ExaminationRepository);
      const updated = await repo.update(examId, parsed.data, version);
      sendSuccess(res, updated);
    } catch (error) {
      next(error);
    }
  }

  public async deleteExamination(req: Request, res: Response, next: NextFunction) {
    try {
      const tenantId = this.getTenantId(req);
      const examId = req.params.id;
      const uow = new UnitOfWork(tenantId);
      const repo = uow.getRepository(ExaminationRepository);
      const deleted = await repo.softDelete(examId);
      sendSuccess(res, { success: deleted });
    } catch (error) {
      next(error);
    }
  }

  public async createExaminationSchedule(req: Request, res: Response, next: NextFunction) {
    try {
      const tenantId = this.getTenantId(req);
      const parsed = CreateExaminationScheduleSchema.safeParse(req.body);
      if (!parsed.success) {
        throw new ValidationError('Validation failed', parsed.error.format());
      }
      const schedule = await examinationService.createExaminationSchedule(tenantId, parsed.data);
      sendSuccess(res, schedule, 201);
    } catch (error) {
      next(error);
    }
  }

  public async recordMarks(req: Request, res: Response, next: NextFunction) {
    try {
      const tenantId = this.getTenantId(req);
      const parsed = CreateMarksEntrySchema.safeParse(req.body);
      if (!parsed.success) {
        throw new ValidationError('Validation failed', parsed.error.format());
      }
      const marks = await examinationService.recordMarks(tenantId, parsed.data);
      sendSuccess(res, marks, 201);
    } catch (error) {
      next(error);
    }
  }

  public async compileStudentGrade(req: Request, res: Response, next: NextFunction) {
    try {
      const tenantId = this.getTenantId(req);
      const { studentId, subjectId, term, academicYear, internalMarks, externalMarks } = req.body;
      if (!studentId || !subjectId || !term || !academicYear || internalMarks === undefined || externalMarks === undefined) {
        throw new ValidationError('Missing required fields for grade compilation');
      }
      const grade = await examinationService.compileStudentGrade(
        tenantId,
        studentId,
        subjectId,
        term,
        academicYear,
        Number(internalMarks),
        Number(externalMarks)
      );
      sendSuccess(res, grade);
    } catch (error) {
      next(error);
    }
  }

  public async compileGPA(req: Request, res: Response, next: NextFunction) {
    try {
      const tenantId = this.getTenantId(req);
      const { studentId, term, academicYear } = req.body;
      if (!studentId || !term || !academicYear) {
        throw new ValidationError('Missing required fields for GPA compilation');
      }
      const gpa = await examinationService.compileGPA(tenantId, studentId, term, academicYear);
      sendSuccess(res, gpa);
    } catch (error) {
      next(error);
    }
  }

  public async compileCGPA(req: Request, res: Response, next: NextFunction) {
    try {
      const tenantId = this.getTenantId(req);
      const { studentId, academicYear } = req.body;
      if (!studentId || !academicYear) {
        throw new ValidationError('Missing required fields for CGPA compilation');
      }
      const cgpa = await examinationService.compileCGPA(tenantId, studentId, academicYear);
      sendSuccess(res, cgpa);
    } catch (error) {
      next(error);
    }
  }

  public async declareResults(req: Request, res: Response, next: NextFunction) {
    try {
      const tenantId = this.getTenantId(req);
      const { examinationId } = req.body;
      if (!examinationId) {
        throw new ValidationError('examinationId is required');
      }
      const results = await examinationService.declareResults(tenantId, examinationId);
      sendSuccess(res, results);
    } catch (error) {
      next(error);
    }
  }

  public async promoteStudent(req: Request, res: Response, next: NextFunction) {
    try {
      const tenantId = this.getTenantId(req);
      const { studentId, fromClassId, toClassId, academicYear, isPromoted, reason } = req.body;
      if (!studentId || !fromClassId || !toClassId || !academicYear) {
        throw new ValidationError('Missing required fields for student promotion');
      }
      const promo = await examinationService.promoteStudent(
        tenantId,
        studentId,
        fromClassId,
        toClassId,
        academicYear,
        isPromoted ?? true,
        reason
      );
      sendSuccess(res, promo);
    } catch (error) {
      next(error);
    }
  }

  public async addAcademicRemark(req: Request, res: Response, next: NextFunction) {
    try {
      const tenantId = this.getTenantId(req);
      const remark = await examinationService.addAcademicRemark(tenantId, req.body);
      sendSuccess(res, remark);
    } catch (error) {
      next(error);
    }
  }

  public async analyzePerformance(req: Request, res: Response, next: NextFunction) {
    try {
      const tenantId = this.getTenantId(req);
      const { studentId, subjectId, averageMarks, attendanceRate } = req.body;
      if (!studentId || !subjectId || averageMarks === undefined || attendanceRate === undefined) {
        throw new ValidationError('Missing required fields for performance analysis');
      }
      const analysis = await academicIntelligenceEngine.analyzeStudentPerformance(
        tenantId,
        studentId,
        subjectId,
        Number(averageMarks),
        Number(attendanceRate)
      );
      sendSuccess(res, analysis);
    } catch (error) {
      next(error);
    }
  }
}
export const examinationController = new ExaminationController();
