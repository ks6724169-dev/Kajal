import { useAuth } from './useAuth';
import { useWorkspace } from './useWorkspace';
import { Role } from '../types';

export function useRole() {
  const { user, permissions } = useAuth();
  const { activeWorkspaceId, switchWorkspace } = useWorkspace();

  // If activeWorkspaceId is set, treat it as the current active operational role.
  // This allows administrators to switch their active role workspace seamlessly.
  const currentRole: Role = (activeWorkspaceId && activeWorkspaceId !== 'guest') ? activeWorkspaceId : (user?.role || 'guest');

  const hasPermission = (permission: string): boolean => {
    if (permissions.includes('manage_all')) return true;
    return permissions.includes(permission);
  };

  const isRole = (role: Role | Role[]): boolean => {
    if (Array.isArray(role)) {
      return role.includes(currentRole);
    }
    return currentRole === role;
  };

  const changeRole = (newRole: Role) => {
    // Check if user is authorized to switch roles
    const originalRole = user?.role;
    if (
      originalRole === 'super_admin' || 
      originalRole === 'organization_owner' ||
      originalRole === 'school_admin' ||
      originalRole === 'principal'
    ) {
      switchWorkspace(newRole);
    }
  };

  return {
    currentRole,
    originalRole: user?.role || 'guest',
    hasPermission,
    isRole,
    changeRole
  };
}
