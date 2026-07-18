import { Request, Response } from 'express';
import { hrPayrollService } from '../services/HRPayrollService.js';
import { 
  MarkAttendanceSchema, GPSAttendanceSchema, ApplyLeaveSchema, ApproveLeaveSchema, 
  GeneratePayrollSchema, AddSalaryComponentSchema, ApplyReimbursementSchema, AddBankAccountSchema 
} from '../validators/HRPayrollValidator.js';

export class HRPayrollController {
  public async markAttendance(req: Request, res: Response) {
    try {
      const user = (req as any).user;
      const tenantId = user.tenant_id;
      const data = MarkAttendanceSchema.parse(req.body);
      const result = await hrPayrollService.markAttendance(tenantId, data);
      res.status(201).json(result);
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  }

  public async markGPSAttendance(req: Request, res: Response) {
    try {
      const user = (req as any).user;
      const tenantId = user.tenant_id;
      const data = GPSAttendanceSchema.parse(req.body);
      const result = await hrPayrollService.markGPSAttendance(tenantId, data);
      res.status(201).json(result);
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  }

  public async applyLeave(req: Request, res: Response) {
    try {
      const user = (req as any).user;
      const tenantId = user.tenant_id;
      const data = ApplyLeaveSchema.parse(req.body);
      const result = await hrPayrollService.applyLeave(tenantId, data);
      res.status(201).json(result);
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  }

  public async approveLeave(req: Request, res: Response) {
    try {
      const user = (req as any).user;
      const tenantId = user.tenant_id;
      const { leaveApplicationId, approvalStatus, comments } = ApproveLeaveSchema.parse(req.body);
      const approverId = user.id;
      const result = await hrPayrollService.approveLeave(tenantId, leaveApplicationId, approverId, approvalStatus, comments);
      res.json(result);
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  }

  public async generatePayroll(req: Request, res: Response) {
    try {
      const user = (req as any).user;
      const tenantId = user.tenant_id;
      const { cycleId } = GeneratePayrollSchema.parse(req.body);
      const processedBy = user.id;
      const result = await hrPayrollService.generatePayroll(tenantId, cycleId, processedBy);
      res.status(201).json(result);
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  }

  public async addSalaryComponent(req: Request, res: Response) {
    try {
      const user = (req as any).user;
      const tenantId = user.tenant_id;
      const data = AddSalaryComponentSchema.parse(req.body);
      const result = await hrPayrollService.addSalaryComponent(tenantId, data);
      res.status(201).json(result);
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  }

  public async addBankAccount(req: Request, res: Response) {
    try {
      const user = (req as any).user;
      const tenantId = user.tenant_id;
      const data = AddBankAccountSchema.parse(req.body);
      const result = await hrPayrollService.addBankAccount(tenantId, data);
      res.status(201).json(result);
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  }

  public async applyReimbursement(req: Request, res: Response) {
    try {
      const user = (req as any).user;
      const tenantId = user.tenant_id;
      const data = ApplyReimbursementSchema.parse(req.body);
      const result = await hrPayrollService.applyReimbursement(tenantId, data);
      res.status(201).json(result);
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  }

  public async getAttendanceAnalytics(req: Request, res: Response) {
    try {
      const user = (req as any).user;
      const tenantId = user.tenant_id;
      const result = await hrPayrollService.getAttendanceAnalytics(tenantId);
      res.json(result);
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  }

  public async getPayrollForecast(req: Request, res: Response) {
    try {
      const user = (req as any).user;
      const tenantId = user.tenant_id;
      const result = await hrPayrollService.getPayrollForecast(tenantId);
      res.json(result);
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  }
}

export const hrPayrollController = new HRPayrollController();
