import { TenantEntity } from '../database/base';

export interface ClassEntity extends TenantEntity {
  name: string; // e.g., Grade 10
  code: string;
  order_sequence: number;
}

export interface SectionEntity extends TenantEntity {
  class_id: string;
  name: string; // e.g., A, B, C
  room_number?: string | null;
  capacity?: number | null;
}

export interface ClassSectionTeacherEntity extends TenantEntity {
  class_id: string;
  section_id: string;
  teacher_id: string;
  is_class_teacher: boolean;
}
