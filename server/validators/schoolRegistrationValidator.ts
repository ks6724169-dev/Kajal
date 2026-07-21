import { z } from 'zod';

export const startRegistrationSchema = z.object({
  schoolName: z.string().min(3, "School name must be at least 3 characters").max(255),
  schoolType: z.string().optional(),
  schoolCategory: z.string().optional(),
  board: z.string().min(2, "Invalid board selection"),
  establishmentYear: z.number().min(1800).max(new Date().getFullYear()),
  country: z.string().default('India'),
  state: z.string().min(2, "State is required"),
  district: z.string().min(2, "District is required"),
  city: z.string().min(2, "City is required"),
  pincode: z.string().regex(/^\d{6}$/, "Invalid pin code"),
  address: z.string().min(5, "Address is too short"),
});

export const updateRegistrationSchema = startRegistrationSchema.partial().extend({
  registrationId: z.string().uuid(),
});
