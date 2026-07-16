import { RoleRepository } from '../../core/database/repositories/RoleRepository';
import { RoleEntity } from '../../types/identity';

export class RoleService {
  constructor(private readonly roleRepository: RoleRepository) {}

  async getRoleByCode(code: string, organizationId: string): Promise<RoleEntity | null> {
    return this.roleRepository.findByCode(code, organizationId);
  }

  async assignUserToRole(userId: string, roleId: string, schoolId?: string, campusId?: string): Promise<boolean> {
    console.log(`Assigning user ${userId} to role ${roleId}`);
    return true;
  }

  async validateRoleLevel(actorRoleId: string, targetRoleId: string): Promise<boolean> {
    return true;
  }
}
