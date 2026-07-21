import { z } from 'zod';

export const DashboardSchema = z.object({
  name: z.string().min(3),
  role: z.string(),
  layout: z.any().optional(),
  is_default: z.boolean().default(false)
});

export const ReportRequestSchema = z.object({
  name: z.string().min(3),
  type: z.enum(['PDF', 'EXCEL', 'CSV']),
  parameters: z.any().optional()
});

export const ScheduledReportSchema = z.object({
  report_id: z.string().uuid(),
  frequency: z.enum(['DAILY', 'WEEKLY', 'MONTHLY']),
  recipients: z.array(z.string().email()),
  next_run_date: z.string().datetime(),
  is_active: z.boolean().default(true)
});

export const AlertRuleSchema = z.object({
  metric_name: z.string(),
  condition: z.string(),
  threshold: z.number(),
  notification_channels: z.array(z.string())
});
