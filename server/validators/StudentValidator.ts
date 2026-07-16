import { z } from 'zod';
import { StudentStatus } from '../entities/StudentDomain.js';
import { AddressSchema } from './MasterDataValidator.js';

export const ParentSchema = z.object({
  type: z.enum(['FATHER', 'MOTHER', 'GUARDIAN']),
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  email: z.string().email().optional(),
  phone: z.string().min(10),
  occupation: z.string().optional(),
  isEmergencyContact: z.boolean().default(false),
  isPickupAuthorized: z.boolean().default(false)
});

export const StudentSchema = z.object({
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  admissionNumber: z.string(),
  aadhaar: z.string().optional(),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER']),
  dateOfBirth: z.string().transform((val) => new Date(val)),
  academicStatus: z.nativeEnum(StudentStatus).default(StudentStatus.ENQUIRY),
  parents: z.array(ParentSchema).optional(),
  address: AddressSchema.optional()
});
