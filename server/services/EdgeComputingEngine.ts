import { 
  EdgeLocationRepository, 
  EdgeCacheRepository, 
  CDNConfigurationRepository, 
  GlobalOperationLogRepository 
} from '../repositories/index.js';

export class EdgeComputingEngine {
  private edgeLocationRepo: EdgeLocationRepository;
  private edgeCacheRepo: EdgeCacheRepository;
  private cdnRepo: CDNConfigurationRepository;
  private logRepo: GlobalOperationLogRepository;

  constructor(private readonly tenantId: string) {
    this.edgeLocationRepo = new EdgeLocationRepository(this.tenantId);
    this.edgeCacheRepo = new EdgeCacheRepository(this.tenantId);
    this.cdnRepo = new CDNConfigurationRepository(this.tenantId);
    this.logRepo = new GlobalOperationLogRepository(this.tenantId);
  }

  async registerEdgeNode(city: string, country: string, ipAddress?: string) {
    const node = await this.edgeLocationRepo.insert({
      city,
      country,
      ip_address: ipAddress,
      status: 'ONLINE'
    } as any);

    await this.logRepo.insert({
      action: 'EDGE_NODE_REGISTER',
      severity: 'INFO',
      details: { node_id: node.id, city, country }
    });

    return node;
  }

  async purgeEdgeCache(locationId: string, keyPattern: string) {
    const cacheRecord = await this.edgeCacheRepo.insert({
      location_id: locationId,
      key_pattern: keyPattern,
      hit_rate: 0,
      size_mb: 0
    } as any);

    await this.logRepo.insert({
      action: 'EDGE_CACHE_PURGE',
      severity: 'INFO',
      details: { locationId, keyPattern, cacheRecordId: cacheRecord.id }
    });

    return { status: 'PURGED', pattern: keyPattern, locationId };
  }

  async configureCDN(domainName: string, originUrl: string, ttlSeconds: number = 3600) {
    const config = await this.cdnRepo.insert({
      domain_name: domainName,
      origin_url: originUrl,
      ttl_seconds: ttlSeconds,
      ssl_enabled: true
    } as any);

    await this.logRepo.insert({
      action: 'CDN_CONFIGURE',
      severity: 'INFO',
      details: { cdn_id: config.id, domainName, originUrl }
    });

    return config;
  }
}
