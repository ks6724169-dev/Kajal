import React from 'react';
import { Calendar, Clock, BookOpen, Star, AlertCircle } from 'lucide-react';
import { Role } from '../../types';

interface CalendarWidgetProps {
  role: Role;
}

interface ScheduleItem {
  time: string;
  subject: string;
  instructorOrClass: string;
  room?: string;
  status: 'upcoming' | 'ongoing' | 'completed';
}

export const CalendarWidget: React.FC<CalendarWidgetProps> = ({ role }) => {
  const getSchedule = (): ScheduleItem[] => {
    switch (role) {
      case 'teacher':
        return [
          { time: '09:00 AM - 09:45 AM', subject: 'Grade 11-A Calculus', instructorOrClass: 'Room 302', status: 'completed' },
          { time: '10:00 AM - 10:45 AM', subject: 'Grade 10-B Algebra 2', instructorOrClass: 'Room 204', status: 'ongoing' },
          { time: '11:15 AM - 12:00 PM', subject: 'Grade 12-C Physics Lab', instructorOrClass: 'Science Lab 1', status: 'upcoming' },
          { time: '02:00 PM - 02:45 PM', subject: 'Grade 9-A Trigonometry', instructorOrClass: 'Room 101', status: 'upcoming' },
        ];
      case 'student':
        return [
          { time: '09:00 AM - 09:45 AM', subject: 'Mathematics Section A', instructorOrClass: 'Dr. Rajesh Sharma', room: 'Room 302', status: 'completed' },
          { time: '10:00 AM - 10:45 AM', subject: 'English Language Class', instructorOrClass: 'Mrs. Neha Gupta', room: 'Room 204', status: 'ongoing' },
          { time: '11:15 AM - 12:00 PM', subject: 'Computer Science Lab', instructorOrClass: 'Mr. Amit Verma', room: 'IT Hub Node B', status: 'upcoming' },
          { time: '01:30 PM - 02:15 PM', subject: 'History / Social Studies', instructorOrClass: 'Dr. Sonia Sen', room: 'Room 102', status: 'upcoming' },
        ];
      default:
        return [
          { time: '09:30 AM', subject: 'Daily Administration Sync', instructorOrClass: 'Principal Office', status: 'completed' },
          { time: '11:00 AM', subject: 'Fee Collection Reconciliation', instructorOrClass: 'Accounts Desk', status: 'ongoing' },
          { time: '01:00 PM', subject: 'Special Parent Orientation Meet', instructorOrClass: 'Auditorium Block A', status: 'upcoming' },
          { time: '04:00 PM', subject: 'Board Review meeting', instructorOrClass: 'Main Conference Hall', status: 'upcoming' },
        ];
    }
  };

  const events = [
    { date: 'Jul 24', title: 'Mid-term Exams Begin', type: 'critical' },
    { date: 'Aug 02', title: 'Annual Cultural Festival', type: 'info' },
    { date: 'Aug 10', title: 'Parent-Teacher Meet', type: 'warning' },
  ];

  return (
    <div className="space-y-4 w-full">
      {/* Schedule List */}
      <div>
        <div className="flex items-center justify-between mb-2 pb-1 border-b border-slate-100 dark:border-slate-800/40">
          <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Today's Class Schedule</span>
          <span className="text-[10px] text-indigo-500 dark:text-indigo-400 font-bold hover:underline cursor-pointer">Full Calendar</span>
        </div>
        <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
          {getSchedule().map((item, idx) => (
            <div 
              key={idx} 
              className={`p-2.5 rounded-xl border flex items-start justify-between transition-colors ${
                item.status === 'ongoing' 
                  ? 'bg-indigo-500/5 border-indigo-200 dark:border-indigo-800/40' 
                  : item.status === 'completed' 
                  ? 'bg-slate-50/40 border-slate-100 dark:border-slate-900/10 opacity-60' 
                  : 'bg-white dark:bg-slate-900/20 border-slate-100 dark:border-slate-800/40'
              }`}
            >
              <div className="flex items-start space-x-2.5 min-w-0">
                <div className="mt-0.5 shrink-0">
                  {item.status === 'ongoing' ? (
                    <span className="relative flex h-2 w-2 mt-1">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                    </span>
                  ) : (
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                  )}
                </div>
                <div className="min-w-0">
                  <div className={`text-xs font-bold leading-tight ${item.status === 'ongoing' ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-700 dark:text-slate-200'}`}>
                    {item.subject}
                  </div>
                  <div className="text-[10px] text-slate-400 dark:text-slate-500 font-medium mt-0.5 flex items-center gap-1">
                    <span>{item.instructorOrClass}</span>
                    {item.room && <span>• {item.room}</span>}
                  </div>
                </div>
              </div>
              <span className="text-[9px] font-bold uppercase shrink-0 px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 tracking-wider">
                {item.time.split(' ')[0]}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Event Dates */}
      <div className="pt-2 border-t border-slate-100 dark:border-slate-800/40">
        <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-2">Upcoming Academic Events</span>
        <div className="grid grid-cols-1 gap-2">
          {events.map((evt, idx) => (
            <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-slate-50/50 dark:bg-slate-900/50 border border-slate-100/50 dark:border-slate-800/20">
              <div className="flex items-center space-x-2.5 min-w-0">
                <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                  evt.type === 'critical' ? 'bg-rose-500' : evt.type === 'warning' ? 'bg-amber-500' : 'bg-blue-500'
                }`} />
                <span className="text-[11px] font-bold text-slate-700 dark:text-slate-200 truncate">{evt.title}</span>
              </div>
              <span className="text-[9px] font-bold text-slate-400 bg-white dark:bg-slate-800 border border-slate-200/50 dark:border-slate-700/50 rounded px-1.5 py-0.5 shrink-0 uppercase">
                {evt.date}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
