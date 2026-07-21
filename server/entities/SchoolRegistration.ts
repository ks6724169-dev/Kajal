import { BaseEntity } from './BaseEntity.js';

export interface SchoolRegistration extends BaseEntity {
  registration_id: string;
  school_name: string;
  school_type?: string;
  school_category?: string;
  board_type?: string;
  established_year?: number;
  principal_name?: string;
  principal_email?: string;
  principal_phone?: string;
  admin_name?: string;
  admin_email?: string;
  admin_phone?: string;
  total_students?: number;
  total_teachers?: number;
  selected_plan?: string;
  billing_cycle?: string;
  logo_url?: string;
  agree_terms?: boolean;
  country?: string;
  state?: string;
  district?: string;
  city?: string;
  pincode?: string;
  address?: string;
  current_step: number;
  progress: number;
  
  school_unique_id?: string;
  tenant_id: string;
  owner_user_id?: string;

  // New multi-step form data model attributes
  institution_name?: string;
  institution_type?: string;
  affiliation_number?: string;
  establishment_year?: number;
  official_website?: string;
  official_email?: string;
  official_phone?: string;
  postal_code?: string;
  owner_name?: string;
  administrator_name?: string;
  administrator_designation?: string;
  owner_email?: string;
  owner_mobile?: string;
  alternate_mobile?: string;
  short_name?: string;
  primary_brand_color?: string;
  secondary_brand_color?: string;

  // Subscription and Payment properties
  plan_id?: string;
  student_capacity?: number;
  currency?: string;
  base_amount?: number;
  setup_fee?: number;
  total_amount?: number;
  required_initial_payment?: number;
  paid_amount?: number;
  remaining_amount?: number;
  payment_status?: string;
  gateway?: string;
  gateway_order_id?: string;
  gateway_payment_id?: string;
  gateway_signature?: string;
  activated_at?: Date;
}
