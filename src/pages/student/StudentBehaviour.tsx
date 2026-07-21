import React, { useState } from 'react';
import { useStudents } from '../../hooks/useStudents';
import { Award, AlertTriangle, Save, Heart } from 'lucide-react';

export const StudentBehaviour: React.FC = () => {
  const { students, addBehaviourLog } = useStudents();
  const [selectedStudent, setSelectedStudent] = useState(students[0]?.id || '');
  const [category, setCategory] = useState<'positive' | 'negative'>('positive');
  const [title, setTitle] = useState('');
  const [points, setPoints] = useState(5);
  const [description, setDescription] = useState('');
  const [reportedBy, setReportedBy] = useState('Dr. Rajesh Sharma');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent || !title.trim()) return;

    addBehaviourLog(selectedStudent, {
      category,
      title,
      points: category === 'positive' ? points : -Math.abs(points),
      description,
      reportedBy
    });

    // Reset
    setTitle('');
    setDescription('');
    alert('Student conduct log registered successfully! Conduct score updated.');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h2 className="text-xl font-black text-slate-800 dark:text-slate-100 tracking-tight">Student Classroom Morals & Conduct Logger</h2>
        <p className="text-xs text-slate-400 font-medium">Record merit points, praise academic mentoring, or issue penalty warnings regarding class conduct.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Form */}
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

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">Behavior Category</label>
              <select 
                value={category} 
                onChange={e => setCategory(e.target.value as any)} 
                className="form-select"
              >
                <option value="positive">Positive Merit Praise</option>
                <option value="negative">Negative Penalty Warning</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">Point Metric</label>
              <select 
                value={points} 
                onChange={e => setPoints(Number(e.target.value))} 
                className="form-select"
              >
                <option value={2}>2 Points (Standard)</option>
                <option value={5}>5 Points (Commendable)</option>
                <option value={10}>10 Points (Outstanding)</option>
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">Incident / Merit Title</label>
            <input 
              type="text" 
              required 
              value={title} 
              onChange={e => setTitle(e.target.value)} 
              placeholder="e.g. Excellent Algebra Mentoring" 
              className="form-input" 
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">Detailed Classroom Description</label>
            <textarea 
              required 
              value={description} 
              onChange={e => setDescription(e.target.value)} 
              placeholder="Enter exact context of the action or incident..." 
              rows={3} 
              className="form-input resize-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">Reporting Officer / Instructor</label>
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
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold py-2.5 rounded-xl text-xs flex items-center justify-center space-x-2 transition shadow-md shadow-indigo-600/15 cursor-pointer"
          >
            <Save className="w-4.5 h-4.5" />
            <span>Register Conduct Log</span>
          </button>
        </form>

        {/* Right Info Board */}
        <div className="space-y-4">
          <div className="p-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl space-y-3.5 shadow-2xs">
            <h4 className="text-[10px] font-black uppercase tracking-wider text-indigo-600">Conduct Audit Rules</h4>
            <ul className="text-[11px] text-slate-500 font-medium space-y-2.5 leading-relaxed">
              <li className="flex items-start"><span className="text-emerald-500 mr-1.5 font-bold">✓</span> Positive points boost student House Rank.</li>
              <li className="flex items-start"><span className="text-emerald-500 mr-1.5 font-bold">✓</span> Scores &gt; 100 get auto-recommended for national student leadership summits.</li>
              <li className="flex items-start"><span className="text-rose-500 mr-1.5 font-bold">✗</span> Scores &lt; 85 trigger mandatory career-counselling workflows.</li>
            </ul>
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
