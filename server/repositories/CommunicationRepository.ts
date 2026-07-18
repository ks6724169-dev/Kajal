import { BaseRepository } from './BaseRepository.js';
import {
  Notification,
  NotificationTemplate,
  Announcement,
  Circular,
  Conversation,
  InternalMessage,
  MessageAttachment,
  BroadcastMessage,
  BroadcastRecipient,
  NotificationLog,
  EmailQueue,
  SMSQueue,
  WhatsAppQueue,
  PushNotification,
  Reminder,
  EventInvitation,
  NotificationPreference,
  DeviceToken,
  DeliveryStatus
} from '../entities/CommunicationDomain.js';

export class NotificationRepository extends BaseRepository<Notification> {
  protected tableName = 'notification_master';
}

export class NotificationTemplateRepository extends BaseRepository<NotificationTemplate> {
  protected tableName = 'notification_template';
}

export class AnnouncementRepository extends BaseRepository<Announcement> {
  protected tableName = 'announcement_master';
}

export class CircularRepository extends BaseRepository<Circular> {
  protected tableName = 'circular_master';
}

export class ConversationRepository extends BaseRepository<Conversation> {
  protected tableName = 'conversation_master';
}

export class InternalMessageRepository extends BaseRepository<InternalMessage> {
  protected tableName = 'message_master';
}

export class MessageAttachmentRepository extends BaseRepository<MessageAttachment> {
  protected tableName = 'attachment_master';
}

export class BroadcastMessageRepository extends BaseRepository<BroadcastMessage> {
  protected tableName = 'broadcast_master';
}

export class BroadcastRecipientRepository extends BaseRepository<BroadcastRecipient> {
  protected tableName = 'broadcast_recipient';
}

export class NotificationLogRepository extends BaseRepository<NotificationLog> {
  protected tableName = 'notification_log';
}

export class EmailQueueRepository extends BaseRepository<EmailQueue> {
  protected tableName = 'email_queue';
}

export class SMSQueueRepository extends BaseRepository<SMSQueue> {
  protected tableName = 'sms_queue';
}

export class WhatsAppQueueRepository extends BaseRepository<WhatsAppQueue> {
  protected tableName = 'whatsapp_queue';
}

export class PushNotificationRepository extends BaseRepository<PushNotification> {
  protected tableName = 'push_queue';
}

export class ReminderRepository extends BaseRepository<Reminder> {
  protected tableName = 'reminder_master';
}

export class EventInvitationRepository extends BaseRepository<EventInvitation> {
  protected tableName = 'event_invitation';
}

export class NotificationPreferenceRepository extends BaseRepository<NotificationPreference> {
  protected tableName = 'notification_preference';
}

export class DeviceTokenRepository extends BaseRepository<DeviceToken> {
  protected tableName = 'device_token';
}

export class DeliveryStatusRepository extends BaseRepository<DeliveryStatus> {
  protected tableName = 'delivery_status';
}
