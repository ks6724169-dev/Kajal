import { UnitOfWork } from '../database/unitOfWork.js';
import { 
  EmployeeRepository, TeacherRepository, EmployeeAttendanceRepository, 
  EmployeeLeaveRepository, PerformanceReviewRepository, 
  TrainingCourseRepository, EmployeeTrainingRepository 
} from '../repositories/WorkforceRepository.js';
import { 
  Employee, Teacher, EmploymentStatus, EmployeeAttendance, 
  EmployeeLeave, PerformanceReview, TrainingCourse, EmployeeTraining 
} from '../entities/WorkforceDomain.js';
import { uniqueIdEngine } from '../shared/generators/UniqueIdEngine.js';

export class WorkforceEngine {
  public async onboardEmployee(tenantId: string, data: any): Promise<Employee> {
    const uow = new UnitOfWork(tenantId);
    try {
      await uow.begin();
      const empRepo = uow.getRepository(EmployeeRepository);
      
      const existing = await empRepo.findByEmail(data.officialEmail);
      if (existing) throw new Error('Employee with email already exists');
      
      const employeeId = uniqueIdEngine.generateEmployeeId(tenantId);
      const employmentNumber = `EMP-${Date.now()}`;
      
      const employee = await empRepo.insert({
        ...data,
        employeeId,
        employmentNumber,
        employmentStatus: data.employmentStatus || EmploymentStatus.ACTIVE
      });
      
      await uow.commit();
      return employee;
    } catch (error) {
      await uow.rollback();
      throw error;
    } finally {
      await uow.dispose();
    }
  }

  public async assignTeacherProfile(tenantId: string, data: any): Promise<Teacher> {
    const uow = new UnitOfWork(tenantId);
    try {
      await uow.begin();
      const teacherRepo = uow.getRepository(TeacherRepository);
      
      const teacherNumber = `TCH-${Date.now()}`;
      const teacher = await teacherRepo.insert({
        ...data,
        teacherNumber
      });
      
      await uow.commit();
      return teacher;
    } catch (error) {
      await uow.rollback();
      throw error;
    } finally {
      await uow.dispose();
    }
  }

  public async markAttendance(tenantId: string, data: Partial<EmployeeAttendance>): Promise<EmployeeAttendance> {
    const uow = new UnitOfWork(tenantId);
    try {
      await uow.begin();
      const repo = uow.getRepository(EmployeeAttendanceRepository);
      const record = await repo.insert({ ...data, isLocked: false });
      await uow.commit();
      return record;
    } catch (error) {
      await uow.rollback();
      throw error;
    } finally {
      await uow.dispose();
    }
  }
  
  public async requestLeave(tenantId: string, data: Partial<EmployeeLeave>): Promise<EmployeeLeave> {
    const uow = new UnitOfWork(tenantId);
    try {
      await uow.begin();
      const repo = uow.getRepository(EmployeeLeaveRepository);
      const record = await repo.insert({ ...data, status: 'PENDING' });
      await uow.commit();
      return record;
    } catch (error) {
      await uow.rollback();
      throw error;
    } finally {
      await uow.dispose();
    }
  }

  public async submitPerformanceReview(tenantId: string, reviewerId: string, data: Partial<PerformanceReview>): Promise<PerformanceReview> {
    const uow = new UnitOfWork(tenantId);
    try {
      await uow.begin();
      const repo = uow.getRepository(PerformanceReviewRepository);
      const record = await repo.insert({ ...data, reviewer_id: reviewerId, reviewDate: new Date() });
      await uow.commit();
      return record;
    } catch (error) {
      await uow.rollback();
      throw error;
    } finally {
      await uow.dispose();
    }
  }
  
  public async createTrainingCourse(tenantId: string, data: Partial<TrainingCourse>): Promise<TrainingCourse> {
    const uow = new UnitOfWork(tenantId);
    try {
      await uow.begin();
      const repo = uow.getRepository(TrainingCourseRepository);
      const record = await repo.insert(data);
      await uow.commit();
      return record;
    } catch (error) {
      await uow.rollback();
      throw error;
    } finally {
      await uow.dispose();
    }
  }
  
  public async enrollTraining(tenantId: string, data: Partial<EmployeeTraining>): Promise<EmployeeTraining> {
    const uow = new UnitOfWork(tenantId);
    try {
      await uow.begin();
      const repo = uow.getRepository(EmployeeTrainingRepository);
      const record = await repo.insert({ ...data, status: 'ENROLLED' });
      await uow.commit();
      return record;
    } catch (error) {
      await uow.rollback();
      throw error;
    } finally {
      await uow.dispose();
    }
  }
}

export const workforceEngine = new WorkforceEngine();
