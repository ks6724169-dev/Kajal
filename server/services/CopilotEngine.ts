import { aiGateway } from '../ai/AIGateway.js';

export class CopilotEngine {
  constructor(private tenantId: string) {}

  async chat(agentId: string, userId: string, message: string, conversationId?: string): Promise<any> {
    const prompt = `Chat input: ${message}`;
    const schema = `{ "reply": "string", "suggested_actions": ["string"] }`;
    return await aiGateway.generateJSON<any>(this.tenantId, prompt, schema);
  }
}
