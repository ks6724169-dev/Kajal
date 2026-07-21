import { Tenant } from '../types';
import { TENANTS } from '../constants/mockData';

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
    return TENANTS;
  }

  static async findTenantById(id: string): Promise<Tenant | null> {
    const tenants = await this.getTenants();
    return tenants.find((t) => t.id === id) || null;
  }

  static async discoverTenantFromDomain(hostname: string): Promise<Tenant | null> {
    // E.g. apex.galaxy.edu maps to apex_k12
    const tenants = await this.getTenants();
    if (hostname.includes('apex')) {
      return tenants[0];
    } else if (hostname.includes('tech') || hostname.includes('sciences')) {
      return tenants[1];
    } else if (hostname.includes('xavier')) {
      return tenants[2];
    }
    return null;
  }

  static async discoverTenantFromSchoolCode(code: string): Promise<Tenant | null> {
    const tenants = await this.getTenants();
    const cleanCode = code.trim().toLowerCase();
    
    if (cleanCode === 'apex' || cleanCode === 'apex12' || cleanCode === 'apex_k12') {
      return tenants[0];
    } else if (cleanCode === 'galaxy' || cleanCode === 'git' || cleanCode === 'galaxy_tech') {
      return tenants[1];
    } else if (cleanCode === 'xavier' || cleanCode === 'stx' || cleanCode === 'st_xaviers') {
      return tenants[2];
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
