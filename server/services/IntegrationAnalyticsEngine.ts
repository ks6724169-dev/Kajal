import { aiGateway } from '../ai/AIGateway.js';

export class IntegrationAnalyticsEngine {
  constructor(private tenantId: string) {}

  async suggestDataMapping(sourceSchema: any, targetSchema: any): Promise<any> {
    const prompt = `Suggest field mappings from source schema to target schema. JSON format.`;
    const schema = `[{ "source_field": "string", "target_field": "string", "confidence": "number" }]`;
    
    return await aiGateway.generateJSON<any[]>(this.tenantId, prompt, schema);
  }

  async analyzeIntegrationHealth(): Promise<any> {
    const prompt = `Analyze API latency and error rates to predict integration health risks. Output JSON.`;
    const schema = `{ "status": "HEALTHY|DEGRADED", "risk_factors": ["string"], "recommendation": "string" }`;
    
    return await aiGateway.generateJSON<any>(this.tenantId, prompt, schema);
  }
}
