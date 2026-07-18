import { z } from 'zod';

export const SendNotificationSchema = z.object({
  recipientId: z.string().uuid(),
  title: z.string().min(1),
  body: z.string().min(1),
  type: z.string().optional(),
  priority: z.enum(['LOW', 'NORMAL', 'HIGH', 'EMERGENCY']).optional()
});

export const CreateAnnouncementSchema = z.object({
  title: z.string().min(1),
  content: z.string().min(1),
  targetAudience: z.any(),
  expiryDate: z.string().datetime().optional()
});

export const CreateCircularSchema = z.object({
  circularNumber: z.string().min(1),
  title: z.string().min(1),
  content: z.string().min(1),
  attachmentUrl: z.string().optional(),
  targetAudience: z.any()
});

export const SendInternalMessageSchema = z.object({
  conversationId: z.string().uuid(),
  senderId: z.string().uuid(),
  content: z.string().min(1)
});

export const SendBroadcastSchema = z.object({
  title: z.string().min(1),
  content: z.string().min(1),
  senderId: z.string().uuid(),
  recipientIds: z.array(z.string().uuid()).min(1),
  scheduledAt: z.string().datetime().optional()
});

export const ScheduleReminderSchema = z.object({
  recipientId: z.string().uuid(),
  title: z.string().min(1),
  content: z.string().min(1),
  reminderType: z.string().min(1),
  scheduledAt: z.string().datetime()
});
