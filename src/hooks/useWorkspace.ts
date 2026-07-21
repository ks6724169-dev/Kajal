import { useState, useEffect } from 'react';
import { workspaceStore, WorkspaceState, WorkspaceConfig } from '../store/workspaceStore';
import { Role } from '../types';

export function useWorkspace() {
  const [state, setState] = useState<WorkspaceState>(workspaceStore.getState());

  useEffect(() => {
    const unsubscribe = workspaceStore.subscribe((newState) => {
      setState(newState);
    });
    return () => unsubscribe();
  }, []);

  const switchWorkspace = (role: Role) => {
    workspaceStore.switchWorkspace(role);
  };

  const setRoleWorkspaces = (primaryRole: Role, allRoles: Role[]) => {
    workspaceStore.setRoleWorkspaces(primaryRole, allRoles);
  };

  return {
    activeWorkspaceId: state.activeWorkspaceId,
    currentWorkspace: state.currentWorkspace,
    availableWorkspaces: state.availableWorkspaces,
    switchWorkspace,
    setRoleWorkspaces
  };
}
