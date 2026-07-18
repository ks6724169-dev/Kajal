import { UnitOfWork } from '../database/unitOfWork.js';
import { StudentRepository, ParentRepository, FamilyRepository } from '../repositories/StudentRepository.js';
import { Student, StudentStatus } from '../entities/StudentDomain.js';
import { uniqueIdEngine } from '../shared/generators/UniqueIdEngine.js';

export class AdmissionEngine {
  public async processAdmission(tenantId: string, data: any): Promise<Student> {
    const uow = new UnitOfWork(tenantId);
    try {
      await uow.begin();
      const studentRepo = uow.getRepository(StudentRepository);
      const parentRepo = uow.getRepository(ParentRepository);
      const familyRepo = uow.getRepository(FamilyRepository);
      
      // Duplicate prevention
      const existing = await studentRepo.findByAdmissionNumber(data.admissionNumber);
      if (existing) {
        throw new Error('Student with this admission number already exists');
      }

      // Generate IDs
      const studentId = uniqueIdEngine.generateStudentId(tenantId);
      const rfid = `RFID-${Date.now()}`;
      const rollNumber = `R-${Math.floor(Math.random() * 1000)}`;

      // Setup family if parents exist
      let family_id;
      if (data.parents && data.parents.length > 0) {
        const family = await familyRepo.insert({ name: `${data.lastName} Family`, householdAddress: data.address });
        family_id = family.id;
        for (const parent of data.parents) {
          await parentRepo.insert({ ...parent, family_id: family.id });
        }
      }

      const { parents, address, ...cleanStudentData } = data;
      const studentPayload: Partial<Student> = {
        ...cleanStudentData,
        studentId,
        rfid,
        rollNumber,
        family_id,
        academicStatus: StudentStatus.ADMITTED
      };

      const newStudent = await studentRepo.insert(studentPayload);

      await uow.commit();
      return newStudent;
    } catch (error) {
      await uow.rollback();
      throw error;
    } finally {
      await uow.dispose();
    }
  }
}

export const admissionEngine = new AdmissionEngine();
