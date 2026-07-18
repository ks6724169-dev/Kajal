import { Request, Response, NextFunction } from 'express';
import { financeService } from '../services/FinanceService.js';
import { sendSuccess } from '../core/response.js';
import { ValidationError } from '../errors/AppError.js';
import {
  CreateFeeStructureSchema,
  ReceivePaymentSchema,
  ApplyScholarshipSchema,
  ApplyConcessionSchema,
  ProcessRefundSchema,
  GenerateVoucherSchema,
  RecordExpenseSchema
} from '../validators/FinanceValidator.js';
import { feeEngine } from '../services/FeeEngine.js';
import { UnitOfWork } from '../database/unitOfWork.js';

export class FinanceController {
  
  private getTenantId(req: Request): string {
    const tenantId = req.headers['x-tenant-id'] as string;
    if (!tenantId) {
      throw new ValidationError('Tenant ID (x-tenant-id) is required in headers');
    }
    return tenantId;
  }

  public async createFeeStructure(req: Request, res: Response, next: NextFunction) {
    try {
      const tenantId = this.getTenantId(req);
      const parsed = CreateFeeStructureSchema.safeParse(req.body);
      if (!parsed.success) {
        throw new ValidationError('Validation failed', parsed.error.format());
      }
      const { installments, ...data } = parsed.data;
      if (installments) {
        installments.forEach((i: any) => i.dueDate = new Date(i.dueDate));
      }
      const result = await financeService.createFeeStructure(tenantId, data, installments || []);
      sendSuccess(res, result);
    } catch (error) {
      next(error);
    }
  }

  public async receivePayment(req: Request, res: Response, next: NextFunction) {
    try {
      const tenantId = this.getTenantId(req);
      const parsed = ReceivePaymentSchema.safeParse(req.body);
      if (!parsed.success) {
        throw new ValidationError('Validation failed', parsed.error.format());
      }
      const { studentId, amount, paymentMode, referenceNumber } = parsed.data;
      const result = await financeService.receivePayment(tenantId, studentId, amount, paymentMode, referenceNumber);
      sendSuccess(res, result);
    } catch (error) {
      next(error);
    }
  }

  public async applyScholarship(req: Request, res: Response, next: NextFunction) {
    try {
      const tenantId = this.getTenantId(req);
      const parsed = ApplyScholarshipSchema.safeParse(req.body);
      if (!parsed.success) {
        throw new ValidationError('Validation failed', parsed.error.format());
      }
      const { studentId, name, amount } = parsed.data;
      const result = await financeService.applyScholarship(tenantId, studentId, name, amount);
      sendSuccess(res, result);
    } catch (error) {
      next(error);
    }
  }

  public async processRefund(req: Request, res: Response, next: NextFunction) {
     try {
        const tenantId = this.getTenantId(req);
        const parsed = ProcessRefundSchema.safeParse(req.body);
        if (!parsed.success) {
           throw new ValidationError('Validation failed', parsed.error.format());
        }
        const { studentId, amount, reason, paymentId } = parsed.data;
        const uow = new UnitOfWork(tenantId);
        try {
           await uow.begin();
           const result = await feeEngine.processRefund(uow, studentId, amount, reason, paymentId);
           await uow.commit();
           sendSuccess(res, result);
        } catch(e) {
           await uow.rollback();
           throw e;
        } finally {
           await uow.dispose();
        }
     } catch (error) {
        next(error);
     }
  }

  public async generateVoucher(req: Request, res: Response, next: NextFunction) {
    try {
      const tenantId = this.getTenantId(req);
      const parsed = GenerateVoucherSchema.safeParse(req.body);
      if (!parsed.success) {
        throw new ValidationError('Validation failed', parsed.error.format());
      }
      const { voucherType, voucherDate, totalAmount, narration, entries } = parsed.data;
      const result = await financeService.generateVoucher(tenantId, voucherType, new Date(voucherDate), totalAmount, narration || '', entries);
      sendSuccess(res, result);
    } catch (error) {
      next(error);
    }
  }

  public async getRevenueAnalytics(req: Request, res: Response, next: NextFunction) {
    try {
      const tenantId = this.getTenantId(req);
      const result = await financeService.getRevenueAnalytics(tenantId);
      sendSuccess(res, result);
    } catch (error) {
      next(error);
    }
  }
}

export const financeController = new FinanceController();
