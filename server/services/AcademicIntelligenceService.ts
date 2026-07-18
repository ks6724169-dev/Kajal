import { UnitOfWork } from '../database/unitOfWork.js';
import { predictiveLearningEngine } from './PredictiveLearningEngine.js';
import { personalizedLearningEngine } from './PersonalizedLearningEngine.js';
import { academicInsightEngine } from './AcademicInsightEngine.js';
import { 
  StudentPerformanceAnalyticsRepository,
  SubjectAnalyticsRepository,
  AcademicTrendRepository,
  LearningStyleProfileRepository
} from '../repositories/AcademicIntelligenceRepository.js';
import { WeakStudentRegistryRepository, GiftedStudentRegistryRepository } from '../repositories/ExaminationRepository.js';
import { QuerySpecification } from '../repositories/QuerySpecification.js';
import { StudentPerformanceAnalytics, SubjectAnalytics, AcademicTrend, LearningStyleProfile } from '../entities/AcademicIntelligenceDomain.js';

export class AcademicIntelligenceService {
  
  public async analyzeStudent(tenantId: string, studentId: string, academicYear: string, term?: string): Promise<StudentPerformanceAnalytics> {
    const uow = new UnitOfWork(tenantId);
    try {
      await uow.begin();
      const repo = uow.getRepository(StudentPerformanceAnalyticsRepository);
      
      const spec = new QuerySpecification();
      spec.and('student_id', studentId);
      spec.and('academic_year', academicYear);
      if (term) {
        spec.and('term', term);
      }
      const existing = await repo.findMany(spec);
      
      if (existing.length > 0) {
        await uow.commit();
        return existing[0];
      }

      // Compute mock analytics for now
      const analytics = await repo.insert({
        studentId,
        academicYear,
        term: term || 'FULL_YEAR',
        averageScore: 75,
        percentileRank: 80,
        classRank: 5,
        attendanceRate: 90,
        status: 'ACTIVE'
      });
      
      // Basic Weak/Gifted detection
      if (analytics.averageScore < 50) {
        const weakRepo = uow.getRepository(WeakStudentRegistryRepository);
        await weakRepo.insert({
          studentId,
          subjectId: '00000000-0000-0000-0000-000000000000', // Mock subject
          reason: 'Overall score below 50',
          identifiedDate: new Date(),
          remediationStatus: 'PENDING',
          status: 'ACTIVE'
        });
      } else if (analytics.averageScore > 85) {
        const giftedRepo = uow.getRepository(GiftedStudentRegistryRepository);
        await giftedRepo.insert({
          studentId,
          subjectId: '00000000-0000-0000-0000-000000000000', // Mock subject
          reason: 'Overall score above 85',
          identifiedDate: new Date(),
          enrichmentStatus: 'PENDING',
          status: 'ACTIVE'
        });
      }

      await uow.commit();
      return analytics;
    } catch (e) {
      await uow.rollback();
      throw e;
    } finally {
      await uow.dispose();
    }
  }

  public async analyzeSubject(tenantId: string, subjectId: string, academicYear: string, term?: string): Promise<SubjectAnalytics> {
    const uow = new UnitOfWork(tenantId);
    try {
      await uow.begin();
      const repo = uow.getRepository(SubjectAnalyticsRepository);
      
      const spec = new QuerySpecification();
      spec.and('subject_id', subjectId);
      spec.and('academic_year', academicYear);
      if (term) {
        spec.and('term', term);
      }
      const existing = await repo.findMany(spec);
      
      if (existing.length > 0) {
        await uow.commit();
        return existing[0];
      }

      const analytics = await repo.insert({
        subjectId,
        academicYear,
        term: term || 'FULL_YEAR',
        averageScore: 65,
        passRate: 75,
        difficultyIndex: 1.2,
        status: 'ACTIVE'
      });
      await uow.commit();
      return analytics;
    } catch (e) {
      await uow.rollback();
      throw e;
    } finally {
      await uow.dispose();
    }
  }

  public async generateStudyPlan(tenantId: string, studentId: string, planType: 'WEEKLY'|'DAILY'|'REVISION') {
    return await personalizedLearningEngine.generateStudyPlan(tenantId, studentId, planType, 'Average performance, exams in 2 weeks');
  }

  public async generateAIRecommendation(tenantId: string, studentId: string, context: string) {
    return await personalizedLearningEngine.generateRecommendation(tenantId, studentId, context);
  }

  public async predictPromotion(tenantId: string, studentId: string, academicYear: string) {
    return await predictiveLearningEngine.predictPromotion(tenantId, studentId, academicYear, 'Student has 75% average score');
  }

  public async predictDropout(tenantId: string, studentId: string) {
    return await predictiveLearningEngine.predictDropout(tenantId, studentId, 'Low attendance and falling grades');
  }

  public async predictAttendance(tenantId: string, studentId: string) {
    return await predictiveLearningEngine.predictAttendance(tenantId, studentId, 'Past month attendance was 60%');
  }

  public async saveLearningStyle(tenantId: string, studentId: string, style: 'VISUAL'|'AUDITORY'|'KINESTHETIC'|'READING_WRITING'): Promise<LearningStyleProfile> {
    const uow = new UnitOfWork(tenantId);
    try {
      await uow.begin();
      const repo = uow.getRepository(LearningStyleProfileRepository);
      const profile = await repo.insert({
        studentId,
        primaryStyle: style,
        assessmentDate: new Date(),
        status: 'ACTIVE'
      });
      await uow.commit();
      return profile;
    } catch (e) {
      await uow.rollback();
      throw e;
    } finally {
      await uow.dispose();
    }
  }
}

export const academicIntelligenceService = new AcademicIntelligenceService();
