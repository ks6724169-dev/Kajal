import { z } from 'zod';

export const DataSourceSchema = z.object({
  name: z.string().min(2),
  type: z.string(),
  config: z.any()
});

export const DataPipelineSchema = z.object({
  name: z.string().min(2),
  description: z.string(),
  config: z.any()
});

export const ETLJobSchema = z.object({
  pipeline_id: z.string().uuid(),
  step_name: z.string()
});

export const WarehouseDatasetSchema = z.object({
  name: z.string().min(2),
  description: z.string(),
  schema_definition: z.any()
});

export const MetadataCatalogSchema = z.object({
  name: z.string(),
  description: z.string()
});

export const KnowledgeGraphSchema = z.object({
  name: z.string(),
  description: z.string()
});

export const MLDatasetSchema = z.object({
  name: z.string(),
  version_number: z.string(),
  features: z.array(z.string())
});

export const TrainingJobSchema = z.object({
  dataset_id: z.string().uuid(),
  model_name: z.string()
});

export const StreamingEventSchema = z.object({
  stream_id: z.string().uuid(),
  event_type: z.string(),
  payload: z.any()
});
