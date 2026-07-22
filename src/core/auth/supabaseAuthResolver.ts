import { supabase } from '../../services/supabase';
import { Role } from '../../types';

export interface ResolvedUserAuth {
  id: string;
  email: string;
  name: string;
  role: Role;
  schoolId: string;
  tenantId: string;
  status: string;
  schoolStatus: string;
  schoolName?: string;
  campus?: string;
}

export async function resolveUserTenantAndRole(
  authUserId: string,
  email: string,
  requestedSchoolId: string
): Promise<{ success: boolean; data?: ResolvedUserAuth; error?: string }> {
  const cleanEmail = email.trim().toLowerCase();
  const cleanSchoolId = requestedSchoolId.trim().toUpperCase();

  try {
    // 1. Database Lookup for User Profile / Identity
    let userRecord: any = null;

    // Check 'identities' table first
    try {
      const { data } = await supabase
        .from('identities')
        .select('*')
        .or(`id.eq.${authUserId},user_id.eq.${authUserId},email.eq.${cleanEmail}`)
        .eq('is_deleted', false)
        .maybeSingle();
      if (data) userRecord = data;
    } catch (e) {
      // Table might not exist or schema variation
    }

    // Check 'universal_user' table if not found
    if (!userRecord) {
      try {
        const { data } = await supabase
          .from('universal_user')
          .select('*')
          .or(`id.eq.${authUserId},email.eq.${cleanEmail}`)
          .maybeSingle();
        if (data) userRecord = data;
      } catch (e) {
        // Ignore
      }
    }

    // Check 'users' table if not found
    if (!userRecord) {
      try {
        const { data } = await supabase
          .from('users')
          .select('*')
          .or(`id.eq.${authUserId},email.eq.${cleanEmail}`)
          .maybeSingle();
        if (data) userRecord = data;
      } catch (e) {
        // Ignore
      }
    }

    // Account Status Verification
    const userStatus = (userRecord?.status || userRecord?.user_status || 'active').toLowerCase();
    if (userStatus === 'inactive' || userStatus === 'suspended' || userStatus === 'blocked' || userStatus === 'locked') {
      return {
        success: false,
        error: 'Your user account is inactive or suspended. Please contact your school administrator.'
      };
    }

    // 2. Database Lookup for School / Tenant
    let schoolRecord: any = null;

    try {
      const { data } = await supabase
        .from('schools')
        .select('*')
        .or(`code.ilike.${cleanSchoolId},id.eq.${requestedSchoolId},school_unique_id.ilike.${cleanSchoolId}`)
        .eq('is_deleted', false)
        .maybeSingle();
      if (data) schoolRecord = data;
    } catch (e) {
      // Ignore
    }

    if (!schoolRecord) {
      try {
        const { data } = await supabase
          .from('tenant_registry')
          .select('*')
          .or(`tenant_code.ilike.${cleanSchoolId},id.eq.${requestedSchoolId}`)
          .maybeSingle();
        if (data) schoolRecord = data;
      } catch (e) {
        // Ignore
      }
    }

    if (!schoolRecord) {
      try {
        const { data } = await supabase
          .from('organizations')
          .select('*')
          .or(`slug.ilike.${cleanSchoolId},id.eq.${requestedSchoolId}`)
          .eq('is_deleted', false)
          .maybeSingle();
        if (data) schoolRecord = data;
      } catch (e) {
        // Ignore
      }
    }

    // Verify user's registered school matches requested School ID
    if (userRecord && userRecord.school_id && schoolRecord) {
      if (userRecord.school_id !== schoolRecord.id && userRecord.tenant_id !== schoolRecord.id) {
        return {
          success: false,
          error: 'Invalid credentials or School ID mismatch for this account.'
        };
      }
    }

    // School Status Verification
    const schoolStatus = (schoolRecord?.status || 'active').toLowerCase();
    if (schoolStatus === 'inactive' || schoolStatus === 'suspended') {
      return {
        success: false,
        error: 'The school enterprise workspace is currently inactive or suspended.'
      };
    }

    // 3. Authoritative Role Resolution
    // NEVER use user_metadata as authorization source.
    // Read strictly from database column (identities.role, universal_user.user_type, users.role_id, etc.)
    const rawRole = (userRecord?.role || userRecord?.user_type || userRecord?.role_id || 'teacher').toLowerCase();

    const validRoles: Role[] = [
      'super_admin', 'organization_owner', 'school_admin', 'principal',
      'vice_principal', 'teacher', 'class_teacher', 'accountant', 'hr',
      'receptionist', 'transport_manager', 'hostel_manager', 'librarian',
      'student', 'parent', 'exam_controller', 'inventory_manager', 'guest', 'driver'
    ];

    const authoritativeRole: Role = validRoles.includes(rawRole as Role)
      ? (rawRole as Role)
      : 'teacher';

    const resolvedName = userRecord?.full_name || userRecord?.name || userRecord?.email?.split('@')[0] || cleanEmail.split('@')[0];
    const resolvedSchoolCode = schoolRecord?.code || schoolRecord?.tenant_code || schoolRecord?.slug || cleanSchoolId;

    return {
      success: true,
      data: {
        id: authUserId,
        email: cleanEmail,
        name: resolvedName,
        role: authoritativeRole,
        schoolId: resolvedSchoolCode,
        tenantId: schoolRecord?.id || resolvedSchoolCode,
        status: userStatus,
        schoolStatus,
        schoolName: schoolRecord?.name,
        campus: userRecord?.campus || 'Main Campus'
      }
    };
  } catch (err: any) {
    console.error('Error resolving user tenant and role:', err);
    return {
      success: false,
      error: 'Failed to verify school membership and permissions.'
    };
  }
}
