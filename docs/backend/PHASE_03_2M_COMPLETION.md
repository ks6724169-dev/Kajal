# Phase 03.2M: Enterprise HR, Payroll, Leave, Attendance & Employee Self-Service Platform (EHRPLESP)

## Overview
Phase 03.2M implements a robust Backend Infrastructure for managing human resources, payroll processes, leave management, and employee self-service capabilities. 

## Files Created/Edited
- **Migrations:** `server/database/migrations/014_hr_payroll_platform.sql`
- **Entities:** `server/entities/HRPayrollDomain.ts`
- **Repositories:** `server/repositories/HRPayrollRepository.ts`
- **Validators:** `server/validators/HRPayrollValidator.ts`
- **Engines:**
  - `server/services/AttendanceEngine.ts` (Modified)
  - `server/services/LeaveEngine.ts`
  - `server/services/PayrollEngine.ts`
  - `server/services/HRAnalyticsEngine.ts`
  - `server/services/EmployeeSelfServiceEngine.ts`
- **Service:** `server/services/HRPayrollService.ts`
- **Controller:** `server/controllers/HRPayrollController.ts`
- **Router:** `server/routes/hr-payroll.ts`
- **Gateway:** `server/gateway/v1.ts` (Modified)
- **Tests:** `server/tests/hrPayroll.test.ts`

## Database Objects Created
Tables created with RLS and Audit Triggers:
- `shift_master`, `shift_assignment`, `holiday_master`
- `employee_attendance`, `biometric_attendance`, `gps_attendance`, `face_attendance`, `attendance_correction`
- `leave_type`, `leave_balance`, `leave_application`, `leave_approval`
- `payroll_cycle`, `salary_structure`, `salary_component`, `employee_salary`
- `payroll_run`, `payslip`, `payroll_adjustment`, `payroll_bonus`, `payroll_incentive`, `payroll_deduction`, `payroll_ledger`, `payroll_audit`
- `employee_loan`, `loan_installment`, `advance_salary`, `reimbursement`, `claim`
- `tax_profile`, `pf_account`, `esi_account`, `professional_tax`, `tds_profile`
- `employee_document`, `employee_bank_account`, `employee_self_service`

## APIs Added
Mounted on `/api/gateway/v1/hr-payroll`:
- **POST** `/attendance`
- **POST** `/attendance/gps`
- **POST** `/leave`
- **POST** `/leave/approve`
- **POST** `/payroll/generate`
- **POST** `/payroll/salary-component`
- **POST** `/ess/bank-account`
- **POST** `/ess/reimbursement`
- **GET** `/analytics/attendance`
- **GET** `/analytics/payroll`

## Business Rules Implemented
- **Attendance Rules:** Enforces attendance statuses (PRESENT, ABSENT, etc.) and integrates GPS checks.
- **Leave Workflow:** Processes leave applications and routes them for approvals with `PENDING`, `APPROVED`, or `REJECTED` states.
- **Payroll Rules:** Supports flexible salary structures, components (EARNING/DEDUCTION), and calculates gross vs. net salaries in standard payroll runs.
- **ESS rules:** Allows employees to add banking details and file reimbursements/claims independently.

## AI Features Integrated
- `HRAnalyticsEngine` integrated with `AIGateway` for generating textual analytics on attendance patterns (burnout risks) and payroll forecasts.

## Security Features
- Validated via `Zod`.
- Uses `tenantMiddleware` for multi-tenancy.
- Secures routes using `authenticate` (JWT) and `requireRole` (RBAC & ABAC).
- Row-Level Security (RLS) is enabled on all tables in the database ensuring data isolation.

## Test Coverage Summary
Integration tests covering:
- Regular and GPS Attendance tracking
- Leave Application & Approval flows
- Salary Component additions & Payroll Cycle Generation
- Adding Bank Accounts for ESS
- Retrieving AI-generated Analytics & Forecasts
- Handled via `server/tests/hrPayroll.test.ts`
