import { describe, it, expect, beforeAll } from 'vitest';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { dbManager } from '../database/dbClient.js';
import { financeService } from '../services/FinanceService.js';
import { UnitOfWork } from '../database/unitOfWork.js';
import { 
  FeeStructureRepository,
  PaymentRepository,
  ReceiptRepository,
  AccountRepository
} from '../repositories/FinanceRepository.js';

const tenantId = '123e4567-e89b-12d3-a456-426614174999';

describe('Enterprise Finance, Fee, Accounting & Revenue Management Platform', () => {
  let studentId = uuidv4();
  let accountId1 = uuidv4();
  let accountId2 = uuidv4();

  beforeAll(async () => {
    const tenantRes = await dbManager.query('SELECT id FROM tenant_registry WHERE id = $1', [tenantId]);
    if (tenantRes.rows.length === 0) {
      await dbManager.query(`
        INSERT INTO tenant_registry (id, tenant_code, tenant_name, domain_name, status, subscription_tier)
        VALUES ($1, $2, $3, $4, $5, $6)
      `, [tenantId, 'ETENANT1', 'AI Test Tenant', 'ai-tenant.com', 'active', 'enterprise']);
    }

    await dbManager.query(`SET app.current_tenant = '${tenantId}'`);

    const migrationPath = path.join(process.cwd(), 'server', 'database', 'migrations', '011_finance_platform.sql');
    const sql = fs.readFileSync(migrationPath, 'utf8');
    await dbManager.query(sql);

    const uow = new UnitOfWork(tenantId);
    try {
        await uow.begin();
        const accRepo = uow.getRepository(AccountRepository);
        await accRepo.insert({
           id: accountId1,
           accountCode: 'CASH',
           accountName: 'Cash A/C',
           accountGroup: 'Assets',
           currentBalance: 1000,
           balanceType: 'DEBIT',
           status: 'ACTIVE'
        });
        await accRepo.insert({
           id: accountId2,
           accountCode: 'SALES',
           accountName: 'Sales A/C',
           accountGroup: 'Income',
           currentBalance: 0,
           balanceType: 'CREDIT',
           status: 'ACTIVE'
        });
        await uow.commit();
    } finally {
        await uow.dispose();
    }

  });

  it('1. should create fee structure', async () => {
    const structure = await financeService.createFeeStructure(tenantId, {
      name: 'Class 10 Fee',
      totalAmount: 10000
    }, [
      { installmentName: 'Term 1', dueDate: '2026-06-01', amount: 5000 },
      { installmentName: 'Term 2', dueDate: '2026-11-01', amount: 5000 }
    ]);
    expect(structure.id).toBeDefined();
    expect(structure.totalAmount).toBe(10000);
  });

  it('2. should receive payment and generate receipt', async () => {
    const { payment, receipt } = await financeService.receivePayment(tenantId, studentId, 1500, 'CASH', 'REF123');
    expect(payment.id).toBeDefined();
    expect(payment.amount).toBe(1500);
    expect(receipt.id).toBeDefined();
    expect(receipt.receiptNumber).toContain('REC-');
  });

  it('3. should generate voucher and post to ledger', async () => {
    const voucher = await financeService.generateVoucher(tenantId, 'JOURNAL', new Date(), 500, 'Test Entry', [
       { accountId: accountId1, debitAmount: 500, creditAmount: 0 },
       { accountId: accountId2, debitAmount: 0, creditAmount: 500 }
    ]);
    expect(voucher.id).toBeDefined();
    
    const uow = new UnitOfWork(tenantId);
    const accRepo = uow.getRepository(AccountRepository);
    const acc1 = await accRepo.findOne(accountId1);
    expect(Number(acc1?.currentBalance)).toBe(1500);
    await uow.dispose();
  });

  it('4. should apply scholarship', async () => {
    const scholarship = await financeService.applyScholarship(tenantId, studentId, 'Merit', 2000);
    expect(scholarship.id).toBeDefined();
    expect(scholarship.amount).toBe(2000);
  });

  it('5. should fetch revenue forecast (AI)', async () => {
    const analytics = await financeService.getRevenueAnalytics(tenantId);
    expect(analytics.report).toBeDefined();
    expect(analytics.forecast).toBeDefined();
  });

});
