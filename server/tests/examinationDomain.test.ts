import { describe, it, expect, beforeAll } from 'vitest';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { dbManager } from '../database/dbClient.js';
import { examinationService } from '../services/ExaminationService.js';
import { academicIntelligenceEngine } from '../services/AcademicIntelligenceEngine.js';
import { UnitOfWork } from '../database/unitOfWork.js';
import {
  ExaminationRepository,
  ExaminationScheduleRepository,
  MarksEntryRepository,
  GradeBookRepository,
  GPARecordRepository,
  CGPARecordRepository,
  ResultRepository,
  WeakStudentRegistryRepository,
  GiftedStudentRegistryRepository
} from '../repositories/ExaminationRepository.js';

const tenantId = '123e4567-e89b-12d3-a456-426614174999';

describe('Enterprise Examination, Assessment & Academic Intelligence Platform (EEAAIP) Domain Suite', () => {
  let studentId = uuidv4();
  let teacherId = uuidv4();
  let employeeId = uuidv4();
  let subjectId = uuidv4();
  let classId = uuidv4();
  let toClassId = uuidv4();

  beforeAll(async () => {
    // 1. Ensure the tenant exists in tenant_registry
    const tenantRes = await dbManager.query('SELECT id FROM tenant_registry WHERE id = $1', [tenantId]);
    if (tenantRes.rows.length === 0) {
      await dbManager.query(`
        INSERT INTO tenant_registry (id, tenant_code, tenant_name, domain_name, status, subscription_tier)
        VALUES ($1, $2, $3, $4, $5, $6)
      `, [tenantId, 'ETENANT1', 'Exam Test Tenant', 'exam-tenant.com', 'active', 'enterprise']);
    }

    // 2. Set current setting for app.current_tenant
    await dbManager.query(`SET app.current_tenant = '${tenantId}'`);

    // 3. Ensure student_master and teachers / employees exist for foreign keys
    // Create mock student
    const studentExists = await dbManager.query(`SELECT id FROM student_master WHERE id = $1`, [studentId]);
    if (studentExists.rows.length === 0) {
      await dbManager.query(`
        INSERT INTO student_master (id, tenant_id, student_id, admission_number, gender, date_of_birth, first_name, last_name, academic_status)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      `, [studentId, tenantId, 'STU123', 'ADM123', 'MALE', '2010-01-01', 'Rahul', 'Kumar', 'ACTIVE']);
    }

    // Create mock employee
    const empExists = await dbManager.query(`SELECT id FROM employees WHERE id = $1`, [employeeId]);
    if (empExists.rows.length === 0) {
      await dbManager.query(`
        INSERT INTO employees (id, tenant_id, employee_id, employment_number, first_name, last_name, official_email, phone, date_of_birth, gender, employment_status)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      `, [employeeId, tenantId, 'EMP123', 'EMP_NUM123', 'Suresh', 'Raina', 'suresh@school.com', '9876543211', '1985-01-01', 'MALE', 'ACTIVE']);
    }

    // Create mock teacher
    const teacherExists = await dbManager.query(`SELECT id FROM teachers WHERE id = $1`, [teacherId]);
    if (teacherExists.rows.length === 0) {
      await dbManager.query(`
        INSERT INTO teachers (id, tenant_id, employee_id, teacher_number)
        VALUES ($1, $2, $3, $4)
      `, [teacherId, tenantId, employeeId, 'TCH123']);
    }

    // 4. Read and apply Examination Platform migrations
    const migrationPath = path.join(process.cwd(), 'server', 'database', 'migrations', '006_examination_platform.sql');
    const sql = fs.readFileSync(migrationPath, 'utf8');
    await dbManager.query(sql);
  });

  it('1. should perform Examination CRUD operations successfully with Optimistic Locking', async () => {
    // A. Create Examination
    const exam = await examinationService.createExamination(tenantId, {
      name: 'Mid Term Examination 2026',
      term: 'TERM-1',
      academicYear: '2026',
      startDate: new Date('2026-09-01'),
      endDate: new Date('2026-09-15')
    });

    expect(exam.id).toBeDefined();
    expect(exam.name).toBe('Mid Term Examination 2026');
    expect(exam.version).toBe(1);

    // B. Read Examination
    const uow = new UnitOfWork(tenantId);
    const examRepo = uow.getRepository(ExaminationRepository);
    const fetched = await examRepo.findOne(exam.id);
    expect(fetched).not.toBeNull();
    expect(fetched?.term).toBe('TERM-1');

    // C. Update Examination (with Optimistic Locking)
    const updated = await examRepo.update(exam.id, {
      name: 'Updated Mid Term Examination 2026'
    }, exam.version);

    expect(updated).not.toBeNull();
    expect(updated?.name).toBe('Updated Mid Term Examination 2026');
    expect(updated?.version).toBe(2);

    // D. Test Optimistic Locking Error
    await expect(
      examRepo.update(exam.id, { name: 'Failing Stale Update' }, 1)
    ).rejects.toThrow('Optimistic Locking Error');

    await uow.dispose();
  });

  it('2. should configure schedules, record marks, and compile grading structures', async () => {
    // A. Create Examination
    const exam = await examinationService.createExamination(tenantId, {
      name: 'Final Examination 2026',
      term: 'TERM-2',
      academicYear: '2026',
      startDate: new Date('2026-11-01'),
      endDate: new Date('2026-11-15')
    });

    // B. Configure Exam Schedule
    const schedule = await examinationService.createExaminationSchedule(tenantId, {
      examinationId: exam.id,
      subjectId,
      examDate: new Date('2026-11-05'),
      startTime: '09:00 AM',
      endTime: '12:00 PM',
      maxMarks: 100,
      passingMarks: 40
    });

    expect(schedule.id).toBeDefined();
    expect(schedule.maxMarks).toBe(100);

    // C. Record Marks Entry
    const marks = await examinationService.recordMarks(tenantId, {
      scheduleId: schedule.id,
      studentId,
      obtainedMarks: 75,
      practicalMarks: 10,
      vivaMarks: 5
    });

    expect(marks.id).toBeDefined();
    expect(marks.obtainedMarks).toBe(75);

    // D. Compile Student Grade
    const grade = await examinationService.compileStudentGrade(
      tenantId,
      studentId,
      subjectId,
      'TERM-2',
      '2026',
      15, // Internal
      75  // External
    );

    expect(grade.id).toBeDefined();
    expect(grade.totalMarks).toBe(90);
    expect(grade.grade).toBe('A+');
    expect(grade.points).toBe(10.0);

    // E. Compile GPA
    const gpaRecord = await examinationService.compileGPA(tenantId, studentId, 'TERM-2', '2026');
    expect(gpaRecord.id).toBeDefined();
    expect(gpaRecord.gpa).toBe(10.0);

    // F. Compile CGPA
    const cgpaRecord = await examinationService.compileCGPA(tenantId, studentId, '2026');
    expect(cgpaRecord.id).toBeDefined();
    expect(cgpaRecord.cgpa).toBe(10.0);
  });

  it('3. should process results, declare results, publish results, and promote students', async () => {
    // A. Create Exam & Schedule
    const exam = await examinationService.createExamination(tenantId, {
      name: 'Weekly Assessment 1',
      term: 'TERM-1',
      academicYear: '2026',
      startDate: new Date('2026-08-01'),
      endDate: new Date('2026-08-05')
    });

    const schedule = await examinationService.createExaminationSchedule(tenantId, {
      examinationId: exam.id,
      subjectId,
      examDate: new Date('2026-08-02'),
      startTime: '10:00 AM',
      endTime: '11:00 AM',
      maxMarks: 50,
      passingMarks: 20
    });

    // B. Record Marks
    await examinationService.recordMarks(tenantId, {
      scheduleId: schedule.id,
      studentId,
      obtainedMarks: 35,
      practicalMarks: 0,
      vivaMarks: 0
    });

    // C. Declare and Publish Results
    const results = await examinationService.declareResults(tenantId, exam.id);
    expect(results.length).toBe(1);
    expect(results[0].percentage).toBe(70.00); // 35 / 50 * 100
    expect(results[0].resultStatus).toBe('PASS');

    // D. Promote student
    const promotion = await examinationService.promoteStudent(
      tenantId,
      studentId,
      classId,
      toClassId,
      '2026',
      true,
      'Excellent academic performance'
    );
    expect(promotion.id).toBeDefined();
    expect(promotion.isPromoted).toBe(true);

    // E. Add Remarks
    const remark = await examinationService.addAcademicRemark(tenantId, {
      studentId,
      teacherId,
      term: 'TERM-1',
      academicYear: '2026',
      remarkText: 'Consistent performer, very active in class discussions.',
      severity: 'POSITIVE'
    });
    expect(remark.id).toBeDefined();
    expect(remark.severity).toBe('POSITIVE');
  });

  it('4. should process academic intelligence, predict risk, and trigger AI registries', async () => {
    // A. High risk student performance analysis
    const resultHighRisk = await academicIntelligenceEngine.analyzeStudentPerformance(
      tenantId,
      studentId,
      subjectId,
      45, // Low marks
      70  // Low attendance
    );

    expect(resultHighRisk.performance.riskLevel).toBe('HIGH');
    expect(resultHighRisk.recommendation.recommendationType).toBe('REMEDIATION');
    expect(resultHighRisk.recommendation.recommendationText).toBeDefined();

    // Verify Weak Student Registry enrollment
    const uow = new UnitOfWork(tenantId);
    const weakRepo = uow.getRepository(WeakStudentRegistryRepository);
    const weakList = await weakRepo.findMany();
    const isRegistered = weakList.some(w => w.studentId === studentId);
    expect(isRegistered).toBe(true);

    // B. Gifted student performance analysis
    const resultGifted = await academicIntelligenceEngine.analyzeStudentPerformance(
      tenantId,
      studentId,
      subjectId,
      92, // High marks
      95  // Good attendance
    );

    expect(resultGifted.performance.riskLevel).toBe('LOW');
    expect(resultGifted.recommendation.recommendationType).toBe('ENRICHMENT');

    // Verify Gifted Student Registry enrollment
    const giftRepo = uow.getRepository(GiftedStudentRegistryRepository);
    const giftedList = await giftRepo.findMany();
    const isGiftedRegistered = giftedList.some(g => g.studentId === studentId);
    expect(isGiftedRegistered).toBe(true);

    await uow.dispose();
  });
});
