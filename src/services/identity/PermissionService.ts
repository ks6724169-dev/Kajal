import { PermissionRepository } from '../../core/database/repositories/PermissionRepository';
import { PermissionEntity } from '../../types/identity';

export class PermissionService {
  constructor(private readonly permissionRepository: PermissionRepository) {}

  async getPermissionsForRole(roleId: string): Promise<PermissionEntity[]> {
    return this.permissionRepository.findPermissionsByRole(roleId);
  }

  async hasPermission(roleId: string, resource: string, action: string): Promise<boolean> {
    const permissions = await this.getPermissionsForRole(roleId);
    return permissions.some(p => p.resource === resource && (p.action === action || p.action === 'manage'));
  }
}
