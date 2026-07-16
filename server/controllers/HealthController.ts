import { Request, Response, NextFunction } from 'express';
import { healthEngine } from '../services/HealthEngine.js';
import { sendSuccess } from '../core/response.js';

export class HealthController {
  public async upsertProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const tenantId = req.headers['x-tenant-id'] as string;
      if (!tenantId) throw new Error('Tenant ID missing');
      
      const record = await healthEngine.upsertHealthProfile(tenantId, req.body);
      sendSuccess(res, record, 201);
    } catch (error) {
      next(error);
    }
  }

  public async logVisit(req: Request, res: Response, next: NextFunction) {
    try {
      const tenantId = req.headers['x-tenant-id'] as string;
      if (!tenantId) throw new Error('Tenant ID missing');
      
      const record = await healthEngine.logMedicalVisit(tenantId, req.body);
      sendSuccess(res, record, 201);
    } catch (error) {
      next(error);
    }
  }
}

export const healthController = new HealthController();
