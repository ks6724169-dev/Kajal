import { SupabaseClient } from '@supabase/supabase-js';
import { TenantRepository } from '../../TenantRepository';
import { QuestionBankEntity } from '../../../../types/academic/resources';

export class QuestionBankRepository extends TenantRepository<QuestionBankEntity> {
  constructor(supabase: SupabaseClient) {
    super(supabase, 'question_banks');
  }
}
