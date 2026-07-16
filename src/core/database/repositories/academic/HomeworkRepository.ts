import { SupabaseClient } from '@supabase/supabase-js';
import { TenantRepository } from '../../TenantRepository';
import { HomeworkEntity } from '../../../../types/academic/homework';

export class HomeworkRepository extends TenantRepository<HomeworkEntity> {
  constructor(supabase: SupabaseClient) {
    super(supabase, 'homeworks');
  }

  async findByClassAndSection(classId: string, sectionId: string, organizationId: string): Promise<HomeworkEntity[]> {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select('*')
      .eq('class_id', classId)
      .eq('section_id', sectionId)
      .eq('organization_id', organizationId)
      .eq('is_deleted', false)
      .order('due_date', { ascending: true });

    if (error) return [];
    return data as HomeworkEntity[];
  }
}
