import { Request, Response, NextFunction } from 'express';
import { workforceEngine } from '../services/WorkforceEngine.js';
import { sendSuccess } from '../core/response.js';

export class WorkforceController {
  public async onboardEmployee(req: Request, res: Response, next: NextFunction) {
    try {
      const tenantId = req.headers['x-tenant-id'] as string;
      const record = await workforceEngine.onboardEmployee(tenantId, req.body);
      sendSuccess(res, record, 201);
    } catch (error) { next(error); }
  }

  public async assignTeacher(req: Request, res: Response, next: NextFunction) {
    try {
      const tenantId = req.headers['x-tenant-id'] as string;
      const record = await workforceEngine.assignTeacherProfile(tenantId, req.body);
      sendSuccess(res, record, 201);
    } catch (error) { next(error); }
  }

  public async markAttendance(req: Request, res: Response, next: NextFunction) {
    try {
      const tenantId = req.headers['x-tenant-id'] as string;
      const record = await workforceEngine.markAttendance(tenantId, req.body);
      sendSuccess(res, record, 201);
    } catch (error) { next(error); }
  }

  public async requestLeave(req: Request, res: Response, next: NextFunction) {
    try {
      const tenantId = req.headers['x-tenant-id'] as string;
      const record = await workforceEngine.requestLeave(tenantId, req.body);
      sendSuccess(res, record, 201);
    } catch (error) { next(error); }
  }

  public async reviewPerformance(req: Request, res: Response, next: NextFunction) {
    try {
      const tenantId = req.headers['x-tenant-id'] as string;
      const reviewerId = (req as any).user?.id as string || 'system';
      const record = await workforceEngine.submitPerformanceReview(tenantId, reviewerId, req.body);
      sendSuccess(res, record, 201);
    } catch (error) { next(error); }
  }

  public async createCourse(req: Request, res: Response, next: NextFunction) {
    try {
      const tenantId = req.headers['x-tenant-id'] as string;
      const record = await workforceEngine.createTrainingCourse(tenantId, req.body);
      sendSuccess(res, record, 201);
    } catch (error) { next(error); }
  }

  public async enrollCourse(req: Request, res: Response, next: NextFunction) {
    try {
      const tenantId = req.headers['x-tenant-id'] as string;
      const record = await workforceEngine.enrollTraining(tenantId, req.body);
      sendSuccess(res, record, 201);
    } catch (error) { next(error); }
  }
}

export const workforceController = new WorkforceController();
