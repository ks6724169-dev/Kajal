import { BaseEntity } from './BaseEntity.js';

export interface SchoolRegistration extends BaseEntity {
  registration_id: string;
  school_name: string;
  school_type?: string;
  school_category?: string;
  board?: string;
  establishment_year?: number;
  country?: string;
  state?: string;
  district?: string;
  city?: string;
  pincode?: string;
  address?: string;
  current_step: number;
  progress: number;
}
