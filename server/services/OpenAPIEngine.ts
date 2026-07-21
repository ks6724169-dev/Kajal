export class OpenAPIEngine {
  constructor(private tenantId: string) {}

  async getOpenAPI() {
    return { openapi: "3.1.0", info: { title: "Galaxy ERP API", version: "1.0" } };
  }
}
