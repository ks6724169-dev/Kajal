import { Request, Response, NextFunction } from 'express';
import { hostelService } from '../services/HostelService.js';
import { hostelAllocationEngine } from '../services/HostelAllocationEngine.js';
import { messEngine } from '../services/MessEngine.js';
import { hostelAnalyticsEngine } from '../services/HostelAnalyticsEngine.js';
import { sendSuccess } from '../core/response.js';
import { ValidationError } from '../errors/AppError.js';
import {
  RegisterHostelSchema,
  RegisterRoomSchema,
  AllocateBedSchema,
  TransferRoomSchema,
  ApplyLeaveSchema,
  RegisterVisitorSchema,
  GenerateGatePassSchema,
  RegisterComplaintSchema,
  RecordMealAttendanceSchema,
  RecordLaundrySchema
} from '../validators/HostelValidator.js';

export class HostelController {
  private getTenantId(req: Request): string {
    const tenantId = req.headers['x-tenant-id'] as string;
    if (!tenantId) {
      throw new ValidationError('Tenant ID (x-tenant-id) is required in headers');
    }
    return tenantId;
  }

  public async registerHostel(req: Request, res: Response, next: NextFunction) {
    try {
      const tenantId = this.getTenantId(req);
      const parsed = RegisterHostelSchema.safeParse(req.body);
      if (!parsed.success) {
        throw new ValidationError('Validation failed', parsed.error.format());
      }
      const result = await hostelService.registerHostel(tenantId, parsed.data);
      sendSuccess(res, result);
    } catch (error) {
      next(error);
    }
  }

  public async registerRoom(req: Request, res: Response, next: NextFunction) {
    try {
      const tenantId = this.getTenantId(req);
      const parsed = RegisterRoomSchema.safeParse(req.body);
      if (!parsed.success) {
        throw new ValidationError('Validation failed', parsed.error.format());
      }
      const result = await hostelService.registerRoom(tenantId, parsed.data);
      sendSuccess(res, result);
    } catch (error) {
      next(error);
    }
  }

  public async allocateBed(req: Request, res: Response, next: NextFunction) {
    try {
      const tenantId = this.getTenantId(req);
      const parsed = AllocateBedSchema.safeParse(req.body);
      if (!parsed.success) {
        throw new ValidationError('Validation failed', parsed.error.format());
      }
      const { studentId, bedId, startDate, endDate } = parsed.data;
      const result = await hostelAllocationEngine.allocateRoom(tenantId, studentId, bedId, new Date(startDate), endDate ? new Date(endDate) : undefined);
      sendSuccess(res, result);
    } catch (error) {
      next(error);
    }
  }

  public async transferRoom(req: Request, res: Response, next: NextFunction) {
    try {
      const tenantId = this.getTenantId(req);
      const parsed = TransferRoomSchema.safeParse(req.body);
      if (!parsed.success) {
        throw new ValidationError('Validation failed', parsed.error.format());
      }
      const { allocationId, toBedId, transferDate, reason } = parsed.data;
      const result = await hostelAllocationEngine.transferRoom(tenantId, allocationId, toBedId, new Date(transferDate), reason);
      sendSuccess(res, result);
    } catch (error) {
      next(error);
    }
  }

  public async applyLeave(req: Request, res: Response, next: NextFunction) {
    try {
      const tenantId = this.getTenantId(req);
      const parsed = ApplyLeaveSchema.safeParse(req.body);
      if (!parsed.success) {
        throw new ValidationError('Validation failed', parsed.error.format());
      }
      const data: any = { ...parsed.data };
      data.startDate = new Date(data.startDate);
      data.endDate = new Date(data.endDate);
      const result = await hostelService.applyLeave(tenantId, data);
      sendSuccess(res, result);
    } catch (error) {
      next(error);
    }
  }

  public async registerVisitor(req: Request, res: Response, next: NextFunction) {
    try {
      const tenantId = this.getTenantId(req);
      const parsed = RegisterVisitorSchema.safeParse(req.body);
      if (!parsed.success) {
        throw new ValidationError('Validation failed', parsed.error.format());
      }
      const { visitorName, contactNumber, idProofType, idProofNumber, studentId, visitDate, purpose } = parsed.data;
      const result = await hostelService.registerVisitor(tenantId, 
         { visitorName, contactNumber, idProofType, idProofNumber },
         { studentId, visitDate: new Date(visitDate), purpose }
      );
      sendSuccess(res, result);
    } catch (error) {
      next(error);
    }
  }

  public async generateGatePass(req: Request, res: Response, next: NextFunction) {
    try {
      const tenantId = this.getTenantId(req);
      const parsed = GenerateGatePassSchema.safeParse(req.body);
      if (!parsed.success) {
        throw new ValidationError('Validation failed', parsed.error.format());
      }
      const data: any = { ...parsed.data };
      data.issueDate = new Date(data.issueDate);
      if (data.validUntil) data.validUntil = new Date(data.validUntil);
      const result = await hostelService.generateGatePass(tenantId, data);
      sendSuccess(res, result);
    } catch (error) {
      next(error);
    }
  }

  public async registerComplaint(req: Request, res: Response, next: NextFunction) {
    try {
      const tenantId = this.getTenantId(req);
      const parsed = RegisterComplaintSchema.safeParse(req.body);
      if (!parsed.success) {
        throw new ValidationError('Validation failed', parsed.error.format());
      }
      const result = await hostelService.registerComplaint(tenantId, parsed.data);
      sendSuccess(res, result);
    } catch (error) {
      next(error);
    }
  }

  public async recordMealAttendance(req: Request, res: Response, next: NextFunction) {
    try {
      const tenantId = this.getTenantId(req);
      const parsed = RecordMealAttendanceSchema.safeParse(req.body);
      if (!parsed.success) {
        throw new ValidationError('Validation failed', parsed.error.format());
      }
      const data: any = { ...parsed.data };
      data.mealDate = new Date(data.mealDate);
      const result = await messEngine.recordMealAttendance(tenantId, data);
      sendSuccess(res, result);
    } catch (error) {
      next(error);
    }
  }

  public async recordLaundry(req: Request, res: Response, next: NextFunction) {
    try {
      const tenantId = this.getTenantId(req);
      const parsed = RecordLaundrySchema.safeParse(req.body);
      if (!parsed.success) {
        throw new ValidationError('Validation failed', parsed.error.format());
      }
      const data: any = { ...parsed.data };
      data.dropDate = new Date(data.dropDate);
      const result = await hostelService.recordLaundry(tenantId, data);
      sendSuccess(res, result);
    } catch (error) {
      next(error);
    }
  }

  public async getOccupancyForecast(req: Request, res: Response, next: NextFunction) {
    try {
      const tenantId = this.getTenantId(req);
      const result = await hostelAnalyticsEngine.getOccupancyForecast(tenantId);
      sendSuccess(res, result);
    } catch (error) {
      next(error);
    }
  }

  public async getMealRecommendations(req: Request, res: Response, next: NextFunction) {
    try {
      const tenantId = this.getTenantId(req);
      const messPlanId = req.params.messPlanId;
      const result = await messEngine.getMealRecommendations(tenantId, messPlanId);
      sendSuccess(res, result);
    } catch (error) {
      next(error);
    }
  }

  public async getSmartAllocation(req: Request, res: Response, next: NextFunction) {
    try {
      const tenantId = this.getTenantId(req);
      const result = await hostelAllocationEngine.suggestSmartAllocation(tenantId, req.query);
      sendSuccess(res, result);
    } catch (error) {
      next(error);
    }
  }
}

export const hostelController = new HostelController();
