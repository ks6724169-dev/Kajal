import { AIProvider } from '../providers/AIProvider.js';
import { GeminiProvider } from '../providers/GeminiProvider.js';
import { OpenAIProvider } from '../providers/OpenAIProvider.js';
import { ClaudeProvider } from '../providers/ClaudeProvider.js';
import { AIConfiguration } from '../config/AIConfiguration.js';

export class AIProviderFactory {
  public static createProvider(providerName?: string, apiKey?: string, modelName?: string): AIProvider {
    const config = AIConfiguration.getConfig();
    const activeProvider = (providerName || config.defaultProvider || 'gemini').toLowerCase();
    const activeKey = apiKey || AIConfiguration.getApiKeyForProvider(activeProvider);

    switch (activeProvider) {
      case 'gemini': {
        const activeModel = modelName || config.defaultModel || 'gemini-3.5-flash';
        return new GeminiProvider(activeKey, activeModel);
      }
      case 'openai': {
        const activeModel = modelName || 'gpt-4o';
        return new OpenAIProvider(activeKey, activeModel);
      }
      case 'claude': {
        const activeModel = modelName || 'claude-3-5-sonnet-20241022';
        return new ClaudeProvider(activeKey, activeModel);
      }
      default:
        throw new Error(`Unsupported AI Provider: ${activeProvider}`);
    }
  }
}
