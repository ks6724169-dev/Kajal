import { TenantEntity } from '../database/base';

export interface BaseProfile extends TenantEntity {
  user_id: string;
  first_name: string;
  last_name: string;
  full_name: string;
  avatar_url?: string | null;
  digital_signature_url?: string | null;
  profile_completed: boolean;
}

export interface TeacherProfile extends BaseProfile {
  employee_id: string;
  department_id?: string | null;
  specialization?: string | null;
  qualification?: string | null;
}

export interface StudentProfile extends BaseProfile {
  school_id: string;
  class_id: string;
  section_id: string;
  admission_number: string;
  roll_number: string;
  dob: string;
  gender: 'male' | 'female' | 'other';
  blood_group?: string | null;
}

export interface ParentProfile extends BaseProfile {
  occupation?: string | null;
  income_range?: string | null;
}

export interface PrincipalProfile extends BaseProfile {
  school_id: string;
  employee_id: string;
  experience_years: number;
}

export interface SchoolOwnerProfile extends BaseProfile {
  business_name?: string | null;
  contact_address?: string | null;
}

export interface SuperAdminProfile extends BaseProfile {
  access_level: 'tier1' | 'tier2' | 'tier3';
}
