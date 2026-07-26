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
    <div className="bg-white rounded-2xl border border-slate-200/50 shadow-[0_4px_20px_rgba(0,0,0,0.02)] p-6 h-full flex flex-col transition-all hover:shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
      <h3 className="font-bold text-slate-900 text-sm md:text-base flex items-center gap-2 mb-5">
        <span className="text-base">⚡</span>
        System Shortcuts
      </h3>
      
      <div className="space-y-3 flex-1 overflow-y-auto custom-scrollbar">
        {actions.map((category) => (
          <div key={category.id} className="border border-slate-100/80 rounded-xl overflow-hidden group">
            <button className="w-full flex items-center justify-between p-3 bg-slate-50 hover:bg-slate-100/60 transition-colors cursor-pointer">
              <div className="flex items-center gap-2.5 text-slate-700 font-bold text-[13px]">
                <div className="p-1.5 bg-white rounded-lg border border-slate-200/40 shadow-2xs">
                  <category.icon className="w-3.5 h-3.5 text-slate-600 stroke-[2.2]" />
                </div>
                {category.title}
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600 transition" />
            </button>
            <div className="hidden group-hover:block p-3.5 bg-white border-t border-slate-100">
              <div className="flex flex-wrap gap-2">
                {category.items.map((item, idx) => (
                  <button 
                    key={idx} 
                    onClick={() => onNavigate(item.route)}
                    className="px-2.5 py-1.5 bg-slate-50 hover:bg-slate-900 text-slate-600 hover:text-white text-[11px] font-bold rounded-lg border border-slate-200/60 hover:border-slate-950 transition-all duration-200 cursor-pointer"
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
