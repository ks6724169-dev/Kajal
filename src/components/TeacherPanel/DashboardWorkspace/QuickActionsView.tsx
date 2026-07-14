import React from 'react';
import { CheckSquare, BookOpen, UploadCloud, Edit3, Video, TrendingUp, Megaphone, MessageSquare, Calendar, Bot } from 'lucide-react';

const actions = [
  { id: 1, title: 'Mark Attendance', icon: CheckSquare, color: 'text-emerald-600', bg: 'bg-emerald-50', hover: 'hover:border-emerald-200 hover:shadow-emerald-100' },
  { id: 2, title: 'Create Homework', icon: Edit3, color: 'text-indigo-600', bg: 'bg-indigo-50', hover: 'hover:border-indigo-200 hover:shadow-indigo-100' },
  { id: 3, title: 'Upload Study Material', icon: UploadCloud, color: 'text-blue-600', bg: 'bg-blue-50', hover: 'hover:border-blue-200 hover:shadow-blue-100' },
  { id: 4, title: 'Create Assignment', icon: BookOpen, color: 'text-purple-600', bg: 'bg-purple-50', hover: 'hover:border-purple-200 hover:shadow-purple-100' },
  { id: 5, title: 'Start Live Class', icon: Video, color: 'text-rose-600', bg: 'bg-rose-50', hover: 'hover:border-rose-200 hover:shadow-rose-100' },
  { id: 6, title: 'Enter Marks', icon: TrendingUp, color: 'text-orange-600', bg: 'bg-orange-50', hover: 'hover:border-orange-200 hover:shadow-orange-100' },
  { id: 7, title: 'Send Announcement', icon: Megaphone, color: 'text-amber-600', bg: 'bg-amber-50', hover: 'hover:border-amber-200 hover:shadow-amber-100' },
  { id: 8, title: 'Message Parents', icon: MessageSquare, color: 'text-cyan-600', bg: 'bg-cyan-50', hover: 'hover:border-cyan-200 hover:shadow-cyan-100' },
  { id: 9, title: 'Open Calendar', icon: Calendar, color: 'text-teal-600', bg: 'bg-teal-50', hover: 'hover:border-teal-200 hover:shadow-teal-100' },
  { id: 10, title: 'Open AI Workspace', icon: Bot, color: 'text-fuchsia-600', bg: 'bg-fuchsia-50', hover: 'hover:border-fuchsia-200 hover:shadow-fuchsia-100' },
];

export const QuickActionsView: React.FC = () => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {actions.map((action) => (
        <button 
          key={action.id}
          className={`flex flex-col items-center justify-center p-8 bg-white border border-slate-200 rounded-3xl shadow-sm transition-all duration-200 ${action.hover} hover:shadow-md group`}
        >
          <div className={`w-16 h-16 rounded-2xl ${action.bg} ${action.color} flex items-center justify-center mb-4 transition-transform group-hover:scale-110`}>
             <action.icon className="w-8 h-8" />
          </div>
          <span className="text-sm font-bold text-slate-900 text-center">{action.title}</span>
        </button>
      ))}
    </div>
  );
};
