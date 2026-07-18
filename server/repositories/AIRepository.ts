import { BaseRepository } from './BaseRepository.js';
import {
  AIProviderRegistry,
  AIModelRegistry,
  AIUsageLog,
  AIRequestLog,
  AIResponseCache,
  AIAPIKey,
  AIRateLimit,
  AICostTracking,
  AIProviderHealth
} from '../entities/AIDomain.js';

export class AIProviderRegistryRepository extends BaseRepository<AIProviderRegistry> {
  protected tableName = 'ai_provider_registry';
}

export class AIModelRegistryRepository extends BaseRepository<AIModelRegistry> {
  protected tableName = 'ai_model_registry';
}

export class AIUsageLogRepository extends BaseRepository<AIUsageLog> {
  protected tableName = 'ai_usage_log';
}

export class AIRequestLogRepository extends BaseRepository<AIRequestLog> {
  protected tableName = 'ai_request_log';
}

export class AIResponseCacheRepository extends BaseRepository<AIResponseCache> {
  protected tableName = 'ai_response_cache';
}

export class AIAPIKeyRepository extends BaseRepository<AIAPIKey> {
  protected tableName = 'ai_api_keys';
}

export class AIRateLimitRepository extends BaseRepository<AIRateLimit> {
  protected tableName = 'ai_rate_limits';
}

export class AICostTrackingRepository extends BaseRepository<AICostTracking> {
  protected tableName = 'ai_cost_tracking';
}

export class AIProviderHealthRepository extends BaseRepository<AIProviderHealth> {
  protected tableName = 'ai_provider_health';
}
