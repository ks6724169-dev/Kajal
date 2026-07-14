import { Tenant } from '../../types';

export const normalizeSchoolCode = (schoolCode: string) => schoolCode.trim().toUpperCase().replace(/[^A-Z0-9]/g, '');

export const buildTenantFromAuthMetadata = (metadata: Record<string, unknown> | undefined, schoolCode: string): Tenant => {
  const normalizedSchoolCode = normalizeSchoolCode(schoolCode);
  const tenantId = String(metadata?.tenant_id ?? metadata?.school_id ?? normalizedSchoolCode.toLowerCase());

  return {
    id: tenantId,
    name: String(metadata?.tenant_name ?? metadata?.school_name ?? `School ${normalizedSchoolCode}`),
    type: (metadata?.tenant_type as Tenant['type']) ?? 'school',
    logo: String(metadata?.tenant_logo ?? '🏫'),
    currency: String(metadata?.currency ?? '₹'),
    academicYear: String(metadata?.academic_year ?? '2026-2027'),
    themeColor: String(metadata?.theme_color ?? 'indigo')
  };
};
