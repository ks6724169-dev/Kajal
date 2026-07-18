import { Request, Response, NextFunction } from 'express';
import { admissionEngine } from '../services/AdmissionEngine.js';
import { studentService } from '../services/StudentService.js';
import { sendSuccess } from '../core/response.js';
import { StudentStatus } from '../entities/StudentDomain.js';
import { NotFoundError } from '../shared/errors/EnterpriseErrors.js';
import { ValidationError } from '../errors/AppError.js';

export class StudentController {
  public async admit(req: Request, res: Response, next: NextFunction) {
    try {
      const tenantId = req.headers['x-tenant-id'] as string;
      if (!tenantId) throw new ValidationError('Tenant ID missing');
      const student = await admissionEngine.processAdmission(tenantId, req.body);
      sendSuccess(res, student, 201);
    } catch (error) {
      next(error);
    }
  }

  public async getProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const tenantId = req.headers['x-tenant-id'] as string;
      if (!tenantId) throw new ValidationError('Tenant ID missing');
      const studentId = req.params.id;
      const student = await studentService.getProfile(tenantId, studentId);
      if (!student) throw new NotFoundError('Student not found');
      sendSuccess(res, student);
    } catch (error) {
      next(error);
    }
  }

  public async updateStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const tenantId = req.headers['x-tenant-id'] as string;
      if (!tenantId) throw new ValidationError('Tenant ID missing');
      const studentId = req.params.id;
      const status = req.body.status as StudentStatus;
      const student = await studentService.changeStatus(tenantId, studentId, status);
      sendSuccess(res, student);
    } catch (error) {
      next(error);
    }
  }

  public async runE2ELifecycleCheck(req: Request, res: Response, next: NextFunction) {
    try {
      const tenantId = req.headers['x-tenant-id'] as string;
      if (!tenantId) throw new ValidationError('Tenant ID missing');
      
      const { e2eCheckEngine } = await import('../services/E2ECheckEngine.js');
      const result = await e2eCheckEngine.executeStudentLifecycle(tenantId);
      
      sendSuccess(res, result);
    } catch (error) {
      next(error);
    }
  }
}

export const studentController = new StudentController();
