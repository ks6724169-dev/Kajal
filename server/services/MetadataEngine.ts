export class MetadataEngine {
  constructor(private tenantId: string) {}
  async discoverMetadata(catalogId: string) {
    return { discovered_attributes: [] };
  }
}
