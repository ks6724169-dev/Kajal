import { v4 as uuidv4 } from 'uuid';
import { AIProviderFactory } from './factory/AIProviderFactory.js';
import { AIConfiguration } from './config/AIConfiguration.js';
import { ChatMessage, ChatOptions, ChatResponse } from '../entities/AIDomain.js';
import { UnitOfWork } from '../database/unitOfWork.js';
import {
  AIRequestLogRepository,
  AIUsageLogRepository,
  AICostTrackingRepository,
  AIProviderHealthRepository,
  AIRateLimitRepository,
  AIResponseCacheRepository
} from '../repositories/AIRepository.js';
import { QuerySpecification } from '../repositories/QuerySpecification.js';

interface CircuitBreakerState {
  failures: number;
  lastFailureTime?: number;
  isOpen: boolean;
}

export class AIServiceManager {
  private static circuitBreakers: Record<string, CircuitBreakerState> = {};
  private static FAILURE_THRESHOLD = 3;
  private static COOL_DOWN_MS = 60000; // 1 minute

  /**
   * Execute chat request with robust retry, fallback, rate limiting, and cost tracking
   */
  public async executeChat(
    tenantId: string,
    messages: ChatMessage[],
    options?: ChatOptions
  ): Promise<ChatResponse> {
    const config = AIConfiguration.getConfig();
    const primaryProvider = (options as any)?.provider || config.defaultProvider || 'gemini';
    const providersToTry = [primaryProvider, 'gemini', 'openai', 'claude'].filter(
      (v, i, self) => self.indexOf(v) === i
    );

    let finalResponse: ChatResponse | null = null;
    let selectedProviderName = '';
    const startTime = Date.now();
    const requestId = options?.requestId || uuidv4();

    // Rate Limiting check
    await this.enforceRateLimits(tenantId, options?.userId);

    for (const providerName of providersToTry) {
      if (this.isCircuitOpen(providerName)) {
        console.warn(`[AIServiceManager] Circuit is OPEN for ${providerName}. Skipping...`);
        continue;
      }

      selectedProviderName = providerName;
      let attempt = 0;
      const retries = config.retryCount;

      while (attempt <= retries) {
        try {
          const providerInstance = AIProviderFactory.createProvider(
            providerName,
            undefined,
            (options as any)?.model
          );

          if (options?.stream) {
            finalResponse = await providerInstance.streamChat(messages, options, (options as any).onChunk);
          } else {
            finalResponse = await providerInstance.chat(messages, options);
          }

          // Successful execution -> Reset circuit breaker & log success
          this.recordSuccess(providerName);
          const latency = Date.now() - startTime;
          await this.logRequest(tenantId, requestId, providerName, (options as any)?.model || 'default', messages, true, undefined, latency, options?.userId);
          await this.logUsage(tenantId, requestId, providerName, (options as any)?.model || 'default', finalResponse, options?.userId);
          
          return finalResponse;
        } catch (error: any) {
          attempt++;
          console.error(`[AIServiceManager] Attempt ${attempt} failed for provider ${providerName}: ${error.message}`);
          
          if (attempt <= retries) {
            // Exponential backoff
            const delay = Math.pow(2, attempt) * 100;
            await new Promise(resolve => setTimeout(resolve, delay));
          } else {
            // Out of retries -> Trip Circuit Breaker & try next provider
            this.recordFailure(providerName);
            const latency = Date.now() - startTime;
            await this.logRequest(tenantId, requestId, providerName, (options as any)?.model || 'default', messages, false, error.message, latency, options?.userId);
          }
        }
      }
    }

    throw new Error('[AIServiceManager] All AI Providers failed or are currently unavailable due to circuit open states.');
  }

  /**
   * Helper to perform generic single-completion embeddings
   */
  public async executeEmbed(tenantId: string, text: string, options?: ChatOptions): Promise<number[]> {
    const config = AIConfiguration.getConfig();
    const providerName = config.defaultProvider || 'gemini';
    const providerInstance = AIProviderFactory.createProvider(providerName);
    return providerInstance.embed(text, options);
  }

  /**
   * Helper to perform generic single-completion image analysis
   */
  public async executeAnalyzeImage(
    tenantId: string,
    imageBuffer: Buffer,
    mimeType: string,
    promptText?: string,
    options?: ChatOptions
  ): Promise<string> {
    const config = AIConfiguration.getConfig();
    const providerName = config.defaultProvider || 'gemini';
    const providerInstance = AIProviderFactory.createProvider(providerName);
    return providerInstance.analyzeImage(imageBuffer, mimeType, promptText, options);
  }

  /**
   * Helper to perform generic single-completion document analysis
   */
  public async executeAnalyzeDocument(
    tenantId: string,
    fileBuffer: Buffer,
    mimeType: string,
    promptText?: string,
    options?: ChatOptions
  ): Promise<string> {
    const config = AIConfiguration.getConfig();
    const providerName = config.defaultProvider || 'gemini';
    const providerInstance = AIProviderFactory.createProvider(providerName);
    return providerInstance.analyzeDocument(fileBuffer, mimeType, promptText, options);
  }

  // --- Circuit Breaker implementation ---
  private isCircuitOpen(provider: string): boolean {
    const cb = AIServiceManager.circuitBreakers[provider];
    if (!cb) return false;
    if (cb.isOpen) {
      const now = Date.now();
      if (cb.lastFailureTime && now - cb.lastFailureTime > AIServiceManager.COOL_DOWN_MS) {
        // Cool down period has passed -> Half-open, allow request to try
        console.log(`[AIServiceManager] Cool down complete for ${provider}. Transitioning circuit to HALF-OPEN.`);
        return false;
      }
      return true;
    }
    return false;
  }

  private recordSuccess(provider: string): void {
    const cb = AIServiceManager.circuitBreakers[provider];
    if (cb) {
      cb.failures = 0;
      cb.isOpen = false;
    }
  }

  private recordFailure(provider: string): void {
    if (!AIServiceManager.circuitBreakers[provider]) {
      AIServiceManager.circuitBreakers[provider] = { failures: 0, isOpen: false };
    }
    const cb = AIServiceManager.circuitBreakers[provider];
    cb.failures++;
    cb.lastFailureTime = Date.now();
    if (cb.failures >= AIServiceManager.FAILURE_THRESHOLD) {
      cb.isOpen = true;
      console.warn(`[AIServiceManager] Circuit Breaker TRIPPED for provider ${provider}. It is now OPEN.`);
    }
  }

  // --- Logging and Cost Auditing ---
  private async logRequest(
    tenantId: string,
    requestId: string,
    providerName: string,
    modelName: string,
    messages: ChatMessage[],
    isSuccess: boolean,
    errorMessage?: string,
    latencyMs: number = 0,
    userId?: string
  ): Promise<void> {
    const uow = new UnitOfWork(tenantId);
    try {
      await uow.begin();
      const reqLogRepo = uow.getRepository(AIRequestLogRepository);
      await reqLogRepo.insert({
        id: requestId,
        userId,
        providerName,
        modelName,
        requestType: 'CHAT',
        promptText: messages.map(m => m.content).join('\n'),
        isSuccess,
        errorMessage,
        latencyMs,
        status: 'ACTIVE'
      });
      await uow.commit();
    } catch (e) {
      console.error('[AIServiceManager] Failed to log request in DB:', e);
    } finally {
      await uow.dispose();
    }
  }

  private async logUsage(
    tenantId: string,
    requestId: string,
    providerName: string,
    modelName: string,
    response: ChatResponse,
    userId?: string
  ): Promise<void> {
    const uow = new UnitOfWork(tenantId);
    try {
      await uow.begin();
      const usageRepo = uow.getRepository(AIUsageLogRepository);
      const costRepo = uow.getRepository(AICostTrackingRepository);

      const promptTokens = response.usage?.promptTokens || Math.ceil(response.text.length / 4);
      const completionTokens = response.usage?.completionTokens || Math.ceil(response.text.length / 4);
      const totalTokens = promptTokens + completionTokens;

      // Pricing heuristics (e.g. $0.015 per 1K tokens input/output)
      const estimatedCost = Number((totalTokens * 0.000015).toFixed(6));

      await usageRepo.insert({
        userId,
        requestId,
        providerName,
        modelName,
        promptTokens,
        completionTokens,
        totalTokens,
        estimatedCost,
        status: 'ACTIVE'
      });

      // Update tenant/user cost limit tracker
      const year = new Date().getFullYear().toString();
      const month = (new Date().getMonth() + 1).toString();
      const spec = new QuerySpecification();
      spec.and('tenant_id', tenantId);
      spec.and('entity_type', 'TENANT');
      spec.and('academic_year', year);
      spec.and('term', month);

      const existingCost = await costRepo.findMany(spec);
      if (existingCost.length > 0) {
        await costRepo.update(existingCost[0].id, {
          budgetSpent: Number(existingCost[0].budgetSpent) + estimatedCost
        }, existingCost[0].version);
      } else {
        await costRepo.insert({
          entityType: 'TENANT',
          entityId: tenantId,
          academicYear: year,
          term: month,
          budgetLimit: AIConfiguration.getConfig().costLimitPerTenant,
          budgetSpent: estimatedCost,
          status: 'ACTIVE'
        });
      }

      await uow.commit();
    } catch (e) {
      console.error('[AIServiceManager] Failed to log usage/cost in DB:', e);
    } finally {
      await uow.dispose();
    }
  }

  private async enforceRateLimits(tenantId: string, userId?: string): Promise<void> {
    // Standard validation bypass or light database checks
    const uow = new UnitOfWork(tenantId);
    try {
      await uow.begin();
      const limitRepo = uow.getRepository(AIRateLimitRepository);
      const windowStart = new Date();
      windowStart.setMinutes(windowStart.getMinutes(), 0, 0); // round to current hour/minute

      const spec = new QuerySpecification();
      spec.and('tenant_id', tenantId);
      spec.and('entity_type', 'TENANT');
      spec.and('window_start', windowStart);

      const existingLimits = await limitRepo.findMany(spec);
      if (existingLimits.length > 0) {
        if (existingLimits[0].requestCount >= 1000) {
          throw new Error('Tenant has reached the hourly AI gateway rate limit threshold.');
        }
        await limitRepo.update(existingLimits[0].id, {
          requestCount: existingLimits[0].requestCount + 1
        }, existingLimits[0].version);
      } else {
        await limitRepo.insert({
          entityType: 'TENANT',
          entityId: tenantId,
          windowStart,
          requestCount: 1,
          tokenCount: 0,
          status: 'ACTIVE'
        });
      }
      await uow.commit();
    } catch (e: any) {
      if (e.message.includes('rate limit')) throw e;
      // Fail silently on general logging errors to preserve system uptime
    } finally {
      await uow.dispose();
    }
  }
}

export const aiServiceManager = new AIServiceManager();
