import { BaseRepository } from './BaseRepository.js';
import {
  AcademicCalendar, AcademicWeek, WorkingDay, Holiday, TimeSlot, Period,
  BellSchedule, Timetable, TimetableVersion, TimetablePeriod, TeacherSchedule,
  StudentSchedule, ClassSchedule, RoomSchedule, LabSchedule, SubjectAllocation,
  TeacherAllocation, RoomAllocation, ResourceAllocation, SubstituteTeacher,
  FreePeriod, TimetableConflict, TimetableApproval, TimetablePublish,
  TimetableHistory, TimetableAudit
} from '../entities/TimetableDomain.js';

export class AcademicCalendarRepository extends BaseRepository<AcademicCalendar> { protected tableName = 'academic_calendar'; }
export class AcademicWeekRepository extends BaseRepository<AcademicWeek> { protected tableName = 'academic_week'; }
export class WorkingDayRepository extends BaseRepository<WorkingDay> { protected tableName = 'working_day'; }
export class TimetableHolidayRepository extends BaseRepository<Holiday> { protected tableName = 'holiday'; }
export class TimeSlotRepository extends BaseRepository<TimeSlot> { protected tableName = 'time_slot'; }
export class PeriodRepository extends BaseRepository<Period> { protected tableName = 'period_master'; }
export class BellScheduleRepository extends BaseRepository<BellSchedule> { protected tableName = 'bell_schedule'; }
export class TimetableRepository extends BaseRepository<Timetable> { protected tableName = 'timetable_master'; }
export class TimetableVersionRepository extends BaseRepository<TimetableVersion> { protected tableName = 'timetable_version'; }
export class TimetablePeriodRepository extends BaseRepository<TimetablePeriod> { protected tableName = 'timetable_period'; }
export class TeacherScheduleRepository extends BaseRepository<TeacherSchedule> { protected tableName = 'teacher_schedule'; }
export class StudentScheduleRepository extends BaseRepository<StudentSchedule> { protected tableName = 'student_schedule'; }
export class ClassScheduleRepository extends BaseRepository<ClassSchedule> { protected tableName = 'class_schedule'; }
export class RoomScheduleRepository extends BaseRepository<RoomSchedule> { protected tableName = 'room_schedule'; }
export class LabScheduleRepository extends BaseRepository<LabSchedule> { protected tableName = 'lab_schedule'; }
export class SubjectAllocationRepository extends BaseRepository<SubjectAllocation> { protected tableName = 'subject_allocation'; }
export class TeacherAllocationRepository extends BaseRepository<TeacherAllocation> { protected tableName = 'teacher_allocation'; }
export class RoomAllocationRepository extends BaseRepository<RoomAllocation> { protected tableName = 'room_allocation'; }
export class ResourceAllocationRepository extends BaseRepository<ResourceAllocation> { protected tableName = 'resource_allocation'; }
export class SubstituteTeacherRepository extends BaseRepository<SubstituteTeacher> { protected tableName = 'substitute_teacher'; }
export class FreePeriodRepository extends BaseRepository<FreePeriod> { protected tableName = 'free_period'; }
export class TimetableConflictRepository extends BaseRepository<TimetableConflict> { protected tableName = 'timetable_conflict'; }
export class TimetableApprovalRepository extends BaseRepository<TimetableApproval> { protected tableName = 'timetable_approval'; }
export class TimetablePublishRepository extends BaseRepository<TimetablePublish> { protected tableName = 'timetable_publish'; }
export class TimetableHistoryRepository extends BaseRepository<TimetableHistory> { protected tableName = 'timetable_history'; }
export class TimetableAuditRepository extends BaseRepository<TimetableAudit> { protected tableName = 'timetable_audit'; }
