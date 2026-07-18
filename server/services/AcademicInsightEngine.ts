import { aiGateway } from '../ai/AIGateway.js';

export class AcademicInsightEngine {
  public async generateSummary(
    tenantId: string,
    audience: 'STUDENT' | 'PARENT' | 'TEACHER' | 'PRINCIPAL' | 'SCHOOL_OWNER',
    dataContext: string
  ): Promise<{ summary: string; kpis: any; riskLevel: string }> {
    const prompt = `Generate a summary for audience: ${audience} based on data: ${dataContext}. Output JSON with a summary string, an array of kpis {label, value}, and riskLevel (LOW, MEDIUM, HIGH).`;
    
    return await aiGateway.generateJSON<{ summary: string; kpis: any; riskLevel: string }>(
      tenantId,
      prompt,
      '{"summary": "string", "kpis": [{"label": "string", "value": "string"}], "riskLevel": "string"}'
    );
  }
}

export const academicInsightEngine = new AcademicInsightEngine();
