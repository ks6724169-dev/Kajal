import { SupabaseClient } from '@supabase/supabase-js';
import { TenantRepository } from '../TenantRepository';
import { Campus } from '../../../types/database/entities';

export class CampusRepository extends TenantRepository<Campus> {
  constructor(supabase: SupabaseClient) {
    super(supabase, 'campuses');
  }

  async findBySchool(schoolId: string, organizationId: string): Promise<Campus[]> {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select('*')
      .eq('school_id', schoolId)
      .eq('organization_id', organizationId)
      .eq('is_deleted', false);

    if (error) {
      console.error('Error finding campuses by school:', error);
      return [];
    }

    return data as Campus[];
  }
}
