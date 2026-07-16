import { z } from 'zod';
import { AttendanceStatus, AttendanceSource, BehaviourType } from '../entities/LifecycleDomain.js';

export const AttendanceSchema = z.object({
  student_id: z.string().uuid(),
  date: z.string(),
  status: z.nativeEnum(AttendanceStatus),
  source: z.nativeEnum(AttendanceSource),
  remarks: z.string().optional()
});

export const LeaveRequestSchema = z.object({
  student_id: z.string().uuid(),
  start_date: z.string(),
  end_date: z.string(),
  reason: z.string().min(5)
});

export const BehaviourSchema = z.object({
  student_id: z.string().uuid(),
  type: z.nativeEnum(BehaviourType),
  title: z.string().min(3),
  description: z.string().min(5),
  score_impact: z.number(),
  reported_by: z.string().uuid(),
  is_principal_review_required: z.boolean().default(false)
});

export const HealthProfileSchema = z.object({
  student_id: z.string().uuid(),
  blood_group: z.string().optional(),
  medical_conditions: z.array(z.string()).optional(),
  allergies: z.array(z.string()).optional(),
  emergency_alerts: z.array(z.string()).optional()
});

export const MedicalVisitSchema = z.object({
  student_id: z.string().uuid(),
  symptoms: z.string().min(3),
  treatment: z.string().min(3),
  doctor_notes: z.string().optional(),
  referred_to_hospital: z.boolean().default(false)
});
