import { Request, Response, NextFunction } from 'express';
import { behaviourEngine } from '../services/BehaviourEngine.js';
import { sendSuccess } from '../core/response.js';

export class BehaviourController {
  public async recordIncident(req: Request, res: Response, next: NextFunction) {
    try {
      const tenantId = req.headers['x-tenant-id'] as string;
      if (!tenantId) throw new Error('Tenant ID missing');
      
      const record = await behaviourEngine.recordIncident(tenantId, req.body);
      sendSuccess(res, record, 201);
    } catch (error) {
      next(error);
    }
  }
}

export const behaviourController = new BehaviourController();
