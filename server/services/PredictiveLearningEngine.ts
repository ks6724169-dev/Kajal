import { aiGateway } from '../ai/AIGateway.js';
import { UnitOfWork } from '../database/unitOfWork.js';
import {
  StudentPredictionLogRepository,
  PromotionPredictionRepository,
  DropoutPredictionRepository,
  AttendancePredictionRepository
} from '../repositories/AcademicIntelligenceRepository.js';
import { StudentPredictionLog, PromotionPrediction, DropoutPrediction, AttendancePrediction } from '../entities/AcademicIntelligenceDomain.js';

export class PredictiveLearningEngine {
  public async predictPromotion(
    tenantId: string,
    studentId: string,
    academicYear: string,
    performanceData: string
  ): Promise<PromotionPrediction> {
    const prompt = `Based on the following student performance data: ${performanceData}, predict the probability of promotion for academic year ${academicYear}. Output a JSON object with probability (number 0-100) and recommendation (string).`;
    
    const aiResponse = await aiGateway.generateJSON<{ probability: number; recommendation: string }>(
      tenantId,
      prompt,
      '{"probability": number, "recommendation": "string"}'
    );

    const uow = new UnitOfWork(tenantId);
    try {
      await uow.begin();
      const repo = uow.getRepository(PromotionPredictionRepository);
      const prediction = await repo.insert({
        studentId,
        academicYear,
        probability: aiResponse.probability,
        recommendation: aiResponse.recommendation,
        predictionDate: new Date(),
        status: 'ACTIVE'
      });
      await this.logPrediction(uow, tenantId, studentId, 'PROMOTION', aiResponse);
      await uow.commit();
      return prediction;
    } catch (e) {
      await uow.rollback();
      throw e;
    } finally {
      await uow.dispose();
    }
  }

  public async predictDropout(
    tenantId: string,
    studentId: string,
    riskData: string
  ): Promise<DropoutPrediction> {
    const prompt = `Analyze this student data: ${riskData}. Predict the dropout risk level. Output JSON with riskLevel ("LOW", "MEDIUM", "HIGH"), confidenceScore (0-100), and riskFactors (array of strings).`;
    
    const aiResponse = await aiGateway.generateJSON<{ riskLevel: 'LOW'|'MEDIUM'|'HIGH'; confidenceScore: number; riskFactors: string[] }>(
      tenantId,
      prompt,
      '{"riskLevel": "LOW" | "MEDIUM" | "HIGH", "confidenceScore": number, "riskFactors": ["string"]}'
    );

    const uow = new UnitOfWork(tenantId);
    try {
      await uow.begin();
      const repo = uow.getRepository(DropoutPredictionRepository);
      const prediction = await repo.insert({
        studentId,
        riskLevel: aiResponse.riskLevel,
        confidenceScore: aiResponse.confidenceScore,
        riskFactors: aiResponse.riskFactors,
        predictionDate: new Date(),
        status: 'ACTIVE'
      });
      await this.logPrediction(uow, tenantId, studentId, 'DROPOUT', aiResponse);
      await uow.commit();
      return prediction;
    } catch (e) {
      await uow.rollback();
      throw e;
    } finally {
      await uow.dispose();
    }
  }

  public async predictAttendance(
    tenantId: string,
    studentId: string,
    attendanceHistory: string
  ): Promise<AttendancePrediction> {
    const prompt = `Based on historical attendance: ${attendanceHistory}, predict next month's attendance rate. Output JSON with predictedAttendanceRate (0-100) and riskLevel ("LOW", "MEDIUM", "HIGH").`;
    
    const aiResponse = await aiGateway.generateJSON<{ predictedAttendanceRate: number; riskLevel: string }>(
      tenantId,
      prompt,
      '{"predictedAttendanceRate": number, "riskLevel": "string"}'
    );

    const uow = new UnitOfWork(tenantId);
    try {
      await uow.begin();
      const repo = uow.getRepository(AttendancePredictionRepository);
      const prediction = await repo.insert({
        studentId,
        predictedAttendanceRate: aiResponse.predictedAttendanceRate,
        riskLevel: aiResponse.riskLevel,
        predictionDate: new Date(),
        status: 'ACTIVE'
      });
      await this.logPrediction(uow, tenantId, studentId, 'ATTENDANCE', aiResponse);
      await uow.commit();
      return prediction;
    } catch (e) {
      await uow.rollback();
      throw e;
    } finally {
      await uow.dispose();
    }
  }

  private async logPrediction(
    uow: UnitOfWork,
    tenantId: string,
    studentId: string,
    predictionType: string,
    result: any
  ): Promise<void> {
    const logRepo = uow.getRepository(StudentPredictionLogRepository);
    await logRepo.insert({
      studentId,
      predictionType,
      predictionResult: result,
      predictionDate: new Date(),
      status: 'ACTIVE'
    });
  }
}

export const predictiveLearningEngine = new PredictiveLearningEngine();
