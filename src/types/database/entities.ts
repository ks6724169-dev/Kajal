import { AuditableEntity, TenantEntity } from './base';

export interface Organization extends AuditableEntity {
  name: string;
  slug: string;
  logo_url?: string | null;
  status: 'active' | 'inactive' | 'suspended';
}

export interface School extends TenantEntity {
  name: string;
  code: string;
  address?: string | null;
  contact_email?: string | null;
  contact_phone?: string | null;
}

export interface Campus extends TenantEntity {
  school_id: string;
  name: string;
  location?: string | null;
}

export interface AcademicSession extends TenantEntity {
  name: string;
  start_date: string;
  end_date: string;
  is_current: boolean;
}

export interface Department extends TenantEntity {
  name: string;
  code: string;
}

export interface Class extends TenantEntity {
  name: string;
  level: number;
}

export interface Section extends TenantEntity {
  class_id: string;
  name: string;
  capacity: number;
}

export interface Subject extends TenantEntity {
  name: string;
  code: string;
  type: 'core' | 'elective' | 'lab';
}

export interface Role extends TenantEntity {
  name: string;
  description?: string | null;
}

export interface Permission extends AuditableEntity {
  resource: string;
  action: string;
  description?: string | null;
}

export interface RolePermission extends AuditableEntity {
  role_id: string;
  permission_id: string;
}

export interface User extends TenantEntity {
  email: string;
  phone?: string | null;
  full_name: string;
  avatar_url?: string | null;
  role_id: string;
  status: 'active' | 'inactive' | 'blocked';
}

export interface Teacher extends TenantEntity {
  user_id: string;
  department_id?: string | null;
  specialization?: string | null;
  employee_id: string;
}

export interface Student extends TenantEntity {
  user_id: string;
  school_id: string;
  class_id: string;
  section_id: string;
  admission_number: string;
  roll_number: string;
  dob: string;
  gender: 'male' | 'female' | 'other';
  blood_group?: string | null;
}

export interface Parent extends TenantEntity {
  user_id: string;
  occupation?: string | null;
  income_range?: string | null;
}

export interface Employee extends TenantEntity {
  user_id: string;
  school_id: string;
  department_id: string;
  designation: string;
  joining_date: string;
}

export interface Guardian extends TenantEntity {
  student_id: string;
  parent_id: string;
  relationship: string;
  is_primary: boolean;
}

export interface Attendance extends TenantEntity {
  academic_session_id: string;
  student_id: string;
  class_id: string;
  section_id: string;
  date: string;
  status: 'present' | 'absent' | 'half_day' | 'late' | 'excused';
  remarks?: string | null;
}

export interface Timetable extends TenantEntity {
  academic_session_id: string;
  class_id: string;
  section_id: string;
  subject_id: string;
  teacher_id: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  room_number?: string | null;
}
