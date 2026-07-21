export class SDKEngine {
  constructor(private tenantId: string) {}

  async generateSDK(language: string, openApiSchema: any) {
    return { sdk_url: `https://sdk.galaxyerp.com/${language}/v1.zip` };
  }
}
