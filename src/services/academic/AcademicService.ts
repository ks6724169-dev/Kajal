import { SupabaseClient } from '@supabase/supabase-js';
import { 
  ClassRepository, 
  SectionRepository, 
  SubjectRepository, 
  LessonPlanRepository,
  HomeworkRepository
} from '../../core/database/repositories/academic';

export class AcademicService {
  private classRepo: ClassRepository;
  private sectionRepo: SectionRepository;
  private subjectRepo: SubjectRepository;
  private lessonPlanRepo: LessonPlanRepository;
  private homeworkRepo: HomeworkRepository;

  constructor(supabase: SupabaseClient) {
    this.classRepo = new ClassRepository(supabase);
    this.sectionRepo = new SectionRepository(supabase);
    this.subjectRepo = new SubjectRepository(supabase);
    this.lessonPlanRepo = new LessonPlanRepository(supabase);
    this.homeworkRepo = new HomeworkRepository(supabase);
  }

  // Add specific business logic methods here when needed
  // e.g. mapping curriculum, generating timetables, assigning AI lesson plans, etc.
}
