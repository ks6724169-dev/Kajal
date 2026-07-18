import { z } from 'zod';

export const CreateParentSchema = z.object({
  family_id: z.string().uuid().optional(),
  type: z.enum(['FATHER', 'MOTHER', 'GUARDIAN']),
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  email: z.string().email().optional(),
  phone: z.string().min(10),
  occupation: z.string().optional(),
  isEmergencyContact: z.boolean().default(false),
  isPickupAuthorized: z.boolean().default(false)
});

export const UpdateParentSchema = CreateParentSchema.partial();

export const GuardianSchema = z.object({
  parent_id: z.string().uuid(),
  relationToStudent: z.string().min(2),
  isLegalGuardian: z.boolean().default(false),
  custodyStatus: z.string().optional(),
  verificationStatus: z.enum(['PENDING', 'VERIFIED', 'REJECTED']).default('PENDING')
});

export const EmergencyContactSchema = z.object({
  student_id: z.string().uuid().optional(),
  parent_id: z.string().uuid().optional(),
  name: z.string().min(2),
  relationship: z.string().min(2),
  phone: z.string().min(10),
  alternatePhone: z.string().optional(),
  priority: z.number().int().min(1)
});

export const PickupAuthorizationSchema = z.object({
  student_id: z.string().uuid().optional(),
  parent_id: z.string().uuid().optional(),
  authorizedName: z.string().min(2),
  relationship: z.string().min(2),
  phone: z.string().min(10),
  photoUrl: z.string().url().optional(),
  idCardNumber: z.string().optional(),
  validFrom: z.string().transform((val) => new Date(val)),
  validTo: z.string().transform((val) => new Date(val))
});

export const StudentParentRelationSchema = z.object({
  student_id: z.string().uuid(),
  parent_id: z.string().uuid(),
  relationshipType: z.string().min(2),
  isPrimaryContact: z.boolean().default(false),
  isBillingContact: z.boolean().default(false),
  hasAcademicAccess: z.boolean().default(true)
});

export const FamilySchema = z.object({
  name: z.string().min(3),
  householdAddress: z.object({
    addressLine1: z.string().min(5),
    addressLine2: z.string().optional(),
    cityId: z.string().uuid(),
    stateId: z.string().uuid(),
    countryId: z.string().uuid(),
    postalCode: z.string().min(4)
  }).optional()
});

export const FamilyAddressSchema = z.object({
  family_id: z.string().uuid(),
  addressLine1: z.string().min(5),
  addressLine2: z.string().optional(),
  city: z.string().min(2),
  state: z.string().min(2),
  country: z.string().min(2),
  postalCode: z.string().min(4),
  isPrimary: z.boolean().default(true)
});

export const HouseholdMemberSchema = z.object({
  family_id: z.string().uuid(),
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  relationToHead: z.string().min(2),
  dateOfBirth: z.string().transform((val) => new Date(val)).optional(),
  gender: z.string().optional()
});

export const ParentNotificationPreferenceSchema = z.object({
  parent_id: z.string().uuid(),
  channel: z.enum(['EMAIL', 'SMS', 'PUSH', 'PORTAL']),
  allowAcademicAlerts: z.boolean().default(true),
  allowAttendanceAlerts: z.boolean().default(true),
  allowFinanceAlerts: z.boolean().default(true),
  allowEmergencyAlerts: z.boolean().default(true)
});

export const DigitalConsentSchema = z.object({
  student_id: z.string().uuid(),
  parent_id: z.string().uuid(),
  consentType: z.string().min(2),
  isGranted: z.boolean(),
  ipAddress: z.string().optional()
});
