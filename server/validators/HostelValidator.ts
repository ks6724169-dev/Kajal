import { z } from 'zod';

export const RegisterHostelSchema = z.object({
  hostelName: z.string().min(1),
  hostelType: z.string().optional(),
  capacity: z.number().int().positive().optional(),
  address: z.string().optional(),
  contactNumber: z.string().optional()
});

export const RegisterRoomSchema = z.object({
  floorId: z.string().uuid(),
  roomNumber: z.string().min(1),
  roomType: z.string().optional(),
  capacity: z.number().int().positive(),
  baseFee: z.number().nonnegative().optional()
});

export const AllocateBedSchema = z.object({
  studentId: z.string().uuid(),
  bedId: z.string().uuid(),
  startDate: z.string().date(),
  endDate: z.string().date().optional()
});

export const TransferRoomSchema = z.object({
  allocationId: z.string().uuid(),
  toBedId: z.string().uuid(),
  transferDate: z.string().date(),
  reason: z.string().optional()
});

export const ApplyLeaveSchema = z.object({
  studentId: z.string().uuid(),
  startDate: z.string().date(),
  endDate: z.string().date(),
  reason: z.string().optional()
});

export const RegisterVisitorSchema = z.object({
  visitorName: z.string().min(1),
  contactNumber: z.string().min(1),
  idProofType: z.string().optional(),
  idProofNumber: z.string().optional(),
  studentId: z.string().uuid(),
  visitDate: z.string().date(),
  purpose: z.string().optional()
});

export const GenerateGatePassSchema = z.object({
  studentId: z.string().uuid(),
  issueDate: z.string().date(),
  validUntil: z.string().datetime().optional(),
  reason: z.string().optional()
});

export const RegisterComplaintSchema = z.object({
  studentId: z.string().uuid(),
  roomId: z.string().uuid().optional(),
  category: z.string().optional(),
  description: z.string().min(1)
});

export const RecordMealAttendanceSchema = z.object({
  studentId: z.string().uuid(),
  messPlanId: z.string().uuid().optional(),
  mealDate: z.string().date(),
  mealType: z.string().min(1),
  consumed: z.boolean().optional()
});

export const RecordLaundrySchema = z.object({
  studentId: z.string().uuid(),
  laundryId: z.string().uuid().optional(),
  dropDate: z.string().date(),
  weightKg: z.number().positive().optional(),
  itemCount: z.number().int().positive().optional()
});
