import { z } from 'zod';

export const DeploymentSchema = z.object({
  environment_id: z.string().uuid(),
  release_id: z.string().uuid(),
  strategy_id: z.string().uuid().optional(),
  name: z.string().min(2),
  status: z.string().optional()
});

export const ClusterSchema = z.object({
  region_id: z.string().uuid(),
  name: z.string().min(2),
  provider: z.string(),
  status: z.string().optional()
});

export const RegionSchema = z.object({
  name: z.string().min(2),
  code: z.string().min(2),
  provider: z.string().optional(),
  latency_ms: z.number().int().nonnegative().optional()
});

export const RolloutSchema = z.object({
  release_id: z.string().uuid(),
  percentage: z.number().int().min(1).max(100),
  step_duration_minutes: z.number().int().positive()
});

export const ReleaseSchema = z.object({
  env_id: z.string().uuid(),
  name: z.string().min(2),
  version_tag: z.string(),
  status: z.string().optional()
});

export const ScalingPolicySchema = z.object({
  cluster_id: z.string().uuid(),
  min_replicas: z.number().int().positive(),
  max_replicas: z.number().int().positive(),
  cpu_threshold: z.number().int().min(1).max(100),
  mem_threshold: z.number().int().min(1).max(100)
});

export const AIOrchestrationSchema = z.object({
  name: z.string().min(2),
  model_name: z.string(),
  status: z.string().optional()
});

export const CommandCenterWidgetSchema = z.object({
  dashboard_id: z.string().uuid(),
  title: z.string().min(2),
  type: z.string(),
  grid_layout: z.any().optional()
});
