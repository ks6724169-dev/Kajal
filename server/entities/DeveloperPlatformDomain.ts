import { BaseEntity } from './BaseEntity.js';

export interface DeveloperAccount extends BaseEntity {
  tenant_id: string;
  name: string;
  email: string;
  company?: string;
  is_approved: boolean;
  status: string;
}

export interface DeveloperOrganization extends BaseEntity {
  tenant_id: string;
  name: string;
  domain?: string;
}

export interface APIApplication extends BaseEntity {
  tenant_id: string;
  developer_id: string;
  name: string;
  description?: string;
  status: string;
}

export interface APIKey extends BaseEntity {
  tenant_id: string;
  application_id: string;
  name: string;
  key_hash: string;
  scopes: string[];
  expires_at?: Date;
  is_active: boolean;
}

export interface APISecret extends BaseEntity {
  tenant_id: string;
  application_id: string;
  secret_hash: string;
  expires_at?: Date;
}

export interface APIScope extends BaseEntity {
  tenant_id: string;
  name: string;
  description: string;
}

export interface APIToken extends BaseEntity {
  tenant_id: string;
  application_id: string;
  token_hash: string;
  expires_at: Date;
}

export interface OAuthClient extends BaseEntity {
  tenant_id: string;
  application_id: string;
  client_id: string;
  client_secret_hash: string;
  redirect_uris: string[];
  grant_types: string[];
}

export interface OAuthAuthorization extends BaseEntity {
  tenant_id: string;
  client_id: string;
  user_id: string;
  scopes: string[];
  code_hash: string;
  expires_at: Date;
}

export interface OAuthRefreshToken extends BaseEntity {
  tenant_id: string;
  client_id: string;
  user_id: string;
  token_hash: string;
  expires_at: Date;
}

export interface Webhook extends BaseEntity {
  tenant_id: string;
  application_id: string;
  url: string;
  secret: string;
  events: string[];
  is_active: boolean;
}

export interface WebhookDelivery extends BaseEntity {
  tenant_id: string;
  webhook_id: string;
  event_id: string;
  payload: any;
  status: string;
  response_code?: number;
  response_body?: string;
}

export interface WebhookLog extends BaseEntity {
  tenant_id: string;
  webhook_id: string;
  message: string;
}

export interface EventBus extends BaseEntity {
  tenant_id: string;
  name: string;
  description: string;
}

export interface EventSubscription extends BaseEntity {
  tenant_id: string;
  event_bus_id: string;
  webhook_id: string;
}

export interface Plugin extends BaseEntity {
  tenant_id: string;
  developer_id: string;
  name: string;
  description: string;
  status: string;
}

export interface PluginVersion extends BaseEntity {
  tenant_id: string;
  plugin_id: string;
  version_number: string;
  manifest: any;
  code_url: string;
  is_published: boolean;
}

export interface PluginInstallation extends BaseEntity {
  tenant_id: string;
  plugin_id: string;
  version_id: string;
  target_tenant_id: string;
  status: string;
}

export interface PluginPermission extends BaseEntity {
  tenant_id: string;
  plugin_id: string;
  scope: string;
  is_granted: boolean;
}

export interface PluginMarketplace extends BaseEntity {
  tenant_id: string;
  plugin_id: string;
  category: string;
  price: number;
  rating: number;
  reviews_count: number;
  is_featured: boolean;
}

export interface Extension extends BaseEntity {
  tenant_id: string;
  name: string;
  type: string;
}

export interface SDKRelease extends BaseEntity {
  tenant_id: string;
  language: string;
  version_number: string;
  url: string;
}

export interface SDKDownload extends BaseEntity {
  tenant_id: string;
  sdk_id: string;
  developer_id: string;
}

export interface APIUsage extends BaseEntity {
  tenant_id: string;
  application_id: string;
  endpoint: string;
  request_count: number;
  error_count: number;
  date: Date;
}

export interface APIQuota extends BaseEntity {
  tenant_id: string;
  application_id: string;
  limit_per_day: number;
}

export interface APIRateLimit extends BaseEntity {
  tenant_id: string;
  application_id: string;
  limit_per_second: number;
}

export interface APIBilling extends BaseEntity {
  tenant_id: string;
  application_id: string;
  amount: number;
  currency: string;
  status: string;
}

export interface SandboxEnvironment extends BaseEntity {
  tenant_id: string;
  application_id: string;
  name: string;
  config: any;
}

export interface DeveloperActivity extends BaseEntity {
  tenant_id: string;
  developer_id: string;
  action: string;
  details: any;
}

export interface DeveloperNotification extends BaseEntity {
  tenant_id: string;
  developer_id: string;
  message: string;
  is_read: boolean;
}

export interface APIDocumentation extends BaseEntity {
  tenant_id: string;
  title: string;
  content: string;
}

export interface OpenAPISchema extends BaseEntity {
  tenant_id: string;
  version_number: string;
  schema: any;
}

export interface GraphQLSchema extends BaseEntity {
  tenant_id: string;
  version_number: string;
  schema_definition: string;
}

export interface IntegrationTemplate extends BaseEntity {
  tenant_id: string;
  name: string;
  provider: string;
  config: any;
}
