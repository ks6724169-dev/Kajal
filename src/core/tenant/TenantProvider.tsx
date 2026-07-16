import React, { useState, useEffect, ReactNode } from 'react';
import { TenantContext } from './TenantContext';
import { Organization, School, Campus, AcademicSession } from '../../types/database/entities';

interface TenantProviderProps {
  children: ReactNode;
}

export const TenantProvider: React.FC<TenantProviderProps> = ({ children }) => {
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [school, setSchool] = useState<School | null>(null);
  const [campus, setCampus] = useState<Campus | null>(null);
  const [academicSession, setAcademicSession] = useState<AcademicSession | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const switchTenant = async (orgId: string, schoolId?: string) => {
    setIsLoading(true);
    try {
      // Placeholder for fetching tenant details
      console.log(`Switching tenant to org: ${orgId}, school: ${schoolId}`);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to switch tenant'));
    } finally {
      setIsLoading(false);
    }
  };

  const resolveFromUrl = async (url: string) => {
    setIsLoading(true);
    try {
      // Placeholder for URL resolution logic
      console.log(`Resolving tenant from URL: ${url}`);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to resolve tenant from URL'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setIsLoading(false);
  }, []);

  const value = {
    organization,
    school,
    campus,
    academicSession,
    isLoading,
    error,
    setOrganization,
    setSchool,
    setCampus,
    setAcademicSession,
    switchTenant,
    resolveFromUrl,
  };

  return (
    <TenantContext.Provider value={value}>
      {children}
    </TenantContext.Provider>
  );
};
