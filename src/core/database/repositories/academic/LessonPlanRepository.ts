import { SupabaseClient } from '@supabase/supabase-js';
import { TenantRepository } from '../../TenantRepository';
import { LessonPlanEntity } from '../../../../types/academic/lesson';

export class LessonPlanRepository extends TenantRepository<LessonPlanEntity> {
  constructor(supabase: SupabaseClient) {
    super(supabase, 'lesson_plans');
  }

  async findByTeacher(teacherId: string, organizationId: string): Promise<LessonPlanEntity[]> {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select('*')
      .eq('teacher_id', teacherId)
      .eq('organization_id', organizationId)
      .eq('is_deleted', false)
      .order('date_planned', { ascending: false });

    if (error) return [];
    return data as LessonPlanEntity[];
  }
}
