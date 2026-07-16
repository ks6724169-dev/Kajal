import { SupabaseClient } from '@supabase/supabase-js';
import { TenantRepository } from '../TenantRepository';
import { Student } from '../../../types/database/entities';

export class StudentRepository extends TenantRepository<Student> {
  constructor(supabase: SupabaseClient) {
    super(supabase, 'students');
  }

  async findByAdmissionNumber(admissionNumber: string, organizationId: string): Promise<Student | null> {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select('*')
      .eq('admission_number', admissionNumber)
      .eq('organization_id', organizationId)
      .eq('is_deleted', false)
      .single();

    if (error) {
      console.error('Error finding student by admission number:', error);
      return null;
    }

    return data as Student;
  }
}
