import { SupabaseClient } from '@supabase/supabase-js';
import { TenantRepository } from '../TenantRepository';
import { School } from '../../../types/database/entities';

export class SchoolRepository extends TenantRepository<School> {
  constructor(supabase: SupabaseClient) {
    super(supabase, 'schools');
  }

  async findByCode(code: string, organizationId: string): Promise<School | null> {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select('*')
      .eq('code', code)
      .eq('organization_id', organizationId)
      .eq('is_deleted', false)
      .single();

    if (error) {
      console.error('Error finding school by code:', error);
      return null;
    }

    return data as School;
  }
}
