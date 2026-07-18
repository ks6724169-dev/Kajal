import { UnitOfWork } from '../database/unitOfWork.js';
import { ReminderRepository } from '../repositories/CommunicationRepository.js';
import { Reminder } from '../entities/CommunicationDomain.js';

export class ReminderEngine {
  public async scheduleReminder(tenantId: string, recipientId: string, title: string, content: string, reminderType: string, scheduledAt: Date): Promise<Reminder> {
    const uow = new UnitOfWork(tenantId);
    try {
      await uow.begin();
      const repo = uow.getRepository(ReminderRepository);
      const reminder = await repo.insert({
        recipientId,
        title,
        content,
        reminderType,
        scheduledAt,
        isTriggered: false,
        status: 'ACTIVE'
      });
      await uow.commit();
      return reminder;
    } catch (e) {
      await uow.rollback();
      throw e;
    } finally {
      await uow.dispose();
    }
  }
}

export const reminderEngine = new ReminderEngine();
