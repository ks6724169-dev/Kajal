import React from 'react';
import { Calendar as CalendarIcon, CheckCircle2, XCircle, Clock, AlertCircle } from 'lucide-react';
import { DailyAttendanceRecord } from '../../stores/attendanceStore';

interface AttendanceCalendarProps {
  studentId: string;
  dailyRecords: DailyAttendanceRecord[];
}

export const AttendanceCalendar: React.FC<AttendanceCalendarProps> = ({ studentId, dailyRecords }) => {
  const filtered = dailyRecords.filter(r => r.studentId === studentId);
  
  // Custom static 30-day view representing July 2026
  const daysInMonth = Array.from({ length: 31 }, (_, i) => i + 1);

  const getStatusForDay = (day: number) => {
    const dayStr = day < 10 ? `0${day}` : `${day}`;
    const dateKey = `2026-07-${dayStr}`;
    const record = filtered.find(r => r.date === dateKey);
    return record ? record.status : 'no-session';
  };

  const statusColors = {
    present: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-950/30 font-black',
    absent: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-950/30 font-black',
    late: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-950/30 font-black',
    leave: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-950/30 font-black',
    'no-session': 'bg-slate-50 dark:bg-slate-950 border-slate-100 dark:border-slate-800/40 text-slate-300 dark:text-slate-700'
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-4.5 space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center space-x-2">
          <CalendarIcon className="w-4.5 h-4.5 text-indigo-500" />
          <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-100">July 2026 Calendar</h4>
        </div>
        <div className="flex items-center space-x-2 text-[10px] font-bold text-slate-400">
          <span className="flex items-center"><span className="w-2 h-2 rounded-full bg-emerald-500 mr-1"></span>Pres</span>
          <span className="flex items-center"><span className="w-2 h-2 rounded-full bg-rose-500 mr-1"></span>Abs</span>
          <span className="flex items-center"><span className="w-2 h-2 rounded-full bg-amber-500 mr-1"></span>Late</span>
          <span className="flex items-center"><span className="w-2 h-2 rounded-full bg-blue-500 mr-1"></span>Leave</span>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2 text-center text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">
        <span>Mon</span>
        <span>Tue</span>
        <span>Wed</span>
        <span>Thu</span>
        <span>Fri</span>
        <span>Sat</span>
        <span>Sun</span>
      </div>

      <div className="grid grid-cols-7 gap-1.5">
        {/* Fill first 2 days offset for July 1st (Wednesday) */}
        <div className="aspect-square bg-transparent"></div>
        <div className="aspect-square bg-transparent"></div>

        {daysInMonth.map(day => {
          const status = getStatusForDay(day);
          return (
            <div 
              key={day}
              className={`aspect-square border rounded-xl flex flex-col items-center justify-center text-xs transition duration-150 ${statusColors[status]}`}
            >
              <span>{day}</span>
              {status !== 'no-session' && (
                <span className="text-[7px] uppercase font-black tracking-tighter mt-0.5">{status}</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const AttendanceHeatmap: React.FC<AttendanceCalendarProps> = ({ studentId, dailyRecords }) => {
  const filtered = dailyRecords.filter(r => r.studentId === studentId);
  const presentCount = filtered.filter(r => r.status === 'present').length;
  const absentCount = filtered.filter(r => r.status === 'absent').length;
  const lateCount = filtered.filter(r => r.status === 'late').length;
  const leaveCount = filtered.filter(r => r.status === 'leave').length;
  const totalMarked = filtered.length;

  const attendancePercent = totalMarked > 0 ? ((presentCount + lateCount) / totalMarked * 100).toFixed(1) : '100.0';

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-4.5 space-y-4">
      <div className="pb-1.5 border-b border-slate-100 dark:border-slate-800">
        <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-100">Attendance Index Auditing</h4>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col justify-center">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Operational Attendance</span>
          <span className="text-3xl font-black text-indigo-600 dark:text-indigo-400 mt-1">{attendancePercent}%</span>
          <p className="text-[9px] text-slate-400 font-semibold mt-1">Calculated from {totalMarked} recorded sessions this term.</p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="flex items-center text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" />
              Present Days
            </span>
            <span className="font-extrabold text-slate-700 dark:text-slate-300">{presentCount}</span>
          </div>

          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="flex items-center text-rose-600 dark:text-rose-400">
              <XCircle className="w-3.5 h-3.5 mr-1.5" />
              Absent Days
            </span>
            <span className="font-extrabold text-slate-700 dark:text-slate-300">{absentCount}</span>
          </div>

          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="flex items-center text-amber-600 dark:text-amber-400">
              <Clock className="w-3.5 h-3.5 mr-1.5" />
              Late Entries
            </span>
            <span className="font-extrabold text-slate-700 dark:text-slate-300">{lateCount}</span>
          </div>

          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="flex items-center text-blue-600 dark:text-blue-400">
              <AlertCircle className="w-3.5 h-3.5 mr-1.5" />
              Approved Leaves
            </span>
            <span className="font-extrabold text-slate-700 dark:text-slate-300">{leaveCount}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
