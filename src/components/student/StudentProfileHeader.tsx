import React from 'react';
import { Mail, Phone, Map, ShieldAlert, BadgeInfo, QrCode, Sparkles, AlertTriangle } from 'lucide-react';
import { ExtendedStudent } from '../../stores/studentStore';
import { StudentAvatar } from './StudentCommon';

interface ProfileHeaderProps {
  student: ExtendedStudent;
  onOpenIdCard: () => void;
}

export const StudentProfileHeader: React.FC<ProfileHeaderProps> = ({ student, onOpenIdCard }) => {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-5 md:p-6 shadow-xs">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
        <div className="flex flex-col md:flex-row items-start md:items-center space-y-3.5 md:space-y-0 md:space-x-5">
          <StudentAvatar 
            avatarUrl={student.avatar} 
            name={student.name} 
            size="lg" 
            statusRing={student.attendanceRate > 90 ? 'success' : 'warning'} 
          />
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-xl font-black text-slate-800 dark:text-slate-100 tracking-tight">{student.name}</h2>
              {student.isGifted && (
                <span className="bg-amber-100 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center">
                  <Sparkles className="w-3 h-3 mr-1" />
                  Gifted Pool
                </span>
              )}
              {student.isWeak && (
                <span className="bg-rose-100 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center">
                  <AlertTriangle className="w-3 h-3 mr-1" />
                  Remedial Math
                </span>
              )}
            </div>
            
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 dark:text-slate-500 font-bold tracking-tight mt-1">
              <span>Grade: {student.grade} - Section {student.section}</span>
              <span>•</span>
              <span>Reg No: {student.admissionNo}</span>
              <span>•</span>
              <span>GPA: {student.gpa.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <button
          onClick={onOpenIdCard}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold px-4.5 py-2.5 rounded-xl text-xs shadow-md shadow-indigo-600/20 transition-all flex items-center space-x-2 shrink-0 cursor-pointer"
        >
          <QrCode className="w-4 h-4" />
          <span>Generate Digital ID</span>
        </button>
      </div>
    </div>
  );
};

export const StudentInfoCard: React.FC<{ student: ExtendedStudent }> = ({ student }) => {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-4.5 space-y-4">
      <div className="flex items-center space-x-2 text-slate-800 dark:text-slate-100 pb-1.5 border-b border-slate-100 dark:border-slate-800">
        <BadgeInfo className="w-4.5 h-4.5 text-indigo-500" />
        <h4 className="text-xs font-black uppercase tracking-wider">Institution Directory details</h4>
      </div>

      <div className="space-y-3">
        <div className="flex items-center space-x-3 text-xs">
          <div className="p-2 bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-800/40 rounded-lg text-slate-400">
            <Mail className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider block">Official Email</span>
            <span className="font-semibold text-slate-700 dark:text-slate-300">{student.email}</span>
          </div>
        </div>

        <div className="flex items-center space-x-3 text-xs">
          <div className="p-2 bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-800/40 rounded-lg text-slate-400">
            <Phone className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider block">Cell Phone</span>
            <span className="font-semibold text-slate-700 dark:text-slate-300">{student.phone}</span>
          </div>
        </div>

        <div className="flex items-center space-x-3 text-xs">
          <div className="p-2 bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-800/40 rounded-lg text-slate-400">
            <Map className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider block">GPS Bus Route</span>
            <span className="font-semibold text-slate-700 dark:text-slate-300">{student.busRoute}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
