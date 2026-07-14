import React, { useState } from 'react';
import { UserCheck, UserX, Clock, Calendar, CheckSquare, Square, Search } from 'lucide-react';
import { initialStudents } from './studentData';

export const AttendanceView: React.FC = () => {
  const [attendance, setAttendance] = useState<Record<string, 'Present' | 'Absent' | 'Late'>>(
    initialStudents.reduce((acc, st) => ({ ...acc, [st.id]: 'Present' }), {})
  );

  const toggleStatus = (id: string, status: 'Present' | 'Absent' | 'Late') => {
    setAttendance({ ...attendance, [id]: status });
  };

  const presentCount = Object.values(attendance).filter(s => s === 'Present').length;
  const absentCount = Object.values(attendance).filter(s => s === 'Absent').length;
  const lateCount = Object.values(attendance).filter(s => s === 'Late').length;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Daily Attendance Management</h2>
          <p className="text-xs text-slate-500 mt-0.5">Mark and review attendance for Grade 10 - Section A</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 bg-emerald-50 text-emerald-700 rounded-xl text-xs font-bold border border-emerald-200">
            Present: {presentCount}
          </div>
          <div className="px-4 py-2 bg-rose-50 text-rose-700 rounded-xl text-xs font-bold border border-rose-200">
            Absent: {absentCount}
          </div>
          <div className="px-4 py-2 bg-amber-50 text-amber-700 rounded-xl text-xs font-bold border border-amber-200">
            Late: {lateCount}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-indigo-600" />
            <h3 className="font-bold text-slate-900">Today's Attendance Sheet — {new Date().toLocaleDateString()}</h3>
          </div>
          <button 
            onClick={() => alert('Attendance submitted and synchronized with cloud successfully!')}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-sm transition"
          >
            Save Attendance
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-4 px-6">Roll No</th>
                <th className="py-4 px-6">Student Name</th>
                <th className="py-4 px-6">Admission No</th>
                <th className="py-4 px-6 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-700">
              {initialStudents.map(student => {
                const status = attendance[student.id];
                return (
                  <tr key={student.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-4 px-6 font-bold text-slate-900">{student.rollNumber}</td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <img 
                          src={student.photo} 
                          alt={student.name} 
                          className="w-9 h-9 rounded-full object-cover border border-slate-200 shadow-sm"
                          referrerPolicy="no-referrer"
                        />
                        <span className="font-bold text-slate-900">{student.name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 font-mono text-slate-500">{student.admissionNumber}</td>
                    <td className="py-4 px-6 text-center">
                      <div className="inline-flex rounded-xl bg-slate-100 p-1 border border-slate-200">
                        <button
                          onClick={() => toggleStatus(student.id, 'Present')}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${status === 'Present' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
                        >
                          Present
                        </button>
                        <button
                          onClick={() => toggleStatus(student.id, 'Absent')}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${status === 'Absent' ? 'bg-rose-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
                        >
                          Absent
                        </button>
                        <button
                          onClick={() => toggleStatus(student.id, 'Late')}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${status === 'Late' ? 'bg-amber-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
                        >
                          Late
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
