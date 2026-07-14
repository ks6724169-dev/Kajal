import React from 'react';
import { Users, FileText, Download } from 'lucide-react';
import { initialStudents } from './studentData';

export const ParentDocumentsView: React.FC = () => {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900">Parent Details & Student Documents Vault</h2>
        <p className="text-xs text-slate-500 mt-0.5">Parent contact directories, certificates, TC, ID proofs, and official documents</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {initialStudents.map(student => (
          <div key={student.id} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center gap-4 border-b border-slate-100 pb-4">
              <img src={student.photo} alt={student.name} className="w-12 h-12 rounded-2xl object-cover" referrerPolicy="no-referrer" />
              <div>
                <h3 className="font-bold text-slate-900">{student.name}</h3>
                <p className="text-xs text-slate-500">Roll: {student.rollNumber} | {student.class} - {student.section}</p>
              </div>
            </div>
            <div className="space-y-2 text-xs">
              <p><span className="text-slate-400">Parent Name:</span> <span className="font-bold text-slate-800">{student.parentName}</span></p>
              <p><span className="text-slate-400">Phone Number:</span> <span className="font-bold text-indigo-600">{student.parentPhone}</span></p>
              <p><span className="text-slate-400">Email Address:</span> <span className="font-bold text-slate-800">{student.parentEmail}</span></p>
              <p><span className="text-slate-400">Residential Address:</span> <span className="font-bold text-slate-800">{student.address}</span></p>
            </div>
            <div className="pt-2 flex items-center justify-between border-t border-slate-100 text-xs">
              <span className="text-slate-500 font-semibold">Verified Documents: 5/5</span>
              <button onClick={() => alert(`Downloading documents package for ${student.name}`)} className="px-3 py-1.5 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-slate-700 rounded-xl font-bold transition flex items-center gap-1.5">
                <Download className="w-3.5 h-3.5" />
                <span>Download Vault</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
