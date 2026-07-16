import { UnitOfWork } from '../database/unitOfWork.js';
import { ExtendedOrganizationRepository, ExtendedCampusRepository } from '../repositories/MasterDataRepository.js';
import { Organization, Campus } from '../entities/MasterData.js';
import { uniqueIdEngine } from '../shared/generators/UniqueIdEngine.js';

export class OrganizationService {
  public async createOrganization(tenantId: string, data: Partial<Organization>): Promise<Organization> {
    const uow = new UnitOfWork(tenantId);
    try {
      await uow.begin();
      const orgRepo = uow.getRepository(ExtendedOrganizationRepository);
      
      data.code = data.code || uniqueIdEngine.generateOrganizationId(tenantId);
      const newOrg = await orgRepo.insert(data);
      
      await uow.commit();
      return newOrg;
    } catch (error) {
      await uow.rollback();
      throw error;
    } finally {
      await uow.dispose();
    }
  }

  public async createCampus(tenantId: string, orgId: string, data: Partial<Campus>): Promise<Campus> {
    const uow = new UnitOfWork(tenantId);
    try {
      await uow.begin();
      const campusRepo = uow.getRepository(ExtendedCampusRepository);
      
      data.organization_id = orgId;
      data.code = data.code || uniqueIdEngine.generateCampusId(tenantId);
      
      const newCampus = await campusRepo.insert(data);
      
      await uow.commit();
      return newCampus;
    } catch (error) {
      await uow.rollback();
      throw error;
    } finally {
      await uow.dispose();
    }
  }
}

export const organizationService = new OrganizationService();
