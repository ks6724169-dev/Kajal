import { Request, Response, NextFunction } from 'express';
import { organizationService } from '../services/OrganizationService.js';
import { sendSuccess } from '../core/response.js';
import { logger } from '../telemetry/logger.js';

export class OrganizationController {
  public async getDetails(req: Request, res: Response, next: NextFunction) {
    try {
      const tenantId = req.headers['x-tenant-id'] as string;
      if (!tenantId) throw new Error('Tenant ID missing');
      
      const details = await organizationService.getOrganizationDetails(tenantId);
      sendSuccess(res, details, 200);
    } catch (error) {
      next(error);
    }
  }

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

  public async updateDetails(req: Request, res: Response, next: NextFunction) {
    try {
      const tenantId = req.headers['x-tenant-id'] as string;
      const orgId = req.params.orgId;
      if (!tenantId || !orgId) throw new Error('Tenant ID or Org ID missing');
      
      const { organization, branding } = req.body;
      const result = await organizationService.updateOrganizationDetails(tenantId, orgId, organization, branding);
      sendSuccess(res, result, 200);
    } catch (error) {
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

  public async addDoc(req: Request, res: Response, next: NextFunction) {
    try {
      const tenantId = req.headers['x-tenant-id'] as string;
      const orgId = req.params.orgId;
      if (!tenantId || !orgId) throw new Error('Tenant ID or Org ID missing');
      
      const doc = await organizationService.addDocument(tenantId, orgId, req.body);
      sendSuccess(res, doc, 201);
    } catch (error) {
      next(error);
    }
  }

  public async deleteDoc(req: Request, res: Response, next: NextFunction) {
    try {
      const tenantId = req.headers['x-tenant-id'] as string;
      const docId = req.params.docId;
      if (!tenantId || !docId) throw new Error('Tenant ID or Doc ID missing');
      
      const doc = await organizationService.deleteDocument(tenantId, docId);
      sendSuccess(res, doc, 200);
    } catch (error) {
      next(error);
    }
  }

  public async getUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const tenantId = req.headers['x-tenant-id'] as string;
      if (!tenantId) throw new Error('Tenant ID missing');
      
      const users = await organizationService.getOrganizationUsers(tenantId);
      sendSuccess(res, users, 200);
    } catch (error) {
      next(error);
    }
  }

  public async getAudit(req: Request, res: Response, next: NextFunction) {
    try {
      const tenantId = req.headers['x-tenant-id'] as string;
      if (!tenantId) throw new Error('Tenant ID missing');
      
      const logs = await organizationService.getAuditEvents(tenantId);
      sendSuccess(res, logs, 200);
    } catch (error) {
      next(error);
    }
  }
}

export const organizationController = new OrganizationController();
