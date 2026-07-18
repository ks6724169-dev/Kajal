import { describe, it, expect, beforeAll } from 'vitest';
import { UnitOfWork } from '../database/unitOfWork.js';
import { timetableService } from '../services/TimetableService.js';
import { conflictDetectionEngine } from '../services/ConflictDetectionEngine.js';
import { resourceAllocationEngine } from '../services/ResourceAllocationEngine.js';
import { 
  AcademicCalendarRepository, PeriodRepository, SubjectAllocationRepository, 
  RoomAllocationRepository 
} from '../repositories/TimetableRepository.js';
import { v4 as uuidv4 } from 'uuid';

describe('Timetable Platform (Phase 03.2O)', () => {
  const tenantId = uuidv4();
  let calendarId: string;
  let timetableId: string;
  let periodId: string;

  beforeAll(async () => {
    const uow = new UnitOfWork(tenantId);
    try {
      await uow.begin();
      
      // Seed Academic Calendar
      const calRepo = uow.getRepository(AcademicCalendarRepository);
      const cal = await calRepo.insert({
        calendarName: 'Annual Calendar 2026',
        startDate: new Date('2026-01-01'),
        endDate: new Date('2026-12-31'),
        academicYear: '2026'
      } as any);
      calendarId = cal.id;

      // Seed Period Master
      const periodRepo = uow.getRepository(PeriodRepository);
      const period = await periodRepo.insert({
        periodNumber: 1,
        description: 'Morning Session 1'
      } as any);
      periodId = period.id;

      // Seed Room Allocation
      const roomRepo = uow.getRepository(RoomAllocationRepository);
      await roomRepo.insert({
        roomId: uuidv4(),
        isLab: false,
        capacity: 40
      } as any);

      await uow.commit();
    } finally {
      await uow.dispose();
    }
  });

  it('1. should create a new timetable', async () => {
    const timetable = await timetableService.createTimetable(tenantId, {
      timetableName: 'H1 Weekly Schedule',
      academicCalendarId: calendarId
    });
    expect(timetable).toBeDefined();
    expect(timetable.timetableName).toBe('H1 Weekly Schedule');
    timetableId = timetable.id;
  });

  it('2. should auto-generate timetable periods', async () => {
    const classId = uuidv4();
    const teacherId = uuidv4();
    const subjectId = uuidv4();

    // Setup allocation for auto-gen
    const uow = new UnitOfWork(tenantId);
    const allocRepo = uow.getRepository(SubjectAllocationRepository);
    await allocRepo.insert({
      classId,
      teacherId,
      subjectId,
      weeklyPeriodsCount: 2
    } as any);
    await uow.dispose();

    const periods = await timetableService.autoGenerate(tenantId, timetableId, [classId]);
    expect(periods.length).toBeGreaterThan(0);
  });

  it('3. should detect conflicts', async () => {
    const conflicts = await timetableService.checkConflicts(tenantId, timetableId);
    expect(Array.isArray(conflicts)).toBe(true);
  });

  it('4. should calculate resource utilization', async () => {
    const resourceId = uuidv4();
    const utilization = await resourceAllocationEngine.calculateUtilization(tenantId, resourceId, 40);
    expect(utilization.utilizationRate).toBeDefined();
    expect(utilization.resourceId).toBe(resourceId);
  });

  it('5. should handle substitute teacher assignment', async () => {
    const sub = await timetableService.assignSubstitute(tenantId, {
      originalTeacherId: uuidv4(),
      substituteTeacherId: uuidv4(),
      timetablePeriodId: uuidv4(),
      substitutionDate: new Date(),
      reason: 'Sick Leave'
    });
    expect(sub).toBeDefined();
    expect(sub.reason).toBe('Sick Leave');
  });
});
