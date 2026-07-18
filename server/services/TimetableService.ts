import { UnitOfWork } from '../database/unitOfWork.js';
import { 
  Timetable, TimetablePeriod, SubstituteTeacher 
} from '../entities/TimetableDomain.js';
import { 
  TimetableRepository, TimetablePeriodRepository, SubstituteTeacherRepository,
  TimetablePublishRepository
} from '../repositories/TimetableRepository.js';
import { autoTimetableEngine } from './AutoTimetableEngine.js';
import { conflictDetectionEngine } from './ConflictDetectionEngine.js';

export class TimetableService {
  public async createTimetable(tenantId: string, data: Partial<Timetable>): Promise<Timetable> {
    const uow = new UnitOfWork(tenantId);
    try {
      await uow.begin();
      const repo = uow.getRepository(TimetableRepository);
      const timetable = await repo.insert({
        ...data,
        isPublished: false,
        status: 'ACTIVE'
      } as Timetable);
      await uow.commit();
      return timetable;
    } catch (e) {
      await uow.rollback();
      throw e;
    } finally {
      await uow.dispose();
    }
  }

  public async getTimetable(tenantId: string, id: string): Promise<Timetable | null> {
    const uow = new UnitOfWork(tenantId);
    try {
      const repo = uow.getRepository(TimetableRepository);
      return await repo.findOne(id);
    } finally {
      await uow.dispose();
    }
  }

  public async publishTimetable(tenantId: string, timetableId: string, userId: string): Promise<void> {
    const uow = new UnitOfWork(tenantId);
    try {
      await uow.begin();
      const timetableRepo = uow.getRepository(TimetableRepository);
      const publishRepo = uow.getRepository(TimetablePublishRepository);

      const timetable = await timetableRepo.findOne(timetableId);
      if (!timetable) throw new Error('Timetable not found');

      await timetableRepo.update(timetableId, { isPublished: true }, timetable.version || 1);
      await publishRepo.insert({
        timetableId,
        publishDate: new Date(),
        publishedBy: userId,
        status: 'ACTIVE'
      } as any);

      await uow.commit();
    } catch (e) {
      await uow.rollback();
      throw e;
    } finally {
      await uow.dispose();
    }
  }

  public async getTeacherSchedule(tenantId: string, teacherId: string): Promise<TimetablePeriod[]> {
    const uow = new UnitOfWork(tenantId);
    try {
      const repo = uow.getRepository(TimetablePeriodRepository);
      const periods = await repo.findMany();
      return periods.filter(p => p.teacherId === teacherId);
    } finally {
      await uow.dispose();
    }
  }

  public async getClassSchedule(tenantId: string, classId: string): Promise<TimetablePeriod[]> {
    const uow = new UnitOfWork(tenantId);
    try {
      const repo = uow.getRepository(TimetablePeriodRepository);
      const periods = await repo.findMany();
      return periods.filter(p => p.classId === classId);
    } finally {
      await uow.dispose();
    }
  }

  public async assignSubstitute(tenantId: string, data: Partial<SubstituteTeacher>): Promise<SubstituteTeacher> {
    const uow = new UnitOfWork(tenantId);
    try {
      await uow.begin();
      const repo = uow.getRepository(SubstituteTeacherRepository);
      const substitute = await repo.insert({
        ...data,
        status: 'ACTIVE'
      } as SubstituteTeacher);
      await uow.commit();
      return substitute;
    } catch (e) {
      await uow.rollback();
      throw e;
    } finally {
      await uow.dispose();
    }
  }

  public async autoGenerate(tenantId: string, timetableId: string, classIds: string[]): Promise<TimetablePeriod[]> {
    return await autoTimetableEngine.generateTimetable(tenantId, {
      timetableId,
      classIds,
      daysOfWeek: ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY']
    });
  }

  public async checkConflicts(tenantId: string, timetableId: string): Promise<any[]> {
    const uow = new UnitOfWork(tenantId);
    try {
      const repo = uow.getRepository(TimetablePeriodRepository);
      const periods = await repo.findMany();
      // Filter for this timetable in real app
      return await conflictDetectionEngine.detectConflicts(tenantId, timetableId, periods);
    } finally {
      await uow.dispose();
    }
  }
}

export const timetableService = new TimetableService();
