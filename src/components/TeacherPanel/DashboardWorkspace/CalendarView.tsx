import React, { useState } from 'react';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  MapPin, 
  Users, 
  BookOpen, 
  Award, 
  AlertCircle, 
  CalendarDays, 
  CalendarRange, 
  Filter, 
  Plus, 
  ChevronLeft, 
  ChevronRight,
  CheckCircle,
  Briefcase
} from 'lucide-react';

export const CalendarView: React.FC = () => {
  const [viewMode, setViewMode] = useState<'daily' | 'weekly' | 'monthly'>('weekly');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDate, setSelectedDate] = useState<string>('2026-07-11');

  // Sample schedule & events data covering classes, exams, holidays, meetings, ptm, deadlines, events, leave
  const [events, setEvents] = useState([
    {
      id: 1,
      title: 'Mathematics Advanced Lecture (Grade 10-A)',
      category: 'Classes',
      date: '2026-07-11',
      time: '08:00 AM - 09:30 AM',
      location: 'Room 101',
      type: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      icon: BookOpen
    },
    {
      id: 2,
      title: 'Mid-Term Calculus Examination',
      category: 'Exams',
      date: '2026-07-12',
      time: '10:00 AM - 12:00 PM',
      location: 'Examination Hall B',
      type: 'bg-rose-50 text-rose-700 border-rose-200',
      icon: Award
    },
    {
      id: 3,
      title: 'Summer Break / National Holiday',
      category: 'Holidays',
      date: '2026-07-15',
      time: 'All Day',
      location: 'Campus Closed',
      type: 'bg-amber-50 text-amber-700 border-amber-200',
      icon: CalendarDays
    },
    {
      id: 4,
      title: 'Department Faculty Meeting',
      category: 'Meetings',
      date: '2026-07-11',
      time: '02:00 PM - 03:30 PM',
      location: 'Conference Room 3',
      type: 'bg-blue-50 text-blue-700 border-blue-200',
      icon: Users
    },
    {
      id: 5,
      title: 'Parent-Teacher Meeting (PTM - Grade 10)',
      category: 'PTM',
      date: '2026-07-18',
      time: '09:00 AM - 01:00 PM',
      location: 'Auditorium',
      type: 'bg-purple-50 text-purple-700 border-purple-200',
      icon: Users
    },
    {
      id: 6,
      title: 'Quarterly Grade Submission Deadline',
      category: 'Deadlines',
      date: '2026-07-20',
      time: '05:00 PM',
      location: 'Portal System',
      type: 'bg-orange-50 text-orange-700 border-orange-200',
      icon: AlertCircle
    },
    {
      id: 7,
      title: 'Annual Science & Tech Fair',
      category: 'Events',
      date: '2026-07-25',
      time: '09:00 AM - 04:00 PM',
      location: 'Main Grounds',
      type: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      icon: CalendarRange
    },
    {
      id: 8,
      title: 'Casual Leave Approved',
      category: 'Leave',
      date: '2026-07-28',
      time: 'All Day',
      location: '-',
      type: 'bg-slate-100 text-slate-700 border-slate-300',
      icon: Briefcase
    }
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Classes');
  const [newDate, setNewDate] = useState('2026-07-11');
  const [newTime, setNewTime] = useState('10:00 AM');

  const categories = ['all', 'Classes', 'Exams', 'Holidays', 'Meetings', 'PTM', 'Deadlines', 'Events', 'Leave'];

  const filteredEvents = selectedCategory === 'all' 
    ? events 
    : events.filter(e => e.category === selectedCategory);

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEventTitle.trim()) return;

    const newItem = {
      id: Date.now(),
      title: newEventTitle,
      category: newCategory,
      date: newDate,
      time: newTime,
      location: 'Main Campus',
      type: newCategory === 'Exams' ? 'bg-rose-50 text-rose-700 border-rose-200' :
            newCategory === 'Classes' ? 'bg-indigo-50 text-indigo-700 border-indigo-200' :
            newCategory === 'Holidays' ? 'bg-amber-50 text-amber-700 border-amber-200' :
            newCategory === 'PTM' ? 'bg-purple-50 text-purple-700 border-purple-200' : 'bg-blue-50 text-blue-700 border-blue-200',
      icon: BookOpen
    };

    setEvents([...events, newItem]);
    setNewEventTitle('');
    setIsModalOpen(false);
    alert('Event added successfully to calendar!');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-20">
      {/* Header & Controls */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <CalendarIcon className="w-6 h-6 text-indigo-600" />
            Master Academic & Event Calendar
          </h2>
          <p className="text-xs text-slate-500 mt-1">Track classes, examinations, holidays, meetings, parent-teacher meetings, deadlines, and leave.</p>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* View mode toggle */}
          <div className="flex bg-slate-100 p-1.5 rounded-2xl">
            {(['daily', 'weekly', 'monthly'] as const).map(mode => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition capitalize ${viewMode === mode ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
              >
                {mode} View
              </button>
            ))}
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 transition flex items-center gap-2 shadow-sm"
          >
            <Plus className="w-4 h-4" /> Add Event
          </button>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1 pl-1">
          <Filter className="w-3.5 h-3.5" /> Filter:
        </span>
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition whitespace-nowrap capitalize ${selectedCategory === cat ? 'bg-indigo-600 text-white shadow-sm' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Main View Area */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <h3 className="text-lg font-bold text-slate-900 capitalize">
              {viewMode} Schedule ({filteredEvents.length} items)
            </h3>
            <span className="text-xs px-2.5 py-1 bg-indigo-50 text-indigo-700 font-semibold rounded-lg">July 2026</span>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 border border-slate-200 rounded-xl hover:bg-slate-50 transition"><ChevronLeft className="w-4 h-4 text-slate-600" /></button>
            <span className="text-xs font-bold text-slate-700">Today: July 11</span>
            <button className="p-2 border border-slate-200 rounded-xl hover:bg-slate-50 transition"><ChevronRight className="w-4 h-4 text-slate-600" /></button>
          </div>
        </div>

        {/* Daily View */}
        {viewMode === 'daily' && (
          <div className="space-y-4">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Schedule for Today (July 11, 2026)</p>
            {filteredEvents.filter(e => e.date === '2026-07-11' || e.category === 'Holidays').length === 0 ? (
              <div className="text-center py-12 text-slate-400 text-sm">No scheduled events for this specific day.</div>
            ) : (
              filteredEvents.filter(e => e.date === '2026-07-11' || e.category === 'Holidays').map(item => {
                const IconComponent = item.icon || BookOpen;
                return (
                  <div key={item.id} className={`p-4 rounded-2xl border ${item.type} flex items-center justify-between shadow-sm transition hover:scale-[1.01]`}>
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center font-bold">
                        <IconComponent className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-white shadow-xs uppercase tracking-wider">{item.category}</span>
                          <span className="text-xs font-semibold opacity-80 flex items-center gap-1"><Clock className="w-3 h-3" /> {item.time}</span>
                        </div>
                        <h4 className="text-base font-bold mt-1">{item.title}</h4>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-semibold">
                      <span className="flex items-center gap-1 bg-white px-3 py-1.5 rounded-xl shadow-xs"><MapPin className="w-3.5 h-3.5 text-slate-400" /> {item.location}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* Weekly View */}
        {viewMode === 'weekly' && (
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {['Mon, Jul 06', 'Tue, Jul 07', 'Wed, Jul 08', 'Thu, Jul 09', 'Fri, Jul 10'].map((day, idx) => (
              <div key={idx} className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
                <div className="border-b border-slate-200 pb-2 flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-700">{day}</span>
                  <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                </div>
                <div className="space-y-2">
                  <div className="p-3 bg-white border border-slate-200 rounded-xl shadow-xs space-y-1">
                    <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">Class</span>
                    <p className="text-xs font-bold text-slate-900">Advanced Mathematics</p>
                    <p className="text-[10px] text-slate-500">08:00 AM - Room 101</p>
                  </div>
                  {idx === 2 && (
                    <div className="p-3 bg-white border border-slate-200 rounded-xl shadow-xs space-y-1">
                      <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">Meeting</span>
                      <p className="text-xs font-bold text-slate-900">Faculty Sync</p>
                      <p className="text-[10px] text-slate-500">02:00 PM</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Monthly View */}
        {viewMode === 'monthly' && (
          <div className="space-y-4">
            <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold text-slate-400 uppercase">
              <span>Sun</span><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span>
            </div>
            <div className="grid grid-cols-7 gap-2">
              {Array.from({ length: 31 }).map((_, i) => {
                const dayNum = i + 1;
                const hasEvent = [11, 12, 15, 18, 20, 25, 28].includes(dayNum);
                return (
                  <div 
                    key={i} 
                    className={`min-h-[80px] p-2 rounded-2xl border flex flex-col justify-between transition ${dayNum === 11 ? 'border-indigo-600 bg-indigo-50/30 ring-2 ring-indigo-500/20' : 'border-slate-200 bg-white hover:bg-slate-50'}`}
                  >
                    <div className="flex justify-between items-center">
                      <span className={`text-xs font-bold ${dayNum === 11 ? 'text-indigo-600' : 'text-slate-700'}`}>{dayNum}</span>
                      {hasEvent && <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>}
                    </div>
                    {dayNum === 11 && <span className="text-[9px] font-bold text-indigo-700 bg-indigo-100 px-1.5 py-0.5 rounded truncate">Classes & Meeting</span>}
                    {dayNum === 12 && <span className="text-[9px] font-bold text-rose-700 bg-rose-100 px-1.5 py-0.5 rounded truncate">Exams</span>}
                    {dayNum === 15 && <span className="text-[9px] font-bold text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded truncate">Holiday</span>}
                    {dayNum === 18 && <span className="text-[9px] font-bold text-purple-700 bg-purple-100 px-1.5 py-0.5 rounded truncate">PTM</span>}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* All Events List for Context */}
        <div className="pt-6 border-t border-slate-100 space-y-4">
          <h4 className="text-sm font-bold text-slate-900">All Scheduled Calendar Entries</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredEvents.map(item => {
              const IconComp = item.icon || BookOpen;
              return (
                <div key={item.id} className={`p-4 border rounded-2xl ${item.type} flex items-center justify-between`}>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-white shadow-xs flex items-center justify-center font-bold">
                      <IconComp className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-white shadow-xs uppercase">{item.category}</span>
                      <h5 className="text-sm font-bold mt-1">{item.title}</h5>
                      <p className="text-[11px] opacity-80">{item.date} | {item.time}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setEvents(events.filter(e => e.id !== item.id))}
                    className="text-slate-400 hover:text-rose-600 text-xs font-semibold p-2"
                  >
                    Delete
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Add Event Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-6 animate-in fade-in zoom-in-95 duration-200">
            <h3 className="text-lg font-bold text-slate-900">Add New Calendar Entry</h3>
            
            <form onSubmit={handleAddEvent} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Event Title</label>
                <input 
                  type="text" 
                  placeholder="e.g. Extra Physics Remedial Class"
                  value={newEventTitle}
                  onChange={(e) => setNewEventTitle(e.target.value)}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Category</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                >
                  <option value="Classes">Classes</option>
                  <option value="Exams">Exams</option>
                  <option value="Holidays">Holidays</option>
                  <option value="Meetings">Meetings</option>
                  <option value="PTM">PTM (Parent-Teacher Meeting)</option>
                  <option value="Deadlines">Deadlines</option>
                  <option value="Events">Events</option>
                  <option value="Leave">Leave</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Date</label>
                  <input 
                    type="date"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Time</label>
                  <input 
                    type="text"
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    placeholder="10:00 AM"
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 bg-slate-100 text-slate-700 rounded-xl text-sm font-semibold hover:bg-slate-200 transition"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 transition shadow-sm"
                >
                  Add Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
