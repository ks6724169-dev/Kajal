import React from 'react';
import { Building2, Users, Briefcase, BookOpen, Wallet, Bus, MessageSquare, BrainCircuit, ArrowRight } from 'lucide-react';

interface ModuleGridProps {
  onNavigate: (path: string) => void;
}

export const ModuleGrid: React.FC<ModuleGridProps> = ({ onNavigate }) => {
  const modules = [
    { id: 'admin', route: 'settings', title: 'Administration', icon: Building2, desc: 'Institution, Campus, Departments', color: 'bg-slate-100 text-slate-700' },
    { id: 'student', route: 'students', title: 'Student Mgt', icon: Users, desc: 'Students, Admissions, Attendance', color: 'bg-blue-100 text-blue-700' },
    { id: 'hr', route: 'hrms', title: 'Human Resources', icon: Briefcase, desc: 'Teachers, Staff, Payroll, Leave', color: 'bg-emerald-100 text-emerald-700' },
    { id: 'academic', route: 'exams', title: 'Academic', icon: BookOpen, desc: 'Classes, Timetable, Exams', color: 'bg-purple-100 text-purple-700' },
    { id: 'finance', route: 'fees', title: 'Finance', icon: Wallet, desc: 'Fees, Payments, Expenses', color: 'bg-amber-100 text-amber-700' },
    { id: 'operations', route: 'transport', title: 'Operations', icon: Bus, desc: 'Transport, Hostel, Inventory', color: 'bg-cyan-100 text-cyan-700' },
    { id: 'communication', route: 'dashboard', title: 'Communication', icon: MessageSquare, desc: 'WhatsApp, SMS, Email', color: 'bg-pink-100 text-pink-700' },
    { id: 'ai', route: 'ai_hub', title: 'Intelligence', icon: BrainCircuit, desc: 'AI Assistant, Analytics', color: 'bg-indigo-100 text-indigo-700' },
  ];

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
      <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-6">
        <span className="text-xl">🧩</span> Management Modules
      </h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {modules.map((mod) => (
          <div 
            key={mod.id}
            onClick={() => onNavigate(mod.route)}
            className="group flex flex-col p-4 rounded-xl border border-slate-100 bg-slate-50 hover:bg-white hover:border-indigo-100 hover:shadow-md transition-all cursor-pointer"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className={`p-2.5 rounded-lg ${mod.color}`}>
                <mod.icon className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-slate-800 text-sm group-hover:text-indigo-700 transition-colors">{mod.title}</h4>
            </div>
            <p className="text-[11px] text-slate-500 leading-tight flex-1">{mod.desc}</p>
            <div className="mt-3 flex justify-end opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="p-1 bg-indigo-50 text-indigo-600 rounded-full">
                <ArrowRight className="w-3 h-3" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
