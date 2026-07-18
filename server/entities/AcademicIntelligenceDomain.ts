import { BaseEntity } from './BaseEntity.js';

export interface StudentAcademicProfile extends BaseEntity {
  studentId: string;
  overallGpa: number;
  totalCreditsEarned: number;
  academicStanding: string;
  learningStyle?: string;
}

export interface StudentPerformanceAnalytics extends BaseEntity {
  studentId: string;
  academicYear: string;
  term: string;
  averageScore: number;
  percentileRank: number;
  classRank?: number;
  attendanceRate: number;
}

export interface SubjectAnalytics extends BaseEntity {
  subjectId: string;
  academicYear: string;
  term: string;
  averageScore: number;
  passRate: number;
  difficultyIndex: number;
}

export interface WeakStudentRegistry extends BaseEntity {
  studentId: string;
  subjectId: string;
  reason?: string;
  identifiedDate: Date;
  remediationStatus: string;
}

export interface GiftedStudentRegistry extends BaseEntity {
  studentId: string;
  subjectId: string;
  reason?: string;
  identifiedDate: Date;
  enrichmentStatus: string;
}

export interface DropoutPrediction extends BaseEntity {
  studentId: string;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  confidenceScore: number;
  riskFactors: any;
  predictionDate: Date;
}

export interface AttendancePrediction extends BaseEntity {
  studentId: string;
  predictedAttendanceRate: number;
  riskLevel: string;
  predictionDate: Date;
}

export interface PromotionPrediction extends BaseEntity {
  studentId: string;
  academicYear: string;
  probability: number;
  recommendation?: string;
  predictionDate: Date;
}

export interface LearningStyleProfile extends BaseEntity {
  studentId: string;
  primaryStyle: 'VISUAL' | 'AUDITORY' | 'KINESTHETIC' | 'READING_WRITING';
  secondaryStyle?: string;
  assessmentDate: Date;
}

export interface AIStudyPlan extends BaseEntity {
  studentId: string;
  planType: 'WEEKLY' | 'DAILY' | 'REVISION';
  planData: any;
  generatedDate: Date;
}

export interface AIRecommendation extends BaseEntity {
  studentId: string;
  recommendationType: string;
  recommendationText: string;
  generatedBy: string;
}

export interface AcademicBenchmark extends BaseEntity {
  benchmarkName: string;
  targetMetric: string;
  targetValue: number;
  academicYear: string;
  term?: string;
}

export interface AcademicTrend extends BaseEntity {
  entityType: 'STUDENT' | 'CLASS' | 'SUBJECT';
  entityId: string;
  metricName: string;
  trendData: any;
  calculatedAt: Date;
}

export interface AcademicAlert extends BaseEntity {
  studentId: string;
  alertType: string;
  alertMessage: string;
  severity: string;
  isResolved: boolean;
}

export interface PerformanceHistory extends BaseEntity {
  studentId: string;
  eventName: string;
  eventDate: Date;
  score?: number;
  remarks?: string;
}

export interface StudentPredictionLog extends BaseEntity {
  studentId: string;
  predictionType: string;
  predictionResult: any;
  predictionDate: Date;
}
