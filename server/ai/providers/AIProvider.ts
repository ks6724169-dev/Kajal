import { ChatMessage, ChatOptions, ChatResponse } from '../../entities/AIDomain.js';

export interface AIProvider {
  getProviderName(): string;
  isHealthy(): Promise<boolean>;
  
  chat(messages: ChatMessage[], options?: ChatOptions): Promise<ChatResponse>;
  
  streamChat(
    messages: ChatMessage[], 
    options?: ChatOptions, 
    onChunk?: (text: string) => void
  ): Promise<ChatResponse>;
  
  embed(text: string, options?: ChatOptions): Promise<number[]>;
  
  analyzeImage(
    imageBuffer: Buffer, 
    mimeType: string, 
    promptText?: string,
    options?: ChatOptions
  ): Promise<string>;
  
  analyzeDocument(
    fileBuffer: Buffer, 
    mimeType: string, 
    promptText?: string,
    options?: ChatOptions
  ): Promise<string>;
}
