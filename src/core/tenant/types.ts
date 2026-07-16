import { Organization, School, Campus, AcademicSession } from '../../types/database/entities';

export interface TenantState {
  organization: Organization | null;
  school: School | null;
  campus: Campus | null;
  academicSession: AcademicSession | null;
  isLoading: boolean;
  error: Error | null;
}

export interface TenantContextValue extends TenantState {
  setOrganization: (org: Organization | null) => void;
  setSchool: (school: School | null) => void;
  setCampus: (campus: Campus | null) => void;
  setAcademicSession: (session: AcademicSession | null) => void;
  switchTenant: (orgId: string, schoolId?: string) => Promise<void>;
  resolveFromUrl: (url: string) => Promise<void>;
}
