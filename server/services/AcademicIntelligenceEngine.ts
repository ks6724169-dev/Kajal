import { UnitOfWork } from '../database/unitOfWork.js';
import { QuerySpecification } from '../repositories/QuerySpecification.js';
import {
  StudentPerformanceRepository,
  WeakStudentRegistryRepository,
  GiftedStudentRegistryRepository,
  AcademicRecommendationRepository
} from '../repositories/ExaminationRepository.js';
import {
  StudentPerformance,
  WeakStudentRegistry,
  GiftedStudentRegistry,
  AcademicRecommendation
} from '../entities/ExaminationDomain.js';
import { aiGateway } from '../ai/AIGateway.js';

export class AcademicIntelligenceEngine {
  
  public async analyzeStudentPerformance(
    tenantId: string,
    studentId: string,
    subjectId: string,
    averageMarks: number,
    attendanceRate: number
  ): Promise<{
    performance: StudentPerformance;
    recommendation: AcademicRecommendation;
  }> {
    const uow = new UnitOfWork(tenantId);
    try {
      await uow.begin();

      const perfRepo = uow.getRepository(StudentPerformanceRepository);
      const weakRepo = uow.getRepository(WeakStudentRegistryRepository);
      const giftRepo = uow.getRepository(GiftedStudentRegistryRepository);
      const recRepo = uow.getRepository(AcademicRecommendationRepository);

      // 1. Calculate risk level and predicted score with robust heuristics
      let riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' = 'LOW';
      if (averageMarks < 50 || attendanceRate < 75) {
        riskLevel = 'HIGH';
      } else if (averageMarks < 70 || attendanceRate < 85) {
        riskLevel = 'MEDIUM';
      }

      const predictedScore = Math.min(
        100,
        Math.max(
          0,
          Number((averageMarks * 0.8 + attendanceRate * 0.2).toFixed(2))
        )
      );

      // Save/update performance record
      const perfSpec = new QuerySpecification();
      perfSpec.and('student_id', studentId);
      perfSpec.and('subject_id', subjectId);
      const existingPerf = await perfRepo.findMany(perfSpec);

      let performance: StudentPerformance;
      if (existingPerf.length > 0) {
        performance = await perfRepo.update(existingPerf[0].id, {
          averageMarks,
          attendanceRate,
          predictedScore,
          riskLevel
        }, existingPerf[0].version) as StudentPerformance;
      } else {
        performance = await perfRepo.insert({
          studentId,
          subjectId,
          averageMarks,
          attendanceRate,
          predictedScore,
          riskLevel,
          status: 'ACTIVE'
        });
      }

      // 2. Query Gemini API for Academic Insights, Remediation/Enrichment Plan
      let aiText = `Student average marks is ${averageMarks} and attendance is ${attendanceRate}%. `;
      if (riskLevel === 'HIGH') {
        aiText += 'Recommend urgent remedial coaching, structured assignments, and parent-teacher meeting.';
      } else if (averageMarks >= 85) {
        aiText += 'Recommend advanced problem solving, mentoring peers, and joining school science club.';
      } else {
        aiText += 'Recommend regular practice, keeping up the good attendance, and routine self-review.';
      }

      try {
        const prompt = `
          You are the Academic Intelligence Engine for Galaxy ERP Enterprise.
          Analyze the following student profile:
          - Subject ID: ${subjectId}
          - Average Marks: ${averageMarks}/100
          - Attendance Rate: ${attendanceRate}%
          - Risk Level: ${riskLevel}
          - Predicted Next Score: ${predictedScore}/100

          Generate a concise (2-3 sentences) actionable academic recommendation plan.
          If the student is weak (< 50 marks), outline specific remediation actions.
          If the student is gifted (>= 85 marks), suggest advanced enrichment actions.
          Otherwise, suggest steady-state improvement.
        `;
        const response = await aiGateway.chat(tenantId, [
          { role: 'user', content: prompt }
        ], { provider: 'gemini', model: 'gemini-3.5-flash' });
        
        if (response.text) {
          aiText = response.text.trim();
        }
      } catch (e) {
        console.error('[AcademicIntelligenceEngine] AI Gateway Call failed, using heuristic text.', e);
      }

      // 3. Register in registries if criteria met
      if (averageMarks < 50) {
        // Weak Student Registry
        const weakSpec = new QuerySpecification();
        weakSpec.and('student_id', studentId);
        weakSpec.and('subject_id', subjectId);
        const existingWeak = await weakRepo.findMany(weakSpec);

        if (existingWeak.length > 0) {
          await weakRepo.update(existingWeak[0].id, {
            reason: `Academic performance is below threshold with average marks of ${averageMarks}`,
            remediationStatus: 'REMEDIATION_ASSIGNED'
          }, existingWeak[0].version);
        } else {
          await weakRepo.insert({
            studentId,
            subjectId,
            reason: `Academic performance is below threshold with average marks of ${averageMarks}`,
            identifiedDate: new Date(),
            remediationStatus: 'REMEDIATION_ASSIGNED',
            status: 'ACTIVE'
          });
        }
      } else if (averageMarks >= 85) {
        // Gifted Student Registry
        const giftSpec = new QuerySpecification();
        giftSpec.and('student_id', studentId);
        giftSpec.and('subject_id', subjectId);
        const existingGift = await giftRepo.findMany(giftSpec);

        if (existingGift.length > 0) {
          await giftRepo.update(existingGift[0].id, {
            reason: `Academic performance is outstanding with average marks of ${averageMarks}`,
            enrichmentStatus: 'ENRICHMENT_ASSIGNED'
          }, existingGift[0].version);
        } else {
          await giftRepo.insert({
            studentId,
            subjectId,
            reason: `Academic performance is outstanding with average marks of ${averageMarks}`,
            identifiedDate: new Date(),
            enrichmentStatus: 'ENRICHMENT_ASSIGNED',
            status: 'ACTIVE'
          });
        }
      }

      // 4. Save recommendation
      const rec = await recRepo.insert({
        studentId,
        recommendationType: averageMarks < 50 ? 'REMEDIATION' : (averageMarks >= 85 ? 'ENRICHMENT' : 'IMPROVEMENT'),
        recommendationText: aiText,
        generatedBy: 'AI',
        status: 'ACTIVE'
      });

      await uow.commit();
      return { performance, recommendation: rec };
    } catch (error) {
      await uow.rollback();
      throw error;
    } finally {
      await uow.dispose();
    }
  }
}
export const academicIntelligenceEngine = new AcademicIntelligenceEngine();
