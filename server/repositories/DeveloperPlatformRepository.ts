import { BaseRepository } from './BaseRepository.js';
import * as Domain from '../entities/DeveloperPlatformDomain.js';

export class DeveloperAccountRepository extends BaseRepository<Domain.DeveloperAccount> { protected tableName = 'developer_account'; }
export class DeveloperOrganizationRepository extends BaseRepository<Domain.DeveloperOrganization> { protected tableName = 'developer_organization'; }
export class APIApplicationRepository extends BaseRepository<Domain.APIApplication> { protected tableName = 'api_application'; }
export class APIKeyRepository extends BaseRepository<Domain.APIKey> { protected tableName = 'api_key'; }
export class APISecretRepository extends BaseRepository<Domain.APISecret> { protected tableName = 'api_secret'; }
export class APIScopeRepository extends BaseRepository<Domain.APIScope> { protected tableName = 'api_scope'; }
export class APITokenRepository extends BaseRepository<Domain.APIToken> { protected tableName = 'api_token'; }
export class OAuthClientRepository extends BaseRepository<Domain.OAuthClient> { protected tableName = 'oauth_client'; }
export class OAuthAuthorizationRepository extends BaseRepository<Domain.OAuthAuthorization> { protected tableName = 'oauth_authorization'; }
export class OAuthRefreshTokenRepository extends BaseRepository<Domain.OAuthRefreshToken> { protected tableName = 'oauth_refresh_token'; }
export class WebhookRepository extends BaseRepository<Domain.Webhook> { protected tableName = 'webhook'; }
export class WebhookDeliveryRepository extends BaseRepository<Domain.WebhookDelivery> { protected tableName = 'webhook_delivery'; }
export class WebhookLogRepository extends BaseRepository<Domain.WebhookLog> { protected tableName = 'webhook_log'; }
export class EventBusRepository extends BaseRepository<Domain.EventBus> { protected tableName = 'event_bus'; }
export class EventSubscriptionRepository extends BaseRepository<Domain.EventSubscription> { protected tableName = 'event_subscription'; }
export class PluginRepository extends BaseRepository<Domain.Plugin> { protected tableName = 'plugin'; }
export class PluginVersionRepository extends BaseRepository<Domain.PluginVersion> { protected tableName = 'plugin_version'; }
export class PluginInstallationRepository extends BaseRepository<Domain.PluginInstallation> { protected tableName = 'plugin_installation'; }
export class PluginPermissionRepository extends BaseRepository<Domain.PluginPermission> { protected tableName = 'plugin_permission'; }
export class PluginMarketplaceRepository extends BaseRepository<Domain.PluginMarketplace> { protected tableName = 'plugin_marketplace'; }
export class ExtensionRepository extends BaseRepository<Domain.Extension> { protected tableName = 'extension'; }
export class SDKReleaseRepository extends BaseRepository<Domain.SDKRelease> { protected tableName = 'sdk_release'; }
export class SDKDownloadRepository extends BaseRepository<Domain.SDKDownload> { protected tableName = 'sdk_download'; }
export class APIUsageRepository extends BaseRepository<Domain.APIUsage> { protected tableName = 'api_usage'; }
export class APIQuotaRepository extends BaseRepository<Domain.APIQuota> { protected tableName = 'api_quota'; }
export class APIRateLimitRepository extends BaseRepository<Domain.APIRateLimit> { protected tableName = 'api_rate_limit'; }
export class APIBillingRepository extends BaseRepository<Domain.APIBilling> { protected tableName = 'api_billing'; }
export class SandboxEnvironmentRepository extends BaseRepository<Domain.SandboxEnvironment> { protected tableName = 'sandbox_environment'; }
export class DeveloperActivityRepository extends BaseRepository<Domain.DeveloperActivity> { protected tableName = 'developer_activity'; }
export class DeveloperNotificationRepository extends BaseRepository<Domain.DeveloperNotification> { protected tableName = 'developer_notification'; }
export class APIDocumentationRepository extends BaseRepository<Domain.APIDocumentation> { protected tableName = 'api_documentation'; }
export class OpenAPISchemaRepository extends BaseRepository<Domain.OpenAPISchema> { protected tableName = 'openapi_schema'; }
export class GraphQLSchemaRepository extends BaseRepository<Domain.GraphQLSchema> { protected tableName = 'graphql_schema'; }
export class IntegrationTemplateRepository extends BaseRepository<Domain.IntegrationTemplate> { protected tableName = 'integration_template'; }
