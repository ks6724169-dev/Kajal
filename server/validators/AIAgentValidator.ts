import { z } from 'zod';

export const CreateAgentSchema = z.object({
  name: z.string().min(3),
  description: z.string().optional(),
  model_provider: z.string(),
  model_name: z.string(),
  system_prompt: z.string(),
  temperature: z.number().min(0).max(1)
});

export const ChatMessageSchema = z.object({
  agent_id: z.string().uuid(),
  conversation_id: z.string().uuid().optional(),
  message: z.string().min(1)
});

export const AgentTaskSchema = z.object({
  agent_id: z.string().uuid(),
  name: z.string(),
  description: z.string(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'])
});

export const AgentRecommendationSchema = z.object({
  agent_id: z.string().uuid(),
  user_id: z.string().uuid(),
  module: z.string(),
  suggestion: z.string(),
  priority: z.number()
});
