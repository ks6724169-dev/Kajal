import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth.js';
import { timetableService } from '../services/TimetableService.js';
import { timetableAnalyticsEngine } from '../services/TimetableAnalyticsEngine.js';
import { resourceAllocationEngine } from '../services/ResourceAllocationEngine.js';
import { sendSuccess } from '../core/response.js';

export class TimetableController {
  public async createTimetable(req: Request, res: Response) {
    const authReq = req as any;
    const timetable = await timetableService.createTimetable(authReq.user.tenant_id, req.body);
    return sendSuccess(res, timetable, 201, 'Timetable created successfully');
  }

  public async getTimetable(req: Request, res: Response) {
    const authReq = req as any;
    const timetable = await timetableService.getTimetable(authReq.user.tenant_id, req.params.id);
    return sendSuccess(res, timetable);
  }

  public async publishTimetable(req: Request, res: Response) {
    const authReq = req as any;
    await timetableService.publishTimetable(authReq.user.tenant_id, req.params.id, authReq.user.id);
    return sendSuccess(res, null, 200, 'Timetable published successfully');
  }

  public async getTeacherSchedule(req: Request, res: Response) {
    const authReq = req as any;
    const schedule = await timetableService.getTeacherSchedule(authReq.user.tenant_id, req.params.teacherId);
    return sendSuccess(res, schedule);
  }

  public async getClassSchedule(req: Request, res: Response) {
    const authReq = req as any;
    const schedule = await timetableService.getClassSchedule(authReq.user.tenant_id, req.params.classId);
    return sendSuccess(res, schedule);
  }

  public async autoGenerate(req: Request, res: Response) {
    const authReq = req as any;
    const periods = await timetableService.autoGenerate(authReq.user.tenant_id, req.params.id, req.body.classIds);
    return sendSuccess(res, periods, 200, 'Timetable periods generated automatically');
  }

  public async getConflicts(req: Request, res: Response) {
    const authReq = req as any;
    const conflicts = await timetableService.checkConflicts(authReq.user.tenant_id, req.params.id);
    return sendSuccess(res, conflicts);
  }

  public async getAnalytics(req: Request, res: Response) {
    const authReq = req as any;
    const analytics = await timetableAnalyticsEngine.generateAnalytics(authReq.user.tenant_id, req.params.id);
    return sendSuccess(res, analytics);
  }

  public async getAllocationUtilization(req: Request, res: Response) {
    const authReq = req as any;
    const utilization = await resourceAllocationEngine.calculateUtilization(
      authReq.user.tenant_id,
      req.params.resourceId,
      parseInt(req.query.totalSlots as string || '40')
    );
    return sendSuccess(res, utilization);
  }
}

export const timetableController = new TimetableController();
