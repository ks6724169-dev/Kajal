import { BaseEntity } from './BaseEntity.js';

export interface SystemHealth extends BaseEntity {
  tenant_id: string;
  status: 'HEALTHY' | 'DEGRADED' | 'DOWN';
  last_check_at: Date;
  details: any;
}

export interface ServiceHealth extends BaseEntity {
  service_name: string;
  status: 'UP' | 'DOWN' | 'MAINTENANCE';
  latency_ms: number;
  last_check_at: Date;
}

export interface ApplicationLog extends BaseEntity {
  tenant_id: string;
  level: 'INFO' | 'WARN' | 'ERROR' | 'DEBUG';
  module: string;
  message: string;
  details?: any;
  timestamp: Date;
}

export interface ErrorLog extends BaseEntity {
  tenant_id: string;
  error_code: string;
  message: string;
  stack_trace?: string;
  context?: any;
  timestamp: Date;
}

export interface PerformanceMetric extends BaseEntity {
  tenant_id: string;
  metric_name: string;
  value: number;
  unit: string;
  tags?: any;
  timestamp: Date;
}

export interface APIMetric extends BaseEntity {
  tenant_id: string;
  endpoint: string;
  method: string;
  status_code: number;
  response_time_ms: number;
  timestamp: Date;
}

export interface DatabaseMetric extends BaseEntity {
  query_name: string;
  execution_time_ms: number;
  rows_returned: number;
  timestamp: Date;
}

export interface Alert extends BaseEntity {
  tenant_id: string;
  alert_name: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  message: string;
  status: 'ACTIVE' | 'ACKNOWLEDGED' | 'RESOLVED';
  triggered_at: Date;
  resolved_at?: Date;
}

export interface Incident extends BaseEntity {
  tenant_id: string;
  title: string;
  description: string;
  severity: 'P1' | 'P2' | 'P3' | 'P4';
  status: 'OPEN' | 'INVESTIGATING' | 'RESOLVED' | 'CLOSED';
  assigned_to?: string;
  root_cause?: string;
}

export interface IncidentTimeline extends BaseEntity {
  incident_id: string;
  action: string;
  description: string;
  actor_id?: string;
  timestamp: Date;
}

export interface MaintenanceWindow extends BaseEntity {
  title: string;
  description: string;
  start_time: Date;
  end_time: Date;
  status: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
}

export interface DeploymentHistory extends BaseEntity {
  deployment_version: string;
  description: string;
  deployed_at: Date;
  deployed_by: string;
  status: 'SUCCESS' | 'FAILED' | 'ROLLED_BACK';
}

export interface FeatureFlag extends BaseEntity {
  name: string;
  description?: string;
  is_enabled: boolean;
  rollout_percentage: number;
}

export interface MonitoringDashboard extends BaseEntity {
  tenant_id: string;
  name: string;
  configuration: any;
}
