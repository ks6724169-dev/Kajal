import React from 'react';
import { useTenant } from '../../hooks/useTenant';

interface TenantGuardProps {
  children: React.ReactNode;
  allowedTenantTypes?: Array<'school' | 'college' | 'university' | 'k12'>;
  allowedTenantIds?: string[];
  fallback?: React.ReactNode;
}

export const TenantGuard: React.FC<TenantGuardProps> = ({
  children,
  allowedTenantTypes,
  allowedTenantIds,
  fallback = null
}) => {
  const { currentTenant } = useTenant();

  if (!currentTenant) {
    return <>{fallback}</>;
  }

  if (allowedTenantIds && !allowedTenantIds.includes(currentTenant.id)) {
    return <>{fallback}</>;
  }

  if (allowedTenantTypes && !allowedTenantTypes.includes(currentTenant.type)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};
