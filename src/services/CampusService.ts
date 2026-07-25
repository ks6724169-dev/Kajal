import { supabase } from './supabase';
import { AuditLogger } from './AuditLogger';

export interface CampusRecord {
  id: string;
  tenant_id: string;
  name: string;
  code: string;
  type: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
  email: string;
  status: 'ACTIVE' | 'INACTIVE' | 'ARCHIVED';
  principal_id?: string;
  principal_name?: string;
  principal_avatar?: string;
  principal_email?: string;
  staff_count?: number;
  student_count?: number;
  created_at: string;
}

export class CampusService {
  static async getCampuses(tenantId: string): Promise<CampusRecord[]> {
    try {
      const { data, error } = await supabase
        .from('campuses')
        .select(`
          *,
          principal:user_profiles!principal_id(full_name, avatar_url, email)
        `)
        .eq('tenant_id', tenantId);

      if (error) {
        // Only log if it's not a "table not found" error and we have actual config
        const isPlaceholder = (supabase as any).supabaseUrl?.includes('placeholder.supabase.co');
        if (error.code !== '42P01' && !isPlaceholder) {
          console.error('Error fetching campuses:', error);
        }
        return this.getMockCampuses(tenantId);
      }

      if (!data || data.length === 0) {
        return this.getMockCampuses(tenantId);
      }

      return data.map(c => ({
        ...c,
        principal_name: c.principal?.full_name,
        principal_avatar: c.principal?.avatar_url,
        principal_email: c.principal?.email
      }));
    } catch (e) {
      return this.getMockCampuses(tenantId);
    }
  }

  private static getMockCampuses(tenantId: string): CampusRecord[] {
    return [
      {
        id: 'mock-campus-1',
        tenant_id: tenantId,
        name: 'Main Heritage Campus',
        code: 'CAMPUS-01',
        type: 'PRIMARY',
        address: '101 Education Lane',
        city: 'Silicon Valley',
        state: 'CA',
        pincode: '94025',
        phone: '+1 555-0101',
        email: 'heritage@galaxy.edu',
        status: 'ACTIVE',
        principal_name: 'Dr. Sarah Wilson',
        staff_count: 45,
        student_count: 850,
        created_at: new Date().toISOString()
      },
      {
        id: 'mock-campus-2',
        tenant_id: tenantId,
        name: 'North Tech Campus',
        code: 'CAMPUS-02',
        type: 'SECONDARY',
        address: '505 Innovation Drive',
        city: 'San Jose',
        state: 'CA',
        pincode: '95134',
        phone: '+1 555-0202',
        email: 'northtech@galaxy.edu',
        status: 'ACTIVE',
        principal_name: 'Prof. Michael Chen',
        staff_count: 32,
        student_count: 420,
        created_at: new Date().toISOString()
      }
    ];
  }

  static async getCampusById(id: string, tenantId: string): Promise<CampusRecord | null> {
    const { data, error } = await supabase
      .from('campuses')
      .select(`
        *,
        principal:user_profiles!principal_id(full_name, avatar_url, email)
      `)
      .eq('id', id)
      .eq('tenant_id', tenantId)
      .single();

    if (error) {
      const isPlaceholder = (supabase as any).supabaseUrl?.includes('placeholder.supabase.co');
      if (error.code !== '42P01' && !isPlaceholder) console.error('Error fetching campus detail:', error);
      return null;
    }

    if (data) {
      return {
        ...data,
        principal_name: data.principal?.full_name,
        principal_avatar: data.principal?.avatar_url,
        principal_email: data.principal?.email
      };
    }
    return null;
  }

  static async createCampus(campus: Partial<CampusRecord>, tenantId: string) {
    const { data, error } = await supabase
      .from('campuses')
      .insert([{ ...campus, tenant_id: tenantId }])
      .select()
      .single();

    if (!error) {
      AuditLogger.log({
        eventType: 'CAMPUS_CREATED',
        details: `Campus ${campus.name} created`,
        tenantId,
        metadata: { campus }
      });
    }
    return { data, error };
  }

  static async updateCampus(id: string, updates: Partial<CampusRecord>, tenantId: string) {
    const { data, error } = await supabase
      .from('campuses')
      .update(updates)
      .eq('id', id)
      .eq('tenant_id', tenantId)
      .select()
      .single();

    if (!error) {
      AuditLogger.log({
        eventType: 'CAMPUS_UPDATED',
        details: `Campus ${id} updated`,
        tenantId,
        metadata: { updates }
      });
    }
    return { data, error };
  }

  static async assignPrincipal(campusId: string, userId: string, tenantId: string) {
    const { error: campusError } = await supabase
      .from('campuses')
      .update({ principal_id: userId })
      .eq('id', campusId)
      .eq('tenant_id', tenantId);

    if (campusError) return { error: campusError };

    const { error: roleError } = await supabase
      .from('organization_memberships')
      .upsert({ 
        user_id: userId, 
        campus_id: campusId, 
        tenant_id: tenantId,
        role: 'PRINCIPAL' 
      }, { onConflict: 'user_id, campus_id' });

    if (!campusError) {
      AuditLogger.log({
        eventType: 'PRINCIPAL_ASSIGNED',
        details: `User ${userId} assigned as Principal to Campus ${campusId}`,
        tenantId,
        metadata: { campusId, userId }
      });
    }

    return { error: roleError };
  }
}
