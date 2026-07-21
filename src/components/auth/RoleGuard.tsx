import React from 'react';
import { Role } from '../../types';
import { usePermissions } from '../../hooks/usePermissions';

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: Role | Role[];
  fallback?: React.ReactNode;
}

export const RoleGuard: React.FC<RoleGuardProps> = ({
  children,
  allowedRoles,
  fallback = null
}) => {
  const { hasRole } = usePermissions();

  if (!hasRole(allowedRoles)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};
