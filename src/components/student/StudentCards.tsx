import React from 'react';
import { 
  Heart, AlertTriangle, Shield, ShieldAlert, Award, FileText, 
  MapPin, Phone, Mail, User, CheckCircle2, TrendingUp, Sparkles, BookOpen, Clock 
} from 'lucide-react';
import { ExtendedStudent, BehaviourLog, DisciplineRecord, StudentDocument, ParentInfo } from '../../stores/studentStore';
import { StudentAvatar } from './StudentCommon';

interface CardProps {
  student: ExtendedStudent;
  onClick?: () => void;
  selected?: boolean;
}

export const StudentCard: React.FC<CardProps> = ({ student, onClick, selected }) => {
  return (
    <div 
      onClick={onClick}
      className={`p-4 rounded-2xl border transition-all duration-200 cursor-pointer flex items-center justify-between group ${
        selected 
          ? 'bg-indigo-50/50 dark:bg-indigo-950/25 border-indigo-200 dark:border-indigo-800/60 shadow-xs' 
          : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700'
      }`}
    >
      <div className="flex items-center space-x-3.5">
        <StudentAvatar 
          avatarUrl={student.avatar} 
          name={student.name} 
          statusRing={student.attendanceRate > 90 ? 'success' : 'warning'}
        />
        <div>
          <div className="flex items-center space-x-2">
            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition">
              {student.name}
            </h4>
            {student.isGifted && (
              <span className="bg-amber-100 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 text-[9px] font-extrabold px-1.5 py-0.5 rounded-sm uppercase tracking-wider flex items-center">
                <Sparkles className="w-2.5 h-2.5 mr-0.5" />
                Gifted
              </span>
            )}
            {student.isWeak && (
              <span className="bg-rose-100 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 text-[9px] font-extrabold px-1.5 py-0.5 rounded-sm uppercase tracking-wider flex items-center">
                <AlertTriangle className="w-2.5 h-2.5 mr-0.5" />
                Remedial
              </span>
            )}
          </div>
          <div className="flex items-center space-x-2 text-[10px] text-slate-400 dark:text-slate-500 font-semibold mt-0.5">
            <span>{student.grade}-{student.section}</span>
            <span>•</span>
            <span>ID: {student.admissionNo}</span>
          </div>
        </div>
      </div>

      <div className="text-right flex flex-col items-end">
        <span className="text-xs font-black text-slate-800 dark:text-slate-200">GPA {student.gpa.toFixed(2)}</span>
        <span className={`text-[10px] font-bold ${
          student.attendanceRate >= 85 ? 'text-emerald-500' : 'text-amber-500'
        }`}>
          {student.attendanceRate}% Attd
        </span>
      </div>
    </div>
  );
};

export const BehaviourCard: React.FC<{ log: BehaviourLog }> = ({ log }) => {
  const isPos = log.category === 'positive';
  return (
    <div className={`p-3.5 rounded-xl border flex items-start space-x-3 ${
      isPos 
        ? 'bg-emerald-500/5 dark:bg-emerald-500/10 border-emerald-100/55 dark:border-emerald-950/15' 
        : 'bg-rose-500/5 dark:bg-rose-500/10 border-rose-100/55 dark:border-rose-950/15'
    }`}>
      <div className={`p-2 rounded-lg shrink-0 ${
        isPos ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600' : 'bg-rose-100 dark:bg-rose-950/60 text-rose-600'
      }`}>
        <Award className="w-4 h-4" />
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-800 dark:text-slate-100">{log.title}</span>
          <span className={`text-[11px] font-black ${isPos ? 'text-emerald-600' : 'text-rose-600'}`}>
            {isPos ? `+${log.points}` : log.points} Points
          </span>
        </div>
        <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium mt-0.5">{log.description}</p>
        <div className="flex items-center space-x-2 text-[9px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider mt-2">
          <span>By: {log.reportedBy}</span>
          <span>•</span>
          <span>{log.date}</span>
        </div>
      </div>
    </div>
  );
};

export const HealthCard: React.FC<{ student: ExtendedStudent }> = ({ student }) => {
  const hr = student.healthRecord;
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-4 space-y-4">
      <div className="flex items-center space-x-2 text-slate-800 dark:text-slate-100 pb-1.5 border-b border-slate-100 dark:border-slate-800">
        <Heart className="w-4.5 h-4.5 text-rose-500" />
        <h4 className="text-xs font-black uppercase tracking-wider">Clinical Medical Record</h4>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="p-3 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800/40 rounded-xl">
          <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider">Height</span>
          <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block mt-0.5">{hr.height}</span>
        </div>
        <div className="p-3 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800/40 rounded-xl">
          <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider">Weight</span>
          <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block mt-0.5">{hr.weight}</span>
        </div>
        <div className="p-3 bg-rose-500/5 dark:bg-rose-500/10 border border-rose-100 dark:border-rose-950/20 rounded-xl">
          <span className="text-[9px] font-extrabold text-rose-500 uppercase tracking-wider">Blood Group</span>
          <span className="text-xs font-black text-rose-600 dark:text-rose-400 block mt-0.5">{hr.bloodGroup}</span>
        </div>
      </div>

      <div className="space-y-2">
        <div>
          <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider">Allergies</span>
          <div className="flex flex-wrap gap-1 mt-1">
            {hr.allergies.length > 0 ? hr.allergies.map(a => (
              <span key={a} className="bg-rose-100 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 text-[10px] font-bold px-2 py-0.5 rounded-md">
                {a}
              </span>
            )) : <span className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold">No known allergies.</span>}
          </div>
        </div>

        <div>
          <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider">Chronic/Medical Conditions</span>
          <div className="flex flex-wrap gap-1 mt-1">
            {hr.medicalConditions.length > 0 ? hr.medicalConditions.map(c => (
              <span key={c} className="bg-amber-100 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 text-[10px] font-bold px-2 py-0.5 rounded-md">
                {c}
              </span>
            )) : <span className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold">None reported.</span>}
          </div>
        </div>

        <div>
          <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider">Vaccinations Audit</span>
          <div className="space-y-1.5 mt-1">
            {hr.vaccinations.map(v => (
              <div key={v.name} className="flex items-center justify-between text-[10px] bg-slate-50 dark:bg-slate-950/40 p-2 border border-slate-100 dark:border-slate-800/40 rounded-lg">
                <span className="font-bold text-slate-700 dark:text-slate-300">{v.name}</span>
                <span className="font-semibold text-slate-400 dark:text-slate-500">{v.date}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export const ParentCard: React.FC<{ parentInfo: ParentInfo }> = ({ parentInfo }) => {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-4 space-y-4">
      <div className="flex items-center space-x-2 text-slate-800 dark:text-slate-100 pb-1.5 border-b border-slate-100 dark:border-slate-800">
        <User className="w-4.5 h-4.5 text-indigo-500" />
        <h4 className="text-xs font-black uppercase tracking-wider">Parent & Family Architecture</h4>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="p-3 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800/40 rounded-xl">
          <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider block">Father Details</span>
          <span className="text-xs font-bold text-slate-800 dark:text-slate-100 block mt-0.5">{parentInfo.fatherName}</span>
          <span className="text-[10px] text-slate-400 dark:text-slate-500 block">{parentInfo.fatherOccupation}</span>
          <div className="flex items-center space-x-1.5 text-[10px] text-indigo-500 font-bold mt-2">
            <Phone className="w-3.5 h-3.5" />
            <span>{parentInfo.fatherPhone}</span>
          </div>
        </div>

        <div className="p-3 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800/40 rounded-xl">
          <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider block">Mother Details</span>
          <span className="text-xs font-bold text-slate-800 dark:text-slate-100 block mt-0.5">{parentInfo.motherName}</span>
          <span className="text-[10px] text-slate-400 dark:text-slate-500 block">{parentInfo.motherOccupation}</span>
          <div className="flex items-center space-x-1.5 text-[10px] text-indigo-500 font-bold mt-2">
            <Phone className="w-3.5 h-3.5" />
            <span>{parentInfo.motherPhone}</span>
          </div>
        </div>
      </div>

      <div className="p-3 bg-amber-500/5 border border-amber-100 dark:border-amber-950/20 rounded-xl">
        <span className="text-[9px] font-extrabold text-amber-600 dark:text-amber-500 uppercase tracking-wider block">Emergency Contact Hotline</span>
        <span className="text-xs font-bold text-slate-800 dark:text-slate-100 block mt-1">{parentInfo.emergencyContact}</span>
      </div>

      <div className="p-3 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800/40 rounded-xl flex items-start space-x-2">
        <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
        <div>
          <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider block">Residential Address</span>
          <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mt-0.5">{parentInfo.address}</span>
        </div>
      </div>
    </div>
  );
};

export const DocumentCard: React.FC<{ doc: StudentDocument }> = ({ doc }) => {
  return (
    <div className="bg-slate-50 dark:bg-slate-950/40 border border-slate-150 dark:border-slate-800/60 p-3.5 rounded-xl flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <div className="p-2.5 bg-indigo-500/10 text-indigo-500 border border-indigo-500/20 rounded-lg shrink-0">
          <FileText className="w-5 h-5" />
        </div>
        <div>
          <span className="text-xs font-bold text-slate-800 dark:text-slate-100 block">{doc.name}</span>
          <div className="flex items-center space-x-2 mt-0.5 text-[9px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">
            <span className="bg-slate-200/50 dark:bg-slate-800 px-1.5 py-0.5 rounded-sm">{doc.category}</span>
            <span>•</span>
            <span>{doc.size}</span>
          </div>
        </div>
      </div>
      <button className="bg-indigo-600/10 hover:bg-indigo-600 text-indigo-600 hover:text-white text-[10px] font-extrabold px-3 py-1.5 rounded-lg transition-all border border-indigo-600/25 cursor-pointer">
        View File
      </button>
    </div>
  );
};

export const HouseCard: React.FC<{ house: 'Red Gryphons' | 'Blue Krakens' | 'Green Hydras' | 'Gold Phoenixes' }> = ({ house }) => {
  const houseData = {
    'Gold Phoenixes': { master: 'Mrs. Aditi Sen', color: 'bg-amber-500/10 text-amber-600 border-amber-200 dark:border-amber-950/30', logo: '🔥', captain: 'Aarav Sharma' },
    'Red Gryphons': { master: 'Mr. Alok Tripathi', color: 'bg-rose-500/10 text-rose-600 border-rose-200 dark:border-rose-950/30', logo: '🦁', captain: 'Priya Iyer' },
    'Blue Krakens': { master: 'Mr. Rakesh Kapoor', color: 'bg-blue-500/10 text-blue-600 border-blue-200 dark:border-blue-950/30', logo: '🐙', captain: 'Karan Malhotra' },
    'Green Hydras': { master: 'Mrs. Priya Nair', color: 'bg-emerald-500/10 text-emerald-600 border-emerald-200 dark:border-emerald-950/30', logo: '🐍', captain: 'Sneha Goel' }
  }[house];

  return (
    <div className={`p-4 rounded-2xl border flex items-center space-x-3.5 ${houseData.color}`}>
      <span className="text-3xl shrink-0">{houseData.logo}</span>
      <div>
        <span className="text-[9px] font-extrabold uppercase tracking-widest block opacity-75">SOCIETY HOUSE</span>
        <h4 className="text-sm font-black tracking-tight">{house}</h4>
        <div className="flex flex-wrap gap-2 text-[10px] font-bold mt-1 opacity-90">
          <span>Master: {houseData.master}</span>
          <span>•</span>
          <span>Captain: {houseData.captain}</span>
        </div>
      </div>
    </div>
  );
};

export const ClubCard: React.FC<{ club: string }> = ({ club }) => {
  return (
    <div className="p-4 bg-indigo-500/5 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-950/20 rounded-2xl flex items-start space-x-3">
      <div className="p-2.5 bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 rounded-xl shrink-0 mt-0.5">
        <BookOpen className="w-5 h-5" />
      </div>
      <div>
        <span className="text-[9px] font-extrabold text-indigo-500 dark:text-indigo-400 uppercase tracking-widest block">EXTRACURRICULAR ACTIVITY CLUB</span>
        <h4 className="text-xs font-black text-slate-800 dark:text-slate-100 mt-0.5">{club}</h4>
        <div className="flex items-center space-x-2 text-[10px] font-bold text-slate-400 dark:text-slate-500 mt-2">
          <Clock className="w-3.5 h-3.5" />
          <span>Bi-weekly academic workshops</span>
        </div>
      </div>
    </div>
  );
};
