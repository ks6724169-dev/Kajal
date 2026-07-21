import { 
  ServiceRegistryRepository, 
  ServiceDiscoveryRepository, 
  ServiceMeshRepository, 
  GlobalOperationLogRepository 
} from '../repositories/index.js';

export class ServiceMeshEngine {
  private registryRepo: ServiceRegistryRepository;
  private discoveryRepo: ServiceDiscoveryRepository;
  private meshRepo: ServiceMeshRepository;
  private logRepo: GlobalOperationLogRepository;

  constructor(private readonly tenantId: string) {
    this.registryRepo = new ServiceRegistryRepository(this.tenantId);
    this.discoveryRepo = new ServiceDiscoveryRepository(this.tenantId);
    this.meshRepo = new ServiceMeshRepository(this.tenantId);
    this.logRepo = new GlobalOperationLogRepository(this.tenantId);
  }

  async registerService(name: string, versionTag: string, endpoint: string) {
    const service = await this.registryRepo.insert({
      name,
      version_tag: versionTag,
      endpoint,
      status: 'UP'
    } as any);

    await this.logRepo.insert({
      action: 'SERVICE_REGISTER',
      severity: 'INFO',
      details: { service_id: service.id, name, versionTag }
    });

    return service;
  }

  async discoverServices(name: string) {
    await this.logRepo.insert({
      action: 'SERVICE_DISCOVERY_LOOKUP',
      severity: 'INFO',
      details: { serviceName: name }
    });

    return {
      serviceName: name,
      endpoints: [
        { ip: '10.244.0.5', port: 3000, version: '1.2.0' },
        { ip: '10.244.1.9', port: 3000, version: '1.2.0' }
      ]
    };
  }

  async configureMesh(name: string, mtlsEnabled: boolean = true) {
    const mesh = await this.meshRepo.insert({
      name,
      provider: 'ISTIO',
      mtls_enabled: mtlsEnabled
    } as any);

    await this.logRepo.insert({
      action: 'SERVICE_MESH_CONFIGURE',
      severity: 'INFO',
      details: { mesh_id: mesh.id, name, mtlsEnabled }
    });

    return mesh;
  }
}
