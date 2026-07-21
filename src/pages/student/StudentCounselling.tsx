import React, { useState } from 'react';
import { useStudents } from '../../hooks/useStudents';
import { Brain, Save, Calendar } from 'lucide-react';

export const StudentCounselling: React.FC = () => {
  const { students, addCounsellingLog } = useStudents();
  const [selectedStudent, setSelectedStudent] = useState(students[0]?.id || '');
  const [sessionType, setSessionType] = useState('Career Advisory');
  const [notes, setNotes] = useState('');
  const [recommendations, setRecommendations] = useState('');
  const [counsellor, setCounsellor] = useState('Ms. Sunita Roy');
  const [followUpDate, setFollowUpDate] = useState('2026-07-28');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent || !notes.trim()) return;

    addCounsellingLog(selectedStudent, {
      sessionType,
      notes,
      recommendations,
      counsellor,
      followUpDate
    });

    setNotes('');
    setRecommendations('');
    alert('Counsellor session logged successfully. Advisory tracker updated.');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h2 className="text-xl font-black text-slate-800 dark:text-slate-100 tracking-tight">Counsellor Advisory & Student Support Portal</h2>
        <p className="text-xs text-slate-400 font-medium">Conduct mental wellness monitoring, career mapping, and behavioral therapy logging.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <form onSubmit={handleSubmit} className="md:col-span-2 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-5 md:p-6 rounded-3xl space-y-4.5 shadow-2xs">
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">Select Student</label>
            <select 
              value={selectedStudent} 
              onChange={e => setSelectedStudent(e.target.value)} 
              className="form-select"
            >
              {students.map(s => (
                <option key={s.id} value={s.id}>{s.name} ({s.grade})</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">Session Type</label>
              <select 
                value={sessionType} 
                onChange={e => setSessionType(e.target.value)} 
                className="form-select"
              >
                <option>Career Advisory</option>
                <option>Academic Stress Management</option>
                <option>Behavior Correction Therapy</option>
                <option>Family Counseling</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">Scheduled Follow Up</label>
              <input 
                type="date" 
                value={followUpDate} 
                onChange={e => setFollowUpDate(e.target.value)} 
                className="form-input" 
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">Advisory Discussion Notes</label>
            <textarea 
              required 
              value={notes} 
              onChange={e => setNotes(e.target.value)} 
              placeholder="Record counseling observations, dialogue feedback..." 
              rows={3} 
              className="form-input resize-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">Action & Study Plan Recommendations</label>
            <textarea 
              value={recommendations} 
              onChange={e => setRecommendations(e.target.value)} 
              placeholder="Actionable study guidelines, screen-time limiters, remedial steps..." 
              rows={2} 
              className="form-input resize-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">Assigned Institution Counsellor</label>
            <input 
              type="text" 
              required 
              value={counsellor} 
              onChange={e => setCounsellor(e.target.value)} 
              className="form-input" 
            />
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold py-2.5 rounded-xl text-xs flex items-center justify-center space-x-2 transition shadow-md shadow-indigo-600/15 cursor-pointer"
          >
            <Brain className="w-4.5 h-4.5" />
            <span>Approve & Save Advisory Notes</span>
          </button>
        </form>

        <div className="space-y-4">
          <div className="p-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl space-y-3 shadow-2xs">
            <h4 className="text-[10px] font-black uppercase tracking-wider text-indigo-600">Privacy Charter</h4>
            <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
              Advisory and therapy registers are heavily protected by FERPA and tenant-level encryption guidelines. Only licensed counsellors and campus admins can retrieve transcripts.
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
          color: rgb(226, 226, 240);
        }
      `}</style>
    </div>
  );
};
