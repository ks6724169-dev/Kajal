import { aiGateway } from '../ai/AIGateway.js';
import { ExecutiveInsight } from '../entities/AnalyticsDomain.js';

export class ExecutiveIntelligenceEngine {
  constructor(private tenantId: string) {}

  async generateExecutiveSummary(): Promise<Partial<ExecutiveInsight>> {
    const prompt = `Generate a weekly executive summary for school operations covering Revenue, Academic Performance, and Risk Areas. Return as JSON: { "title": "...", "content": "...", "category": "REVENUE", "severity": "MEDIUM" }`;
    const schema = `{ "title": "string", "content": "string", "category": "REVENUE|ACADEMIC|OPERATIONAL|RISK", "severity": "LOW|MEDIUM|HIGH|CRITICAL" }`;
    
    const insight = await aiGateway.generateJSON<any>(this.tenantId, prompt, schema);
    
    return {
      ...insight,
      ai_generated: true,
      date_generated: new Date()
    };
  }

  async forecastDropoutRisk(): Promise<any> {
    const prompt = `Analyze historical student data and predict dropout risks. Output as JSON.`;
    const schema = `[{ "student_id": "string", "risk_score": "number", "reason": "string" }]`;
    
    return await aiGateway.generateJSON<any[]>(this.tenantId, prompt, schema);
  }
}
