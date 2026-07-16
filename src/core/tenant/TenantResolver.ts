import { Organization, School } from '../../types/database/entities';
import { OrganizationRepository } from '../database/repositories/OrganizationRepository';
import { SchoolRepository } from '../database/repositories/SchoolRepository';

export class TenantResolver {
  constructor(
    private readonly orgRepository: OrganizationRepository,
    private readonly schoolRepository: SchoolRepository
  ) {}

  async resolveFromHostname(hostname: string): Promise<{ organization: Organization | null, school: School | null }> {
    const parts = hostname.split('.');
    
    if (parts.length >= 3) {
      const orgSlug = parts[1];
      const schoolCode = parts[0];

      const organization = await this.orgRepository.findBySlug(orgSlug);
      
      if (organization) {
        const school = await this.schoolRepository.findByCode(schoolCode, organization.id);
        return { organization, school };
      }
    }

    return { organization: null, school: null };
  }
}
