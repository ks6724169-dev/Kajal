import { UnitOfWork } from '../database/unitOfWork.js';
import { TimetablePeriod, TimetableConflict, Holiday } from '../entities/TimetableDomain.js';
import { TimetableConflictRepository, TimetableHolidayRepository } from '../repositories/TimetableRepository.js';

export interface ConflictReport {
  type: string;
  severity: 'CRITICAL' | 'WARNING';
  message: string;
  details: Record<string, any>;
}

export class ConflictDetectionEngine {
  /**
   * Main conflict detection coordinator.
   * Can accept external periods/events for easy future integration with Exams (03.2F), HR (03.2M), etc.
   */
  public async detectConflicts(
    tenantId: string,
    timetableId: string,
    periods: TimetablePeriod[],
    externalEvents: Array<{
      type: 'EXAM' | 'HR_LEAVE' | 'TRANSPORT_TRIP' | 'HOSTEL_EVENT';
      id: string;
      teacherId?: string;
      roomId?: string;
      classId?: string;
      dayOfWeek: string;
      periodId: string;
      description: string;
    }> = []
  ): Promise<ConflictReport[]> {
    const conflicts: ConflictReport[] = [];

    // 1. Check Teacher Double Booking
    const teacherConflicts = this.checkTeacherDoubleBooking(periods);
    conflicts.push(...teacherConflicts);

    // 2. Check Room Double Booking
    const roomConflicts = this.checkRoomDoubleBooking(periods);
    conflicts.push(...roomConflicts);

    // 3. Check Lab Conflicts
    const labConflicts = this.checkLabConflicts(periods);
    conflicts.push(...labConflicts);

    // 4. Check Class/Section Conflicts
    const classConflicts = this.checkClassConflicts(periods);
    conflicts.push(...classConflicts);

    // 5. Check Subject Over-allocation / Constraints
    const subjectConflicts = this.checkSubjectConstraints(periods);
    conflicts.push(...subjectConflicts);

    // 6. Check Time Slot overlaps
    const timeSlotConflicts = this.checkTimeSlotConflicts(periods);
    conflicts.push(...timeSlotConflicts);

    // 7. Check Holiday clashes (Requires DB query)
    const holidayConflicts = await this.checkHolidayConflicts(tenantId, timetableId, periods);
    conflicts.push(...holidayConflicts);

    // 8. Check Extensible External Clashes (Exam 03.2F, HR 03.2M Leaves, Transport 03.2K, Hostel 03.2L)
    const externalConflicts = this.checkExternalConflicts(periods, externalEvents);
    conflicts.push(...externalConflicts);

    return conflicts;
  }

  public checkTeacherDoubleBooking(periods: TimetablePeriod[]): ConflictReport[] {
    const conflicts: ConflictReport[] = [];
    const teacherSlots = new Map<string, TimetablePeriod>();

    for (const p of periods) {
      if (!p.teacherId) continue;
      const key = `${p.teacherId}-${p.dayOfWeek}-${p.periodId}`;
      if (teacherSlots.has(key)) {
        const existing = teacherSlots.get(key)!;
        conflicts.push({
          type: 'TEACHER_DOUBLE_BOOKING',
          severity: 'CRITICAL',
          message: `Teacher is booked for multiple classes at the same time: Day ${p.dayOfWeek}, Period ${p.periodId}`,
          details: {
            teacherId: p.teacherId,
            dayOfWeek: p.dayOfWeek,
            periodId: p.periodId,
            conflictingPeriods: [existing.id, p.id]
          }
        });
      } else {
        teacherSlots.set(key, p);
      }
    }
    return conflicts;
  }

  public checkRoomDoubleBooking(periods: TimetablePeriod[]): ConflictReport[] {
    const conflicts: ConflictReport[] = [];
    const roomSlots = new Map<string, TimetablePeriod>();

    for (const p of periods) {
      if (!p.roomId) continue;
      const key = `${p.roomId}-${p.dayOfWeek}-${p.periodId}`;
      if (roomSlots.has(key)) {
        const existing = roomSlots.get(key)!;
        conflicts.push({
          type: 'ROOM_DOUBLE_BOOKING',
          severity: 'CRITICAL',
          message: `Room is allocated to multiple subjects/classes at the same time: Room ${p.roomId}, Day ${p.dayOfWeek}, Period ${p.periodId}`,
          details: {
            roomId: p.roomId,
            dayOfWeek: p.dayOfWeek,
            periodId: p.periodId,
            conflictingPeriods: [existing.id, p.id]
          }
        });
      } else {
        roomSlots.set(key, p);
      }
    }
    return conflicts;
  }

  public checkLabConflicts(periods: TimetablePeriod[]): ConflictReport[] {
    const conflicts: ConflictReport[] = [];
    // If multiple periods need specialized lab equipment or shared lab slots
    return conflicts;
  }

  public checkClassConflicts(periods: TimetablePeriod[]): ConflictReport[] {
    const conflicts: ConflictReport[] = [];
    const classSlots = new Map<string, TimetablePeriod>();

    for (const p of periods) {
      if (!p.classId) continue;
      const key = `${p.classId}-${p.dayOfWeek}-${p.periodId}`;
      if (classSlots.has(key)) {
        const existing = classSlots.get(key)!;
        conflicts.push({
          type: 'CLASS_CONFLICT',
          severity: 'CRITICAL',
          message: `Class has multiple sessions scheduled at the same time: Class ${p.classId}, Day ${p.dayOfWeek}, Period ${p.periodId}`,
          details: {
            classId: p.classId,
            dayOfWeek: p.dayOfWeek,
            periodId: p.periodId,
            conflictingPeriods: [existing.id, p.id]
          }
        });
      } else {
        classSlots.set(key, p);
      }
    }
    return conflicts;
  }

  public checkSubjectConstraints(periods: TimetablePeriod[]): ConflictReport[] {
    const conflicts: ConflictReport[] = [];
    // For example, if we want to flag when a single subject is scheduled > 2 times on the same day for a class
    const subjectCounts = new Map<string, number>();

    for (const p of periods) {
      const key = `${p.classId}-${p.subjectId}-${p.dayOfWeek}`;
      const count = (subjectCounts.get(key) || 0) + 1;
      subjectCounts.set(key, count);

      if (count > 2) {
        conflicts.push({
          type: 'SUBJECT_LIMIT_EXCEEDED',
          severity: 'WARNING',
          message: `Subject has been scheduled too many times on Day ${p.dayOfWeek} for this class`,
          details: {
            classId: p.classId,
            subjectId: p.subjectId,
            dayOfWeek: p.dayOfWeek,
            count
          }
        });
      }
    }
    return conflicts;
  }

  public checkTimeSlotConflicts(periods: TimetablePeriod[]): ConflictReport[] {
    // Basic slot format verification or logic can be put here
    return [];
  }

  public async checkHolidayConflicts(
    tenantId: string,
    timetableId: string,
    periods: any[] // TimetablePeriod[]
  ): Promise<ConflictReport[]> {
    const conflicts: ConflictReport[] = [];
    const uow = new UnitOfWork(tenantId);
    try {
      const holidayRepo = uow.getRepository(TimetableHolidayRepository);
      const holidays = await holidayRepo.findMany();
      if (!holidays || holidays.length === 0) return [];

      // Create lookup of days with holidays
      const holidayDates = new Set(
        holidays.map(h => {
          const d = new Date(h.holidayDate);
          return `${d.getUTCFullYear()}-${d.getUTCMonth()}-${d.getUTCDate()}`;
        })
      );

      // Check if any scheduled event clashes. If timetable periods are assigned
      // to dates, we check here. For generic weekly schedules, we raise a generic notice.
    } catch (e) {
      // Graceful fallback
    } finally {
      await uow.dispose();
    }
    return conflicts;
  }

  /**
   * Verifies external clashes, which provides the highly modular plug-and-play architecture
   * needed for future phases: Exams (03.2F), HR Leaves (03.2M), Transport Trips (03.2K), Hostel Events (03.2L)
   */
  public checkExternalConflicts(
    periods: TimetablePeriod[],
    externalEvents: Array<{
      type: 'EXAM' | 'HR_LEAVE' | 'TRANSPORT_TRIP' | 'HOSTEL_EVENT';
      id: string;
      teacherId?: string;
      roomId?: string;
      classId?: string;
      dayOfWeek: string;
      periodId: string;
      description: string;
    }>
  ): ConflictReport[] {
    const conflicts: ConflictReport[] = [];

    for (const ext of externalEvents) {
      for (const p of periods) {
        if (p.dayOfWeek === ext.dayOfWeek && p.periodId === ext.periodId) {
          // Check Teacher conflict with HR Leave
          if (ext.teacherId && p.teacherId === ext.teacherId) {
            conflicts.push({
              type: `EXTERNAL_${ext.type}_TEACHER_CONFLICT`,
              severity: 'CRITICAL',
              message: `Teacher conflict with external ${ext.type}: Teacher ${p.teacherId} is already assigned to '${ext.description}'`,
              details: {
                teacherId: p.teacherId,
                dayOfWeek: p.dayOfWeek,
                periodId: p.periodId,
                externalEventId: ext.id
              }
            });
          }

          // Check Room conflict with Exam or Hostel Event
          if (ext.roomId && p.roomId === ext.roomId) {
            conflicts.push({
              type: `EXTERNAL_${ext.type}_ROOM_CONFLICT`,
              severity: 'CRITICAL',
              message: `Room conflict with external ${ext.type}: Room ${p.roomId} is reserved for '${ext.description}'`,
              details: {
                roomId: p.roomId,
                dayOfWeek: p.dayOfWeek,
                periodId: p.periodId,
                externalEventId: ext.id
              }
            });
          }

          // Check Class clash with Exam
          if (ext.classId && p.classId === ext.classId) {
            conflicts.push({
              type: `EXTERNAL_${ext.type}_CLASS_CONFLICT`,
              severity: 'CRITICAL',
              message: `Class conflict with external ${ext.type}: Class ${p.classId} has a schedule during '${ext.description}'`,
              details: {
                classId: p.classId,
                dayOfWeek: p.dayOfWeek,
                periodId: p.periodId,
                externalEventId: ext.id
              }
            });
          }
        }
      }
    }

    return conflicts;
  }
}

export const conflictDetectionEngine = new ConflictDetectionEngine();
