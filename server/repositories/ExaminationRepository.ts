import { BaseRepository } from './BaseRepository.js';
import {
  Examination,
  ExaminationSession,
  ExaminationSchedule,
  ExaminationRoom,
  InvigilatorAssignment,
  SubjectPaper,
  QuestionPaper,
  QuestionBank,
  QuestionBlueprint,
  PracticalExam,
  VivaExam,
  Assignment,
  ProjectAssessment,
  InternalAssessment,
  ExternalAssessment,
  MarksEntry,
  GradeBook,
  GPARecord,
  CGPARecord,
  Result,
  ResultPublication,
  AcademicPromotion,
  AcademicRemark,
  StudentPerformance,
  WeakStudentRegistry,
  GiftedStudentRegistry,
  AcademicRecommendation
} from '../entities/ExaminationDomain.js';

export class ExaminationRepository extends BaseRepository<Examination> {
  protected tableName = 'examination_master';
}

export class ExaminationSessionRepository extends BaseRepository<ExaminationSession> {
  protected tableName = 'examination_session';
}

export class ExaminationScheduleRepository extends BaseRepository<ExaminationSchedule> {
  protected tableName = 'examination_schedule';
}

export class ExaminationRoomRepository extends BaseRepository<ExaminationRoom> {
  protected tableName = 'examination_rooms';
}

export class InvigilatorAssignmentRepository extends BaseRepository<InvigilatorAssignment> {
  protected tableName = 'invigilator_assignment';
}

export class SubjectPaperRepository extends BaseRepository<SubjectPaper> {
  protected tableName = 'subject_paper';
}

export class QuestionPaperRepository extends BaseRepository<QuestionPaper> {
  protected tableName = 'question_paper';
}

export class QuestionBankRepository extends BaseRepository<QuestionBank> {
  protected tableName = 'question_bank';
}

export class QuestionBlueprintRepository extends BaseRepository<QuestionBlueprint> {
  protected tableName = 'blueprint_master';
}

export class PracticalExamRepository extends BaseRepository<PracticalExam> {
  protected tableName = 'practical_exam';
}

export class VivaExamRepository extends BaseRepository<VivaExam> {
  protected tableName = 'viva_exam';
}

export class AssignmentRepository extends BaseRepository<Assignment> {
  protected tableName = 'assignment_master';
}

export class ProjectAssessmentRepository extends BaseRepository<ProjectAssessment> {
  protected tableName = 'project_assessment';
}

export class InternalAssessmentRepository extends BaseRepository<InternalAssessment> {
  protected tableName = 'internal_assessment';
}

export class ExternalAssessmentRepository extends BaseRepository<ExternalAssessment> {
  protected tableName = 'external_assessment';
}

export class MarksEntryRepository extends BaseRepository<MarksEntry> {
  protected tableName = 'marks_entry';
}

export class GradeBookRepository extends BaseRepository<GradeBook> {
  protected tableName = 'grade_book';
}

export class GPARecordRepository extends BaseRepository<GPARecord> {
  protected tableName = 'gpa_records';
}

export class CGPARecordRepository extends BaseRepository<CGPARecord> {
  protected tableName = 'cgpa_records';
}

export class ResultRepository extends BaseRepository<Result> {
  protected tableName = 'result_master';
}

export class ResultPublicationRepository extends BaseRepository<ResultPublication> {
  protected tableName = 'result_publication';
}

export class AcademicPromotionRepository extends BaseRepository<AcademicPromotion> {
  protected tableName = 'promotion_master';
}

export class AcademicRemarkRepository extends BaseRepository<AcademicRemark> {
  protected tableName = 'academic_remark';
}

export class StudentPerformanceRepository extends BaseRepository<StudentPerformance> {
  protected tableName = 'performance_registry';
}

export class WeakStudentRegistryRepository extends BaseRepository<WeakStudentRegistry> {
  protected tableName = 'weak_student_registry';
}

export class GiftedStudentRegistryRepository extends BaseRepository<GiftedStudentRegistry> {
  protected tableName = 'gifted_student_registry';
}

export class AcademicRecommendationRepository extends BaseRepository<AcademicRecommendation> {
  protected tableName = 'academic_recommendation';
}
