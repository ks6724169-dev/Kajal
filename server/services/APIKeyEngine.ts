export class APIKeyEngine {
  constructor(private tenantId: string) {}

  async generateKey(applicationId: string, name: string, scopes: string[]) {
    // Stub implementation
    return { api_key: "ak_live_" + Math.random().toString(36).substring(7), scopes };
  }
}
