import React from 'react';
import { Plus, Wallet, BookOpen, MessageSquare, FileText, ChevronRight } from 'lucide-react';

interface QuickActionCenterProps {
  onNavigate: (path: string) => void;
}

export const QuickActionCenter: React.FC<QuickActionCenterProps> = ({ onNavigate }) => {
  const actions = [
    { 
      id: 'create', 
      title: 'Create', 
      icon: Plus, 
      items: [
        { label: 'Add Student', route: 'students' },
        { label: 'Add Teacher', route: 'hrms' },
        { label: 'Create Admission', route: 'students' },
        { label: 'Create Notice', route: 'dashboard' }
      ] 
    },
    { 
      id: 'finance', 
      title: 'Finance', 
      icon: Wallet, 
      items: [
        { label: 'Collect Fee', route: 'fees' },
        { label: 'Generate Receipt', route: 'fees' },
        { label: 'Finance Report', route: 'fees' }
      ] 
    },
    { 
      id: 'academic', 
      title: 'Academic', 
      icon: BookOpen, 
      items: [
        { label: 'Create Timetable', route: 'exams' },
        { label: 'Create Exam', route: 'exams' },
        { label: 'Generate Result', route: 'exams' }
      ] 
    },
    { 
      id: 'communication', 
      title: 'Communication', 
      icon: MessageSquare, 
      items: [
        { label: 'WhatsApp', route: 'dashboard' },
        { label: 'Email', route: 'dashboard' },
        { label: 'SMS', route: 'dashboard' },
        { label: 'Push Notification', route: 'dashboard' }
      ] 
    },
    { 
      id: 'documents', 
      title: 'Documents', 
      icon: FileText, 
      items: [
        { label: 'Generate Report', route: 'dashboard' },
        { label: 'ID Card', route: 'students' },
        { label: 'Certificate', route: 'students' }
      ] 
    },
  ];

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 h-full flex flex-col">
      <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-4">
        <span className="text-xl">⚡</span> Quick Actions
      </h3>
      
      <div className="space-y-3 flex-1 overflow-y-auto custom-scrollbar">
        {actions.map((category) => (
          <div key={category.id} className="border border-slate-100 rounded-lg overflow-hidden group">
            <button className="w-full flex items-center justify-between p-3 bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer">
              <div className="flex items-center gap-2 text-slate-700 font-semibold text-sm">
                <category.icon className="w-4 h-4 text-indigo-600" />
                {category.title}
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 transition" />
            </button>
            <div className="hidden group-hover:block p-3 bg-white border-t border-slate-100">
              <div className="flex flex-wrap gap-2">
                {category.items.map((item, idx) => (
                  <button 
                    key={idx} 
                    onClick={() => onNavigate(item.route)}
                    className="px-2.5 py-1.5 bg-slate-50 hover:bg-indigo-50 text-slate-600 hover:text-indigo-700 text-xs font-medium rounded border border-slate-200 hover:border-indigo-200 transition-colors cursor-pointer"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
