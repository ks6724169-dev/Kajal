import { Tenant } from '../types';
import { TENANTS } from '../constants/mockData';
import { RealSchoolLookupService } from './RealSchoolLookupService';

export interface TenantBranding {
  primaryColor: string;
  themeClass: string;
  logo: string;
  name: string;
  language: 'en' | 'hi';
  timezone: string;
}

export class TenantManager {
  static async getTenants(): Promise<Tenant[]> {
    try {
      const realSchools = await RealSchoolLookupService.searchRealInstitutions({});
      return realSchools.map(s => ({
        id: s.id,
        name: s.name,
        schoolCode: s.code,
        type: s.type,
        city: s.city || '',
        state: s.state || '',
        academicYear: '2026-2027',
        themeColor: '#4f46e5',
        logo: s.logoUrl || ''
      }));
    } catch (err) {
      return TENANTS;
    }
  }

  static async findTenantById(id: string): Promise<Tenant | null> {
    const tenants = await this.getTenants();
    return tenants.find((t) => t.id === id) || null;
  }

  static async discoverTenantFromDomain(hostname: string): Promise<Tenant | null> {
    // E.g. apex.galaxy.edu maps to a school from Supabase
    // In a real scenario, we'd look up the domain in the database.
    // For Phase 7, since we might not have custom domains setup in DB yet,
    // we return null so the user is forced to enter the school code in login page.
    return null;
  }

  static async discoverTenantFromSchoolCode(code: string): Promise<Tenant | null> {
    const cleanCode = code.trim().toLowerCase();
    
    // First: Check live Supabase Database Registry
    try {
      const realSchools = await RealSchoolLookupService.searchRealInstitutions({ searchTerm: cleanCode });
      if (realSchools.length > 0) {
        const match = realSchools.find((s) => s.code.toLowerCase() === cleanCode || s.id.toLowerCase() === cleanCode) || realSchools[0];
        return {
          id: match.id,
          name: match.name,
          schoolCode: match.code,
          type: match.type as 'school' | 'college' | 'university' | 'academy',
          city: match.city || '',
          state: match.state || '',
          academicYear: '2026-2027',
          themeColor: '#4f46e5',
          logo: match.logoUrl || ''
        };
      }
    } catch (err) {
      console.warn('Live database lookup error in TenantManager:', err);
    }
    
    return null;
  }

  static getTenantBranding(tenant: Tenant): TenantBranding {
    const defaultBranding: Record<string, TenantBranding> = {
      apex_k12: {
        primaryColor: '#4f46e5', // indigo-600
        themeClass: 'indigo',
        logo: '🎓',
        name: 'Apex International K-12',
        language: 'en',
        timezone: 'Asia/Kolkata'
      },
      galaxy_tech: {
        primaryColor: '#7c3aed', // violet-600
        themeClass: 'violet',
        logo: '🚀',
        name: 'Galaxy Institute of Technology',
        language: 'en',
        timezone: 'Asia/Kolkata'
      },
      st_xaviers: {
        primaryColor: '#2563eb', // blue-600
        themeClass: 'blue',
        logo: '🏛️',
        name: 'St. Xavier Public Academy',
        language: 'hi',
        timezone: 'Asia/Kolkata'
      }
    };

    return defaultBranding[tenant.id] || {
      primaryColor: '#4f46e5',
      themeClass: 'indigo',
      logo: '🌐',
      name: tenant.name,
      language: 'en',
      timezone: 'UTC'
    };
  }
}
