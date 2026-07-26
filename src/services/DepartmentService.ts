import { supabase } from './supabase';
import { AuditLogger } from './AuditLogger';

export interface DepartmentRecord {
  id: string;
  campus_id: string;
  tenant_id: string;
  name: string;
  code: string;
  head_user_id: string | null;
  status: 'ACTIVE' | 'INACTIVE' | 'ARCHIVED';
  created_at: string;
  staff_count?: number;
}

export type Department = DepartmentRecord;

export class DepartmentService {
  static async getDepartments(tenantId: string): Promise<DepartmentRecord[]> {
    const { data, error } = await supabase
      .from('departments')
      .select(`
        *,
        campus:campuses(name)
      `)
      .eq('tenant_id', tenantId);

    if (error) {
      if (error.code !== '42P01') console.error('Error fetching departments:', error);
      return [];
    }
    return data || [];
  }

  static async getCampusDepartments(campusId: string, tenantId: string): Promise<DepartmentRecord[]> {
    const { data, error } = await supabase
      .from('departments')
      .select('*')
      .eq('campus_id', campusId)
      .eq('tenant_id', tenantId);

    if (error) {
      if (error.code !== '42P01') console.error('Error fetching campus departments:', error);
      return [];
    }
    return data || [];
  }

  static async createDepartment(dept: Partial<DepartmentRecord>, tenantId: string) {
    const { data, error } = await supabase
      .from('departments')
      .insert([{ ...dept, tenant_id: tenantId }])
      .select()
      .single();

    if (!error) {
      AuditLogger.log({
        eventType: 'DEPARTMENT_CREATED',
        details: `Department ${dept.name} created`,
        userId: tenantId
      });
    }
    return { data, error };
  }
}
