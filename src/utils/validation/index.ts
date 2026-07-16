import { z } from 'zod';

export const BaseEntitySchema = z.object({
  id: z.string().uuid(),
});

export const AuditableEntitySchema = BaseEntitySchema.extend({
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
  created_by: z.string().uuid().nullable().optional(),
  updated_by: z.string().uuid().nullable().optional(),
});

export const SoftDeletableEntitySchema = AuditableEntitySchema.extend({
  is_deleted: z.boolean().default(false),
  deleted_at: z.string().datetime().nullable().optional(),
  deleted_by: z.string().uuid().nullable().optional(),
});

export const TenantEntitySchema = SoftDeletableEntitySchema.extend({
  organization_id: z.string().uuid(),
});

// Examples of Specific Validations
export const OrganizationSchema = AuditableEntitySchema.extend({
  name: z.string().min(2).max(255),
  slug: z.string().min(2).max(255),
  logo_url: z.string().url().nullable().optional(),
  status: z.enum(['active', 'inactive', 'suspended']),
});

export const UserSchema = TenantEntitySchema.extend({
  email: z.string().email(),
  phone: z.string().max(20).nullable().optional(),
  full_name: z.string().min(2).max(255),
  avatar_url: z.string().url().nullable().optional(),
  role_id: z.string().uuid(),
  status: z.enum(['active', 'inactive', 'blocked']),
});

export const StudentSchema = TenantEntitySchema.extend({
  user_id: z.string().uuid(),
  school_id: z.string().uuid(),
  class_id: z.string().uuid(),
  section_id: z.string().uuid(),
  admission_number: z.string().min(1).max(50),
  roll_number: z.string().min(1).max(50),
  dob: z.string().date(),
  gender: z.enum(['male', 'female', 'other']),
  blood_group: z.string().max(10).nullable().optional(),
});
