export class PluginEngine {
  constructor(private tenantId: string) {}

  async installPlugin(pluginId: string, versionId: string, targetTenantId: string) {
    return { status: "INSTALLED" };
  }
}
