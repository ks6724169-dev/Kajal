import { useState, useEffect } from 'react';
import { tenantStore, TenantState } from '../store/tenantStore';

export function useTenant() {
  const [state, setState] = useState<TenantState>(tenantStore.getState());

  useEffect(() => {
    const unsubscribe = tenantStore.subscribe((newState) => {
      setState(newState);
    });
    return () => unsubscribe();
  }, []);

  const selectTenant = (id: string) => {
    tenantStore.selectTenant(id);
  };

  const selectTenantByCode = (code: string): Promise<boolean> => {
    return tenantStore.selectTenantByCode(code);
  };

  return {
    tenants: state.tenants,
    currentTenant: state.currentTenant,
    branding: state.branding,
    isLoading: state.isLoading,
    selectTenant,
    selectTenantByCode
  };
}
