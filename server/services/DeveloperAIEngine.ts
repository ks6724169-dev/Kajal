import { aiGateway } from '../ai/AIGateway.js';

export class DeveloperAIEngine {
  constructor(private tenantId: string) {}

  async generatePluginBoilerplate(description: string) {
    const prompt = `Generate a boilerplate for a Galaxy ERP plugin that: ${description}`;
    const schema = `{ "files": [{ "name": "string", "content": "string" }] }`;
    return await aiGateway.generateJSON<any>(this.tenantId, prompt, schema);
  }

  async generateAPIDocs(schema: string) {
    const prompt = `Generate API documentation for: ${schema}`;
    const outputSchema = `{ "markdown": "string" }`;
    return await aiGateway.generateJSON<any>(this.tenantId, prompt, outputSchema);
  }
}
