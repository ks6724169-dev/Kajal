import { z } from 'zod';

export const IncidentSchema = z.object({
  title: z.string().min(5),
  description: z.string().min(10),
  severity: z.enum(['P1', 'P2', 'P3', 'P4'])
});

export const FeatureFlagSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  is_enabled: z.boolean(),
  rollout_percentage: z.number().min(0).max(100)
});

export const LogQuerySchema = z.object({
  level: z.enum(['INFO', 'WARN', 'ERROR', 'DEBUG']).optional(),
  module: z.string().optional(),
  start_date: z.string().optional(),
  end_date: z.string().optional()
});

export const MetricQuerySchema = z.object({
  metric_name: z.string(),
  start_date: z.string().optional(),
  end_date: z.string().optional()
});
