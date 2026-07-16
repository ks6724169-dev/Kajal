import { Organization, School, Campus, AcademicSession } from '../../types/database/entities';
import { OrganizationRepository } from '../../core/database/repositories/OrganizationRepository';
import { SchoolRepository } from '../../core/database/repositories/SchoolRepository';
import { CampusRepository } from '../../core/database/repositories/CampusRepository';
import { AcademicSessionRepository } from '../../core/database/repositories/AcademicSessionRepository';

export class TenantService {
  constructor(
    private readonly orgRepo: OrganizationRepository,
    private readonly schoolRepo: SchoolRepository,
    private readonly campusRepo: CampusRepository,
    private readonly sessionRepo: AcademicSessionRepository
  ) {}

  async getOrganization(id: string): Promise<Organization | null> {
    return this.orgRepo.findById(id);
  }

  async getSchool(id: string, orgId: string): Promise<School | null> {
    return this.schoolRepo.findByIdAndTenant(id, orgId);
  }

  async getCampuses(schoolId: string, orgId: string): Promise<Campus[]> {
    return this.campusRepo.findBySchool(schoolId, orgId);
  }
  
  async getCurrentSession(orgId: string): Promise<AcademicSession | null> {
    return this.sessionRepo.findCurrent(orgId);
  }
}
