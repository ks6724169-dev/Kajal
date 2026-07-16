import { useState, useCallback } from 'react';
import { useTenant } from '../../core/tenant/TenantContext';

export const useTenantSwitcher = () => {
  const { switchTenant, resolveFromUrl } = useTenant();
  const [isSwitching, setIsSwitching] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const handleSwitch = useCallback(async (orgId: string, schoolId?: string) => {
    setIsSwitching(true);
    setError(null);
    try {
      await switchTenant(orgId, schoolId);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Tenant switch failed'));
    } finally {
      setIsSwitching(false);
    }
  }, [switchTenant]);

  return {
    handleSwitch,
    isSwitching,
    error,
    resolveFromUrl
  };
};
