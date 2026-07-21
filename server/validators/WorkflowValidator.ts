import { z } from 'zod';

export const WorkflowSchema = z.object({
  name: z.string().min(3),
  module: z.string(),
  description: z.string().optional(),
  is_active: z.boolean().default(true)
});

export const WorkflowVersionSchema = z.object({
  workflow_id: z.string().uuid(),
  schema_definition: z.any()
});

export const WorkflowStartSchema = z.object({
  entity_type: z.string(),
  entity_id: z.string().uuid(),
  context_data: z.any().optional()
});

export const ApprovalSchema = z.object({
  comments: z.string().optional()
});

export const TaskCompletionSchema = z.object({
  outcome: z.string().optional(),
  comments: z.string().optional()
});

export const DelegateSchema = z.object({
  delegate_to_id: z.string().uuid(),
  comments: z.string().optional()
});
