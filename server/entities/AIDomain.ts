import { BaseEntity } from './BaseEntity.js';

export interface AIProviderRegistry extends BaseEntity {
  providerName: string;
  baseUrl: string;
  isActive: boolean;
}

export interface AIModelRegistry extends BaseEntity {
  providerName: string;
  modelName: string;
  modelType: 'TEXT' | 'VISION' | 'EMBEDDING' | 'OCR';
  contextWindow: number;
  pricingInput: number;
  pricingOutput: number;
  isActive: boolean;
}

export interface AIUsageLog extends BaseEntity {
  userId?: string;
  requestId: string;
  providerName: string;
  modelName: string;
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  estimatedCost: number;
}

export interface AIRequestLog extends BaseEntity {
  userId?: string;
  providerName: string;
  modelName: string;
  requestType: 'CHAT' | 'VISION' | 'OCR' | 'EMBEDDINGS';
  promptText?: string;
  isSuccess: boolean;
  errorMessage?: string;
  latencyMs: number;
}

export interface AIResponseCache extends BaseEntity {
  promptHash: string;
  promptText: string;
  responseText: string;
  providerName: string;
  modelName: string;
  expiresAt: Date;
}

export interface AIAPIKey extends BaseEntity {
  providerName: string;
  apiKeyEncrypted: string;
  isActive: boolean;
}

export interface AIRateLimit extends BaseEntity {
  entityType: 'TENANT' | 'USER';
  entityId: string;
  windowStart: Date;
  requestCount: number;
  tokenCount: number;
}

export interface AICostTracking extends BaseEntity {
  entityType: 'TENANT' | 'USER';
  entityId: string;
  academicYear: string;
  term: string;
  budgetLimit: number;
  budgetSpent: number;
}

export interface AIProviderHealth extends BaseEntity {
  providerName: string;
  isHealthy: boolean;
  lastCheckedAt: Date;
  errorRatePercentage: number;
  latencyMs: number;
}

// Universal Chat interfaces
export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface ChatOptions {
  temperature?: number;
  maxTokens?: number;
  jsonMode?: boolean;
  stream?: boolean;
  timeout?: number;
  requestId?: string;
  userId?: string;
  provider?: string;
  model?: string;
  onChunk?: (text: string) => void;
}

export interface ChatResponse {
  text: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}
