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

const isUuid = (val: string): boolean => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(val);
};

const getMockDepartments = (tenantId: string): DepartmentRecord[] => [
  {
    id: 'dept-1',
    campus_id: 'mock-campus-1',
    tenant_id: tenantId,
    name: 'School of Science & Tech',
    code: 'SCI-01',
    head_user_id: 'Dr. Alan Turing',
    status: 'ACTIVE',
    staff_count: 22,
    created_at: new Date().toISOString()
  },
  {
    id: 'dept-2',
    campus_id: 'mock-campus-1',
    tenant_id: tenantId,
    name: 'Humanities & Social Studies',
    code: 'HUM-01',
    head_user_id: 'Prof. Maya Angelou',
    status: 'ACTIVE',
    staff_count: 18,
    created_at: new Date().toISOString()
  },
  {
    id: 'dept-3',
    campus_id: 'mock-campus-1',
    tenant_id: tenantId,
    name: 'Mathematics & Computing',
    code: 'MTH-01',
    head_user_id: 'Dr. Katherine Johnson',
    status: 'ACTIVE',
    staff_count: 16,
    created_at: new Date().toISOString()
  },
  {
    id: 'dept-4',
    campus_id: 'mock-campus-2',
    tenant_id: tenantId,
    name: 'Applied Robotics & Engineering',
    code: 'ROB-01',
    head_user_id: 'Dr. Grace Hopper',
    status: 'ACTIVE',
    staff_count: 14,
    created_at: new Date().toISOString()
  },
  {
    id: 'dept-5',
    campus_id: 'mock-campus-2',
    tenant_id: tenantId,
    name: 'Information Technology & AI',
    code: 'ITA-01',
    head_user_id: 'Prof. Claude Shannon',
    status: 'ACTIVE',
    staff_count: 12,
    created_at: new Date().toISOString()
  }
];

export class DepartmentService {
  static async getDepartments(tenantId: string): Promise<DepartmentRecord[]> {
    if (!isUuid(tenantId)) {
      return getMockDepartments(tenantId);
    }

    try {
      const { data, error } = await supabase
        .from('departments')
        .select(`
          *,
          campus:campuses(name)
        `)
        .eq('tenant_id', tenantId);

      if (error) {
        const isPlaceholder = (supabase as any).supabaseUrl?.includes('placeholder.supabase.co');
        if (error.code !== '42P01' && !isPlaceholder) console.error('Error fetching departments:', error);
        return getMockDepartments(tenantId);
      }

      if (!data || data.length === 0) {
        return getMockDepartments(tenantId);
      }

      return data;
    } catch (e) {
      return getMockDepartments(tenantId);
    }
  }

  static async getCampusDepartments(campusId: string, tenantId: string): Promise<DepartmentRecord[]> {
    if (!isUuid(tenantId) || !isUuid(campusId)) {
      return getMockDepartments(tenantId).filter(d => d.campus_id === campusId || campusId.startsWith('mock-'));
    }

    try {
      const { data, error } = await supabase
        .from('departments')
        .select('*')
        .eq('campus_id', campusId)
        .eq('tenant_id', tenantId);

      if (error) {
        const isPlaceholder = (supabase as any).supabaseUrl?.includes('placeholder.supabase.co');
        if (error.code !== '42P01' && !isPlaceholder) console.error('Error fetching campus departments:', error);
        return getMockDepartments(tenantId).filter(d => d.campus_id === campusId);
      }
      return data || [];
    } catch (e) {
      return getMockDepartments(tenantId).filter(d => d.campus_id === campusId);
    }
  }

  static async createDepartment(dept: Partial<DepartmentRecord>, tenantId: string) {
    if (!isUuid(tenantId)) {
      const newDept: DepartmentRecord = {
        id: dept.id || `dept-${Date.now()}`,
        campus_id: dept.campus_id || 'mock-campus-1',
        tenant_id: tenantId,
        name: dept.name || 'New Department',
        code: dept.code || 'DEPT-00',
        head_user_id: dept.head_user_id || null,
        status: dept.status || 'ACTIVE',
        created_at: new Date().toISOString(),
        staff_count: dept.staff_count || 10
      };
      AuditLogger.log({
        eventType: 'DEPARTMENT_CREATED',
        details: `Department ${dept.name} created`,
        userId: tenantId
      });
      return { data: newDept, error: null };
    }

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

