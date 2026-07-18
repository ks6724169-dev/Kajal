import { describe, it, expect, beforeAll } from 'vitest';
import { hrPayrollService } from '../services/HRPayrollService.js';
import { UnitOfWork } from '../database/unitOfWork.js';
import { LeaveTypeRepository, ShiftRepository, SalaryStructureRepository, PayrollCycleRepository } from '../repositories/HRPayrollRepository.js';
import { dbManager } from '../database/dbClient.js';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

const tenantId = '123e4567-e89b-12d3-a456-426614174999';

describe('HR & Payroll Platform Phase 03.2M', () => {
  let employeeId = uuidv4();
  let leaveTypeId = uuidv4();
  let shiftId = uuidv4();
  let structureId = uuidv4();
  let leaveAppId: string;
  let cycleId = uuidv4();

  beforeAll(async () => {
    // Apply migration directly via dbManager
    const migrationPath = path.join(process.cwd(), 'server', 'database', 'migrations', '014_hr_payroll_platform.sql');
    const sql = fs.readFileSync(migrationPath, 'utf8');
    await dbManager.query(sql);

    const uow = new UnitOfWork(tenantId);
    await uow.begin();
    
    // Seed Leave Type
    const ltRepo = uow.getRepository(LeaveTypeRepository);
    await ltRepo.insert({ id: leaveTypeId, typeName: 'Casual Leave', yearlyLimit: 12 });
    
    // Seed Shift
    const shiftRepo = uow.getRepository(ShiftRepository);
    await shiftRepo.insert({ id: shiftId, shiftName: 'General', startTime: '09:00', endTime: '17:00' });
    
    // Seed Salary Structure
    const ssRepo = uow.getRepository(SalaryStructureRepository);
    await ssRepo.insert({ id: structureId, structureName: 'Basic Tier' });

    // Seed Payroll Cycle
    const pcRepo = uow.getRepository(PayrollCycleRepository);
    await pcRepo.insert({ id: cycleId, cycleName: 'October 2025', startDate: new Date('2025-10-01'), endDate: new Date('2025-10-31'), paymentDate: new Date('2025-11-01') });
    
    // Seed Employee
    const uniqueEmail = `test${employeeId.substring(0,8)}@t.com`;
    const empId = `E${employeeId.substring(0,6)}`;
    const empNum = `N${employeeId.substring(0,6)}`;
    await dbManager.query(`INSERT INTO employees (id, tenant_id, employee_id, employment_number, first_name, last_name, official_email, phone, date_of_birth, gender, employment_status) VALUES ($1, $2, $3, $4, 'Test', 'User', $5, '123', '1990-01-01', 'MALE', 'ACTIVE') ON CONFLICT (id) DO NOTHING`, [employeeId, tenantId, empId, empNum, uniqueEmail]);

    await uow.commit();
    await uow.dispose();
  });

  it('1. should mark attendance for an employee', async () => {
    const data = {
      employeeId,
      date: '2025-10-10',
      status: 'PRESENT',
      source: 'MANUAL'
    };
    const record = await hrPayrollService.markAttendance(tenantId, data);
    expect(record).toBeDefined();
    expect(record.status).toBe('PRESENT');
  });

  it('2. should mark GPS attendance', async () => {
    const data = {
      employeeId,
      latitude: 12.9716,
      longitude: 77.5946,
      punchTime: new Date().toISOString()
    };
    const record = await hrPayrollService.markGPSAttendance(tenantId, data);
    expect(record).toBeDefined();
    expect(parseFloat(record.latitude)).toBe(12.9716);
  });

  it('3. should apply for leave', async () => {
    const data = {
      employeeId,
      leaveTypeId,
      startDate: '2025-11-01',
      endDate: '2025-11-02',
      days: 2,
      reason: 'Sick leave'
    };
    const leave = await hrPayrollService.applyLeave(tenantId, data);
    expect(leave).toBeDefined();
    expect(leave.status).toBe('PENDING');
    leaveAppId = leave.id;
  });

  it('4. should approve leave', async () => {
    const approverId = '99999999-8888-7777-6666-555555555555';
    const approval = await hrPayrollService.approveLeave(tenantId, leaveAppId, approverId, 'APPROVED', 'Looks good');
    expect(approval).toBeDefined();
    expect(approval.approvalStatus).toBe('APPROVED');
  });

  it('5. should add a salary component', async () => {
    const data = {
      structureId,
      componentName: 'Basic Pay',
      componentType: 'EARNING',
      amountType: 'FIXED',
      amountValue: 50000
    };
    const comp = await hrPayrollService.addSalaryComponent(tenantId, data);
    expect(comp).toBeDefined();
    expect(comp.componentName).toBe('Basic Pay');
  });

  it('6. should generate payroll run', async () => {
    const processedBy = '99999999-8888-7777-6666-555555555555';
    const run = await hrPayrollService.generatePayroll(tenantId, cycleId, processedBy);
    expect(run).toBeDefined();
    expect(run.status).toBe('PROCESSED');
  });

  it('7. should add a bank account for ESS', async () => {
    const data = {
      employeeId,
      bankName: 'Global Bank',
      accountNumber: '1234567890',
      ifscCode: 'GLOB0001'
    };
    const acc = await hrPayrollService.addBankAccount(tenantId, data);
    expect(acc).toBeDefined();
    expect(acc.bankName).toBe('Global Bank');
  });

  it('8. should get attendance analytics', async () => {
    const analytics = await hrPayrollService.getAttendanceAnalytics(tenantId);
    expect(analytics.report).toBeDefined();
    expect(analytics.insights).toBeDefined();
  });

  it('9. should get payroll forecast', async () => {
    const forecast = await hrPayrollService.getPayrollForecast(tenantId);
    expect(forecast.forecast).toBeDefined();
    expect(forecast.insights).toBeDefined();
  });
});
