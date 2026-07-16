import { Request, Response, NextFunction } from 'express';
import { attendanceEngine } from '../services/AttendanceEngine.js';
import { sendSuccess } from '../core/response.js';

export class AttendanceController {
  public async mark(req: Request, res: Response, next: NextFunction) {
    try {
      const tenantId = req.headers['x-tenant-id'] as string;
      if (!tenantId) throw new Error('Tenant ID missing');
      
      const record = await attendanceEngine.markDailyAttendance(tenantId, req.body);
      sendSuccess(res, record, 201);
    } catch (error) {
      next(error);
    }
  }

  public async lock(req: Request, res: Response, next: NextFunction) {
    try {
      const tenantId = req.headers['x-tenant-id'] as string;
      const approvedBy = (req as any).user?.id as string; // Assuming auth middleware sets this
      const attendanceId = req.params.id;
      
      if (!tenantId || !approvedBy) throw new Error('Context missing');
      
      const record = await attendanceEngine.lockAttendance(tenantId, attendanceId, approvedBy);
      sendSuccess(res, record, 200);
    } catch (error) {
      next(error);
    }
  }
}

export const attendanceController = new AttendanceController();
