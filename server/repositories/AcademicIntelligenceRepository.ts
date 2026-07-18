import { BaseRepository } from './BaseRepository.js';
import {
  StudentAcademicProfile,
  StudentPerformanceAnalytics,
  SubjectAnalytics,
  DropoutPrediction,
  AttendancePrediction,
  PromotionPrediction,
  LearningStyleProfile,
  AIStudyPlan,
  AIRecommendation,
  AcademicBenchmark,
  AcademicTrend,
  AcademicAlert,
  PerformanceHistory,
  StudentPredictionLog
} from '../entities/AcademicIntelligenceDomain.js';

export class StudentAcademicProfileRepository extends BaseRepository<StudentAcademicProfile> {
  protected tableName = 'student_academic_profile';
}

export class StudentPerformanceAnalyticsRepository extends BaseRepository<StudentPerformanceAnalytics> {
  protected tableName = 'student_performance_analytics';
}

export class SubjectAnalyticsRepository extends BaseRepository<SubjectAnalytics> {
  protected tableName = 'subject_analytics';
}

export class DropoutPredictionRepository extends BaseRepository<DropoutPrediction> {
  protected tableName = 'dropout_prediction';
}

export class AttendancePredictionRepository extends BaseRepository<AttendancePrediction> {
  protected tableName = 'attendance_prediction';
}

export class PromotionPredictionRepository extends BaseRepository<PromotionPrediction> {
  protected tableName = 'promotion_prediction';
}

export class LearningStyleProfileRepository extends BaseRepository<LearningStyleProfile> {
  protected tableName = 'learning_style_profile';
}

export class AIStudyPlanRepository extends BaseRepository<AIStudyPlan> {
  protected tableName = 'ai_study_plan';
}

export class AIRecommendationRepository extends BaseRepository<AIRecommendation> {
  protected tableName = 'ai_recommendation';
}

export class AcademicBenchmarkRepository extends BaseRepository<AcademicBenchmark> {
  protected tableName = 'academic_benchmark';
}

export class AcademicTrendRepository extends BaseRepository<AcademicTrend> {
  protected tableName = 'academic_trend';
}

export class AcademicAlertRepository extends BaseRepository<AcademicAlert> {
  protected tableName = 'academic_alert';
}

export class PerformanceHistoryRepository extends BaseRepository<PerformanceHistory> {
  protected tableName = 'performance_history';
}

export class StudentPredictionLogRepository extends BaseRepository<StudentPredictionLog> {
  protected tableName = 'student_prediction_log';
}
