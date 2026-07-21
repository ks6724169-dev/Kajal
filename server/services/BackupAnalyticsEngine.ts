import { aiGateway } from '../ai/AIGateway.js';

export class BackupAnalyticsEngine {
  constructor(private tenantId: string) {}

  async analyzeBackupHealth(): Promise<any> {
    const prompt = `Analyze backup frequency, size, and failure rates to determine overall backup health and disaster recovery readiness.`;
    const schema = `{ "health_score": "number", "status": "HEALTHY|AT_RISK|CRITICAL", "recommendations": ["string"] }`;
    return await aiGateway.generateJSON<any>(this.tenantId, prompt, schema);
  }

  async predictStorageCapacity(): Promise<any> {
    const prompt = `Based on current backup size growth, predict when storage capacity will be reached.`;
    const schema = `{ "days_to_full": "number", "projected_growth_gb_per_month": "number", "recommendation": "string" }`;
    return await aiGateway.generateJSON<any>(this.tenantId, prompt, schema);
  }
}
