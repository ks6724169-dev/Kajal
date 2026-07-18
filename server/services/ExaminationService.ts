import { UnitOfWork } from '../database/unitOfWork.js';
import { QuerySpecification } from '../repositories/QuerySpecification.js';
import {
  ExaminationRepository,
  ExaminationScheduleRepository,
  MarksEntryRepository,
  GradeBookRepository,
  GPARecordRepository,
  CGPARecordRepository,
  ResultRepository,
  ResultPublicationRepository,
  AcademicPromotionRepository,
  AcademicRemarkRepository
} from '../repositories/ExaminationRepository.js';
import {
  Examination,
  ExaminationSchedule,
  MarksEntry,
  GradeBook,
  GPARecord,
  CGPARecord,
  Result,
  ResultPublication,
  AcademicPromotion,
  AcademicRemark
} from '../entities/ExaminationDomain.js';

export class ExaminationService {
  
  public async createExamination(tenantId: string, data: Partial<Examination>): Promise<Examination> {
    const uow = new UnitOfWork(tenantId);
    try {
      await uow.begin();
      const examRepo = uow.getRepository(ExaminationRepository);
      const exam = await examRepo.insert({
        ...data,
        status: 'ACTIVE'
      });
      await uow.commit();
      return exam;
    } catch (error) {
      await uow.rollback();
      throw error;
    } finally {
      await uow.dispose();
    }
  }

  public async createExaminationSchedule(tenantId: string, data: Partial<ExaminationSchedule>): Promise<ExaminationSchedule> {
    const uow = new UnitOfWork(tenantId);
    try {
      await uow.begin();
      const schedRepo = uow.getRepository(ExaminationScheduleRepository);
      const schedule = await schedRepo.insert({
        ...data,
        status: 'ACTIVE'
      });
      await uow.commit();
      return schedule;
    } catch (error) {
      await uow.rollback();
      throw error;
    } finally {
      await uow.dispose();
    }
  }

  public async recordMarks(tenantId: string, data: Partial<MarksEntry>): Promise<MarksEntry> {
    const uow = new UnitOfWork(tenantId);
    try {
      await uow.begin();
      const marksRepo = uow.getRepository(MarksEntryRepository);
      const existingSpec = new QuerySpecification();
      existingSpec.and('schedule_id', data.scheduleId!);
      existingSpec.and('student_id', data.studentId!);
      const existing = await marksRepo.findMany(existingSpec);

      let marksRecord: MarksEntry;
      if (existing.length > 0) {
        marksRecord = await marksRepo.update(existing[0].id, data, existing[0].version) as MarksEntry;
      } else {
        marksRecord = await marksRepo.insert({
          ...data,
          practicalMarks: data.practicalMarks || 0,
          vivaMarks: data.vivaMarks || 0,
          isAbsent: data.isAbsent || false,
          isVerified: data.isVerified || false,
          isApproved: data.isApproved || false,
          status: 'ACTIVE'
        });
      }
      await uow.commit();
      return marksRecord;
    } catch (error) {
      await uow.rollback();
      throw error;
    } finally {
      await uow.dispose();
    }
  }

  public async compileStudentGrade(
    tenantId: string,
    studentId: string,
    subjectId: string,
    term: string,
    academicYear: string,
    internalMarks: number,
    externalMarks: number
  ): Promise<GradeBook> {
    const uow = new UnitOfWork(tenantId);
    try {
      await uow.begin();
      const gradeRepo = uow.getRepository(GradeBookRepository);

      const totalMarks = internalMarks + externalMarks;
      let grade = 'F';
      let points = 0.0;

      if (totalMarks >= 90) {
        grade = 'A+';
        points = 10.0;
      } else if (totalMarks >= 80) {
        grade = 'A';
        points = 9.0;
      } else if (totalMarks >= 70) {
        grade = 'B';
        points = 8.0;
      } else if (totalMarks >= 60) {
        grade = 'C';
        points = 7.0;
      } else if (totalMarks >= 50) {
        grade = 'D';
        points = 6.0;
      } else if (totalMarks >= 40) {
        grade = 'E';
        points = 5.0;
      }

      const spec = new QuerySpecification();
      spec.and('student_id', studentId);
      spec.and('subject_id', subjectId);
      spec.and('term', term);
      spec.and('academic_year', academicYear);
      const existing = await gradeRepo.findMany(spec);

      let gradeRecord: GradeBook;
      if (existing.length > 0) {
        gradeRecord = await gradeRepo.update(existing[0].id, {
          internalMarks,
          externalMarks,
          totalMarks,
          grade,
          points
        }, existing[0].version) as GradeBook;
      } else {
        gradeRecord = await gradeRepo.insert({
          studentId,
          term,
          academicYear,
          subjectId,
          internalMarks,
          externalMarks,
          totalMarks,
          grade,
          points,
          status: 'ACTIVE'
        });
      }

      await uow.commit();
      return gradeRecord;
    } catch (error) {
      await uow.rollback();
      throw error;
    } finally {
      await uow.dispose();
    }
  }

  public async compileGPA(
    tenantId: string,
    studentId: string,
    term: string,
    academicYear: string
  ): Promise<GPARecord> {
    const uow = new UnitOfWork(tenantId);
    try {
      await uow.begin();
      const gradeRepo = uow.getRepository(GradeBookRepository);
      const gpaRepo = uow.getRepository(GPARecordRepository);

      const spec = new QuerySpecification();
      spec.and('student_id', studentId);
      spec.and('term', term);
      spec.and('academic_year', academicYear);
      const grades = await gradeRepo.findMany(spec);

      if (grades.length === 0) {
        throw new Error('No grades compiled for this student and term');
      }

      const totalPoints = grades.reduce((acc, g) => acc + Number(g.points), 0);
      const gpa = Number((totalPoints / grades.length).toFixed(2));
      const totalCredits = grades.length * 4; // Mocking 4 credits per subject
      const earnedCredits = grades.filter(g => g.grade !== 'F').length * 4;

      const gpaSpec = new QuerySpecification();
      gpaSpec.and('student_id', studentId);
      gpaSpec.and('term', term);
      gpaSpec.and('academic_year', academicYear);
      const existingGpa = await gpaRepo.findMany(gpaSpec);

      let gpaRecord: GPARecord;
      if (existingGpa.length > 0) {
        gpaRecord = await gpaRepo.update(existingGpa[0].id, {
          gpa,
          totalCredits,
          earnedCredits
        }, existingGpa[0].version) as GPARecord;
      } else {
        gpaRecord = await gpaRepo.insert({
          studentId,
          term,
          academicYear,
          gpa,
          totalCredits,
          earnedCredits,
          status: 'ACTIVE'
        });
      }

      await uow.commit();
      return gpaRecord;
    } catch (error) {
      await uow.rollback();
      throw error;
    } finally {
      await uow.dispose();
    }
  }

  public async compileCGPA(
    tenantId: string,
    studentId: string,
    academicYear: string
  ): Promise<CGPARecord> {
    const uow = new UnitOfWork(tenantId);
    try {
      await uow.begin();
      const gpaRepo = uow.getRepository(GPARecordRepository);
      const cgpaRepo = uow.getRepository(CGPARecordRepository);

      const spec = new QuerySpecification();
      spec.and('student_id', studentId);
      spec.and('academic_year', academicYear);
      const gpaRecords = await gpaRepo.findMany(spec);

      if (gpaRecords.length === 0) {
        throw new Error('No GPA records available to compile CGPA');
      }

      const totalGPA = gpaRecords.reduce((acc, r) => acc + Number(r.gpa), 0);
      const cgpa = Number((totalGPA / gpaRecords.length).toFixed(2));
      const totalCredits = gpaRecords.reduce((acc, r) => acc + r.totalCredits, 0);
      const earnedCredits = gpaRecords.reduce((acc, r) => acc + r.earnedCredits, 0);

      const cgpaSpec = new QuerySpecification();
      cgpaSpec.and('student_id', studentId);
      cgpaSpec.and('academic_year', academicYear);
      const existingCgpa = await cgpaRepo.findMany(cgpaSpec);

      let cgpaRecord: CGPARecord;
      if (existingCgpa.length > 0) {
        cgpaRecord = await cgpaRepo.update(existingCgpa[0].id, {
          cgpa,
          totalCredits,
          earnedCredits
        }, existingCgpa[0].version) as CGPARecord;
      } else {
        cgpaRecord = await cgpaRepo.insert({
          studentId,
          academicYear,
          cgpa,
          totalCredits,
          earnedCredits,
          status: 'ACTIVE'
        });
      }

      await uow.commit();
      return cgpaRecord;
    } catch (error) {
      await uow.rollback();
      throw error;
    } finally {
      await uow.dispose();
    }
  }

  public async declareResults(tenantId: string, examinationId: string): Promise<Result[]> {
    const uow = new UnitOfWork(tenantId);
    try {
      await uow.begin();
      const examRepo = uow.getRepository(ExaminationRepository);
      const schedRepo = uow.getRepository(ExaminationScheduleRepository);
      const marksRepo = uow.getRepository(MarksEntryRepository);
      const resultRepo = uow.getRepository(ResultRepository);
      const pubRepo = uow.getRepository(ResultPublicationRepository);

      const exam = await examRepo.findOne(examinationId);
      if (!exam) {
        throw new Error('Examination not found');
      }

      // Fetch all schedules for this exam
      const schedSpec = new QuerySpecification();
      schedSpec.and('examination_id', examinationId);
      const schedules = await schedRepo.findMany(schedSpec);

      if (schedules.length === 0) {
        throw new Error('No exam schedules configured for this exam');
      }

      const scheduleIds = schedules.map(s => s.id);

      // Fetch all marks for these schedules
      // To bypass query specification limits on arrays, fetch and group inside memory or query directly
      const txClient = (marksRepo as any).getClient();
      const marksResult = await txClient.query(
        `SELECT * FROM marks_entry WHERE schedule_id = ANY($1) AND tenant_id = $2 AND deleted_at IS NULL`,
        [scheduleIds, tenantId]
      );

      const marksRows = marksResult.rows;
      const studentMarksMap: Record<string, { obtained: number; max: number; passedAll: boolean }> = {};

      for (const row of marksRows) {
        const studentId = row.student_id;
        const schedule = schedules.find(s => s.id === row.schedule_id);
        if (!schedule) continue;

        const obtained = Number(row.obtained_marks) + Number(row.practical_marks || 0) + Number(row.viva_marks || 0);
        const max = Number(schedule.maxMarks);
        const passed = obtained >= Number(schedule.passingMarks);

        if (!studentMarksMap[studentId]) {
          studentMarksMap[studentId] = { obtained: 0, max: 0, passedAll: true };
        }

        studentMarksMap[studentId].obtained += obtained;
        studentMarksMap[studentId].max += max;
        if (!passed) {
          studentMarksMap[studentId].passedAll = false;
        }
      }

      const createdResults: Result[] = [];
      const studentIds = Object.keys(studentMarksMap);

      for (const studId of studentIds) {
        const { obtained, max, passedAll } = studentMarksMap[studId];
        const percentage = Number(((obtained / max) * 100).toFixed(2));
        
        let overallGrade = 'F';
        if (percentage >= 90) overallGrade = 'A+';
        else if (percentage >= 80) overallGrade = 'A';
        else if (percentage >= 70) overallGrade = 'B';
        else if (percentage >= 60) overallGrade = 'C';
        else if (percentage >= 50) overallGrade = 'D';
        else if (percentage >= 40) overallGrade = 'E';

        const resultStatus = passedAll ? 'PASS' : 'FAIL';

        const resSpec = new QuerySpecification();
        resSpec.and('student_id', studId);
        resSpec.and('examination_id', examinationId);
        const existingRes = await resultRepo.findMany(resSpec);

        let resRecord: Result;
        if (existingRes.length > 0) {
          resRecord = await resultRepo.update(existingRes[0].id, {
            totalObtained: obtained,
            totalMax: max,
            percentage,
            overallGrade,
            resultStatus
          }, existingRes[0].version) as Result;
        } else {
          resRecord = await resultRepo.insert({
            studentId: studId,
            examinationId,
            totalObtained: obtained,
            totalMax: max,
            percentage,
            overallGrade,
            resultStatus,
            status: 'ACTIVE'
          });
        }
        createdResults.push(resRecord);
      }

      // Create result publication record
      const pubSpec = new QuerySpecification();
      pubSpec.and('examination_id', examinationId);
      const existingPub = await pubRepo.findMany(pubSpec);

      if (existingPub.length > 0) {
        await pubRepo.update(existingPub[0].id, {
          isPublished: true,
          publishDate: new Date()
        }, existingPub[0].version);
      } else {
        await pubRepo.insert({
          examinationId,
          publishDate: new Date(),
          isPublished: true,
          publishedBy: '00000000-0000-0000-0000-000000000000', // Mock system UUID
          status: 'ACTIVE'
        });
      }

      await uow.commit();
      return createdResults;
    } catch (error) {
      await uow.rollback();
      throw error;
    } finally {
      await uow.dispose();
    }
  }

  public async promoteStudent(
    tenantId: string,
    studentId: string,
    fromClassId: string,
    toClassId: string,
    academicYear: string,
    isPromoted: boolean,
    reason?: string
  ): Promise<AcademicPromotion> {
    const uow = new UnitOfWork(tenantId);
    try {
      await uow.begin();
      const promoRepo = uow.getRepository(AcademicPromotionRepository);
      
      const promo = await promoRepo.insert({
        studentId,
        fromClassId,
        toClassId,
        academicYear,
        promotionDate: new Date(),
        isPromoted,
        reason,
        status: 'ACTIVE'
      });

      await uow.commit();
      return promo;
    } catch (error) {
      await uow.rollback();
      throw error;
    } finally {
      await uow.dispose();
    }
  }

  public async addAcademicRemark(tenantId: string, remark: Partial<AcademicRemark>): Promise<AcademicRemark> {
    const uow = new UnitOfWork(tenantId);
    try {
      await uow.begin();
      const remarkRepo = uow.getRepository(AcademicRemarkRepository);
      
      const savedRemark = await remarkRepo.insert({
        ...remark,
        status: 'ACTIVE'
      });

      await uow.commit();
      return savedRemark;
    } catch (error) {
      await uow.rollback();
      throw error;
    } finally {
      await uow.dispose();
    }
  }
}
export const examinationService = new ExaminationService();
