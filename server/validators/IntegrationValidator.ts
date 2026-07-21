import { z } from 'zod';

export const IntegrationProviderSchema = z.object({
  name: z.string().min(3),
  category: z.enum(['WORKSPACE', 'COMMUNICATION', 'PAYMENT', 'STORAGE', 'CUSTOM']),
  provider_type: z.string(),
  description: z.string().optional()
});

export const APIConnectorSchema = z.object({
  provider_id: z.string().uuid(),
  name: z.string().min(3),
  configuration: z.any()
});

export const WebhookEndpointSchema = z.object({
  connector_id: z.string().uuid(),
  url: z.string().url(),
  events: z.array(z.string()),
  direction: z.enum(['INCOMING', 'OUTGOING'])
});

export const SyncJobSchema = z.object({
  connector_id: z.string().uuid(),
  job_name: z.string(),
  sync_type: z.enum(['FULL', 'INCREMENTAL', 'MANUAL'])
});

export const DataMappingSchema = z.object({
  connector_id: z.string().uuid(),
  source_entity: z.string(),
  target_entity: z.string(),
  field_mappings: z.any()
});
