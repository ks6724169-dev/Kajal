import { AIProvider } from './AIProvider.js';
import { ChatMessage, ChatOptions, ChatResponse } from '../../entities/AIDomain.js';

export class OpenAIProvider implements AIProvider {
  private apiKey: string;
  private model: string;

  constructor(apiKey?: string, model: string = 'gpt-4o') {
    this.apiKey = apiKey || process.env.OPENAI_API_KEY || '';
    this.model = model;
  }

  public getProviderName(): string {
    return 'openai';
  }

  private hasRealKey(): boolean {
    return !!this.apiKey && !this.apiKey.startsWith('mock_') && this.apiKey.length > 10;
  }

  public async isHealthy(): Promise<boolean> {
    if (!this.hasRealKey()) {
      return true; // Mock mode is always healthy
    }
    try {
      const response = await fetch('https://api.openai.com/v1/models', {
        headers: { 'Authorization': `Bearer ${this.apiKey}` }
      });
      return response.ok;
    } catch {
      return false;
    }
  }

  public async chat(messages: ChatMessage[], options?: ChatOptions): Promise<ChatResponse> {
    if (!this.hasRealKey()) {
      // Mock completion for testing
      const promptText = messages.map(m => m.content).join(' ');
      const responseText = this.getMockResponse(promptText, options?.jsonMode);
      return {
        text: responseText,
        usage: { promptTokens: 10, completionTokens: 20, totalTokens: 30 }
      };
    }

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: this.model,
          messages: messages.map(m => ({ role: m.role, content: m.content })),
          temperature: options?.temperature ?? 0.7,
          max_tokens: options?.maxTokens,
          response_format: options?.jsonMode ? { type: 'json_object' } : undefined
        })
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`OpenAI API failed: ${response.statusText} - ${errText}`);
      }

      const data = await response.json() as any;
      const text = data.choices?.[0]?.message?.content || '';
      const promptTokens = data.usage?.prompt_tokens || 0;
      const completionTokens = data.usage?.completion_tokens || 0;

      return {
        text,
        usage: {
          promptTokens,
          completionTokens,
          totalTokens: promptTokens + completionTokens
        }
      };
    } catch (error: any) {
      throw new Error(`[OpenAIProvider] Error: ${error.message || error}`);
    }
  }

  public async streamChat(
    messages: ChatMessage[],
    options?: ChatOptions,
    onChunk?: (text: string) => void
  ): Promise<ChatResponse> {
    if (!this.hasRealKey()) {
      const fullText = this.getMockResponse(messages.map(m => m.content).join(' '), options?.jsonMode);
      if (onChunk) {
        // Simulate streaming
        const parts = fullText.split(' ');
        for (const part of parts) {
          onChunk(part + ' ');
          await new Promise(resolve => setTimeout(resolve, 20));
        }
      }
      return {
        text: fullText,
        usage: { promptTokens: 10, completionTokens: 20, totalTokens: 30 }
      };
    }

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: this.model,
          messages: messages.map(m => ({ role: m.role, content: m.content })),
          temperature: options?.temperature ?? 0.7,
          max_tokens: options?.maxTokens,
          stream: true
        })
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`OpenAI Streaming failed: ${response.statusText} - ${errText}`);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder('utf-8');
      let fullText = '';

      if (!reader) {
        throw new Error('No body stream reader available');
      }

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunkStr = decoder.decode(value);
        const lines = chunkStr.split('\n').filter(l => l.trim() !== '');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const dataStr = line.slice(6).trim();
            if (dataStr === '[DONE]') break;

            try {
              const parsed = JSON.parse(dataStr);
              const delta = parsed.choices?.[0]?.delta?.content || '';
              if (delta) {
                fullText += delta;
                if (onChunk) {
                  onChunk(delta);
                }
              }
            } catch {
              // Ignore partial JSON parse errors
            }
          }
        }
      }

      return {
        text: fullText,
        usage: {
          promptTokens: Math.ceil(fullText.length / 4),
          completionTokens: Math.ceil(fullText.length / 4),
          totalTokens: Math.ceil(fullText.length / 2)
        }
      };
    } catch (error: any) {
      throw new Error(`[OpenAIProvider] Streaming Error: ${error.message || error}`);
    }
  }

  public async embed(text: string, options?: ChatOptions): Promise<number[]> {
    if (!this.hasRealKey()) {
      return Array.from({ length: 1536 }, () => Math.random());
    }

    try {
      const response = await fetch('https://api.openai.com/v1/embeddings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: 'text-embedding-3-small',
          input: text
        })
      });

      if (!response.ok) {
        throw new Error(`OpenAI Embedding failed: ${response.statusText}`);
      }

      const data = await response.json() as any;
      return data.data?.[0]?.embedding || [];
    } catch (error: any) {
      throw new Error(`[OpenAIProvider] Embed Error: ${error.message || error}`);
    }
  }

  public async analyzeImage(
    imageBuffer: Buffer,
    mimeType: string,
    promptText?: string,
    options?: ChatOptions
  ): Promise<string> {
    if (!this.hasRealKey()) {
      return `[Mock OpenAI Vision] Analyzed image with size ${imageBuffer.length} and type ${mimeType}. Prompt: ${promptText}`;
    }

    try {
      const base64 = imageBuffer.toString('base64');
      const dataUrl = `data:${mimeType};base64,${base64}`;

      const res = await this.chat([
        {
          role: 'user',
          content: JSON.stringify([
            { type: 'text', text: promptText || 'Analyze this image.' },
            { type: 'image_url', image_url: { url: dataUrl } }
          ])
        }
      ]);
      return res.text;
    } catch (error: any) {
      throw new Error(`[OpenAIProvider] Vision Error: ${error.message || error}`);
    }
  }

  public async analyzeDocument(
    fileBuffer: Buffer,
    mimeType: string,
    promptText?: string,
    options?: ChatOptions
  ): Promise<string> {
    if (!this.hasRealKey()) {
      return `[Mock OpenAI Document] Analyzed file with size ${fileBuffer.length} and type ${mimeType}. Prompt: ${promptText}`;
    }
    // Standard text document proxy or GPT-4o assistant upload
    return this.chat([
      { role: 'system', content: 'You are a document analyzer.' },
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
    return "This is a secure mock completion response generated by the OpenAI Provider implementation of EAIPI-AGMAP.";
  }
}
