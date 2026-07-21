import { BaseEntity } from './BaseEntity.js';

export interface IntegrationProvider extends BaseEntity {
  name: string;
  category: 'WORKSPACE' | 'COMMUNICATION' | 'PAYMENT' | 'STORAGE' | 'CUSTOM';
  description?: string;
  is_active: boolean;
  provider_type: string;
}

export interface APIConnector extends BaseEntity {
  provider_id: string;
  name: string;
  configuration: any;
  status: 'ACTIVE' | 'INACTIVE' | 'ERROR';
}

export interface OAuthCredential extends BaseEntity {
  connector_id: string;
  access_token: string;
  refresh_token?: string;
  expires_at?: Date;
  scopes?: string[];
}

export interface APIKey extends BaseEntity {
  connector_id: string;
  key_name: string;
  key_hash: string;
  expires_at?: Date;
  is_active: boolean;
}

export interface WebhookEndpoint extends BaseEntity {
  connector_id: string;
  url: string;
  secret: string;
  events: string[];
  is_active: boolean;
  direction: 'INCOMING' | 'OUTGOING';
}

export interface WebhookEvent extends BaseEntity {
  endpoint_id: string;
  event_type: string;
  payload: any;
  delivery_status: 'PENDING' | 'DELIVERED' | 'FAILED';
  retry_count: number;
}

export interface SyncJob extends BaseEntity {
  connector_id: string;
  job_name: string;
  sync_type: 'FULL' | 'INCREMENTAL' | 'MANUAL';
  status: 'QUEUED' | 'RUNNING' | 'COMPLETED' | 'FAILED';
  started_at?: Date;
  completed_at?: Date;
}

export interface SyncLog extends BaseEntity {
  job_id: string;
  level: 'INFO' | 'WARN' | 'ERROR';
  message: string;
  details?: any;
}

export interface DataMapping extends BaseEntity {
  connector_id: string;
  source_entity: string;
  target_entity: string;
  field_mappings: any;
}

export interface IntegrationHealth extends BaseEntity {
  connector_id: string;
  status: 'HEALTHY' | 'DEGRADED' | 'DOWN';
  last_check_at: Date;
  latency_ms?: number;
  error_rate?: number;
}

export interface RetryQueue extends BaseEntity {
  event_type: string;
  payload: any;
  retry_count: number;
  next_retry_at: Date;
  status: 'PENDING' | 'FAILED' | 'PROCESSED';
}

export interface DeadLetterQueue extends BaseEntity {
  original_queue_id: string;
  reason: string;
  payload: any;
  failed_at: Date;
}
