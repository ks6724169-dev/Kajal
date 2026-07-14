import React from 'react';
import { BookOpen, TrendingDown, Award, AlertTriangle } from 'lucide-react';
import { initialStudents } from './studentData';

export const PortfolioProgressView: React.FC = () => {
  const weakStudents = initialStudents.filter(st => st.academicStanding === 'Weak');
  const giftedStudents = initialStudents.filter(st => st.academicStanding === 'Gifted');

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900">Student Portfolios, Learning Progress & Weak/Gifted Analytics</h2>
        <p className="text-xs text-slate-500 mt-0.5">AI-driven academic evaluations and student growth portfolios</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900">Weak Student Detection & Remedial Plan</h3>
              <p className="text-xs text-slate-500">Students requiring extra academic support</p>
            </div>
          </div>
          <div className="space-y-3">
            {weakStudents.map(student => (
              <div key={student.id} className="p-4 bg-amber-50/50 rounded-2xl border border-amber-200 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <img src={student.photo} alt={student.name} className="w-10 h-10 rounded-full object-cover" referrerPolicy="no-referrer" />
                  <div>
                    <h4 className="font-bold text-slate-900">{student.name} ({student.class} - {student.section})</h4>
                    <p className="text-amber-800 mt-0.5">{student.counsellingNotes || 'Needs remedial attention.'}</p>
                  </div>
                </div>
                <button onClick={() => alert(`Assigned custom remedial worksheet to ${student.name}`)} className="px-3 py-1.5 bg-amber-600 text-white rounded-xl text-xs font-bold hover:bg-amber-700 transition">
                  Assign Remedial
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900">Gifted Student Tracking & Enrichment</h3>
              <p className="text-xs text-slate-500">Advanced learners & olympiad candidates</p>
            </div>
          </div>
          <div className="space-y-3">
            {giftedStudents.map(student => (
              <div key={student.id} className="p-4 bg-purple-50/50 rounded-2xl border border-purple-200 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <img src={student.photo} alt={student.name} className="w-10 h-10 rounded-full object-cover" referrerPolicy="no-referrer" />
                  <div>
                    <h4 className="font-bold text-slate-900">{student.name} ({student.class} - {student.section})</h4>
                    <p className="text-purple-800 mt-0.5">{student.counsellingNotes || 'Enrolled in advanced track.'}</p>
                  </div>
                </div>
                <button onClick={() => alert(`Assigned advanced challenge project to ${student.name}`)} className="px-3 py-1.5 bg-purple-600 text-white rounded-xl text-xs font-bold hover:bg-purple-700 transition">
                  Assign Enrichment
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
