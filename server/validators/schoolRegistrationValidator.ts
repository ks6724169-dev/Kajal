import { z } from 'zod';

const schoolRegistrationBaseSchema = z.object({
  schoolName: z.string().max(255).optional(),
  schoolType: z.string().optional(),
  schoolCategory: z.string().optional(),
  board: z.string().optional(),
  establishmentYear: z.number().min(1800).max(new Date().getFullYear()).optional(),
  country: z.string().default('India').optional(),
  state: z.string().optional(),
  district: z.string().optional(),
  city: z.string().optional(),
  pincode: z.string().optional(),
  address: z.string().optional(),

  // New fields
  institutionName: z.string().max(255).optional(),
  institutionType: z.string().optional(),
  boardType: z.string().optional(),
  affiliationNumber: z.string().optional(),
  officialWebsite: z.string().optional(),
  officialEmail: z.string().optional(),
  officialPhone: z.string().optional(),
  postalCode: z.string().optional(),
  ownerName: z.string().optional(),
  administratorName: z.string().optional(),
  administratorDesignation: z.string().optional(),
  ownerEmail: z.string().optional(),
  ownerMobile: z.string().optional(),
  alternateMobile: z.string().optional(),
  logoUrl: z.string().optional(),
  shortName: z.string().optional(),
  primaryBrandColor: z.string().optional(),
  secondaryBrandColor: z.string().optional(),
});

export const startRegistrationSchema = schoolRegistrationBaseSchema.refine(data => {
  return !!(data.schoolName || data.institutionName);
}, {
  message: "Either schoolName or institutionName is required",
  path: ["institutionName"]
});

export const updateRegistrationSchema = schoolRegistrationBaseSchema.partial().extend({
  registrationId: z.string().uuid(),
});


