import { z } from 'zod';
import { EmploymentStatus } from '../entities/WorkforceDomain.js';
import { AddressSchema } from './MasterDataValidator.js';

export const EmployeeSchema = z.object({
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  officialEmail: z.string().email(),
  phone: z.string().min(10),
  dateOfBirth: z.string().transform((val) => new Date(val)),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER']),
  employmentStatus: z.nativeEnum(EmploymentStatus).default(EmploymentStatus.ACTIVE),
  address: AddressSchema.optional()
});

export const TeacherSchema = z.object({
  employee_id: z.string().uuid(),
  qualifications: z.array(z.string()),
  experienceYears: z.number().min(0),
  skills: z.array(z.string()),
  subjects: z.array(z.string())
});

export const EmployeeAttendanceSchema = z.object({
  employee_id: z.string().uuid(),
  date: z.string(),
  status: z.enum(['PRESENT', 'ABSENT', 'LATE', 'HALF_DAY']),
  source: z.enum(['MANUAL', 'BIOMETRIC', 'RFID', 'FACE', 'GPS']),
  workHours: z.number().optional()
});

export const EmployeeLeaveSchema = z.object({
  employee_id: z.string().uuid(),
  leaveType: z.string(),
  startDate: z.string(),
  endDate: z.string(),
  reason: z.string().min(5)
});

export const PerformanceReviewSchema = z.object({
  employee_id: z.string().uuid(),
  kpiScore: z.number().min(0).max(100),
  okrProgress: z.number().min(0).max(100),
  comments: z.string(),
  trainingRecommendation: z.string().optional()
});

export const TrainingCourseSchema = z.object({
  name: z.string().min(3),
  description: z.string().min(10),
  learningHours: z.number().min(1)
});

export const EmployeeTrainingSchema = z.object({
  employee_id: z.string().uuid(),
  course_id: z.string().uuid()
});
