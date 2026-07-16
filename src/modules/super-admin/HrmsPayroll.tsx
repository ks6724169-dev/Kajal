import React, { useState } from 'react';
import { INITIAL_TEACHERS } from '../../constants/mockData';
import { Teacher } from '../../types';
import { Briefcase, DollarSign, CheckCircle2, ShieldCheck } from 'lucide-react';
import confetti from 'canvas-confetti';

export const HrmsPayroll: React.FC = () => {
  const [teachers, setTeachers] = useState<Teacher[]>(INITIAL_TEACHERS);
  const [payslipGenerated, setPayslipGenerated] = useState<string | null>(null);

  const handleGeneratePayslip = (t: Teacher) => {
    setPayslipGenerated(t.name);
    confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">HRMS & Faculty Payroll Management</h1>
        <p className="text-xs text-slate-500">Staff directory, automated monthly salary calculation, tax deductions, and one-click payslip generation.</p>
      </div>

      <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="p-4">Faculty & ID</th>
                <th className="p-4">Department & Subject</th>
                <th className="p-4">Assigned Classes</th>
                <th className="p-4">Monthly Salary</th>
                <th className="p-4">Attendance</th>
                <th className="p-4 text-right">Payroll Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {teachers.map(t => (
                <tr key={t.id} className="hover:bg-slate-50/80 transition">
                  <td className="p-4">
                    <div className="font-bold text-slate-900">{t.name}</div>
                    <div className="text-[11px] text-slate-500 font-mono">{t.employeeId}</div>
                  </td>
                  <td className="p-4">
                    <div className="font-medium text-slate-800">{t.department}</div>
                    <div className="text-[11px] text-slate-500">{t.subject}</div>
                  </td>
                  <td className="p-4">
                    <div className="flex flex-wrap gap-1">
                      {t.classesAssigned.map((c, i) => (
                        <span key={i} className="bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded text-[10px] font-semibold">
                          {c}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="p-4 font-bold text-slate-900">₹{t.salary.toLocaleString()} /mo</td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                      t.attendanceToday === 'present' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {t.attendanceToday}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => handleGeneratePayslip(t)}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded-lg font-semibold transition inline-flex items-center space-x-1"
                    >
                      <DollarSign className="w-3.5 h-3.5" />
                      <span>Generate Payslip</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {payslipGenerated && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <CheckCircle2 className="w-6 h-6 text-emerald-600" />
            <div>
              <div className="font-bold text-sm text-emerald-900">Payslip generated successfully for {payslipGenerated}!</div>
              <div className="text-xs text-emerald-700">Tax deductions and EPF synced. Disbursed via direct bank transfer.</div>
            </div>
          </div>
          <button onClick={() => setPayslipGenerated(null)} className="text-xs font-semibold text-emerald-800 hover:underline">
            Dismiss
          </button>
        </div>
      )}
    </div>
  );
};
