import { describe, it, expect, beforeAll } from 'vitest';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { dbManager } from '../database/dbClient.js';
import { communicationService } from '../services/CommunicationService.js';
import { notificationEngine } from '../services/NotificationEngine.js';
import { UnitOfWork } from '../database/unitOfWork.js';
import { 
  NotificationRepository,
  AnnouncementRepository,
  EmailQueueRepository,
  ReminderRepository,
  ConversationRepository
} from '../repositories/CommunicationRepository.js';

const tenantId = '123e4567-e89b-12d3-a456-426614174999';

describe('Enterprise Communication, Notification & Messaging Platform', () => {
  let recipientId = uuidv4();
  let conversationId = uuidv4();
  let senderId = uuidv4();

  beforeAll(async () => {
    const tenantRes = await dbManager.query('SELECT id FROM tenant_registry WHERE id = $1', [tenantId]);
    if (tenantRes.rows.length === 0) {
      await dbManager.query(`
        INSERT INTO tenant_registry (id, tenant_code, tenant_name, domain_name, status, subscription_tier)
        VALUES ($1, $2, $3, $4, $5, $6)
      `, [tenantId, 'ETENANT1', 'AI Test Tenant', 'ai-tenant.com', 'active', 'enterprise']);
    }

    await dbManager.query(`SET app.current_tenant = '${tenantId}'`);

    const migrationPath = path.join(process.cwd(), 'server', 'database', 'migrations', '009_communication_platform.sql');
    const sql = fs.readFileSync(migrationPath, 'utf8');
    await dbManager.query(sql);
    
    // Seed a conversation for messaging tests
    const uow = new UnitOfWork(tenantId);
    try {
        await uow.begin();
        const convRepo = uow.getRepository(ConversationRepository);
        await convRepo.insert({
           id: conversationId,
           title: 'Test Chat',
           type: 'ONE_TO_ONE',
           participants: [senderId, recipientId],
           status: 'ACTIVE'
        });
        await uow.commit();
    } finally {
        await uow.dispose();
    }
  });

  it('1. should send an in-app notification', async () => {
    await communicationService.sendNotification(tenantId, recipientId, 'Test Notif', 'Body', 'GENERAL', 'NORMAL');
    const uow = new UnitOfWork(tenantId);
    const repo = uow.getRepository(NotificationRepository);
    const notifs = await repo.findMany();
    expect(notifs.length).toBeGreaterThan(0);
    expect(notifs[notifs.length - 1].title).toBe('Test Notif');
    await uow.dispose();
  });

  it('2. should create an announcement', async () => {
    const announcement = await communicationService.createAnnouncement(tenantId, 'Holiday', 'No school tomorrow', { role: 'STUDENT' });
    expect(announcement.id).toBeDefined();
    expect(announcement.title).toBe('Holiday');
    
    const uow = new UnitOfWork(tenantId);
    const repo = uow.getRepository(AnnouncementRepository);
    const fetched = await repo.findOne(announcement.id!);
    expect(fetched).not.toBeNull();
    await uow.dispose();
  });

  it('3. should create a circular', async () => {
    const circular = await communicationService.createCircular(tenantId, 'C-001', 'Exam Schedule', 'Starts next week', undefined, { role: 'PARENT' });
    expect(circular.id).toBeDefined();
    expect(circular.circularNumber).toBe('C-001');
  });

  it('4. should send an internal message', async () => {
    const msg = await communicationService.sendInternalMessage(tenantId, conversationId, senderId, 'Hello there');
    expect(msg.id).toBeDefined();
    expect(msg.content).toBe('Hello there');
  });

  it('5. should schedule a reminder', async () => {
    const reminder = await communicationService.scheduleReminder(tenantId, recipientId, 'Fee Due', 'Pay fees by tomorrow', 'FEE', new Date());
    expect(reminder.id).toBeDefined();
    expect(reminder.reminderType).toBe('FEE');
    
    const uow = new UnitOfWork(tenantId);
    const repo = uow.getRepository(ReminderRepository);
    const fetched = await repo.findOne(reminder.id!);
    expect(fetched).not.toBeNull();
    await uow.dispose();
  });

  it('6. should send a broadcast', async () => {
    const broadcast = await communicationService.sendBroadcast(tenantId, 'Urgent Update', 'Please check your emails', senderId, [recipientId]);
    expect(broadcast.id).toBeDefined();
  });

  it('7. should queue an email via NotificationEngine', async () => {
    await notificationEngine.queueEmail(tenantId, 'test@example.com', 'Subject', 'Email body');
    const uow = new UnitOfWork(tenantId);
    const repo = uow.getRepository(EmailQueueRepository);
    const emails = await repo.findMany();
    expect(emails.length).toBeGreaterThan(0);
    expect(emails[emails.length - 1].recipientEmail).toBe('test@example.com');
    await uow.dispose();
  });

});
