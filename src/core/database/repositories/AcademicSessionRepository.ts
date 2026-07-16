import { SupabaseClient } from '@supabase/supabase-js';
import { TenantRepository } from '../TenantRepository';
import { AcademicSession } from '../../../types/database/entities';

export class AcademicSessionRepository extends TenantRepository<AcademicSession> {
  constructor(supabase: SupabaseClient) {
    super(supabase, 'academic_sessions');
  }

  async findCurrent(organizationId: string): Promise<AcademicSession | null> {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select('*')
      .eq('is_current', true)
      .eq('organization_id', organizationId)
      .eq('is_deleted', false)
      .single();

    if (error) {
      console.error('Error finding current academic session:', error);
      return null;
    }

    return data as AcademicSession;
  }
}
