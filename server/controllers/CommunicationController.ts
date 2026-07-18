import { Request, Response, NextFunction } from 'express';
import { communicationService } from '../services/CommunicationService.js';
import { sendSuccess } from '../core/response.js';
import { ValidationError } from '../errors/AppError.js';
import {
  SendNotificationSchema,
  CreateAnnouncementSchema,
  CreateCircularSchema,
  SendInternalMessageSchema,
  SendBroadcastSchema,
  ScheduleReminderSchema
} from '../validators/CommunicationValidator.js';

export class CommunicationController {
  
  private getTenantId(req: Request): string {
    const tenantId = req.headers['x-tenant-id'] as string;
    if (!tenantId) {
      throw new ValidationError('Tenant ID (x-tenant-id) is required in headers');
    }
    return tenantId;
  }

  public async sendNotification(req: Request, res: Response, next: NextFunction) {
    try {
      const tenantId = this.getTenantId(req);
      const parsed = SendNotificationSchema.safeParse(req.body);
      if (!parsed.success) {
        throw new ValidationError('Validation failed', parsed.error.format());
      }
      const { recipientId, title, body, type, priority } = parsed.data;
      const result = await communicationService.sendNotification(tenantId, recipientId, title, body, type, priority);
      sendSuccess(res, result);
    } catch (error) {
      next(error);
    }
  }

  public async createAnnouncement(req: Request, res: Response, next: NextFunction) {
    try {
      const tenantId = this.getTenantId(req);
      const parsed = CreateAnnouncementSchema.safeParse(req.body);
      if (!parsed.success) {
        throw new ValidationError('Validation failed', parsed.error.format());
      }
      const { title, content, targetAudience, expiryDate } = parsed.data;
      const result = await communicationService.createAnnouncement(tenantId, title, content, targetAudience, expiryDate ? new Date(expiryDate) : undefined);
      sendSuccess(res, result);
    } catch (error) {
      next(error);
    }
  }

  public async createCircular(req: Request, res: Response, next: NextFunction) {
    try {
      const tenantId = this.getTenantId(req);
      const parsed = CreateCircularSchema.safeParse(req.body);
      if (!parsed.success) {
        throw new ValidationError('Validation failed', parsed.error.format());
      }
      const { circularNumber, title, content, attachmentUrl, targetAudience } = parsed.data;
      const result = await communicationService.createCircular(tenantId, circularNumber, title, content, attachmentUrl, targetAudience);
      sendSuccess(res, result);
    } catch (error) {
      next(error);
    }
  }

  public async sendInternalMessage(req: Request, res: Response, next: NextFunction) {
    try {
      const tenantId = this.getTenantId(req);
      const parsed = SendInternalMessageSchema.safeParse(req.body);
      if (!parsed.success) {
        throw new ValidationError('Validation failed', parsed.error.format());
      }
      const { conversationId, senderId, content } = parsed.data;
      const improveTone = req.body.improveTone === true;
      const result = await communicationService.sendInternalMessage(tenantId, conversationId, senderId, content, improveTone);
      sendSuccess(res, result);
    } catch (error) {
      next(error);
    }
  }

  public async sendBroadcast(req: Request, res: Response, next: NextFunction) {
    try {
      const tenantId = this.getTenantId(req);
      const parsed = SendBroadcastSchema.safeParse(req.body);
      if (!parsed.success) {
        throw new ValidationError('Validation failed', parsed.error.format());
      }
      const { title, content, senderId, recipientIds, scheduledAt } = parsed.data;
      const result = await communicationService.sendBroadcast(tenantId, title, content, senderId, recipientIds, scheduledAt ? new Date(scheduledAt) : undefined);
      sendSuccess(res, result);
    } catch (error) {
      next(error);
    }
  }

  public async scheduleReminder(req: Request, res: Response, next: NextFunction) {
    try {
      const tenantId = this.getTenantId(req);
      const parsed = ScheduleReminderSchema.safeParse(req.body);
      if (!parsed.success) {
        throw new ValidationError('Validation failed', parsed.error.format());
      }
      const { recipientId, title, content, reminderType, scheduledAt } = parsed.data;
      const result = await communicationService.scheduleReminder(tenantId, recipientId, title, content, reminderType, new Date(scheduledAt));
      sendSuccess(res, result);
    } catch (error) {
      next(error);
    }
  }

  public async markRead(req: Request, res: Response, next: NextFunction) {
    try {
      const tenantId = this.getTenantId(req);
      const notificationId = req.params.id;
      const result = await communicationService.markNotificationRead(tenantId, notificationId);
      sendSuccess(res, result);
    } catch (error) {
      next(error);
    }
  }
}

export const communicationController = new CommunicationController();
