import { BaseEntity } from './BaseEntity.js';

export interface AcademicCalendar extends BaseEntity {
  calendarName: string;
  startDate: Date;
  endDate: Date;
  academicYear: string;
  description?: string;
}

export interface AcademicWeek extends BaseEntity {
  academicCalendarId: string;
  weekNumber: number;
  startDate: Date;
  endDate: Date;
}

export interface WorkingDay extends BaseEntity {
  academicCalendarId: string;
  dayOfWeek: string; // 'MONDAY', 'TUESDAY', etc.
  isWorkingDay: boolean;
}

export interface Holiday extends BaseEntity {
  academicCalendarId: string;
  holidayDate: Date;
  holidayName: string;
  description?: string;
}

export interface TimeSlot extends BaseEntity {
  slotName: string;
  startTime: string; // 'HH:MM:SS'
  endTime: string; // 'HH:MM:SS'
  isBreak: boolean;
  type?: string; // 'ACADEMIC', 'EXAM', 'EVENT'
}

export interface Period extends BaseEntity {
  periodNumber: number;
  slotId: string;
  description?: string;
}

export interface BellSchedule extends BaseEntity {
  scheduleName: string;
  description?: string;
}

export interface Timetable extends BaseEntity {
  timetableName: string;
  academicCalendarId: string;
  termId?: string;
  isPublished: boolean;
  description?: string;
}

export interface TimetableVersion extends BaseEntity {
  timetableId: string;
  versionNumber: number;
  description?: string;
  createdBy?: string;
}

export interface TimetablePeriod extends BaseEntity {
  timetableId: string;
  periodId: string;
  dayOfWeek: string; // 'MONDAY', 'TUESDAY', etc.
  subjectId: string;
  teacherId: string;
  roomId?: string;
  sectionId?: string;
  classId?: string;
}

export interface TeacherSchedule extends BaseEntity {
  teacherId: string;
  timetablePeriodId: string;
  dayOfWeek: string;
  periodId: string;
}

export interface StudentSchedule extends BaseEntity {
  studentId: string;
  timetablePeriodId: string;
  dayOfWeek: string;
  periodId: string;
}

export interface ClassSchedule extends BaseEntity {
  classId: string;
  timetablePeriodId: string;
  dayOfWeek: string;
  periodId: string;
}

export interface RoomSchedule extends BaseEntity {
  roomId: string;
  timetablePeriodId: string;
  dayOfWeek: string;
  periodId: string;
}

export interface LabSchedule extends BaseEntity {
  labId: string;
  timetablePeriodId: string;
  dayOfWeek: string;
  periodId: string;
}

export interface SubjectAllocation extends BaseEntity {
  classId: string;
  subjectId: string;
  teacherId: string;
  weeklyPeriodsCount: number;
}

export interface TeacherAllocation extends BaseEntity {
  teacherId: string;
  subjectId: string;
  allocatedPeriods: number;
}

export interface RoomAllocation extends BaseEntity {
  roomId: string;
  isLab: boolean;
  capacity: number;
  properties?: Record<string, any>;
}

export interface ResourceAllocation extends BaseEntity {
  resourceId: string; // e.g. room_id, lab_id, playground_id
  timetablePeriodId: string;
  allocatedFrom: Date;
  allocatedTo: Date;
}

export interface SubstituteTeacher extends BaseEntity {
  originalTeacherId: string;
  substituteTeacherId: string;
  timetablePeriodId: string;
  substitutionDate: Date;
  reason?: string;
}

export interface FreePeriod extends BaseEntity {
  teacherId?: string;
  roomId?: string;
  periodId: string;
  dayOfWeek: string;
}

export interface TimetableConflict extends BaseEntity {
  timetableId: string;
  conflictType: string; // 'TEACHER_DOUBLE_BOOKING', 'ROOM_DOUBLE_BOOKING', etc.
  details: string;
  resolved: boolean;
  resolvedAt?: Date;
}

export interface TimetableApproval extends BaseEntity {
  timetableId: string;
  approvedBy: string;
  approvalStatus: string; // 'PENDING', 'APPROVED', 'REJECTED'
  remarks?: string;
}

export interface TimetablePublish extends BaseEntity {
  timetableId: string;
  publishDate: Date;
  publishedBy: string;
}

export interface TimetableHistory extends BaseEntity {
  timetableId: string;
  actionType: string; // 'CREATE', 'UPDATE', 'DELETE', 'PUBLISH'
  description: string;
  payload?: Record<string, any>;
}

export interface TimetableAudit extends BaseEntity {
  userId: string;
  action: string;
  tableName: string;
  recordId: string;
  oldValues?: Record<string, any>;
  newValues?: Record<string, any>;
}
