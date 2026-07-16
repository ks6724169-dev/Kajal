import { SupabaseClient } from '@supabase/supabase-js';
import { TenantRepository } from '../../TenantRepository';
import { SectionEntity } from '../../../../types/academic/class';

export class SectionRepository extends TenantRepository<SectionEntity> {
  constructor(supabase: SupabaseClient) {
    super(supabase, 'sections');
  }

  async findByClass(classId: string, organizationId: string): Promise<SectionEntity[]> {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select('*')
      .eq('class_id', classId)
      .eq('organization_id', organizationId)
      .eq('is_deleted', false)
      .order('name');

    if (error) return [];
    return data as SectionEntity[];
  }
}
