import React from 'react';
import { ProtectedWorkspace } from './ProtectedWorkspace';
import { Role } from '../types';

interface DynamicRouteProps {
  allowedRoles?: Role[];
  requiredPermissions?: string[];
  children: React.ReactNode;
}

export const DynamicRoute: React.FC<DynamicRouteProps> = ({
  allowedRoles,
  requiredPermissions,
  children
}) => {
  return (
    <ProtectedWorkspace
      allowedRoles={allowedRoles}
      requiredPermissions={requiredPermissions}
    >
      {children}
    </ProtectedWorkspace>
  );
};
export default DynamicRoute;
