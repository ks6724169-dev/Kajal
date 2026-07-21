import React, { useEffect } from 'react';
import { useRole } from '../hooks/useRole';
import { useWorkspace } from '../hooks/useWorkspace';
import { Role } from '../types';
import { ProtectedWorkspace } from './ProtectedWorkspace';

interface WorkspaceRouteProps {
  role: Role;
  children: React.ReactNode;
}

export const WorkspaceRoute: React.FC<WorkspaceRouteProps> = ({ role, children }) => {
  const { currentRole, changeRole } = useRole();
  const { setRoleWorkspaces } = useWorkspace();

  useEffect(() => {
    if (currentRole !== role) {
      changeRole(role);
      setRoleWorkspaces(role, [role]);
    }
  }, [role, currentRole]);

  return (
    <ProtectedWorkspace allowedRoles={[role]}>
      {children}
    </ProtectedWorkspace>
  );
};
export default WorkspaceRoute;
