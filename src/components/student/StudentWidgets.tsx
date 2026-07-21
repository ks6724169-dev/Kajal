import React from 'react';
import { 
  Users, CheckCircle2, XCircle, Percent, Star, AlertTriangle, 
  Sparkles, ArrowUpRight, GraduationCap, Clock, BadgeAlert 
} from 'lucide-react';
import { ExtendedStudent } from '../../stores/studentStore';

interface WidgetProps {
  students: ExtendedStudent[];
  onSelectTab: (tab: string) => void;
}

export const StudentKPIWidgets: React.FC<WidgetProps> = ({ students, onSelectTab }) => {
  const total = students.length;
  const presentToday = Math.round(total * 0.9);
  const absentToday = total - presentToday;
  const avgAttendance = (students.reduce((acc, s) => acc + s.attendanceRate, 0) / total).toFixed(1);
  const avgGPA = (students.reduce((acc, s) => acc + s.gpa, 0) / total).toFixed(2);

  const stats = [
    { label: 'Total Enrolled', value: total, desc: 'Academic session active', color: 'text-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 border-indigo-100', icon: Users, tab: 'list' },
    { label: 'Present Today', value: presentToday, desc: 'Face ID verified', color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-100', icon: CheckCircle2, tab: 'attendance' },
    { label: 'Absent Today', value: absentToday, desc: 'Automated notification sent', color: 'text-rose-600 bg-rose-50 dark:bg-rose-950/40 border-rose-100', icon: XCircle, tab: 'attendance' },
    { label: 'Avg Attendance', value: `${avgAttendance}%`, desc: 'SLA threshold 75%', color: 'text-blue-600 bg-blue-50 dark:bg-blue-950/40 border-blue-100', icon: Percent, tab: 'attendance' },
    { label: 'Avg GPA Score', value: avgGPA, desc: 'Highest on campus 4.0', color: 'text-amber-600 bg-amber-50 dark:bg-amber-950/40 border-amber-100', icon: Star, tab: 'progress' }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5 w-full">
      {stats.map(s => (
        <div 
          key={s.label}
          onClick={() => onSelectTab(s.tab)}
          className={`p-4 rounded-2xl border bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 flex items-start justify-between cursor-pointer group hover:border-slate-250 transition-all ${s.tab === 'list' ? 'col-span-2 lg:col-span-1' : ''}`}
        >
          <div>
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">{s.label}</span>
            <span className="text-2xl font-black text-slate-800 dark:text-slate-100 block mt-1">{s.value}</span>
            <span className="text-[9px] text-slate-400 dark:text-slate-500 font-semibold block mt-1.5">{s.desc}</span>
          </div>
          <div className={`p-2 rounded-xl shrink-0 ${s.color}`}>
            <s.icon className="w-4.5 h-4.5" />
          </div>
        </div>
      ))}
    </div>
  );
};

export const AlertsAndTargetWidgets: React.FC<WidgetProps> = ({ students, onSelectTab }) => {
  const weakCount = students.filter(s => s.isWeak).length;
  const giftedCount = students.filter(s => s.isGifted).length;
  const promotionReady = students.filter(s => s.promotionStatus === 'recommended').length;

  const cards = [
    { title: 'Remedial Targets', value: weakCount, desc: 'Students with lagging GPA requiring support clinics', color: 'border-rose-100 dark:border-rose-950/15 bg-rose-500/5', icon: AlertTriangle, tab: 'weak', labelColor: 'text-rose-600 dark:text-rose-400' },
    { title: 'Gifted Pool', value: giftedCount, desc: 'Outstanding academic track candidates selected for advanced hackathons', color: 'border-amber-100 dark:border-amber-950/15 bg-amber-500/5', icon: Sparkles, tab: 'gifted', labelColor: 'text-amber-600 dark:text-amber-400' },
    { title: 'Promotion Ready', value: promotionReady, desc: 'Meets statutory attendance and curriculum GPA threshold standards', color: 'border-emerald-100 dark:border-emerald-950/15 bg-emerald-500/5', icon: GraduationCap, tab: 'promotion', labelColor: 'text-emerald-600 dark:text-emerald-400' }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
      {cards.map(c => (
        <div 
          key={c.title}
          onClick={() => onSelectTab(c.tab)}
          className={`p-4.5 rounded-2xl border cursor-pointer transition-all hover:shadow-xs hover:border-slate-200 dark:hover:border-slate-700 flex items-start justify-between ${c.color}`}
        >
          <div className="space-y-1 pr-4">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-200">{c.title}</h4>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold leading-relaxed">{c.desc}</p>
            <span className="text-[9px] font-extrabold text-indigo-500 hover:underline flex items-center mt-2.5">
              Explore segment <ArrowUpRight className="w-3 h-3 ml-0.5" />
            </span>
          </div>
          <div className="text-right flex flex-col items-end shrink-0">
            <span className={`text-3xl font-black ${c.labelColor}`}>{c.value}</span>
            <div className={`p-1.5 rounded-lg bg-white dark:bg-slate-900 mt-2.5 shadow-2xs`}>
              <c.icon className={`w-4 h-4 ${c.labelColor}`} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export const RecentAdmissionAndActivityWidgets: React.FC<WidgetProps> = ({ students }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
      {/* Recent Admissions */}
      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-4.5 space-y-4">
        <div>
          <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-100">Recent Online Admissions</h4>
          <p className="text-[10px] text-slate-400 font-medium">Newly registered candidates on-boarded into Student Information System.</p>
        </div>

        <div className="space-y-3">
          {students.slice(0, 3).map(s => (
            <div key={s.id} className="flex items-center justify-between p-2.5 bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-800/40 rounded-xl">
              <div className="flex items-center space-x-2.5">
                <img src={s.avatar} alt={s.name} referrerPolicy="no-referrer" className="w-8 h-8 rounded-full object-cover" />
                <div>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">{s.name}</span>
                  <span className="text-[9px] text-slate-400 font-bold block">{s.grade} • Registered via SIS</span>
                </div>
              </div>
              <span className="text-[10px] font-extrabold text-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded-md uppercase">Active</span>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activities */}
      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-4.5 space-y-4">
        <div>
          <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-100">Recent Extracurricular Activities</h4>
          <p className="text-[10px] text-slate-400 font-medium">Latest portfolio achievements and events reported across academic houses.</p>
        </div>

        <div className="space-y-3">
          <div className="flex items-start space-x-2.5 p-2.5 bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-800/40 rounded-xl">
            <span className="text-lg mt-0.5">🔥</span>
            <div>
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">House Hackathon Victory</span>
              <span className="text-[10px] text-slate-400 block font-semibold">Gold Phoenixes achieved 1st place in Inter-School Algorithm Challenge.</span>
              <span className="text-[9px] text-slate-400 font-bold uppercase block mt-1">July 18, 2026</span>
            </div>
          </div>

          <div className="flex items-start space-x-2.5 p-2.5 bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-800/40 rounded-xl">
            <span className="text-lg mt-0.5">🦁</span>
            <div>
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">Youth Parliamentary Trophy</span>
              <span className="text-[10px] text-slate-400 block font-semibold">Red Gryphons won first-runner-up oratorical certificate.</span>
              <span className="text-[9px] text-slate-400 font-bold uppercase block mt-1">July 16, 2026</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
