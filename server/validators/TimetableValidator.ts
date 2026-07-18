import { z } from 'zod';

export const AcademicCalendarSchema = z.object({
  calendarName: z.string().min(1),
  startDate: z.string().or(z.date()),
  endDate: z.string().or(z.date()),
  academicYear: z.string().min(1),
  description: z.string().optional()
});

export const WorkingDaySchema = z.object({
  academicCalendarId: z.string().uuid(),
  dayOfWeek: z.enum(['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY']),
  isWorkingDay: z.boolean()
});

export const HolidaySchema = z.object({
  academicCalendarId: z.string().uuid(),
  holidayDate: z.string().or(z.date()),
  holidayName: z.string().min(1),
  description: z.string().optional()
});

export const TimeSlotSchema = z.object({
  slotName: z.string().min(1),
  startTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/),
  endTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/),
  isBreak: z.boolean(),
  type: z.string().optional()
});

export const PeriodSchema = z.object({
  periodNumber: z.number().int().positive(),
  slotId: z.string().uuid(),
  description: z.string().optional()
});

export const TimetableSchema = z.object({
  timetableName: z.string().min(1),
  academicCalendarId: z.string().uuid(),
  termId: z.string().uuid().optional(),
  description: z.string().optional()
});

export const SubjectAllocationSchema = z.object({
  classId: z.string().uuid(),
  subjectId: z.string().uuid(),
  teacherId: z.string().uuid(),
  weeklyPeriodsCount: z.number().int().positive()
});

export const TeacherAllocationSchema = z.object({
  teacherId: z.string().uuid(),
  subjectId: z.string().uuid(),
  allocatedPeriods: z.number().int().positive()
});

export const RoomAllocationSchema = z.object({
  roomId: z.string().uuid(),
  isLab: z.boolean(),
  capacity: z.number().int().positive(),
  properties: z.record(z.string(), z.any()).optional()
});

export const SubstituteTeacherSchema = z.object({
  originalTeacherId: z.string().uuid(),
  substituteTeacherId: z.string().uuid(),
  timetablePeriodId: z.string().uuid(),
  substitutionDate: z.string().or(z.date()),
  reason: z.string().optional()
});

export const TimetablePublishSchema = z.object({
  timetableId: z.string().uuid(),
  publishDate: z.string().or(z.date()),
  publishedBy: z.string().uuid()
});
