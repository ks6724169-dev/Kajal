import { BaseRepository } from './BaseRepository.js';
import { Organization, Campus, Department, MasterReference, AcademicSession, ClassEntity, Subject, Resource } from '../entities/MasterData.js';
import { QuerySpecification } from './QuerySpecification.js';

export class ExtendedOrganizationRepository extends BaseRepository<Organization> {
  protected tableName = 'organizations';

  public async findByCode(code: string): Promise<Organization | null> {
    const spec = new QuerySpecification().and('code', code);
    const results = await this.findMany(spec, 1);
    return results[0] || null;
  }
}

export class ExtendedCampusRepository extends BaseRepository<Campus> {
  protected tableName = 'campuses';
}

export class ExtendedDepartmentRepository extends BaseRepository<Department> {
  protected tableName = 'departments';
}

export class MasterReferenceRepository extends BaseRepository<MasterReference> {
  protected tableName = 'master_references';

  public async findByType(type: string): Promise<MasterReference[]> {
    return this.findMany(new QuerySpecification().and('type', type));
  }
}

export class AcademicSessionRepository extends BaseRepository<AcademicSession> {
  protected tableName = 'academic_sessions';
}

export class ClassRepository extends BaseRepository<ClassEntity> {
  protected tableName = 'classes';
}

export class SubjectRepository extends BaseRepository<Subject> {
  protected tableName = 'subjects';
}

export class ResourceRepository extends BaseRepository<Resource> {
  protected tableName = 'resources';
}
