import { Tenant } from '../types';
import { TenantManager, TenantBranding } from './TenantManager';
import { TENANTS } from '../constants/mockData';

export interface TenantContext {
  tenantId: string;
  schoolCode: string;
  name: string;
  logo: string;
  themeColor: string;
  type: string;
  city?: string;
  state?: string;
  academicYear: string;
  branding?: TenantBranding;
}

export class TenantResolutionService {
  /**
   * Resolves tenant and branding context based on a school code from backend API.
   */
  static async resolveBySchoolCode(code: string): Promise<TenantContext | null> {
    try {
      const response = await fetch(`/api/tenants/resolve/${encodeURIComponent(code)}`);
      
      if (!response.ok) {
        if (response.status === 404) return null;
        throw new Error(`Failed to resolve tenant: ${response.statusText}`);
      }
      
      const data = await response.json();
      return data.tenant;
    } catch (error) {
      console.error('Tenant resolution error:', error);
      
      // Fallback to local mock discover if backend fails
      const tenant = await TenantManager.discoverTenantFromSchoolCode(code);
      if (!tenant) return null;

      const branding = TenantManager.getTenantBranding(tenant);
      return {
        tenantId: tenant.id,
        schoolCode: tenant.schoolCode || code,
        name: tenant.name,
        logo: branding.logo,
        themeColor: tenant.themeColor,
        type: tenant.type,
        city: tenant.city,
        state: tenant.state,
        academicYear: tenant.academicYear,
        branding
      };
    }
  }

  /**
   * Validates if a school code is active and exists.
   */
  static async validateSchoolCode(code: string): Promise<boolean> {
    const context = await this.resolveBySchoolCode(code);
    return context !== null;
  }

  /**
   * Resolves context from hostname domain.
   */
  static async resolveByDomain(hostname: string): Promise<TenantContext | null> {
    const tenant = await TenantManager.discoverTenantFromDomain(hostname);
    if (!tenant) return null;

    const branding = TenantManager.getTenantBranding(tenant);
    return {
      tenantId: tenant.id,
      schoolCode: tenant.schoolCode || '',
      name: tenant.name,
      logo: branding.logo,
      themeColor: tenant.themeColor,
      type: tenant.type,
      city: tenant.city,
      state: tenant.state,
      academicYear: tenant.academicYear,
      branding
    };
  }

  /**
   * Searches schools by multiple search criteria (code, name, city, state, board/type).
   */
  static searchSchools(query: string): Tenant[] {
    const cleanQuery = query.trim().toLowerCase();
    if (!cleanQuery) return TENANTS;

    return TENANTS.filter((t) => {
      const matchCode = t.schoolCode?.toLowerCase().includes(cleanQuery);
      const matchName = t.name.toLowerCase().includes(cleanQuery);
      const matchCity = t.city?.toLowerCase().includes(cleanQuery);
      const matchState = t.state?.toLowerCase().includes(cleanQuery);
      const matchType = t.type.toLowerCase().includes(cleanQuery);
      return matchCode || matchName || matchCity || matchState || matchType;
    });
  }
}
