import { Request, Response, NextFunction } from 'express';
import { organizationService } from '../services/OrganizationService.js';
import { sendSuccess } from '../core/response.js';
import { logger } from '../telemetry/logger.js';

export class OrganizationController {
  public async create(req: Request, res: Response, next: NextFunction) {
    try {
      const tenantId = req.headers['x-tenant-id'] as string;
      if (!tenantId) throw new Error('Tenant ID missing');
      
      const org = await organizationService.createOrganization(tenantId, req.body);
      sendSuccess(res, org, 201);
    } catch (error) {
      logger.error('Organization creation failed', error);
      next(error);
    }
  }

  public async createCampus(req: Request, res: Response, next: NextFunction) {
    try {
      const tenantId = req.headers['x-tenant-id'] as string;
      const orgId = req.params.orgId;
      if (!tenantId || !orgId) throw new Error('Tenant ID or Org ID missing');
      
      const campus = await organizationService.createCampus(tenantId, orgId, req.body);
      sendSuccess(res, campus, 201);
    } catch (error) {
      next(error);
    }
  }
}

export const organizationController = new OrganizationController();
