import { StudentRepository } from '../repositories/StudentRepository.js';
import { StudentStatus, Student } from '../entities/StudentDomain.js';
import { UnitOfWork } from '../database/unitOfWork.js';

export class StudentService {
  public async changeStatus(tenantId: string, studentId: string, status: StudentStatus): Promise<Student> {
    const uow = new UnitOfWork(tenantId);
    try {
      await uow.begin();
      const studentRepo = uow.getRepository(StudentRepository);
      const student = await studentRepo.findOne(studentId);
      if (!student) throw new Error('Student not found');
      
      const updated = await studentRepo.update(studentId, { academicStatus: status }, student.version);
      
      await uow.commit();
      return updated!;
    } catch (error) {
      await uow.rollback();
      throw error;
    } finally {
      await uow.dispose();
    }
  }

  public async getProfile(tenantId: string, studentId: string): Promise<Student | null> {
    const uow = new UnitOfWork(tenantId);
    try {
      const studentRepo = uow.getRepository(StudentRepository);
      return await studentRepo.findOne(studentId);
    } finally {
      await uow.dispose();
    }
  }
}

export const studentService = new StudentService();
