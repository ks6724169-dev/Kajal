import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  ArrowRight, 
  Calendar as CalendarIcon, 
  Clock, 
  Users, 
  CheckCircle2, 
  AlertCircle,
  FileText,
  Megaphone,
  Sparkles,
  ChevronDown,
  Heart,
  Award,
  BookOpen,
  Star,
  Sun,
  Smile,
  Zap
} from 'lucide-react';
import { teacherModules } from './modulesData';

interface TeacherDashboardProps {
  onSelectModule: (moduleId: string) => void;
}

const welcomeQuotes = [
  {
    id: 1,
    title: "Inspire & Shape Minds",
    quote: "A great teacher takes a hand, opens a mind, and touches a heart every single day.",
    gradient: "from-pink-500 via-rose-500 to-orange-400",
    bgLight: "bg-rose-50/80 border-rose-200 text-rose-900",
    icon: Heart,
    tag: "Daily Inspiration"
  },
  {
    id: 2,
    title: "Excellence in Education",
    quote: "Teaching is the greatest act of optimism, planting seeds for a future you may never see.",
    gradient: "from-violet-600 via-purple-600 to-indigo-600",
    bgLight: "bg-purple-50/80 border-purple-200 text-purple-900",
    icon: Award,
    tag: "Teacher Wisdom"
  },
  {
    id: 3,
    title: "Light the Fire of Curiosity",
    quote: "Education is not the filling of a pail, but the lighting of a vibrant fire.",
    gradient: "from-amber-500 via-orange-500 to-yellow-500",
    bgLight: "bg-amber-50/80 border-amber-200 text-amber-900",
    icon: Sun,
    tag: "Ignite Passion"
  },
  {
    id: 4,
    title: "Empowering Future Leaders",
    quote: "Your patience, dedication, and passion build the foundation of tomorrow's world.",
    gradient: "from-emerald-500 via-teal-500 to-cyan-500",
    bgLight: "bg-emerald-50/80 border-emerald-200 text-emerald-900",
    icon: Sparkles,
    tag: "Pride & Joy"
  }
];

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({ onSelectModule }) => {
  const [isModulesOpen, setIsModulesOpen] = useState(false);
  const [activeQuoteIndex, setActiveQuoteIndex] = useState(0);

  const currentQuote = welcomeQuotes[activeQuoteIndex];
  const IconComponent = currentQuote.icon;

  const nextQuote = () => {
    setActiveQuoteIndex((prev) => (prev + 1) % welcomeQuotes.length);
  };

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 pt-4 pb-24 space-y-6 animate-in fade-in duration-500">
      {/* Welcome & Top Widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Welcome Card */}
        <div className="lg:col-span-2 bg-gradient-to-br from-indigo-900 via-indigo-800 to-purple-900 rounded-3xl p-8 text-white relative overflow-hidden shadow-xl shadow-indigo-900/20">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4"></div>
          <div className="absolute bottom-0 right-10 w-40 h-40 bg-purple-500 opacity-20 rounded-full blur-2xl translate-y-1/3"></div>
          
          <div className="relative z-10 h-full flex flex-col justify-between">
            <div>
              <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-medium text-indigo-100 mb-6 border border-white/10">
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>AI Assistant Active</span>
              </div>
              <h2 className="text-3xl font-bold tracking-tight mb-2">Good morning, Sarah! 👋</h2>
              <p className="text-indigo-200 text-sm max-w-md leading-relaxed">
                You have <strong className="text-white">3 classes</strong> today, <strong className="text-white">12 assignments</strong> to review, and an upcoming staff meeting at 2:00 PM.
              </p>
            </div>
            
            <div className="mt-8 flex flex-wrap gap-4">
              <button className="bg-white text-indigo-900 px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-indigo-50 transition-colors shadow-sm flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>Start Next Class (10:30 AM)</span>
              </button>
              <button className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-white/20 transition-colors flex items-center gap-2">
                <FileText className="w-4 h-4" />
                <span>Review Homework</span>
              </button>
            </div>
          </div>
        </div>

        {/* Quick Stats Column */}
        <div className="grid grid-rows-2 gap-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col justify-center relative overflow-hidden group">
            <div className="absolute right-0 top-0 w-24 h-24 bg-emerald-50 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider">Today's Attendance</h3>
                <div className="p-2 bg-emerald-100 rounded-lg text-emerald-600">
                  <Users className="w-5 h-5" />
                </div>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-slate-900">94%</span>
                <span className="text-sm font-medium text-emerald-600 flex items-center"><ArrowRight className="w-3 h-3 rotate-[-45deg] mr-0.5"/> 2.1%</span>
              </div>
              <p className="text-xs text-slate-500 mt-1">4 absent across all your classes</p>
            </div>
          </div>
          
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col justify-center relative overflow-hidden group">
            <div className="absolute right-0 top-0 w-24 h-24 bg-amber-50 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider">Pending Tasks</h3>
                <div className="p-2 bg-amber-100 rounded-lg text-amber-600">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-slate-900">12</span>
                <span className="text-sm font-medium text-amber-600">to review</span>
              </div>
              <p className="text-xs text-slate-500 mt-1">Assignments & Test Papers</p>
            </div>
          </div>
        </div>
      </div>

      {/* Single Large Colorful Inspiring Teacher Welcome Quote Card */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-slate-900">Inspiring Teacher Thought & Welcome Card</h3>
            <p className="text-xs text-slate-500">Daily motivation and wisdom for your educational journey</p>
          </div>
          <button 
            onClick={nextQuote}
            className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-semibold hover:bg-indigo-700 transition-colors shadow-sm flex items-center gap-2"
          >
            <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
            <span>Next Thought ({activeQuoteIndex + 1}/{welcomeQuotes.length})</span>
          </button>
        </div>

        <motion.div
          key={currentQuote.id}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className={`relative rounded-3xl p-8 sm:p-10 bg-gradient-to-r ${currentQuote.gradient} text-white shadow-xl overflow-hidden flex flex-col justify-between`}
        >
          {/* Decorative glowing background elements */}
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-black/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white shadow-lg border border-white/20">
                <IconComponent className="w-8 h-8" />
              </div>
              <div>
                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-white/20 backdrop-blur-md text-white border border-white/20">
                  {currentQuote.tag}
                </span>
                <h4 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-2 text-white">{currentQuote.title}</h4>
              </div>
            </div>
            
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md p-1.5 rounded-2xl border border-white/20">
              {welcomeQuotes.map((q, idx) => (
                <button
                  key={q.id}
                  onClick={() => setActiveQuoteIndex(idx)}
                  className={`w-3 h-3 rounded-full transition-all ${idx === activeQuoteIndex ? 'bg-white scale-125' : 'bg-white/40 hover:bg-white/70'}`}
                  title={q.title}
                />
              ))}
            </div>
          </div>

          <div className="relative z-10 py-4 my-2 border-y border-white/20">
            <p className="text-lg sm:text-xl md:text-2xl text-white font-medium italic leading-relaxed tracking-wide">
              "{currentQuote.quote}"
            </p>
          </div>

          <div className="relative z-10 pt-2 flex items-center justify-between text-xs sm:text-sm font-semibold text-white/90">
            <span>✨ Galaxy ERP Educator Wellness & Motivation Portal</span>
            <span className="bg-white/20 px-3 py-1 rounded-lg backdrop-blur-sm">Click 'Next Thought' to explore more</span>
          </div>
        </motion.div>
      </div>

      {/* Main Module Cards Grid */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
        <div 
          onClick={() => setIsModulesOpen(!isModulesOpen)}
          className="flex items-center justify-between cursor-pointer select-none group"
        >
          <div>
            <h3 className="text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">Workspace Modules</h3>
            <p className="text-xs text-slate-500 mt-0.5">Click here to {isModulesOpen ? 'hide' : 'view'} all 8 modules</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-xl text-sm font-semibold hover:bg-indigo-100 transition-colors">
            <span>8 Modules Available</span>
            <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isModulesOpen ? 'rotate-180' : ''}`} />
          </button>
        </div>
        
        {isModulesOpen && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-6 pt-6 border-t border-slate-100 animate-in fade-in duration-300">
            {teacherModules.map((mod, idx) => {
              const Icon = mod.icon;
              return (
                <motion.div
                  key={mod.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: idx * 0.03 }}
                  onClick={() => onSelectModule(mod.id)}
                  className="group relative bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer overflow-hidden flex flex-col h-full"
                >
                  {/* Decorative background gradient on hover */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${mod.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
                  
                  <div className="relative z-10 flex flex-col h-full">
                    <div className="flex justify-between items-start mb-6">
                      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${mod.color} flex items-center justify-center text-white shadow-md transform group-hover:scale-110 transition-transform duration-300`}>
                        <Icon className="w-7 h-7" />
                      </div>
                      {mod.badge && (
                        <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white bg-rose-500 rounded-full shadow-sm">
                          {mod.badge}
                        </span>
                      )}
                    </div>
                    
                    <div className="mt-auto">
                      <h4 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors">{mod.title}</h4>
                      <p className="text-sm text-slate-500 leading-relaxed mb-6 line-clamp-2">{mod.description}</p>
                      
                      <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                        <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg">{mod.stats}</span>
                        <button className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
      

    </div>
  );
};

