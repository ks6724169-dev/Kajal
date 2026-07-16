import { TenantEntity } from '../database/base';

export interface ClassTimetableEntity extends TenantEntity {
  class_id: string;
  section_id: string;
  subject_id: string;
  teacher_id: string;
  day_of_week: 1 | 2 | 3 | 4 | 5 | 6 | 7;
  start_time: string; // HH:mm format
  end_time: string;
  room_number?: string | null;
}
