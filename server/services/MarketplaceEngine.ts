export class MarketplaceEngine {
  constructor(private tenantId: string) {}

  async publishPlugin(pluginId: string, versionId: string, category: string, price: number) {
    return { status: "PUBLISHED" };
  }
}
