import { TenantEntity } from '../database/base';

export type AssignmentType = 'homework' | 'assignment' | 'project' | 'practical';

export interface HomeworkEntity extends TenantEntity {
  class_id: string;
  section_id: string;
  subject_id: string;
  teacher_id: string;
  title: string;
  description: string;
  type: AssignmentType;
  issue_date: string;
  due_date: string;
  total_marks?: number | null;
  attachments?: string[] | null;
  ai_generated: boolean;
}

export interface HomeworkSubmissionEntity extends TenantEntity {
  homework_id: string;
  student_id: string;
  submission_date: string;
  status: 'pending' | 'submitted' | 'late' | 'graded';
  content?: string | null;
  attachments?: string[] | null;
  marks_obtained?: number | null;
  teacher_remarks?: string | null;
}
