import { aiGateway } from '../ai/AIGateway.js';

export class DevOpsAnalyticsEngine {
  constructor(private tenantId: string) {}

  async performRootCauseAnalysis(incidentId: string): Promise<any> {
    const prompt = `Analyze recent logs and metrics to determine the root cause of the incident. Return JSON.`;
    const schema = `{ "root_cause": "string", "confidence_score": "number", "recommended_action": "string" }`;
    
    return await aiGateway.generateJSON<any>(this.tenantId, prompt, schema);
  }

  async predictCapacity(): Promise<any> {
    const prompt = `Analyze resource usage trends and predict when capacity will be exhausted.`;
    const schema = `{ "days_until_exhaustion": "number", "resource_bottleneck": "string", "recommendation": "string" }`;
    
    return await aiGateway.generateJSON<any>(this.tenantId, prompt, schema);
  }
}
