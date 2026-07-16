import { TenantEntity } from '../database/base';

export type ResourceType = 'study_material' | 'notes' | 'practical_record' | 'lab_record' | 'ebook' | 'video';

export interface ResourceEntity extends TenantEntity {
  title: string;
  description?: string | null;
  type: ResourceType;
  subject_id?: string | null;
  class_id?: string | null;
  file_url: string;
  author_id: string; // Teacher or Admin ID
  is_published: boolean;
  ai_generated: boolean;
}

export interface QuestionBankEntity extends TenantEntity {
  subject_id: string;
  class_id: string;
  topic?: string | null;
  difficulty_level: 'easy' | 'medium' | 'hard';
  question_type: 'mcq' | 'subjective' | 'true_false' | 'fill_in_the_blanks';
  question_text: string;
  options?: any | null; // For MCQs
  correct_answer?: string | null;
  marks: number;
  ai_generated: boolean;
}

export interface OnlineClassEntity extends TenantEntity {
  class_id: string;
  section_id: string;
  subject_id: string;
  teacher_id: string;
  title: string;
  meeting_url: string;
  platform: 'zoom' | 'google_meet' | 'teams' | 'other';
  start_time: string;
  duration_minutes: number;
  status: 'scheduled' | 'live' | 'completed' | 'cancelled';
  recording_url?: string | null;
}
