import { useAuth } from './useAuth';

export function usePermissions() {
  const { user, permissions } = useAuth();

  const hasPermission = (permission: string): boolean => {
    if (!user) return false;
    // Super Admins bypass all granular permission checks
    if (user.role === 'super_admin' || permissions.includes('manage_all')) {
      return true;
    }
    return permissions.includes(permission);
  };

  const hasAnyPermission = (perms: string[]): boolean => {
    return perms.some((p) => hasPermission(p));
  };

  const hasAllPermissions = (perms: string[]): boolean => {
    return perms.every((p) => hasPermission(p));
  };

  const hasRole = (role: string | string[]): boolean => {
    if (!user) return false;
    if (Array.isArray(role)) {
      return role.includes(user.role);
    }
    return user.role === role;
  };

  return {
    permissions,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    hasRole
  };
}
