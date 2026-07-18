import { attendanceEngine } from './AttendanceEngine.js';
import { leaveEngine } from './LeaveEngine.js';
import { payrollEngine } from './PayrollEngine.js';
import { hrAnalyticsEngine } from './HRAnalyticsEngine.js';
import { employeeSelfServiceEngine } from './EmployeeSelfServiceEngine.js';

export class HRPayrollService {
  public async markAttendance(tenantId: string, data: any) {
    return attendanceEngine.markEmployeeAttendance(tenantId, data);
  }
  public async markGPSAttendance(tenantId: string, data: any) {
    return attendanceEngine.markEmployeeGPSAttendance(tenantId, data);
  }
  public async applyLeave(tenantId: string, data: any) {
    return leaveEngine.applyLeave(tenantId, data);
  }
  public async approveLeave(tenantId: string, leaveId: string, approverId: string, status: string, comments?: string) {
    return leaveEngine.approveLeave(tenantId, leaveId, approverId, status, comments);
  }
  public async generatePayroll(tenantId: string, cycleId: string, processedBy: string) {
    return payrollEngine.generatePayroll(tenantId, cycleId, processedBy);
  }
  public async addSalaryComponent(tenantId: string, data: any) {
    return payrollEngine.addSalaryComponent(tenantId, data);
  }
  public async addBankAccount(tenantId: string, data: any) {
    return employeeSelfServiceEngine.addBankAccount(tenantId, data);
  }
  public async applyReimbursement(tenantId: string, data: any) {
    return employeeSelfServiceEngine.applyReimbursement(tenantId, data);
  }
  public async getAttendanceAnalytics(tenantId: string) {
    return hrAnalyticsEngine.getAttendanceAnalytics(tenantId);
  }
  public async getPayrollForecast(tenantId: string) {
    return hrAnalyticsEngine.getPayrollForecast(tenantId);
  }
}

export const hrPayrollService = new HRPayrollService();
