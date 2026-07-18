import { describe, it, expect, beforeAll } from 'vitest';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { dbManager } from '../database/dbClient.js';
import { academicIntelligenceService } from '../services/AcademicIntelligenceService.js';
import { UnitOfWork } from '../database/unitOfWork.js';
import { 
  StudentPerformanceAnalyticsRepository,
  PromotionPredictionRepository,
  DropoutPredictionRepository
} from '../repositories/AcademicIntelligenceRepository.js';

const tenantId = '123e4567-e89b-12d3-a456-426614174999';

describe('Enterprise Academic Intelligence, Student Analytics & Predictive Learning Platform', () => {
  let studentId = uuidv4();
  let subjectId = uuidv4();

  beforeAll(async () => {
    const tenantRes = await dbManager.query('SELECT id FROM tenant_registry WHERE id = $1', [tenantId]);
    if (tenantRes.rows.length === 0) {
      await dbManager.query(`
        INSERT INTO tenant_registry (id, tenant_code, tenant_name, domain_name, status, subscription_tier)
        VALUES ($1, $2, $3, $4, $5, $6)
      `, [tenantId, 'ETENANT1', 'AI Test Tenant', 'ai-tenant.com', 'active', 'enterprise']);
    }

    await dbManager.query(`SET app.current_tenant = '${tenantId}'`);

    const migrationPath = path.join(process.cwd(), 'server', 'database', 'migrations', '008_academic_intelligence.sql');
    const sql = fs.readFileSync(migrationPath, 'utf8');
    await dbManager.query(sql);
  });

  it('1. should analyze student performance', async () => {
    const analytics = await academicIntelligenceService.analyzeStudent(tenantId, studentId, '2026', 'TERM-1');
    expect(analytics.id).toBeDefined();
    expect(analytics.averageScore).toBe(75);

    const uow = new UnitOfWork(tenantId);
    const repo = uow.getRepository(StudentPerformanceAnalyticsRepository);
    const fetched = await repo.findOne(analytics.id);
    expect(fetched).not.toBeNull();
    expect(fetched?.academicYear).toBe('2026');
    await uow.dispose();
  });

  it('2. should analyze subject metrics', async () => {
    const analytics = await academicIntelligenceService.analyzeSubject(tenantId, subjectId, '2026', 'TERM-1');
    expect(analytics.id).toBeDefined();
    expect(analytics.passRate).toBe(75);
  });

  it('3. should generate a study plan', async () => {
    const plan = await academicIntelligenceService.generateStudyPlan(tenantId, studentId, 'WEEKLY');
    expect(plan.id).toBeDefined();
    expect(plan.planType).toBe('WEEKLY');
    expect(plan.planData).toBeDefined();
  });

  it('4. should generate an AI recommendation', async () => {
    const recommendation = await academicIntelligenceService.generateAIRecommendation(tenantId, studentId, 'Needs help with math');
    expect(recommendation.id).toBeDefined();
    expect(recommendation.recommendationText).toBeDefined();
  });

  it('5. should predict promotion', async () => {
    const prediction = await academicIntelligenceService.predictPromotion(tenantId, studentId, '2026');
    expect(prediction.id).toBeDefined();
    expect(prediction.probability).toBeDefined();

    const uow = new UnitOfWork(tenantId);
    const repo = uow.getRepository(PromotionPredictionRepository);
    const fetched = await repo.findOne(prediction.id);
    expect(fetched).not.toBeNull();
    await uow.dispose();
  });

  it('6. should predict dropout risk', async () => {
    const prediction = await academicIntelligenceService.predictDropout(tenantId, studentId);
    expect(prediction.id).toBeDefined();
    expect(prediction.riskLevel).toBeDefined();
    
    const uow = new UnitOfWork(tenantId);
    const repo = uow.getRepository(DropoutPredictionRepository);
    const fetched = await repo.findOne(prediction.id);
    expect(fetched).not.toBeNull();
    await uow.dispose();
  });

  it('7. should predict attendance risk', async () => {
    const prediction = await academicIntelligenceService.predictAttendance(tenantId, studentId);
    expect(prediction.id).toBeDefined();
    expect(prediction.predictedAttendanceRate).toBeDefined();
  });

  it('8. should save learning style', async () => {
    const style = await academicIntelligenceService.saveLearningStyle(tenantId, studentId, 'VISUAL');
    expect(style.id).toBeDefined();
    expect(style.primaryStyle).toBe('VISUAL');
  });

});
