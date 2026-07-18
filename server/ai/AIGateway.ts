import { aiServiceManager } from './AIServiceManager.js';
import { ChatMessage, ChatOptions, ChatResponse } from '../entities/AIDomain.js';

export class AIGateway {
  
  public async chat(
    tenantId: string, 
    messages: ChatMessage[], 
    options?: ChatOptions
  ): Promise<ChatResponse> {
    return aiServiceManager.executeChat(tenantId, messages, options);
  }

  public async analyzeDocument(
    tenantId: string,
    fileBuffer: Buffer,
    mimeType: string,
    promptText?: string,
    options?: ChatOptions
  ): Promise<string> {
    return aiServiceManager.executeAnalyzeDocument(tenantId, fileBuffer, mimeType, promptText, options);
  }

  public async analyzeImage(
    tenantId: string,
    imageBuffer: Buffer,
    mimeType: string,
    promptText?: string,
    options?: ChatOptions
  ): Promise<string> {
    return aiServiceManager.executeAnalyzeImage(tenantId, imageBuffer, mimeType, promptText, options);
  }

  public async summarize(
    tenantId: string,
    text: string,
    options?: ChatOptions
  ): Promise<string> {
    const messages: ChatMessage[] = [
      { role: 'system', content: 'You are an advanced text summarization agent. Generate a concise, high-impact summary of the text provided.' },
      { role: 'user', content: text }
    ];
    const response = await aiServiceManager.executeChat(tenantId, messages, options);
    return response.text;
  }

  public async classify(
    tenantId: string,
    text: string,
    categories: string[],
    options?: ChatOptions
  ): Promise<string> {
    const messages: ChatMessage[] = [
      {
        role: 'system',
        content: `You are an expert classification agent. Classify the user text into exactly one of the following categories: [${categories.join(', ')}]. Respond with only the category name.`
      },
      { role: 'user', content: text }
    ];
    const response = await aiServiceManager.executeChat(tenantId, messages, options);
    return response.text.trim();
  }

  public async translate(
    tenantId: string,
    text: string,
    targetLanguage: string,
    options?: ChatOptions
  ): Promise<string> {
    const messages: ChatMessage[] = [
      {
        role: 'system',
        content: `You are a high-fidelity translator. Translate the user text into ${targetLanguage}. Keep original formatting and tone.`
      },
      { role: 'user', content: text }
    ];
    const response = await aiServiceManager.executeChat(tenantId, messages, options);
    return response.text;
  }

  public async embeddings(
    tenantId: string,
    text: string,
    options?: ChatOptions
  ): Promise<number[]> {
    return aiServiceManager.executeEmbed(tenantId, text, options);
  }

  public async recommendation(
    tenantId: string,
    context: string,
    options?: ChatOptions
  ): Promise<string> {
    const messages: ChatMessage[] = [
      {
        role: 'system',
        content: 'You are an enterprise strategic recommendations agent. Based on the provided context, generate actionable suggestions or intervention strategies.'
      },
      { role: 'user', content: context }
    ];
    const response = await aiServiceManager.executeChat(tenantId, messages, options);
    return response.text;
  }

  public async generateJSON<T>(
    tenantId: string,
    prompt: string,
    schemaDescription: string,
    options?: ChatOptions
  ): Promise<T> {
    const messages: ChatMessage[] = [
      {
        role: 'system',
        content: `You are a structured JSON generation bot. Generate a JSON object strictly following this schema: ${schemaDescription}. Ensure the output is valid, parseable JSON and nothing else.`
      },
      { role: 'user', content: prompt }
    ];
    const response = await aiServiceManager.executeChat(tenantId, messages, {
      ...options,
      jsonMode: true
    });
    try {
      return JSON.parse(response.text) as T;
    } catch {
      throw new Error(`[AIGateway] Failed to parse generated text as valid JSON: ${response.text}`);
    }
  }
}

export const aiGateway = new AIGateway();
