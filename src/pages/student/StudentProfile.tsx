import React, { useState } from 'react';
import { useStudents } from '../../hooks/useStudents';
import { StudentProfileHeader, StudentInfoCard } from '../../components/student/StudentProfileHeader';
import { HealthCard, ParentCard, DocumentCard, HouseCard, ClubCard } from '../../components/student/StudentCards';
import { AIInsightCard } from '../../components/student/StudentAIInsightCard';
import { AttendanceCalendar, AttendanceHeatmap } from '../../components/student/AttendanceComponents';
import { useAttendance } from '../../hooks/useAttendance';
import { 
  Award, Heart, Shield, ShieldAlert, GraduationCap, 
  Files, User, X, CheckCircle2, ChevronRight, Activity, Calendar 
} from 'lucide-react';

export const StudentProfile: React.FC = () => {
  const { students, selectedStudentId } = useStudents();
  const { dailyRecords } = useAttendance();
  const [activeTab, setActiveTab] = useState<'academics' | 'attendance' | 'health' | 'behaviour' | 'documents'>('academics');
  const [showIdCard, setShowIdCard] = useState(false);

  const student = students.find(s => s.id === selectedStudentId) || students[0];

  if (!student) {
    return (
      <div className="py-12 text-center bg-white dark:bg-slate-900 border border-slate-100 rounded-3xl">
        <p className="text-xs text-slate-400 font-medium">Please select a student from the active list.</p>
      </div>
    );
  }

  const tabs = [
    { id: 'academics', label: 'Academic & AI Insights', icon: GraduationCap },
    { id: 'attendance', label: 'Attendance Telemetry', icon: Calendar },
    { id: 'health', label: 'Clinical Health Index', icon: Heart },
    { id: 'behaviour', label: 'Behaviour & Discipline', icon: Shield },
    { id: 'documents', label: 'Document Locker', icon: Files }
  ] as const;

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <StudentProfileHeader student={student} onOpenIdCard={() => setShowIdCard(true)} />

      {/* Main Core Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Direct Info Cards */}
        <div className="space-y-6">
          <StudentInfoCard student={student} />
          <ParentCard parentInfo={student.parentInfo} />
          <HouseCard house={student.house} />
          <ClubCard club={student.club} />
        </div>

        {/* Right Columns: Tabbed Detail Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Tab Selection */}
          <div className="flex border-b border-slate-100 dark:border-slate-800 space-x-1.5 overflow-x-auto pb-px">
            {tabs.map(t => {
              const Icon = t.icon;
              return (
                <button
                  key={t.id}
                  onClick={() => setActiveTab(t.id)}
                  className={`flex items-center space-x-2 px-4.5 py-3 text-xs font-bold whitespace-nowrap border-b-2 transition cursor-pointer ${
                    activeTab === t.id 
                      ? 'border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400' 
                      : 'border-transparent text-slate-400 hover:text-slate-600 dark:text-slate-500'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{t.label}</span>
                </button>
              );
            })}
          </div>

          {/* Active Tab rendering */}
          {activeTab === 'academics' && (
            <div className="space-y-6">
              <AIInsightCard student={student} />
              
              <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-4.5 space-y-3 shadow-2xs">
                <div className="pb-1.5 border-b border-slate-100 dark:border-slate-800">
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-100">Student Portfolio Narrative</h4>
                </div>
                <p className="text-xs font-medium text-slate-600 dark:text-slate-400 leading-relaxed bg-slate-50 dark:bg-slate-950/40 p-4 border border-slate-150 dark:border-slate-800/40 rounded-xl">
                  {student.portfolioSummary}
                </p>
              </div>

              {/* Student Timeline */}
              <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-4.5 space-y-4 shadow-2xs">
                <div>
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-100">Chronological Event Timeline</h4>
                </div>
                <div className="space-y-4 relative pl-4 border-l border-slate-100 dark:border-slate-800 ml-1.5">
                  {student.timeline.map((evt, idx) => (
                    <div key={evt.id || idx} className="relative">
                      <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-indigo-500 ring-4 ring-white dark:ring-slate-900"></div>
                      <span className="text-[9px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest block">{evt.date}</span>
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block mt-0.5">{evt.event}</span>
                      <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium block mt-0.5">{evt.description}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'attendance' && (
            <div className="space-y-6">
              <AttendanceCalendar studentId={student.id} dailyRecords={dailyRecords} />
              <AttendanceHeatmap studentId={student.id} dailyRecords={dailyRecords} />
            </div>
          )}

          {activeTab === 'health' && (
            <div className="space-y-6">
              <HealthCard student={student} />
            </div>
          )}

          {activeTab === 'behaviour' && (
            <div className="space-y-4">
              {/* Score header */}
              <div className="p-4 bg-indigo-600/5 dark:bg-indigo-600/10 border border-indigo-100 dark:border-indigo-950/20 rounded-2xl flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-black uppercase tracking-wider text-indigo-900 dark:text-indigo-300">Classroom Morals & Conduct Score</h4>
                  <p className="text-[10px] text-indigo-500 font-medium mt-0.5">Calculated based on positive points and disciplinary incidents.</p>
                </div>
                <span className="text-3xl font-black text-indigo-600 dark:text-indigo-400">{student.behaviourScore}</span>
              </div>

              {/* Behaviour logs */}
              <div className="space-y-3">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Recent Conduct Logs</span>
                {student.behaviourLogs.length > 0 ? student.behaviourLogs.map((log, idx) => (
                  <div key={log.id || idx} className={`p-3.5 rounded-xl border flex items-start space-x-3 ${
                    log.category === 'positive' 
                      ? 'bg-emerald-500/5 border-emerald-100/55 dark:border-emerald-950/15' 
                      : 'bg-rose-500/5 border-rose-100/55 dark:border-rose-950/15'
                  }`}>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-800 dark:text-slate-100">{log.title}</span>
                        <span className={`text-xs font-black ${log.category === 'positive' ? 'text-emerald-600' : 'text-rose-600'}`}>
                          {log.category === 'positive' ? `+${log.points}` : log.points} Pts
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium mt-1">{log.description}</p>
                      <div className="flex items-center space-x-2 text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-2.5">
                        <span>By: {log.reportedBy}</span>
                        <span>•</span>
                        <span>{log.date}</span>
                      </div>
                    </div>
                  </div>
                )) : (
                  <p className="text-[11px] text-slate-400 font-semibold p-4 bg-slate-50 dark:bg-slate-950/40 border border-slate-150 dark:border-slate-800/40 rounded-xl text-center">No conduct reports recorded for this student.</p>
                )}
              </div>

              {/* Discipline incidents */}
              <div className="space-y-3 mt-6">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Disciplinary Action Records</span>
                {student.disciplineRecords.length > 0 ? student.disciplineRecords.map((rec, idx) => (
                  <div key={rec.id || idx} className="p-3.5 bg-rose-500/5 dark:bg-rose-500/10 border border-rose-100 dark:border-rose-950/20 rounded-xl space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-rose-600 dark:text-rose-400 uppercase tracking-wide">Incident: {rec.severity} Severity</span>
                      <span className="text-[10px] font-extrabold bg-rose-100 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 px-2.5 py-0.5 rounded-full uppercase">{rec.status}</span>
                    </div>
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200">{rec.incident}</p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-2.5 rounded-lg leading-relaxed">
                      <strong>Correction Action:</strong> {rec.actionTaken}
                    </p>
                  </div>
                )) : (
                  <p className="text-[11px] text-slate-400 font-semibold p-4 bg-slate-50 dark:bg-slate-950/40 border border-slate-150 dark:border-slate-800/40 rounded-xl text-center">This student has zero disciplinary incident records. Clean profile!</p>
                )}
              </div>
            </div>
          )}

          {activeTab === 'documents' && (
            <div className="space-y-4">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Verified Academic & Identity Documents</span>
              {student.documents.length > 0 ? student.documents.map((doc, idx) => (
                <DocumentCard key={doc.id || idx} doc={doc} />
              )) : (
                <p className="text-[11px] text-slate-400 font-semibold p-4 bg-slate-50 dark:bg-slate-950/40 border border-slate-150 dark:border-slate-800/40 rounded-xl text-center">No digital files uploaded for this student yet.</p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* High-Fidelity DIGITAL ID CARD MODAL */}
      {showIdCard && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl max-w-sm w-full relative space-y-6 shadow-2xl">
            <button 
              onClick={() => setShowIdCard(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg bg-slate-800 border border-slate-700/60 transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="text-center pb-2 border-b border-slate-800/80">
              <h3 className="text-sm font-black text-indigo-400 uppercase tracking-widest">Digital ID Verification</h3>
              <p className="text-[10px] text-slate-400">Scan at school gate / GPS transport reader</p>
            </div>

            {/* High fidelity ID card front */}
            <div className="bg-slate-950 border border-slate-800/80 rounded-2xl p-5 relative overflow-hidden flex flex-col items-center space-y-4 shadow-xl">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl"></div>
              
              {/* Card Header logo */}
              <div className="w-full flex items-center justify-between text-[10px] font-extrabold tracking-widest text-indigo-400 uppercase">
                <span>GALAXY ACADEMY</span>
                <span className="text-emerald-500">SYS_ACTIVE</span>
              </div>

              {/* Photo */}
              <img 
                src={student.avatar} 
                alt={student.name} 
                referrerPolicy="no-referrer"
                className="w-24 h-24 rounded-full object-cover border-2 border-indigo-500/40 shadow-md shadow-indigo-500/10"
              />

              {/* Identity labels */}
              <div className="text-center">
                <h4 className="text-base font-black text-white tracking-tight">{student.name}</h4>
                <p className="text-[10px] font-bold text-slate-400 mt-0.5">GRADE {student.grade.toUpperCase()} - {student.section}</p>
              </div>

              <div className="w-full grid grid-cols-2 gap-2 text-center pt-2 border-t border-slate-800/60 text-[10px] font-semibold text-slate-400">
                <div className="border-r border-slate-800">
                  <span className="text-[8px] font-extrabold text-slate-500 uppercase block">Reg No</span>
                  <span className="text-white font-bold">{student.admissionNo}</span>
                </div>
                <div>
                  <span className="text-[8px] font-extrabold text-slate-500 uppercase block">Transport Route</span>
                  <span className="text-white font-bold">{student.busRoute.split(' ')[1]}</span>
                </div>
              </div>

              {/* Simulation QR Code */}
              <div className="bg-white p-2 rounded-xl mt-2 select-none">
                <div className="w-20 h-20 bg-slate-950 flex items-center justify-center text-white text-[8px] font-extrabold text-center rounded-lg">
                  QR CODE SCANNER
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowIdCard(false)}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold py-2.5 rounded-xl text-xs transition shadow-md shadow-indigo-600/20 cursor-pointer"
            >
              Export & Download Print PDF
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
