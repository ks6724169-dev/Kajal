import { BaseRepository } from './BaseRepository.js';
import { Student, Parent, Family } from '../entities/StudentDomain.js';
import { QuerySpecification } from './QuerySpecification.js';

export class StudentRepository extends BaseRepository<Student> {
  protected tableName = 'student_master';
  
  public async findByAdmissionNumber(admissionNumber: string): Promise<Student | null> {
    const spec = new QuerySpecification().and('admission_number', admissionNumber);
    const results = await this.findMany(spec, 1);
    return results[0] || null;
  }
}

export class ParentRepository extends BaseRepository<Parent> {
  protected tableName = 'parent_master';
}

export class FamilyRepository extends BaseRepository<Family> {
  protected tableName = 'family_master';
}
