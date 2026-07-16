import { BaseRepository } from './BaseRepository.js';
import { 
  Attendance, 
  LeaveRequest, 
  BehaviourRecord, 
  HealthRecord, 
  MedicalVisit, 
  StudentDocument,
  StudentHouse,
  MentorAssignment
} from '../entities/LifecycleDomain.js';

export class AttendanceRepository extends BaseRepository<Attendance> {
  protected tableName = 'attendance_records';
}

export class LeaveRequestRepository extends BaseRepository<LeaveRequest> {
  protected tableName = 'leave_requests';
}

export class BehaviourRepository extends BaseRepository<BehaviourRecord> {
  protected tableName = 'behaviour_records';
}

export class HealthRecordRepository extends BaseRepository<HealthRecord> {
  protected tableName = 'health_records';
}

export class MedicalVisitRepository extends BaseRepository<MedicalVisit> {
  protected tableName = 'medical_visits';
}

export class DocumentRepository extends BaseRepository<StudentDocument> {
  protected tableName = 'student_documents';
}

export class AcademicAllocationRepository extends BaseRepository<StudentHouse> {
  protected tableName = 'student_houses';
}

export class MentorAssignmentRepository extends BaseRepository<MentorAssignment> {
  protected tableName = 'mentor_assignments';
}
