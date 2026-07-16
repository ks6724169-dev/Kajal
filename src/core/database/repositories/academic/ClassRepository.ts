import { SupabaseClient } from '@supabase/supabase-js';
import { TenantRepository } from '../../TenantRepository';
import { ClassEntity } from '../../../../types/academic/class';

export class ClassRepository extends TenantRepository<ClassEntity> {
  constructor(supabase: SupabaseClient) {
    super(supabase, 'classes');
  }

  async findByCode(code: string, organizationId: string): Promise<ClassEntity | null> {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select('*')
      .eq('code', code)
      .eq('organization_id', organizationId)
      .eq('is_deleted', false)
      .single();

    if (error) return null;
    return data as ClassEntity;
  }
}
