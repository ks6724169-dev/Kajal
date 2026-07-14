import React, { useState } from 'react';
import { CalendarDays, Clock, MapPin, Users, BookOpen, Filter } from 'lucide-react';

export const TimetableView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'today' | 'weekly' | 'monthly'>('today');
  const [selectedDay, setSelectedDay] = useState<string>('Monday');

  const todaySchedule = [
    { period: '1st', time: '08:00 AM - 08:45 AM', subject: 'Advanced Calculus', class: 'Grade 10', section: 'Section A', room: 'Room 101' },
    { period: '2nd', time: '08:45 AM - 09:30 AM', subject: 'Linear Algebra', class: 'Grade 11', section: 'Section B', room: 'Lab 2' },
    { period: '3rd', time: '09:30 AM - 10:15 AM', subject: 'Trigonometry', class: 'Grade 12', section: 'Section A', room: 'Room 105' },
    { period: 'Break', time: '10:15 AM - 10:45 AM', subject: 'Recess / Tea Break', class: '-', section: '-', room: 'Staff Lounge' },
    { period: '4th', time: '10:45 AM - 11:30 AM', subject: 'General Mathematics', class: 'Grade 9', section: 'Section C', room: 'Room 102' },
    { period: '5th', time: '11:30 AM - 12:15 PM', subject: 'Mentorship & Counseling', class: 'Grade 10', section: 'Section A', room: 'Counseling Hall' },
  ];

  const weeklyScheduleData: Record<string, typeof todaySchedule> = {
    'Monday': todaySchedule,
    'Tuesday': [
      { period: '1st', time: '08:00 AM - 08:45 AM', subject: 'Physics AP', class: 'Grade 11', section: 'Section A', room: 'Lab 1' },
      { period: '2nd', time: '08:45 AM - 09:30 AM', subject: 'Advanced Calculus', class: 'Grade 10', section: 'Section A', room: 'Room 101' },
      { period: '3rd', time: '09:30 AM - 10:15 AM', subject: 'Statistics', class: 'Grade 12', section: 'Section B', room: 'Room 103' },
      { period: 'Break', time: '10:15 AM - 10:45 AM', subject: 'Recess', class: '-', section: '-', room: 'Cafeteria' },
      { period: '4th', time: '10:45 AM - 11:30 AM', subject: 'Linear Algebra', class: 'Grade 11', section: 'Section B', room: 'Lab 2' },
    ],
    'Wednesday': [
      { period: '1st', time: '08:00 AM - 08:45 AM', subject: 'Trigonometry', class: 'Grade 12', section: 'Section A', room: 'Room 105' },
      { period: '2nd', time: '08:45 AM - 09:30 AM', subject: 'General Mathematics', class: 'Grade 9', section: 'Section C', room: 'Room 102' },
      { period: '3rd', time: '09:30 AM - 10:15 AM', subject: 'Advanced Calculus', class: 'Grade 10', section: 'Section B', room: 'Room 101' },
      { period: 'Break', time: '10:15 AM - 10:45 AM', subject: 'Recess', class: '-', section: '-', room: 'Staff Lounge' },
      { period: '4th', time: '10:45 AM - 11:30 AM', subject: 'Department Meeting', class: 'Faculty', section: 'All', room: 'Conference Room 3' },
    ],
    'Thursday': [
      { period: '1st', time: '08:00 AM - 08:45 AM', subject: 'Linear Algebra', class: 'Grade 11', section: 'Section A', room: 'Lab 2' },
      { period: '2nd', time: '08:45 AM - 09:30 AM', subject: 'Statistics', class: 'Grade 12', section: 'Section A', room: 'Room 103' },
      { period: '3rd', time: '09:30 AM - 10:15 AM', subject: 'Advanced Calculus', class: 'Grade 10', section: 'Section A', room: 'Room 101' },
      { period: 'Break', time: '10:15 AM - 10:45 AM', subject: 'Recess', class: '-', section: '-', room: 'Cafeteria' },
      { period: '4th', time: '10:45 AM - 11:30 AM', subject: 'STEM Project Guidance', class: 'Grade 11', section: 'All', room: 'Innovation Lab' },
    ],
    'Friday': [
      { period: '1st', time: '08:00 AM - 08:45 AM', subject: 'General Mathematics', class: 'Grade 9', section: 'Section C', room: 'Room 102' },
      { period: '2nd', time: '08:45 AM - 09:30 AM', subject: 'Trigonometry', class: 'Grade 12', section: 'Section B', room: 'Room 105' },
      { period: '3rd', time: '09:30 AM - 10:15 AM', subject: 'Advanced Calculus', class: 'Grade 10', section: 'Section B', room: 'Room 101' },
      { period: 'Break', time: '10:15 AM - 10:45 AM', subject: 'Recess', class: '-', section: '-', room: 'Staff Lounge' },
      { period: '4th', time: '10:45 AM - 11:30 AM', subject: 'Weekly Assessment Review', class: 'Grade 10', section: 'All', room: 'Auditorium' },
    ]
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-20">
      {/* Header & Tabs */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <CalendarDays className="w-6 h-6 text-indigo-600" />
            Teacher Timetable & Schedule Management
          </h2>
          <p className="text-xs text-slate-500 mt-1">View today's timetable, weekly schedule breakdown, and monthly timetable overview.</p>
        </div>

        <div className="flex bg-slate-100 p-1.5 rounded-2xl w-full md:w-auto overflow-x-auto">
          {(['today', 'weekly', 'monthly'] as const).map(tab => (
            <button 
              key={tab} 
              onClick={() => setActiveTab(tab)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${activeTab === tab ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
            >
              {tab === 'today' ? "Today" : tab === 'weekly' ? 'Weekly' : 'Monthly'}
            </button>
          ))}
        </div>
      </div>

      {/* Weekly Days Bar */}
      {activeTab === 'weekly' && (
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {Object.keys(weeklyScheduleData).map(day => (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${selectedDay === day ? 'bg-indigo-600 text-white shadow-sm' : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'}`}
            >
              {day}
            </button>
          ))}
        </div>
      )}

      {/* Main Timetable Card */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              {activeTab === 'today' ? "Today's Schedule (Monday, July 11, 2026)" : activeTab === 'weekly' ? `${selectedDay}'s Schedule` : 'Monthly Master Timetable Overview'}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">Showing period, subject, class, section, room, and timing details.</p>
          </div>
          <span className="text-xs px-2.5 py-1 bg-indigo-50 text-indigo-700 font-semibold rounded-lg">Active Term</span>
        </div>

        {activeTab === 'monthly' ? (
          <div className="space-y-4">
            <p className="text-xs text-slate-500">Monthly schedule rotation follows Standard Week A / Week B timetable configuration.</p>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {Object.keys(weeklyScheduleData).map((dayName) => (
                <div key={dayName} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                  <h4 className="text-sm font-bold text-slate-900 border-b border-slate-200 pb-2">{dayName}</h4>
                  <div className="space-y-2">
                    {weeklyScheduleData[dayName].slice(0, 3).map((item, i) => (
                      <div key={i} className="p-2.5 bg-white border border-slate-200 rounded-xl text-xs space-y-1">
                        <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded">{item.period} - {item.subject}</span>
                        <p className="font-semibold text-slate-800">{item.class} ({item.section})</p>
                        <p className="text-[10px] text-slate-400">{item.room}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Period</th>
                  <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Time</th>
                  <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Subject</th>
                  <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Class</th>
                  <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Section</th>
                  <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Room</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {(activeTab === 'today' ? todaySchedule : weeklyScheduleData[selectedDay]).map((slot, index) => (
                  <tr key={index} className={`hover:bg-slate-50 transition-colors ${slot.period === 'Break' ? 'bg-amber-50/30' : ''}`}>
                    <td className="py-4 px-6">
                      <span className={`px-3 py-1 rounded-xl text-xs font-bold ${slot.period === 'Break' ? 'bg-amber-100 text-amber-800' : 'bg-indigo-50 text-indigo-700'}`}>
                        {slot.period}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        {slot.time}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-indigo-600" />
                        <span className="text-sm font-bold text-slate-900">{slot.subject}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
                        <Users className="w-3.5 h-3.5 text-slate-400" />
                        {slot.class}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-xs font-semibold px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg">
                        {slot.section}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600">
                        {slot.room !== '-' && <MapPin className="w-3.5 h-3.5 text-slate-400" />}
                        {slot.room}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
