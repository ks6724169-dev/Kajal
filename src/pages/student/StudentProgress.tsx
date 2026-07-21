import React, { useState } from 'react';
import { useStudents } from '../../hooks/useStudents';
import { AcademicChart, PerformanceGraph } from '../../components/student/AcademicCharts';
import { Star, Award, TrendingUp } from 'lucide-react';

export const StudentProgress: React.FC = () => {
  const { students } = useStudents();
  const [selectedStudent, setSelectedStudent] = useState(students[0]?.id || '');

  const student = students.find(s => s.id === selectedStudent) || students[0];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-800 dark:text-slate-100 tracking-tight">Academic Progress & GPA Analytical Board</h2>
          <p className="text-xs text-slate-400 font-medium">Verify terminal GPA progressions, subject audits, and cumulative grade averages.</p>
        </div>

        <select 
          value={selectedStudent} 
          onChange={e => setSelectedStudent(e.target.value)} 
          className="form-select bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-3.5 py-2.5 rounded-xl text-xs font-bold outline-none cursor-pointer text-slate-700 dark:text-slate-300"
        >
          {students.map(s => (
            <option key={s.id} value={s.id}>{s.name} ({s.grade})</option>
          ))}
        </select>
      </div>

      {student && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Selected Student GPA</span>
            <div className="flex items-baseline space-x-1.5 mt-1">
              <span className="text-3xl font-black text-indigo-600 dark:text-indigo-400">{student.gpa.toFixed(2)}</span>
              <span className="text-[10px] font-bold text-emerald-500 uppercase">Term score</span>
            </div>
          </div>

          <div className="p-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Attendance SLA</span>
            <div className="flex items-baseline space-x-1.5 mt-1">
              <span className="text-3xl font-black text-indigo-600 dark:text-indigo-400">{student.attendanceRate}%</span>
              <span className="text-[10px] font-bold text-emerald-500 uppercase">Verified</span>
            </div>
          </div>

          <div className="p-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Conduct Rating</span>
            <div className="flex items-baseline space-x-1.5 mt-1">
              <span className="text-3xl font-black text-indigo-600 dark:text-indigo-400">{student.behaviourScore}</span>
              <span className="text-[10px] font-bold text-emerald-500 uppercase">Merits</span>
            </div>
          </div>
        </div>
      )}

      {/* Recharts Progress Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AcademicChart />
        <PerformanceGraph />
      </div>

      <style>{`
        .form-select {
          width: auto;
          background: rgb(248, 250, 252);
          border: 1px solid rgb(226, 232, 240);
          border-radius: 12px;
          padding: 10px 14px;
          font-size: 12px;
          font-weight: 600;
          color: rgb(51, 65, 85);
          outline: none;
          cursor: pointer;
        }
        .dark .form-select {
          background: rgb(15, 23, 42);
          border-color: rgb(30, 41, 59);
          color: rgb(226, 226, 240);
        }
      `}</style>
    </div>
  );
};
