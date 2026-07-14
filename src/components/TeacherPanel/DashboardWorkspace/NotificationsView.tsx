import React, { useState } from 'react';
import { 
  Bell, 
  Search, 
  Filter, 
  Archive, 
  CheckCircle2, 
  Trash2, 
  Megaphone, 
  UserCheck, 
  MessageSquare, 
  Users, 
  BookOpen, 
  FileText, 
  CheckSquare, 
  Award, 
  Cpu, 
  Server,
  Plus
} from 'lucide-react';

export const NotificationsView: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showFilters, setShowFilters] = useState<boolean>(false);

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: 'School Notice: Independence Day Cultural Fest & Parade Preparations',
      snippet: 'All staff members are requested to coordinate with student council heads for march-past and cultural events.',
      category: 'School Notices',
      time: '10:00 AM Today',
      read: false,
      icon: Megaphone,
      color: 'bg-indigo-50 text-indigo-700 border-indigo-200'
    },
    {
      id: 2,
      title: 'Principal Notice: Mandatory Faculty Board Review Meeting',
      snippet: 'Principal Dr. Henderson has scheduled a briefing regarding mid-term curriculum standards in Conference Hall A.',
      category: 'Principal Notices',
      time: '08:30 AM Today',
      read: false,
      icon: UserCheck,
      color: 'bg-purple-50 text-purple-700 border-purple-200'
    },
    {
      id: 3,
      title: 'Student Message from Alex Turner (Grade 10-A)',
      snippet: 'Teacher, I uploaded my calculus assignment late due to a network glitch. Kindly grant review permission.',
      category: 'Student Messages',
      time: 'Yesterday',
      read: true,
      icon: MessageSquare,
      color: 'bg-blue-50 text-blue-700 border-blue-200'
    },
    {
      id: 4,
      title: 'Parent Message from Mrs. Eleanor Vance',
      snippet: 'Inquiry regarding daughter Sarah’s remedial math coaching schedule for next week.',
      category: 'Parent Messages',
      time: 'Yesterday',
      read: false,
      icon: Users,
      color: 'bg-emerald-50 text-emerald-700 border-emerald-200'
    },
    {
      id: 5,
      title: 'Homework Alert: Chapter 4 Calculus Problem Set Submission',
      snippet: '42 out of 45 students have successfully submitted their homework assignments on time.',
      category: 'Homework Alerts',
      time: '2 days ago',
      read: true,
      icon: BookOpen,
      color: 'bg-amber-50 text-amber-700 border-amber-200'
    },
    {
      id: 6,
      title: 'Assignment Alert: Physics Lab Report Grading Pending',
      snippet: '15 lab reports require grading before the Friday portal lock deadline.',
      category: 'Assignment Alerts',
      time: '3 days ago',
      read: false,
      icon: FileText,
      color: 'bg-orange-50 text-orange-700 border-orange-200'
    },
    {
      id: 7,
      title: 'Attendance Alert: 3 Consecutive Absences for David Miller',
      snippet: 'Automated attendance sensor flagged David Miller as absent for three consecutive classes.',
      category: 'Attendance Alerts',
      time: '3 days ago',
      read: true,
      icon: CheckSquare,
      color: 'bg-rose-50 text-rose-700 border-rose-200'
    },
    {
      id: 8,
      title: 'Exam Alert: Midterm Question Paper Verification Due',
      snippet: 'Please verify the final mathematics question paper draft by Thursday 5:00 PM.',
      category: 'Exam Alerts',
      time: '4 days ago',
      read: false,
      icon: Award,
      color: 'bg-teal-50 text-teal-700 border-teal-200'
    },
    {
      id: 9,
      title: 'AI Alert: Predicted Score Drop in Trigonometry Quiz',
      snippet: 'AI Analytics detected a 14% drop in quiz scores for Section B. Recommended review session generated.',
      category: 'AI Alerts',
      time: '5 days ago',
      read: true,
      icon: Cpu,
      color: 'bg-cyan-50 text-cyan-700 border-cyan-200'
    },
    {
      id: 10,
      title: 'System Notification: Cloud Server Maintenance Scheduled',
      snippet: 'Galaxy ERP system will undergo routine background maintenance this Saturday from 01:00 AM to 03:00 AM.',
      category: 'System Notifications',
      time: '1 week ago',
      read: true,
      icon: Server,
      color: 'bg-slate-100 text-slate-700 border-slate-300'
    }
  ]);

  const categories = [
    'all',
    'School Notices',
    'Principal Notices',
    'Student Messages',
    'Parent Messages',
    'Homework Alerts',
    'Assignment Alerts',
    'Attendance Alerts',
    'Exam Alerts',
    'AI Alerts',
    'System Notifications'
  ];

  const handleMarkAsRead = (id: number) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const handleArchive = (id: number) => {
    setNotifications(notifications.filter(n => n.id !== id));
    alert('Notification archived successfully.');
  };

  const handleDelete = (id: number) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const filteredNotifications = notifications.filter(n => {
    const matchesCategory = activeCategory === 'all' || n.category === activeCategory;
    const matchesSearch = n.title.toLowerCase().includes(searchQuery.toLowerCase()) || n.snippet.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-20">
      {/* Top Banner & Search */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Bell className="w-6 h-6 text-indigo-600" />
            Notifications & Alerts Hub
          </h2>
          <p className="text-xs text-slate-500 mt-1">Categorized notices, student-parent messages, homework alerts, and AI diagnostics.</p>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input 
            type="text" 
            placeholder="Search notifications..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="relative">
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition flex items-center gap-2 shadow-sm"
          >
            <span className="text-sm">❄️</span>
            <span>Filter {activeCategory !== 'all' ? `(${activeCategory})` : ''}</span>
          </button>

          {showFilters && (
            <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 py-2 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-4 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 flex items-center gap-1.5">
                <Filter className="w-3.5 h-3.5 text-indigo-600" /> Filter Category
              </div>
              <div className="max-h-60 overflow-y-auto py-1">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => {
                      setActiveCategory(cat);
                      setShowFilters(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-xs font-medium transition flex items-center justify-between capitalize ${activeCategory === cat ? 'bg-indigo-50 text-indigo-700 font-bold' : 'text-slate-700 hover:bg-slate-50'}`}
                  >
                    <span>{cat}</span>
                    {activeCategory === cat && <span className="text-indigo-600 font-bold">✓</span>}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-4">
        {filteredNotifications.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-3xl p-16 text-center text-slate-400 text-sm">
            No notifications found matching your filter or search query.
          </div>
        ) : (
          filteredNotifications.map(notif => {
            const IconComponent = notif.icon || Bell;
            return (
              <div 
                key={notif.id} 
                className={`p-5 rounded-2xl border ${notif.read ? 'bg-white border-slate-200' : 'bg-indigo-50/40 border-indigo-200 shadow-sm'} flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-all hover:shadow-md`}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${notif.read ? 'bg-slate-100 text-slate-600' : 'bg-indigo-600 text-white'}`}>
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-lg border ${notif.color} uppercase tracking-wider`}>
                        {notif.category}
                      </span>
                      <span className="text-xs text-slate-400 font-medium">{notif.time}</span>
                      {!notif.read && <span className="w-2 h-2 rounded-full bg-indigo-600"></span>}
                    </div>
                    <h4 className={`text-base ${notif.read ? 'font-semibold text-slate-800' : 'font-bold text-slate-900'}`}>
                      {notif.title}
                    </h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {notif.snippet}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end md:self-center">
                  {!notif.read && (
                    <button 
                      onClick={() => handleMarkAsRead(notif.id)} 
                      className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-indigo-600 rounded-xl text-xs font-semibold transition flex items-center gap-1 shadow-xs"
                      title="Mark as Read"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" /> Read
                    </button>
                  )}
                  <button 
                    onClick={() => handleArchive(notif.id)} 
                    className="p-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl transition shadow-xs"
                    title="Archive"
                  >
                    <Archive className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => handleDelete(notif.id)} 
                    className="p-2 bg-white border border-slate-200 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-xl transition shadow-xs"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
