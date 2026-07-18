import { UnitOfWork } from '../database/unitOfWork.js';
import { notificationEngine } from './NotificationEngine.js';
import { messagingEngine } from './MessagingEngine.js';
import { reminderEngine } from './ReminderEngine.js';
import {
  AnnouncementRepository,
  CircularRepository,
  BroadcastMessageRepository,
  BroadcastRecipientRepository,
  NotificationRepository
} from '../repositories/CommunicationRepository.js';
import { aiGateway } from '../ai/AIGateway.js';
import { QuerySpecification } from '../repositories/QuerySpecification.js';

export class CommunicationService {
  
  public async sendNotification(tenantId: string, recipientId: string, title: string, body: string, type?: string, priority?: string) {
    await notificationEngine.sendInAppNotification(tenantId, recipientId, title, body, type, priority);
    return { success: true };
  }

  public async sendInternalMessage(tenantId: string, conversationId: string, senderId: string, content: string, improveTone: boolean = false) {
    let finalContent = content;
    if (improveTone) {
      finalContent = await messagingEngine.improveMessageTone(tenantId, content);
    }
    return await messagingEngine.sendMessage(tenantId, conversationId, senderId, finalContent);
  }

  public async createAnnouncement(tenantId: string, title: string, content: string, targetAudience: any, expiryDate?: Date, autoTranslate?: string[]) {
    const uow = new UnitOfWork(tenantId);
    try {
      await uow.begin();
      const repo = uow.getRepository(AnnouncementRepository);
      const announcement = await repo.insert({
        title,
        content,
        targetAudience,
        publishedDate: new Date(),
        expiryDate,
        status: 'ACTIVE'
      });
      
      // Simulate translations using AI Gateway if requested
      if (autoTranslate && autoTranslate.length > 0) {
        for (const lang of autoTranslate) {
          try {
             await aiGateway.translate(tenantId, content, lang);
             // In a real scenario, we would save the translated version
          } catch(e) {
             console.error(`Translation failed for ${lang}`, e);
          }
        }
      }

      await uow.commit();
      return announcement;
    } catch (e) {
      await uow.rollback();
      throw e;
    } finally {
      await uow.dispose();
    }
  }

  public async createCircular(tenantId: string, circularNumber: string, title: string, content: string, attachmentUrl: string | undefined, targetAudience: any) {
    const uow = new UnitOfWork(tenantId);
    try {
      await uow.begin();
      const repo = uow.getRepository(CircularRepository);
      const circular = await repo.insert({
        circularNumber,
        title,
        content,
        attachmentUrl,
        targetAudience,
        publishedDate: new Date(),
        status: 'ACTIVE'
      });
      
      // Generate AI summary for quick view
      try {
        await aiGateway.summarize(tenantId, content);
      } catch (e) {
        console.error('Circular summarization failed', e);
      }

      await uow.commit();
      return circular;
    } catch (e) {
      await uow.rollback();
      throw e;
    } finally {
      await uow.dispose();
    }
  }

  public async sendBroadcast(tenantId: string, title: string, content: string, senderId: string, recipientIds: string[], scheduledAt?: Date) {
    const uow = new UnitOfWork(tenantId);
    try {
      await uow.begin();
      const broadcastRepo = uow.getRepository(BroadcastMessageRepository);
      const recipientRepo = uow.getRepository(BroadcastRecipientRepository);
      
      const broadcast = await broadcastRepo.insert({
        title,
        content,
        senderId,
        scheduledAt,
        status: 'ACTIVE'
      });

      for (const recipientId of recipientIds) {
        await recipientRepo.insert({
          broadcastId: broadcast.id!,
          recipientId,
          deliveryStatus: 'PENDING',
          status: 'ACTIVE'
        });
        // We also trigger an in-app notification immediately or schedule it
        if (!scheduledAt) {
          await notificationEngine.sendInAppNotification(tenantId, recipientId, title, content, 'BROADCAST', 'NORMAL');
        }
      }

      await uow.commit();
      return broadcast;
    } catch (e) {
      await uow.rollback();
      throw e;
    } finally {
      await uow.dispose();
    }
  }

  public async scheduleReminder(tenantId: string, recipientId: string, title: string, content: string, reminderType: string, scheduledAt: Date) {
    return await reminderEngine.scheduleReminder(tenantId, recipientId, title, content, reminderType, scheduledAt);
  }

  public async markNotificationRead(tenantId: string, notificationId: string) {
    const uow = new UnitOfWork(tenantId);
    try {
      await uow.begin();
      const repo = uow.getRepository(NotificationRepository);
      const notif = await repo.findOne(notificationId);
      if (notif && !notif.isRead) {
        await repo.update(notificationId, { isRead: true, readAt: new Date() }, notif.version);
      }
      await uow.commit();
      return { success: true };
    } catch (e) {
      await uow.rollback();
      throw e;
    } finally {
      await uow.dispose();
    }
  }
}

export const communicationService = new CommunicationService();
