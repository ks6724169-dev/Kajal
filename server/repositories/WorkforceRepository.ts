import { BaseRepository } from './BaseRepository.js';
import { 
  Employee, Teacher, EmployeeAttendance, EmployeeLeave, 
  PerformanceReview, TrainingCourse, EmployeeTraining, 
  EmployeeDocument, DepartmentAllocation 
} from '../entities/WorkforceDomain.js';
import { QuerySpecification } from './QuerySpecification.js';

export class EmployeeRepository extends BaseRepository<Employee> {
  protected tableName = 'employees';
  
  public async findByEmail(email: string): Promise<Employee | null> {
    const spec = new QuerySpecification().and('official_email', email);
    const results = await this.findMany(spec, 1);
    return results[0] || null;
  }
}

export class TeacherRepository extends BaseRepository<Teacher> {
  protected tableName = 'teachers';
}

export class EmployeeAttendanceRepository extends BaseRepository<EmployeeAttendance> {
  protected tableName = 'employee_attendance';
}

export class EmployeeLeaveRepository extends BaseRepository<EmployeeLeave> {
  protected tableName = 'employee_leaves';
}

export class PerformanceReviewRepository extends BaseRepository<PerformanceReview> {
  protected tableName = 'performance_reviews';
}

export class TrainingCourseRepository extends BaseRepository<TrainingCourse> {
  protected tableName = 'training_courses';
}

export class EmployeeTrainingRepository extends BaseRepository<EmployeeTraining> {
  protected tableName = 'employee_training';
}

export class EmployeeDocumentRepository extends BaseRepository<EmployeeDocument> {
  protected tableName = 'employee_documents';
}

export class DepartmentAllocationRepository extends BaseRepository<DepartmentAllocation> {
  protected tableName = 'department_allocations';
}
