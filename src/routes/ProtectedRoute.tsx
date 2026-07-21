import React from 'react';
import { AuthGuard } from '../components/auth/AuthGuard';
import { RoleGuard } from '../components/auth/RoleGuard';
import { TenantGuard } from '../components/auth/TenantGuard';
import { Role } from '../types';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: Role | Role[];
  allowedTenantTypes?: Array<'school' | 'college' | 'university' | 'k12'>;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles,
  allowedTenantTypes
}) => {
  let content = <AuthGuard>{children}</AuthGuard>;

  if (allowedRoles) {
    content = (
      <RoleGuard allowedRoles={allowedRoles}>
        {content}
      </RoleGuard>
    );
  }

  if (allowedTenantTypes) {
    content = (
      <TenantGuard allowedTenantTypes={allowedTenantTypes}>
        {content}
      </TenantGuard>
    );
  }

  return <div id="protected-route-wrapper">{content}</div>;
};
