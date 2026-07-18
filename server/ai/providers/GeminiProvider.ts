import { GoogleGenAI } from '@google/genai';
import { AIProvider } from './AIProvider.js';
import { ChatMessage, ChatOptions, ChatResponse } from '../../entities/AIDomain.js';

export class GeminiProvider implements AIProvider {
  private ai: GoogleGenAI;
  private model: string;

  constructor(apiKey?: string, model: string = 'gemini-3.5-flash') {
    const key = apiKey || process.env.GEMINI_API_KEY || '';
    this.ai = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
    this.model = model;
  }

  public getProviderName(): string {
    return 'gemini';
  }

  public async isHealthy(): Promise<boolean> {
    try {
      // Small test to check health
      await this.ai.models.generateContent({
        model: this.model,
        contents: 'ping',
        config: { maxOutputTokens: 5 }
      });
      return true;
    } catch {
      return false;
    }
  }

  public async chat(messages: ChatMessage[], options?: ChatOptions): Promise<ChatResponse> {
    try {
      const systemMessage = messages.find(m => m.role === 'system');
      const otherMessages = messages.filter(m => m.role !== 'system');

      const contents = otherMessages.map(msg => ({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.content }]
      }));

      const config: any = {
        temperature: options?.temperature,
        maxOutputTokens: options?.maxTokens,
      };

      if (systemMessage) {
        config.systemInstruction = systemMessage.content;
      }

      if (options?.jsonMode) {
        config.responseMimeType = 'application/json';
      }

      const response = await this.ai.models.generateContent({
        model: this.model,
        contents: contents.length > 0 ? contents : [{ role: 'user', parts: [{ text: '' }] }],
        config
      });

      const text = response.text || '';
      const promptTokens = response.usageMetadata?.promptTokenCount || 0;
      const completionTokens = response.usageMetadata?.candidatesTokenCount || 0;

      return {
        text,
        usage: {
          promptTokens,
          completionTokens,
          totalTokens: promptTokens + completionTokens
        }
      };
    } catch (error: any) {
      throw new Error(`[GeminiProvider] Error: ${error.message || error}`);
    }
  }

  public async streamChat(
    messages: ChatMessage[],
    options?: ChatOptions,
    onChunk?: (text: string) => void
  ): Promise<ChatResponse> {
    try {
      const systemMessage = messages.find(m => m.role === 'system');
      const otherMessages = messages.filter(m => m.role !== 'system');

      const contents = otherMessages.map(msg => ({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.content }]
      }));

      const config: any = {
        temperature: options?.temperature,
        maxOutputTokens: options?.maxTokens,
      };

      if (systemMessage) {
        config.systemInstruction = systemMessage.content;
      }

      if (options?.jsonMode) {
        config.responseMimeType = 'application/json';
      }

      const responseStream = await this.ai.models.generateContentStream({
        model: this.model,
        contents: contents.length > 0 ? contents : [{ role: 'user', parts: [{ text: '' }] }],
        config
      });

      let fullText = '';
      for await (const chunk of responseStream) {
        const text = chunk.text;
        if (text) {
          fullText += text;
          if (onChunk) {
            onChunk(text);
          }
        }
      }

      return {
        text: fullText,
        usage: {
          promptTokens: Math.ceil(fullText.length / 4), // Approximate fallback
          completionTokens: Math.ceil(fullText.length / 4),
          totalTokens: Math.ceil(fullText.length / 2)
        }
      };
    } catch (error: any) {
      throw new Error(`[GeminiProvider] Streaming Error: ${error.message || error}`);
    }
  }

  public async embed(text: string, options?: ChatOptions): Promise<number[]> {
    try {
      const response: any = await this.ai.models.embedContent({
        model: 'gemini-embedding-2-preview',
        contents: text
      });

      if (response.embedding?.values) {
        return response.embedding.values;
      }
      if (response.embeddings?.[0]?.values) {
        return response.embeddings[0].values;
      }
      throw new Error('No embedding values returned');
    } catch (error: any) {
      throw new Error(`[GeminiProvider] Embed Error: ${error.message || error}`);
    }
  }

  public async analyzeImage(
    imageBuffer: Buffer,
    mimeType: string,
    promptText?: string,
    options?: ChatOptions
  ): Promise<string> {
    try {
      const response = await this.ai.models.generateContent({
        model: this.model,
        contents: [
          {
            inlineData: {
              data: imageBuffer.toString('base64'),
              mimeType
            }
          },
          { text: promptText || 'Analyze this image.' }
        ]
      });

      return response.text || '';
    } catch (error: any) {
      throw new Error(`[GeminiProvider] Image Analysis Error: ${error.message || error}`);
    }
  }

  public async analyzeDocument(
    fileBuffer: Buffer,
    mimeType: string,
    promptText?: string,
    options?: ChatOptions
  ): Promise<string> {
    try {
      const response = await this.ai.models.generateContent({
        model: this.model,
        contents: [
          {
            inlineData: {
              data: fileBuffer.toString('base64'),
              mimeType
            }
          },
          { text: promptText || 'Analyze this document.' }
        ]
      });

      return response.text || '';
    } catch (error: any) {
      throw new Error(`[GeminiProvider] Document Analysis Error: ${error.message || error}`);
    }
  }
}
