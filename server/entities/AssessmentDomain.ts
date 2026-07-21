import { BaseEntity } from './BaseEntity';

export interface QuestionBank extends BaseEntity {
  subject_id: string;
  topic_id?: string;
  question_type: 'MCQ' | 'SUBJECTIVE' | 'TRUE_FALSE' | 'FILL_BLANKS' | 'MATCHING';
  content: string; // JSON or rich text
  options?: any; // JSON array for MCQ
  correct_answer?: any;
  explanation?: string;
  difficulty_level: 'EASY' | 'MEDIUM' | 'HARD' | 'VERY_HARD';
  bloom_taxonomy?: 'REMEMBER' | 'UNDERSTAND' | 'APPLY' | 'ANALYZE' | 'EVALUATE' | 'CREATE';
  marks: number;
  negative_marks?: number;
  tags?: string[];
  ai_generated: boolean;
  quality_score?: number;
}

export interface QuestionCategory extends BaseEntity {
  name: string;
  description?: string;
  parent_id?: string;
}

export interface QuestionDifficulty extends BaseEntity {
  name: string;
  weight: number;
}

export interface QuestionTag extends BaseEntity {
  name: string;
}

export interface QuestionPaper extends BaseEntity {
  title: string;
  description?: string;
  course_id?: string;
  subject_id: string;
  total_marks: number;
  duration_minutes: number;
  instructions?: string;
  is_published: boolean;
  ai_generated?: boolean;
}

export interface QuestionPaperVersion extends BaseEntity {
  question_paper_id: string;
  version_code: string;
}

export interface QuestionPaperSection extends BaseEntity {
  question_paper_id: string;
  name: string;
  description?: string;
  marks_per_question: number;
  negative_marks?: number;
  mandatory_questions_count?: number;
}

export interface QuestionPaperQuestion extends BaseEntity {
  question_paper_id: string;
  section_id?: string;
  question_id: string;
  order_sequence: number;
  marks_override?: number;
}

export interface CBTExam extends BaseEntity {
  question_paper_id: string;
  name: string;
  start_time: Date;
  end_time: Date;
  passing_marks: number;
  strict_browser: boolean;
  allow_resume: boolean;
  shuffle_questions: boolean;
  shuffle_options: boolean;
  show_results_immediately: boolean;
}

export interface CBTSession extends BaseEntity {
  cbt_exam_id: string;
  student_id: string;
  start_time: Date;
  end_time?: Date;
  ip_address?: string;
  device_info?: string;
  session_status: 'STARTED' | 'IN_PROGRESS' | 'SUBMITTED' | 'TERMINATED' | 'EXPIRED';
  auto_submitted?: boolean;
}

export interface CBTAttempt extends BaseEntity {
  cbt_session_id: string;
  question_id: string;
  time_spent_seconds: number;
  is_answered: boolean;
  is_bookmarked: boolean;
  is_correct?: boolean;
  marks_obtained?: number;
}

export interface CBTResponse extends BaseEntity {
  cbt_attempt_id: string;
  selected_answer: any;
}

export interface CBTBookmark extends BaseEntity {
  cbt_session_id: string;
  question_id: string;
  note?: string;
}

export interface OMRSheet extends BaseEntity {
  exam_id: string;
  student_id: string;
  scanned_image_url: string;
  processing_status: 'PENDING' | 'PROCESSED' | 'FAILED' | 'MANUAL_REVIEW';
  error_details?: string;
}

export interface OMREvaluation extends BaseEntity {
  omr_sheet_id: string;
  total_marks: number;
  recognized_answers: any;
  confidence_score: number;
  is_verified: boolean;
}

export interface Invigilator extends BaseEntity {
  exam_id: string;
  staff_id: string;
  hall_id: string;
}

export interface ExamHall extends BaseEntity {
  name: string;
  capacity: number;
  building_id?: string;
}

export interface SeatingPlan extends BaseEntity {
  exam_id: string;
  hall_id: string;
  student_id: string;
  seat_number: string;
}

export interface CandidateAttendance extends BaseEntity {
  exam_id: string;
  student_id: string;
  hall_id?: string;
  is_present: boolean;
  check_in_time?: Date;
  check_out_time?: Date;
}

export interface ExamViolation extends BaseEntity {
  exam_id: string;
  student_id: string;
  violation_type: 'BROWSER_SWITCH' | 'TAB_CHANGE' | 'UNAUTHORIZED_MATERIAL' | 'OTHER';
  description?: string;
  reported_by?: string;
}

export interface GraceMark extends BaseEntity {
  exam_id: string;
  student_id: string;
  subject_id: string;
  marks_added: number;
  reason: string;
}

export interface ModerationRule extends BaseEntity {
  exam_id: string;
  subject_id: string;
  condition: string;
  adjustment_formula: string;
}

export interface ResultApproval extends BaseEntity {
  exam_id: string;
  approved_by: string;
  approval_date: Date;
  comments?: string;
}

export interface ResultPublication extends BaseEntity {
  exam_id: string;
  publish_date: Date;
  is_published: boolean;
}

export interface AssessmentAudit extends BaseEntity {
  entity_name: string;
  entity_id: string;
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'PUBLISH' | 'EVALUATE';
  changes: any;
  performed_by: string;
}
