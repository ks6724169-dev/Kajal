import React from 'react';
import { motion } from 'motion/react';
import { 
  Users, 
  UserCheck, 
  UserX, 
  Clock, 
  Activity, 
  AlertTriangle, 
  TrendingDown, 
  Award, 
  Calendar, 
  ArrowRight,
  ShieldAlert,
  HeartPulse,
  BookOpen,
  FileText,
  Home,
  Star,
  CheckCircle2
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { initialStudents } from './studentData';

interface StudentLifecycleDashboardProps {
  onSelectSubModule: (subId: string) => void;
}

const attendanceGraphData = [
  { day: 'Mon', present: 142, absent: 3 },
  { day: 'Tue', present: 140, absent: 5 },
  { day: 'Wed', present: 144, absent: 1 },
  { day: 'Thu', present: 139, absent: 6 },
  { day: 'Fri', present: 143, absent: 2 },
];

export const StudentLifecycleDashboard: React.FC<StudentLifecycleDashboardProps> = () => {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Summary Analytics Cards (12 items) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-400 uppercase">Total Students</span>
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-black text-slate-900">145</h3>
            <p className="text-[11px] text-emerald-600 font-semibold mt-1">100% Enrolled</p>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-400 uppercase">Present Today</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <UserCheck className="w-5 h-5" />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-black text-slate-900">141</h3>
            <p className="text-[11px] text-emerald-600 font-semibold mt-1">97.2% Attendance</p>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-400 uppercase">Absent Today</span>
            <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
              <UserX className="w-5 h-5" />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-black text-slate-900">4</h3>
            <p className="text-[11px] text-rose-600 font-semibold mt-1">Excused & Unexcused</p>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-400 uppercase">Late Students</span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-black text-slate-900">2</h3>
            <p className="text-[11px] text-amber-600 font-semibold mt-1">Arrived past 8:15 AM</p>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-400 uppercase">Medical Cases</span>
            <div className="w-9 h-9 rounded-xl bg-pink-50 text-pink-600 flex items-center justify-center font-bold">
              <Activity className="w-5 h-5" />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-black text-slate-900">2</h3>
            <p className="text-[11px] text-pink-600 font-semibold mt-1">Under observation</p>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-400 uppercase">Behaviour Alerts</span>
            <div className="w-9 h-9 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center font-bold">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-black text-slate-900">3</h3>
            <p className="text-[11px] text-orange-600 font-semibold mt-1">Requires review</p>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-400 uppercase">Weak Students</span>
            <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
              <TrendingDown className="w-5 h-5" />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-black text-slate-900">8</h3>
            <p className="text-[11px] text-rose-600 font-semibold mt-1">Remedial assigned</p>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-400 uppercase">Gifted Students</span>
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
              <Award className="w-5 h-5" />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-black text-slate-900">12</h3>
            <p className="text-[11px] text-purple-600 font-semibold mt-1">Enriched curriculum</p>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-400 uppercase">Parent Meetings</span>
            <div className="w-9 h-9 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center font-bold">
              <Calendar className="w-5 h-5" />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-black text-slate-900">4</h3>
            <p className="text-[11px] text-cyan-600 font-semibold mt-1">Scheduled this week</p>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-400 uppercase">Promotion Eligible</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-black text-slate-900">137</h3>
            <p className="text-[11px] text-emerald-600 font-semibold mt-1">On track for upgrade</p>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-400 uppercase">Club Members</span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <BookOpen className="w-5 h-5" />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-black text-slate-900">145</h3>
            <p className="text-[11px] text-blue-600 font-semibold mt-1">100% Participation</p>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-400 uppercase">House Distribution</span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <Home className="w-5 h-5" />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-black text-slate-900">4 Houses</h3>
            <p className="text-[11px] text-amber-600 font-semibold mt-1">Ruby leads points</p>
          </div>
        </div>
      </div>

      {/* Attendance & Behaviour Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
          <h3 className="text-base font-bold text-slate-900 mb-1">Weekly Attendance Overview</h3>
          <p className="text-xs text-slate-500 mb-6">Daily present vs absent student count across classes</p>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={attendanceGraphData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="day" stroke="#94a3b8" fontSize={12} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} />
                <Tooltip />
                <Bar dataKey="present" fill="#6366f1" radius={[8, 8, 0, 0]} name="Present" />
                <Bar dataKey="absent" fill="#f43f5e" radius={[8, 8, 0, 0]} name="Absent" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 mb-1">Student Lifecycle Highlights</h3>
            <p className="text-xs text-slate-500 mb-6">AI-driven actionable insights for student welfare</p>
          </div>
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-amber-900">8 Students Identified as Weak in Mathematics</h4>
                <p className="text-xs text-amber-700 mt-0.5">Automated remedial classes have been scheduled for Wednesday 3:00 PM.</p>
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-purple-50 border border-purple-200 flex items-start gap-3">
              <Award className="w-5 h-5 text-purple-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-purple-900">12 Gifted Students Enrolled in Advanced Science Olympiad</h4>
                <p className="text-xs text-purple-700 mt-0.5">Special mentorship modules assigned successfully.</p>
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-emerald-900">97.2% Overall Attendance This Week</h4>
                <p className="text-xs text-emerald-700 mt-0.5">Sapphire house maintains highest attendance streak.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
