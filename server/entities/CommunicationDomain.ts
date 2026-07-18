import { BaseEntity } from './BaseEntity.js';

export interface Notification extends BaseEntity {
  recipientId: string;
  title: string;
  body: string;
  type?: string;
  priority?: string;
  isRead?: boolean;
  readAt?: Date;
}

export interface NotificationTemplate extends BaseEntity {
  name: string;
  subjectTemplate?: string;
  bodyTemplate: string;
  channel: string;
  language?: string;
}

export interface Announcement extends BaseEntity {
  title: string;
  content: string;
  targetAudience: any;
  publishedDate?: Date;
  expiryDate?: Date;
}

export interface Circular extends BaseEntity {
  circularNumber: string;
  title: string;
  content: string;
  attachmentUrl?: string;
  targetAudience: any;
  publishedDate?: Date;
}

export interface Conversation extends BaseEntity {
  title?: string;
  type?: string;
  participants: any;
  lastMessageAt?: Date;
}

export interface InternalMessage extends BaseEntity {
  conversationId: string;
  senderId: string;
  content: string;
  isEdited?: boolean;
}

export interface MessageAttachment extends BaseEntity {
  messageId: string;
  fileUrl: string;
  fileType: string;
  fileSize?: number;
}

export interface BroadcastMessage extends BaseEntity {
  title: string;
  content: string;
  senderId: string;
  scheduledAt?: Date;
}

export interface BroadcastRecipient extends BaseEntity {
  broadcastId: string;
  recipientId: string;
  deliveryStatus?: string;
}

export interface NotificationLog extends BaseEntity {
  recipientId: string;
  channel: string;
  content?: string;
  deliveryStatus?: string;
  errorMessage?: string;
}

export interface EmailQueue extends BaseEntity {
  recipientEmail: string;
  subject: string;
  body: string;
  retryCount?: number;
  deliveryStatus?: string;
}

export interface SMSQueue extends BaseEntity {
  phoneNumber: string;
  content: string;
  retryCount?: number;
  deliveryStatus?: string;
}

export interface WhatsAppQueue extends BaseEntity {
  phoneNumber: string;
  content: string;
  retryCount?: number;
  deliveryStatus?: string;
}

export interface PushNotification extends BaseEntity {
  deviceToken: string;
  title: string;
  body: string;
  data?: any;
  retryCount?: number;
  deliveryStatus?: string;
}

export interface Reminder extends BaseEntity {
  recipientId: string;
  title: string;
  content: string;
  reminderType: string;
  scheduledAt: Date;
  isTriggered?: boolean;
}

export interface EventInvitation extends BaseEntity {
  eventId: string;
  recipientId: string;
  responseStatus?: string;
}

export interface NotificationPreference extends BaseEntity {
  userId: string;
  channelPreferences: any;
  categoryPreferences: any;
}

export interface DeviceToken extends BaseEntity {
  userId: string;
  token: string;
  platform: string;
}

export interface DeliveryStatus extends BaseEntity {
  messageId: string;
  recipientId: string;
  status: string;
}
