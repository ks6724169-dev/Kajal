import { useState, useEffect } from 'react';
import { authStore, AuthState } from '../store/authStore';
import { AuthService } from '../services/AuthService';
import { Role } from '../types';

export function useAuth() {
  const [state, setState] = useState<AuthState>(authStore.getState());
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = authStore.subscribe((newState) => {
      setState(newState);
    });
    return () => unsubscribe();
  }, []);

  const login = async (
    email: string, 
    password: string, 
    rememberMe: boolean = false,
    tenantContext?: { tenantId: string; schoolCode: string; campus?: string }
  ) => {
    setIsLoading(true);
    try {
      const response = await AuthService.login(email, password, rememberMe, tenantContext);
      return response;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    authStore.logout();
  };

  const startRolePreview = (role: 'organization_owner' | 'principal' | 'vice_principal') => {
    authStore.startRolePreview(role);
  };

  const exitPreviewMode = () => {
    authStore.exitPreviewMode();
  };

  return {
    user: state.user,
    isAuthenticated: state.isAuthenticated,
    isLoading: state.isLoading || isLoading,
    permissions: state.permissions,
    previewConfig: state.previewConfig,
    login,
    logout,
    startRolePreview,
    exitPreviewMode
  };
}
