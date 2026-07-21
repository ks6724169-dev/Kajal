import { BaseRepository } from './BaseRepository.js';
import { 
  IntegrationProvider, 
  APIConnector, 
  WebhookEndpoint, 
  SyncJob,
  DataMapping,
  RetryQueue
} from '../entities/IntegrationDomain.js';

export class IntegrationProviderRepository extends BaseRepository<IntegrationProvider> {
  protected tableName = 'integration_provider';
}

export class APIConnectorRepository extends BaseRepository<APIConnector> {
  protected tableName = 'api_connector';
}

export class WebhookEndpointRepository extends BaseRepository<WebhookEndpoint> {
  protected tableName = 'webhook_endpoint';
}

export class SyncJobRepository extends BaseRepository<SyncJob> {
  protected tableName = 'sync_job';
}

export class DataMappingRepository extends BaseRepository<DataMapping> {
  protected tableName = 'data_mapping';
}

export class RetryQueueRepository extends BaseRepository<RetryQueue> {
  protected tableName = 'retry_queue';
}
