import { supabase } from './supabase';
import { AuditLogger } from './AuditLogger';

export interface InstitutionRecord {
  id: string;
  organization_id: string;
  tenant_id: string;
  name: string;
  registration_number: string;
  institution_type: string;
  established_year: number;
  official_email: string;
  official_phone: string;
  website: string;
  logo_url: string;
  metadata: any;
}

export interface AcademicSession {
  id: string;
  institution_id: string;
  tenant_id: string;
  session_name: string;
  start_date: string;
  end_date: string;
  is_active: boolean;
  status: 'UPCOMING' | 'ACTIVE' | 'COMPLETED' | 'ARCHIVED';
}

export interface Affiliation {
  id: string;
  institution_id: string;
  tenant_id: string;
  board_name: string;
  affiliation_number: string;
  valid_upto: string;
  status: string;
}

export class InstitutionService {
  static async getInstitution(tenantId: string): Promise<InstitutionRecord | null> {
    try {
      if (!tenantId) {
        return this.getMockInstitution('default');
      }

      const { data, error } = await supabase
        .from('institutions')
        .select('*')
        .eq('tenant_id', tenantId)
        .single();

      if (error) {
        return this.getMockInstitution(tenantId);
      }
      return data;
    } catch (e) {
      return this.getMockInstitution(tenantId);
    }
  }

  private static getMockInstitution(tenantId: string): InstitutionRecord {
    return {
      id: 'mock-inst',
      organization_id: 'mock-org',
      tenant_id: tenantId,
      name: 'Galaxy International School',
      registration_number: 'REG-2026-X89',
      institution_type: 'K-12 Education',
      established_year: 2010,
      official_email: 'admin@galaxy-edu.org',
      official_phone: '+1 800-GALAXY-0',
      website: 'www.galaxy-edu.org',
      logo_url: '',
      metadata: {
        board: 'Central Board of Education',
        current_session: '2026-27',
        dept_count: 8,
        user_count: 124,
        session_count: 3,
        role_count: 12,
        address: '123 Enterprise Way, Silicon Valley, CA',
        about: 'A leading educational institution focused on holistic development and academic excellence.'
      }
    };
  }

  static async updateInstitution(id: string, updates: Partial<InstitutionRecord>, tenantId: string) {
    const { data, error } = await supabase
      .from('institutions')
      .update(updates)
      .eq('id', id)
      .eq('tenant_id', tenantId);

    if (!error) {
      AuditLogger.log({
        eventType: 'INSTITUTION_UPDATED',
        details: `Institution ${id} updated`,
        userId: tenantId,
        metadata: { updates }
      });
    }
    return { data, error };
  }

  static async getSessions(tenantId: string): Promise<AcademicSession[]> {
    try {
      const { data, error } = await supabase
        .from('academic_sessions')
        .select('*')
        .eq('tenant_id', tenantId)
        .order('start_date', { ascending: false });

      if (error) {
        return [];
      }

      return data || [];
    } catch {
      return [];
    }
  }

  static async createSession(session: Partial<AcademicSession>, tenantId: string) {
    const { data, error } = await supabase
      .from('academic_sessions')
      .insert([{ ...session, tenant_id: tenantId }])
      .select()
      .single();

    if (!error) {
      AuditLogger.log({
        eventType: 'SESSION_CREATED',
        details: `Academic session ${session.session_name} created`,
        userId: tenantId
      });
    }
    return { data, error };
  }

  static async getAffiliations(tenantId: string): Promise<Affiliation[]> {
    try {
      const { data, error } = await supabase
        .from('affiliations')
        .select('*')
        .eq('tenant_id', tenantId);

      if (error) {
        return [];
      }

      return data || [];
    } catch {
      return [];
    }
  }
}
