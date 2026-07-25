import React from 'react';
import { ComingSoonModule } from '../../components/common/ComingSoonModule';

export const HrmsPayroll: React.FC = () => {
  return (
    <div className="p-6">
      <ComingSoonModule 
        title="HRMS, Teacher Directory & Payroll Engine"
        subtitle="Staff attendance, salary slips, EPF/ESI calculations, leave approvals, and biometric teacher clock-ins are undergoing live database integration. Demo data has been purged."
        category="Human Resources"
        features={[
          "Staff Directory & Profile Records",
          "Automated Monthly Salary Slips",
          "EPF / ESI Statutory Deductions",
          "Leave Application & Approval Workflow",
          "Biometric Attendance Integration"
        ]}
      />
    </div>
  );
};
