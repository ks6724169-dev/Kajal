import { BaseEntity } from './BaseEntity.js';

export interface GlobalRegion extends BaseEntity {
  name: string;
  code: string;
  provider: string;
  latency_ms: number;
}

export interface DeploymentCluster extends BaseEntity {
  region_id: string;
  name: string;
  provider: string;
  status: string;
}

export interface KubernetesCluster extends BaseEntity {
  cluster_id: string;
  kube_version: string;
  api_endpoint: string;
  status: string;
}

export interface KubernetesNode extends BaseEntity {
  k8s_cluster_id: string;
  name: string;
  role: string;
  cpu_cores: number;
  memory_gb: number;
  status: string;
}

export interface DeploymentEnvironment extends BaseEntity {
  name: string;
  code: string;
  is_production: boolean;
}

export interface DeploymentRelease extends BaseEntity {
  env_id: string;
  name: string;
  version_tag: string;
  status: string;
}

export interface DeploymentVersion extends BaseEntity {
  release_id: string;
  commit_sha?: string;
  build_url?: string;
  changelog?: string;
}

export interface DeploymentStrategy extends BaseEntity {
  name: string;
  type: string;
  config: Record<string, any>;
}

export interface EdgeLocation extends BaseEntity {
  city: string;
  country: string;
  ip_address?: string;
  status: string;
}

export interface EdgeCache extends BaseEntity {
  location_id: string;
  key_pattern: string;
  hit_rate: number;
  size_mb: number;
}

export interface CDNConfiguration extends BaseEntity {
  domain_name: string;
  origin_url: string;
  ttl_seconds: number;
  ssl_enabled: boolean;
}

export interface ServiceRegistry extends BaseEntity {
  name: string;
  version_tag: string;
  endpoint: string;
  status: string;
}

export interface ServiceDiscovery extends BaseEntity {
  service_id: string;
  client_ip?: string;
  last_heartbeat?: Date;
}

export interface ServiceMesh extends BaseEntity {
  name: string;
  provider: string;
  mtls_enabled: boolean;
}

export interface LoadBalancer extends BaseEntity {
  name: string;
  algorithm: string;
  public_ip?: string;
}

export interface AutoscalingPolicy extends BaseEntity {
  cluster_id: string;
  min_replicas: number;
  max_replicas: number;
  cpu_threshold: number;
  mem_threshold: number;
}

export interface GlobalConfiguration extends BaseEntity {
  config_key: string;
  config_value: string;
  is_encrypted: boolean;
}

export interface TenantRegionMapping extends BaseEntity {
  mapped_tenant_id: string;
  region_id: string;
  is_primary: boolean;
}

export interface ProductionEnvironment extends BaseEntity {
  env_id: string;
  domain_name: string;
  health_status: string;
}

export interface MaintenanceSchedule extends BaseEntity {
  title: string;
  description?: string;
  start_time: Date;
  end_time: Date;
  status: string;
}

export interface MaintenanceHistory extends BaseEntity {
  schedule_id: string;
  performed_by?: string;
  outcome_notes?: string;
}

export interface ReleaseNote extends BaseEntity {
  version_tag: string;
  notes: string;
  published_at?: Date;
}

export interface ReleaseChannel extends BaseEntity {
  name: string;
  description?: string;
}

export interface RolloutPolicy extends BaseEntity {
  release_id: string;
  percentage: number;
  step_duration_minutes: number;
}

export interface RollbackHistory extends BaseEntity {
  release_id: string;
  reason: string;
  triggered_by: string;
}

export interface CommandCenterDashboard extends BaseEntity {
  name: string;
  is_default: boolean;
}

export interface CommandCenterWidget extends BaseEntity {
  dashboard_id: string;
  title: string;
  type: string;
  grid_layout: Record<string, any>;
}

export interface GlobalOperationLog extends BaseEntity {
  action: string;
  details: Record<string, any>;
  severity: string;
}

export interface GlobalAlert extends BaseEntity {
  title: string;
  message: string;
  severity: string;
  is_resolved: boolean;
}

export interface CompliancePolicy extends BaseEntity {
  name: string;
  standard: string;
  rules: Record<string, any>;
}

export interface ComplianceAudit extends BaseEntity {
  policy_id: string;
  status: string;
  findings?: string;
  audited_at: Date;
}

export interface DisasterStatus extends BaseEntity {
  region_id: string;
  is_active: boolean;
  recovery_point_objective_seconds: number;
  recovery_time_objective_seconds: number;
}

export interface SystemCapacity extends BaseEntity {
  resource_type: string;
  allocated: number;
  used: number;
}

export interface InfrastructureCost extends BaseEntity {
  region_id: string;
  amount_usd: number;
  billing_period: string;
}

export interface AIOrchestrationJob extends BaseEntity {
  name: string;
  model_name: string;
  status: string;
}

export interface AICluster extends BaseEntity {
  name: string;
  region_id: string;
  gpu_type: string;
  gpu_count: number;
}

export interface AIModelRegistryGlobal extends BaseEntity {
  name: string;
  version_tag: string;
  accuracy: number;
}
