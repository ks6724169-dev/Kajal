import { aiGateway } from '../ai/AIGateway.js';

export class SecurityAnalyticsEngine {
  constructor(private tenantId: string) {}

  async analyzeLoginPatterns(userId: string): Promise<any> {
    const prompt = `Analyze login history for user and detect anomalies indicating fraud or compromised credentials. Return JSON.`;
    const schema = `{ "risk_level": "LOW|MEDIUM|HIGH", "anomalies": ["string"], "recommendation": "string" }`;
    
    return await aiGateway.generateJSON<any>(this.tenantId, prompt, schema);
  }
}
