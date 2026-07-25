import { z } from 'zod';

export const AddressSchema = z.union([
  z.string(),
  z.object({
    addressLine1: z.string().optional(),
    addressLine2: z.string().optional(),
    cityId: z.string().optional(),
    stateId: z.string().optional(),
    countryId: z.string().optional(),
    postalCode: z.string().optional(),
    latitude: z.number().optional(),
    longitude: z.number().optional(),
    street: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    pincode: z.string().optional(),
    country: z.string().optional(),
  }).passthrough()
]);

export const OrganizationSchema = z.object({
  name: z.string().min(3),
  code: z.string().min(2).optional(),
  registrationNumber: z.string().optional(),
  taxId: z.string().optional(),
  address: AddressSchema.optional(),
  contactEmail: z.string().email().optional(),
  contactPhone: z.string().optional(),
  website: z.string().optional()
});

export const CampusSchema = z.object({
  name: z.string().min(3),
  code: z.string().min(2).optional(),
  type: z.enum(['MAIN', 'BRANCH', 'SATELLITE']).optional(),
  address: AddressSchema.optional(),
  capacity: z.number().min(0).optional()
});
