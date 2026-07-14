import React from 'react';
import { Activity, ShieldAlert, HeartPulse } from 'lucide-react';
import { initialStudents } from './studentData';

export const HealthRecordsView: React.FC = () => {
  const medicalStudents = initialStudents.filter(st => st.healthStatus !== 'Fit' || st.medicalNotes);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Student Health & Medical Records</h2>
          <p className="text-xs text-slate-500 mt-0.5">Allergies, vaccination statuses, medical conditions, and emergency notes</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {medicalStudents.map(student => (
          <div key={student.id} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex items-start gap-4">
            <img 
              src={student.photo} 
              alt={student.name} 
              className="w-14 h-14 rounded-2xl object-cover border border-slate-200"
              referrerPolicy="no-referrer"
            />
            <div className="space-y-2 flex-1">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-slate-900 text-base">{student.name}</h3>
                  <p className="text-xs text-slate-500">{student.class} - {student.section} | Blood: {student.bloodGroup}</p>
                </div>
                <span className="px-3 py-1 bg-rose-50 text-rose-700 border border-rose-200 rounded-full text-[10px] font-bold uppercase">
                  {student.healthStatus}
                </span>
              </div>
              <p className="text-xs text-slate-700 bg-rose-50/50 p-3 rounded-2xl border border-rose-100">
                <span className="font-bold text-rose-900">Medical Notes:</span> {student.medicalNotes || 'None specified.'}
              </p>
              <p className="text-[11px] text-slate-500">Emergency Contact: {student.parentName} ({student.parentPhone})</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
