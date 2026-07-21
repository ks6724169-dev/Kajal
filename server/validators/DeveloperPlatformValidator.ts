import { z } from 'zod';

export const DeveloperAccountSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  company: z.string().optional()
});

export const APIApplicationSchema = z.object({
  developer_id: z.string().uuid(),
  name: z.string().min(3),
  description: z.string().optional()
});

export const APIKeySchema = z.object({
  application_id: z.string().uuid(),
  name: z.string(),
  scopes: z.array(z.string())
});

export const OAuthClientSchema = z.object({
  application_id: z.string().uuid(),
  redirect_uris: z.array(z.string().url()),
  grant_types: z.array(z.string())
});

export const WebhookSchema = z.object({
  application_id: z.string().uuid(),
  url: z.string().url(),
  events: z.array(z.string())
});

export const PluginSchema = z.object({
  developer_id: z.string().uuid(),
  name: z.string().min(3),
  description: z.string()
});
