export interface AIConfig {
  defaultProvider: string;
  defaultModel: string;
  temperature: number;
  maxTokens: number;
  timeoutMs: number;
  retryCount: number;
  streamingEnabled: boolean;
  costLimitPerTenant: number; // monthly limit in USD
  costLimitPerUser: number; // monthly limit in USD
}

export const defaultAIConfig: AIConfig = {
  defaultProvider: process.env.AI_PROVIDER || 'gemini',
  defaultModel: process.env.AI_MODEL || 'gemini-3.5-flash',
  temperature: Number(process.env.AI_TEMPERATURE) || 0.7,
  maxTokens: Number(process.env.AI_MAX_TOKENS) || 2048,
  timeoutMs: Number(process.env.AI_TIMEOUT_MS) || 30000,
  retryCount: Number(process.env.AI_RETRY_COUNT) || 3,
  streamingEnabled: process.env.AI_STREAMING_ENABLED !== 'false',
  costLimitPerTenant: Number(process.env.AI_TENANT_COST_LIMIT) || 100.00,
  costLimitPerUser: Number(process.env.AI_USER_COST_LIMIT) || 10.00
};

export class AIConfiguration {
  private static config: AIConfig = { ...defaultAIConfig };

  public static getConfig(): AIConfig {
    return this.config;
  }

  public static updateConfig(newConfig: Partial<AIConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }

  public static getApiKeyForProvider(provider: string): string {
    switch (provider.toLowerCase()) {
      case 'gemini':
        return process.env.GEMINI_API_KEY || '';
      case 'openai':
        return process.env.OPENAI_API_KEY || '';
      case 'claude':
        return process.env.ANTHROPIC_API_KEY || '';
      default:
        return '';
    }
  }
}
