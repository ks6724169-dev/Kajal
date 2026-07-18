import { AIProvider } from './AIProvider.js';
import { ChatMessage, ChatOptions, ChatResponse } from '../../entities/AIDomain.js';

export class ClaudeProvider implements AIProvider {
  private apiKey: string;
  private model: string;

  constructor(apiKey?: string, model: string = 'claude-3-5-sonnet-20241022') {
    this.apiKey = apiKey || process.env.ANTHROPIC_API_KEY || '';
    this.model = model;
  }

  public getProviderName(): string {
    return 'claude';
  }

  private hasRealKey(): boolean {
    return !!this.apiKey && !this.apiKey.startsWith('mock_') && this.apiKey.length > 10;
  }

  public async isHealthy(): Promise<boolean> {
    return true; // Mock mode or real checking is assumed healthy
  }

  public async chat(messages: ChatMessage[], options?: ChatOptions): Promise<ChatResponse> {
    if (!this.hasRealKey()) {
      const promptText = messages.map(m => m.content).join(' ');
      const responseText = this.getMockResponse(promptText, options?.jsonMode);
      return {
        text: responseText,
        usage: { promptTokens: 12, completionTokens: 25, totalTokens: 37 }
      };
    }

    try {
      const systemMessage = messages.find(m => m.role === 'system');
      const otherMessages = messages.filter(m => m.role !== 'system');

      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.apiKey,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: this.model,
          max_tokens: options?.maxTokens || 1024,
          system: systemMessage?.content,
          messages: otherMessages.map(m => ({
            role: m.role === 'assistant' ? 'assistant' : 'user',
            content: m.content
          })),
          temperature: options?.temperature ?? 0.7
        })
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`Claude API failed: ${response.statusText} - ${errText}`);
      }

      const data = await response.json() as any;
      const text = data.content?.[0]?.text || '';
      const promptTokens = data.usage?.input_tokens || 0;
      const completionTokens = data.usage?.output_tokens || 0;

      return {
        text,
        usage: {
          promptTokens,
          completionTokens,
          totalTokens: promptTokens + completionTokens
        }
      };
    } catch (error: any) {
      throw new Error(`[ClaudeProvider] Error: ${error.message || error}`);
    }
  }

  public async streamChat(
    messages: ChatMessage[],
    options?: ChatOptions,
    onChunk?: (text: string) => void
  ): Promise<ChatResponse> {
    // Falls back to regular chat or mocks since standard fetch SSE stream is complex for custom test environments
    const res = await this.chat(messages, options);
    if (onChunk && res.text) {
      onChunk(res.text);
    }
    return res;
  }

  public async embed(text: string, options?: ChatOptions): Promise<number[]> {
    // Anthropic does not natively host a general embedding API; we mock embeddings or proxy to standard 1536 size
    return Array.from({ length: 1536 }, () => Math.random());
  }

  public async analyzeImage(
    imageBuffer: Buffer,
    mimeType: string,
    promptText?: string,
    options?: ChatOptions
  ): Promise<string> {
    if (!this.hasRealKey()) {
      return `[Mock Claude Vision] Analyzed image of size ${imageBuffer.length}. Prompt: ${promptText}`;
    }

    try {
      const base64 = imageBuffer.toString('base64');
      const systemMessage = 'You are a vision-capable AI assistant.';
      
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.apiKey,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: this.model,
          max_tokens: options?.maxTokens || 1024,
          system: systemMessage,
          messages: [
            {
              role: 'user',
              content: [
                {
                  type: 'image',
                  source: {
                    type: 'base64',
                    media_type: mimeType,
                    data: base64
                  }
                },
                {
                  type: 'text',
                  text: promptText || 'Analyze this image.'
                }
              ]
            }
          ]
        })
      });

      if (!response.ok) {
        throw new Error(`Claude Vision failed: ${response.statusText}`);
      }

      const data = await response.json() as any;
      return data.content?.[0]?.text || '';
    } catch (error: any) {
      throw new Error(`[ClaudeProvider] Vision Error: ${error.message || error}`);
    }
  }

  public async analyzeDocument(
    fileBuffer: Buffer,
    mimeType: string,
    promptText?: string,
    options?: ChatOptions
  ): Promise<string> {
    if (!this.hasRealKey()) {
      return `[Mock Claude Document] Analyzed document of size ${fileBuffer.length}. Prompt: ${promptText}`;
    }
    return this.chat([
      { role: 'system', content: 'You are an advanced document intelligence analyst.' },
      { role: 'user', content: `${promptText || 'Analyze this text document:'}\n\n${fileBuffer.toString('utf-8')}` }
    ]).then(r => r.text);
  }

  private getMockResponse(prompt: string, jsonMode?: boolean): string {
    if (jsonMode) {
      return JSON.stringify({
        analysis: "Outstanding progress with high attendance",
        category: "ENRICHMENT",
        risk: "LOW",
        remediation: "Recommend advanced science electives",
        points: 9.5
      });
    }
    return "This is a secure mock completion response generated by the Claude Provider implementation of EAIPI-AGMAP.";
  }
}
