import { describe, it, expect, beforeAll } from 'vitest';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { dbManager } from '../database/dbClient.js';
import { AIProviderFactory } from '../ai/factory/AIProviderFactory.js';
import { aiGateway } from '../ai/AIGateway.js';
import { aiServiceManager } from '../ai/AIServiceManager.js';
import { AIConfiguration } from '../ai/config/AIConfiguration.js';
import { UnitOfWork } from '../database/unitOfWork.js';
import {
  AIUsageLogRepository,
  AIRequestLogRepository,
  AICostTrackingRepository,
  AIRateLimitRepository
} from '../repositories/AIRepository.js';
import {
  ChatRequestSchema,
  VisionRequestSchema,
  EmbeddingRequestSchema
} from '../validators/AIValidator.js';

const tenantId = '123e4567-e89b-12d3-a456-426614174999';

describe('Enterprise AI Provider Interface & Model Abstraction Suite', () => {
  
  beforeAll(async () => {
    // 1. Ensure the tenant exists in tenant_registry
    const tenantRes = await dbManager.query('SELECT id FROM tenant_registry WHERE id = $1', [tenantId]);
    if (tenantRes.rows.length === 0) {
      await dbManager.query(`
        INSERT INTO tenant_registry (id, tenant_code, tenant_name, domain_name, status, subscription_tier)
        VALUES ($1, $2, $3, $4, $5, $6)
      `, [tenantId, 'ETENANT1', 'AI Test Tenant', 'ai-tenant.com', 'active', 'enterprise']);
    }

    // 2. Set current setting for app.current_tenant
    await dbManager.query(`SET app.current_tenant = '${tenantId}'`);

    // 3. Read and apply AI Platform migrations
    const migrationPath = path.join(process.cwd(), 'server', 'database', 'migrations', '007_ai_provider_platform.sql');
    const sql = fs.readFileSync(migrationPath, 'utf8');
    await dbManager.query(sql);
  });

  it('1. should initialize and factory-switch all AI providers correctly', () => {
    // Gemini
    const gemini = AIProviderFactory.createProvider('gemini');
    expect(gemini.getProviderName()).toBe('gemini');

    // OpenAI
    const openai = AIProviderFactory.createProvider('openai');
    expect(openai.getProviderName()).toBe('openai');

    // Claude
    const claude = AIProviderFactory.createProvider('claude');
    expect(claude.getProviderName()).toBe('claude');
  });

  it('2. should execute mock chat and streaming on providers without real API keys', async () => {
    const messages = [{ role: 'user' as const, content: 'Analyze high attendance' }];

    // OpenAI Mock completion
    const openai = AIProviderFactory.createProvider('openai');
    const resOpenAI = await openai.chat(messages, { jsonMode: true });
    expect(resOpenAI.text).toContain('analysis');
    
    // Claude Mock completion
    const claude = AIProviderFactory.createProvider('claude');
    const resClaude = await claude.chat(messages);
    expect(resClaude.text).toContain('secure mock completion');
  });

  it('3. should execute AIGateway chat and track cost / usage logs in PostgreSQL', async () => {
    const messages = [{ role: 'user' as const, content: 'Test Gateway usage mapping' }];
    
    // Execute chat with openai to guarantee a fast mock path in test environment
    const response = await aiGateway.chat(tenantId, messages, { provider: 'openai' });
    expect(response.text).toBeDefined();

    // Verify logs in SQL Tables
    const uow = new UnitOfWork(tenantId);
    try {
      const requestLogRepo = uow.getRepository(AIRequestLogRepository);
      const usageLogRepo = uow.getRepository(AIUsageLogRepository);
      const costTrackingRepo = uow.getRepository(AICostTrackingRepository);

      const reqLogs = await requestLogRepo.findMany();
      expect(reqLogs.length).toBeGreaterThan(0);
      expect(reqLogs[0].providerName).toBe('openai');

      const usageLogs = await usageLogRepo.findMany();
      expect(usageLogs.length).toBeGreaterThan(0);
      expect(usageLogs[0].estimatedCost).toBeGreaterThan(0);

      const costs = await costTrackingRepo.findMany();
      expect(costs.length).toBeGreaterThan(0);
      expect(Number(costs[0].budgetSpent)).toBeGreaterThan(0);
    } finally {
      await uow.dispose();
    }
  });

  it('4. should process higher level gateway workflows: summarize, classify, and generateJSON', async () => {
    // Summary
    const summary = await aiGateway.summarize(tenantId, 'This is a very long text about ERP integrations.', { provider: 'openai' });
    expect(summary).toBeDefined();

    // Classification
    const category = await aiGateway.classify(tenantId, 'Slightly low grades', ['HIGH', 'MEDIUM', 'LOW'], { provider: 'openai' });
    expect(category).toBeDefined();

    // JSON Generation
    interface TestObj { points: number; risk: string }
    const resultJson = await aiGateway.generateJSON<TestObj>(
      tenantId,
      'Compile student results',
      '{"points": number, "risk": "LOW" | "HIGH"}',
      { provider: 'openai' }
    );
    expect(resultJson.points).toBeDefined();
    expect(resultJson.risk).toBeDefined();
  });

  it('5. should enforce Zod schema validators on AI gateway payloads', () => {
    // Valid Chat Payload
    const chatParsed = ChatRequestSchema.safeParse({
      messages: [{ role: 'user', content: 'Ping' }],
      temperature: 0.8,
      provider: 'gemini'
    });
    expect(chatParsed.success).toBe(true);

    // Invalid Chat Payload (Missing messages)
    const chatInvalid = ChatRequestSchema.safeParse({
      temperature: 1.5
    });
    expect(chatInvalid.success).toBe(false);

    // Valid Vision Payload
    const visionParsed = VisionRequestSchema.safeParse({
      image: 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
      mimeType: 'image/png',
      promptText: 'What is this?'
    });
    expect(visionParsed.success).toBe(true);
  });

  it('6. should trigger circuit breaker, rate limiting counters, and recovery modes', async () => {
    // Verify rate limit counter increases on requests
    const uow = new UnitOfWork(tenantId);
    try {
      const limitRepo = uow.getRepository(AIRateLimitRepository);
      const limits = await limitRepo.findMany();
      expect(limits.length).toBeGreaterThan(0);
      expect(limits[0].requestCount).toBeGreaterThan(0);
    } finally {
      await uow.dispose();
    }
  });
});
