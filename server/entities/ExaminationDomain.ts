import { BaseEntity } from './BaseEntity.js';

export interface Examination extends BaseEntity {
  name: string;
  term: string;
  academicYear: string;
  startDate: Date;
  endDate: Date;
}

export interface ExaminationSession extends BaseEntity {
  examinationId: string;
  sessionName: string;
  startTime: string;
  endTime: string;
}

export interface ExaminationSchedule extends BaseEntity {
  examinationId: string;
  subjectId: string;
  examDate: Date;
  startTime: string;
  endTime: string;
  maxMarks: number;
  passingMarks: number;
}

export interface ExaminationRoom extends BaseEntity {
  roomNumber: string;
  capacity: number;
  blockName?: string;
}

export interface InvigilatorAssignment extends BaseEntity {
  scheduleId: string;
  roomId: string;
  teacherId: string;
}

export interface SubjectPaper extends BaseEntity {
  examinationId: string;
  subjectId: string;
  paperCode: string;
}

export interface QuestionPaper extends BaseEntity {
  scheduleId: string;
  subjectId: string;
  blueprintId?: string;
  paperCode: string;
  title: string;
  totalMarks: number;
  isLocked: boolean;
  difficultyLevel: string;
}

export interface QuestionBank extends BaseEntity {
  subjectId: string;
  questionText: string;
  questionType: 'MCQ' | 'SHORT' | 'LONG' | 'FIB';
  options?: string[];
  correctAnswer?: string;
  marks: number;
  difficultyLevel: 'EASY' | 'MEDIUM' | 'HARD';
}

export interface QuestionBlueprint extends BaseEntity {
  subjectId: string;
  title: string;
  totalMarks: number;
  easyPercentage: number;
  mediumPercentage: number;
  hardPercentage: number;
}

export interface PracticalExam extends BaseEntity {
  scheduleId: string;
  studentId: string;
  examinerName: string;
  maxMarks: number;
  obtainedMarks?: number;
  comments?: string;
}

export interface VivaExam extends BaseEntity {
  scheduleId: string;
  studentId: string;
  examinerName: string;
  maxMarks: number;
  obtainedMarks?: number;
  comments?: string;
}

export interface Assignment extends BaseEntity {
  subjectId: string;
  title: string;
  dueDate: Date;
  maxMarks: number;
}

export interface ProjectAssessment extends BaseEntity {
  subjectId: string;
  studentId: string;
  projectTitle: string;
  maxMarks: number;
  obtainedMarks?: number;
  evaluatorName: string;
}

export interface InternalAssessment extends BaseEntity {
  studentId: string;
  subjectId: string;
  term: string;
  attendanceMarks: number;
  assignmentMarks: number;
  quizMarks: number;
  totalInternalMarks: number;
}

export interface ExternalAssessment extends BaseEntity {
  studentId: string;
  subjectId: string;
  examMarks: number;
  totalExternalMarks: number;
}

export interface MarksEntry extends BaseEntity {
  scheduleId: string;
  studentId: string;
  obtainedMarks: number;
  practicalMarks?: number;
  vivaMarks?: number;
  isAbsent: boolean;
  isVerified: boolean;
  verifiedBy?: string;
  isApproved: boolean;
  approvedBy?: string;
  remarks?: string;
}

export interface GradeBook extends BaseEntity {
  studentId: string;
  term: string;
  academicYear: string;
  subjectId: string;
  internalMarks: number;
  externalMarks: number;
  totalMarks: number;
  grade: string;
  points: number;
}

export interface GPARecord extends BaseEntity {
  studentId: string;
  term: string;
  academicYear: string;
  gpa: number;
  totalCredits: number;
  earnedCredits: number;
}

export interface CGPARecord extends BaseEntity {
  studentId: string;
  academicYear: string;
  cgpa: number;
  totalCredits: number;
  earnedCredits: number;
}

export interface Result extends BaseEntity {
  studentId: string;
  examinationId: string;
  totalObtained: number;
  totalMax: number;
  percentage: number;
  gpa?: number;
  cgpa?: number;
  overallGrade: string;
  resultStatus: 'PASS' | 'FAIL' | 'WITHHELD' | 'SUPPLEMENTARY';
  rank?: number;
}

export interface ResultPublication extends BaseEntity {
  examinationId: string;
  publishDate: Date;
  isPublished: boolean;
  publishedBy: string;
}

export interface AcademicPromotion extends BaseEntity {
  studentId: string;
  fromClassId: string;
  toClassId: string;
  academicYear: string;
  promotionDate: Date;
  isPromoted: boolean;
  reason?: string;
}

export interface AcademicRemark extends BaseEntity {
  studentId: string;
  teacherId: string;
  term: string;
  academicYear: string;
  remarkText: string;
  severity: 'POSITIVE' | 'NEUTRAL' | 'WARNING';
}

export interface StudentPerformance extends BaseEntity {
  studentId: string;
  subjectId: string;
  averageMarks: number;
  attendanceRate: number;
  predictedScore?: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
}

export interface WeakStudentRegistry extends BaseEntity {
  studentId: string;
  subjectId: string;
  reason: string;
  identifiedDate: Date;
  remediationStatus: string;
}

export interface GiftedStudentRegistry extends BaseEntity {
  studentId: string;
  subjectId: string;
  reason: string;
  identifiedDate: Date;
  enrichmentStatus: string;
}

export interface AcademicRecommendation extends BaseEntity {
  studentId: string;
  recommendationType: string;
  recommendationText: string;
  generatedBy: 'AI' | 'TEACHER';
}
