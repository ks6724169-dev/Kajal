import { UnitOfWork } from '../database/unitOfWork.js';
import {
  EmailQueueRepository,
  SMSQueueRepository,
  WhatsAppQueueRepository,
  PushNotificationRepository,
  NotificationRepository
} from '../repositories/CommunicationRepository.js';

export class NotificationEngine {
  public async queueEmail(tenantId: string, email: string, subject: string, body: string): Promise<void> {
    const uow = new UnitOfWork(tenantId);
    try {
      await uow.begin();
      const repo = uow.getRepository(EmailQueueRepository);
      await repo.insert({
        recipientEmail: email,
        subject,
        body,
        deliveryStatus: 'QUEUED',
        status: 'ACTIVE'
      });
      await uow.commit();
    } catch (e) {
      await uow.rollback();
      throw e;
    } finally {
      await uow.dispose();
    }
  }

  public async queueSMS(tenantId: string, phone: string, content: string): Promise<void> {
    const uow = new UnitOfWork(tenantId);
    try {
      await uow.begin();
      const repo = uow.getRepository(SMSQueueRepository);
      await repo.insert({
        phoneNumber: phone,
        content,
        deliveryStatus: 'QUEUED',
        status: 'ACTIVE'
      });
      await uow.commit();
    } catch (e) {
      await uow.rollback();
      throw e;
    } finally {
      await uow.dispose();
    }
  }
  
  public async queuePush(tenantId: string, token: string, title: string, body: string, data?: any): Promise<void> {
    const uow = new UnitOfWork(tenantId);
    try {
      await uow.begin();
      const repo = uow.getRepository(PushNotificationRepository);
      await repo.insert({
        deviceToken: token,
        title,
        body,
        data,
        deliveryStatus: 'QUEUED',
        status: 'ACTIVE'
      });
      await uow.commit();
    } catch (e) {
      await uow.rollback();
      throw e;
    } finally {
      await uow.dispose();
    }
  }

  public async sendInAppNotification(tenantId: string, recipientId: string, title: string, body: string, type: string = 'GENERAL', priority: string = 'NORMAL'): Promise<void> {
    const uow = new UnitOfWork(tenantId);
    try {
      await uow.begin();
      const repo = uow.getRepository(NotificationRepository);
      await repo.insert({
        recipientId,
        title,
        body,
        type,
        priority,
        isRead: false,
        status: 'ACTIVE'
      });
      await uow.commit();
    } catch (e) {
      await uow.rollback();
      throw e;
    } finally {
      await uow.dispose();
    }
  }
}

export const notificationEngine = new NotificationEngine();
