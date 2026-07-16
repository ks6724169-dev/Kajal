import { z } from 'zod';

export const AddressSchema = z.object({
  addressLine1: z.string().min(5),
  addressLine2: z.string().optional(),
  cityId: z.string().uuid(),
  stateId: z.string().uuid(),
  countryId: z.string().uuid(),
  postalCode: z.string().min(4),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
});

export const OrganizationSchema = z.object({
  name: z.string().min(3),
  code: z.string().min(2),
  registrationNumber: z.string(),
  taxId: z.string().optional(),
  address: AddressSchema,
  contactEmail: z.string().email(),
  contactPhone: z.string().min(10),
  website: z.string().url().optional()
});

export const CampusSchema = z.object({
  name: z.string().min(3),
  code: z.string().min(2),
  type: z.enum(['MAIN', 'BRANCH', 'SATELLITE']),
  address: AddressSchema,
  capacity: z.number().min(0)
});
