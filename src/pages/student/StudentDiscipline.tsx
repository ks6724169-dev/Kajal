import React, { useState } from 'react';
import { useStudents } from '../../hooks/useStudents';
import { ShieldAlert, Save, AlertTriangle } from 'lucide-react';

export const StudentDiscipline: React.FC = () => {
  const { students, addDisciplineRecord } = useStudents();
  const [selectedStudent, setSelectedStudent] = useState(students[0]?.id || '');
  const [severity, setSeverity] = useState<'low' | 'medium' | 'high'>('medium');
  const [incident, setIncident] = useState('');
  const [actionTaken, setActionTaken] = useState('');
  const [reportedBy, setReportedBy] = useState('Mr. Rakesh Kapoor');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent || !incident.trim()) return;

    addDisciplineRecord(selectedStudent, {
      severity,
      incident,
      actionTaken,
      status: 'pending',
      reportedBy
    });

    setIncident('');
    setActionTaken('');
    alert('Disciplinary alert issued successfully. Parent-Teacher meeting notification pushed.');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h2 className="text-xl font-black text-slate-800 dark:text-slate-100 tracking-tight">Institutional Discipline Registry</h2>
        <p className="text-xs text-slate-400 font-medium">Record serious academic integrity slips or policy violations with tracked corrective status.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <form onSubmit={handleSubmit} className="md:col-span-2 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-5 md:p-6 rounded-3xl space-y-4.5 shadow-2xs">
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">Select Target Student</label>
            <select 
              value={selectedStudent} 
              onChange={e => setSelectedStudent(e.target.value)} 
              className="form-select"
            >
              {students.map(s => (
                <option key={s.id} value={s.id}>{s.name} (GPA {s.gpa.toFixed(2)})</option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">Severity Level</label>
            <select 
              value={severity} 
              onChange={e => setSeverity(e.target.value as any)} 
              className="form-select"
            >
              <option value="low">Low Severity warning card</option>
              <option value="medium">Medium Severity (Parent teacher conference)</option>
              <option value="high">High Severity (Academic probation review)</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">Incident Statement</label>
            <textarea 
              required 
              value={incident} 
              onChange={e => setIncident(e.target.value)} 
              placeholder="Provide objective statement of the occurrence..." 
              rows={3} 
              className="form-input resize-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">Corrective Action Taken</label>
            <input 
              type="text" 
              required 
              value={actionTaken} 
              onChange={e => setActionTaken(e.target.value)} 
              placeholder="e.g. Disciplinary card issued; parent meeting scheduled" 
              className="form-input" 
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">Reporting Officer / Mentor</label>
            <input 
              type="text" 
              required 
              value={reportedBy} 
              onChange={e => setReportedBy(e.target.value)} 
              className="form-input" 
            />
          </div>

          <button
            type="submit"
            className="w-full bg-rose-600 hover:bg-rose-700 text-white font-extrabold py-2.5 rounded-xl text-xs flex items-center justify-center space-x-2 transition shadow-md shadow-rose-600/15 cursor-pointer"
          >
            <ShieldAlert className="w-4.5 h-4.5" />
            <span>File Disciplinary Record</span>
          </button>
        </form>

        <div className="space-y-4">
          <div className="p-4 bg-rose-500/5 dark:bg-rose-500/10 border border-rose-100 dark:border-rose-950/20 rounded-2xl space-y-3 shadow-2xs">
            <div className="flex items-center space-x-1.5 text-rose-600">
              <AlertTriangle className="w-4 h-4" />
              <h4 className="text-[10px] font-black uppercase tracking-wider">Severity Standards</h4>
            </div>
            <p className="text-[10px] text-rose-600 dark:text-rose-400 font-semibold leading-relaxed">
              Disciplinary entries are securely logged into the candidate's permanent SIS register. High-severity slips immediately block auto-promotion algorithms.
            </p>
          </div>
        </div>
      </div>

      <style>{`
        .form-input {
          width: 100%;
          background: rgb(248, 250, 252);
          border: 1px solid rgb(226, 232, 240);
          border-radius: 12px;
          padding: 10px 14px;
          font-size: 12px;
          font-weight: 500;
          color: rgb(30, 41, 59);
          outline: none;
        }
        .dark .form-input {
          background: rgb(15, 23, 42);
          border-color: rgb(30, 41, 59);
          color: rgb(241, 245, 249);
        }
        .form-select {
          width: 100%;
          background: rgb(248, 250, 252);
          border: 1px solid rgb(226, 232, 240);
          border-radius: 12px;
          padding: 10px 14px;
          font-size: 12px;
          font-weight: 600;
          color: rgb(51, 65, 85);
          outline: none;
          cursor: pointer;
        }
        .dark .form-select {
          background: rgb(15, 23, 42);
          border-color: rgb(30, 41, 59);
          color: rgb(226, 232, 240);
        }
      `}</style>
    </div>
  );
};
