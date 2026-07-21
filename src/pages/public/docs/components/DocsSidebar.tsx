import React from 'react';
import { 
  Rocket, Download, School, User, Shield, Users, 
  GraduationCap, Heart, IndianRupee, Calendar, 
  FileText, Truck, Book, Home, Briefcase, 
  BrainCircuit, Link, Lock, BarChart, Smartphone, 
  HelpCircle, Clipboard 
} from 'lucide-react';

const iconMap: Record<string, any> = {
  Rocket, Download, School, User, Shield, Users, 
  GraduationCap, Heart, IndianRupee, Calendar, 
  FileText, Truck, Book, Home, Briefcase, 
  BrainCircuit, Link, Lock, BarChart, Smartphone, 
  HelpCircle, Clipboard
};

interface DocsSidebarProps {
  categories: any[];
  activeCategory: string;
  onSelect: (id: string) => void;
}

export const DocsSidebar: React.FC<DocsSidebarProps> = ({ categories, activeCategory, onSelect }) => {
  return (
    <aside className="w-72 hidden lg:block sticky top-20 h-[calc(100vh-5rem)] overflow-y-auto border-r border-slate-100 p-6 bg-white">
      <div className="space-y-8">
        <div>
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">
            Documentation
          </h3>
          <nav className="space-y-1">
            {categories.map((cat) => {
              const Icon = iconMap[cat.icon] || HelpCircle;
              const isActive = activeCategory === cat.id;
              
              return (
                <button
                  key={cat.id}
                  onClick={() => onSelect(cat.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-bold transition-all ${
                    isActive 
                    ? 'bg-indigo-50 text-indigo-600 shadow-sm shadow-indigo-500/5' 
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
                  {cat.name}
                </button>
              );
            })}
          </nav>
        </div>
      </div>
    </aside>
  );
};
