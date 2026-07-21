export class GraphQLEngine {
  constructor(private tenantId: string) {}

  async getSchema() {
    return { schema: "type Query { hello: String }" };
  }
}
