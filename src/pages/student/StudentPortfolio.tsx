import React, { useState } from 'react';
import { useStudents } from '../../hooks/useStudents';
import { usePortfolio } from '../../hooks/usePortfolio';
import { Award, Briefcase, PlusCircle, Save } from 'lucide-react';

export const StudentPortfolio: React.FC = () => {
  const { students } = useStudents();
  const { projects, achievements, addProject, addAchievement } = usePortfolio();
  
  const [selectedStudent, setSelectedStudent] = useState(students[0]?.id || '');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Computer Science');
  const [description, setDescription] = useState('');
  const [skills, setSkills] = useState('React, Gemini, AI');

  const filteredProjects = projects.filter(p => p.studentId === selectedStudent);
  const filteredAchievements = achievements.filter(a => a.studentId === selectedStudent);

  const handleAddProj = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent || !title.trim()) return;

    addProject({
      studentId: selectedStudent,
      title,
      category,
      description,
      skills: skills.split(',').map(s => s.trim()).filter(Boolean)
    });

    setTitle('');
    setDescription('');
    setSkills('');
    alert('Project successfully archived into student portfolio locker.');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-800 dark:text-slate-100 tracking-tight">Student Academic Portfolio & Achievements</h2>
          <p className="text-xs text-slate-400 font-medium">Log software prototypes, scientific articles, code hackathons, and state-level trophies.</p>
        </div>

        <select 
          value={selectedStudent} 
          onChange={e => setSelectedStudent(e.target.value)} 
          className="form-select bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-3.5 py-2.5 rounded-xl text-xs font-bold outline-none cursor-pointer text-slate-700 dark:text-slate-300"
        >
          {students.map(s => (
            <option key={s.id} value={s.id}>{s.name} ({s.grade})</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Register Project */}
        <form onSubmit={handleAddProj} className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-5 rounded-3xl space-y-4 shadow-2xs h-fit">
          <div className="flex items-center space-x-2 text-indigo-600 border-b border-slate-100 dark:border-slate-800 pb-2">
            <PlusCircle className="w-4.5 h-4.5" />
            <h4 className="text-xs font-black uppercase tracking-wider">Archive New Project</h4>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">Project Title</label>
            <input type="text" required value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. GPS AI Router" className="form-input" />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">Category</label>
            <select value={category} onChange={e => setCategory(e.target.value)} className="form-select">
              <option>Computer Science</option>
              <option>Mathematics</option>
              <option>Environmental Science</option>
              <option>Arts & Literature</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">Tech Stack (comma separated)</label>
            <input type="text" value={skills} onChange={e => setSkills(e.target.value)} placeholder="React, TypeScript, CSS" className="form-input" />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">Abstract Description</label>
            <textarea required value={description} onChange={e => setDescription(e.target.value)} placeholder="Outline structural innovations of this project..." rows={3} className="form-input resize-none" />
          </div>

          <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold py-2.5 rounded-xl text-xs flex items-center justify-center space-x-1.5 transition shadow-sm cursor-pointer">
            <Save className="w-4 h-4" />
            <span>Publish Project</span>
          </button>
        </form>

        {/* Right Column: Portfolio Display */}
        <div className="lg:col-span-2 space-y-5">
          {/* Projects Display */}
          <div className="space-y-3">
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Completed Projects Portfolio</span>
            {filteredProjects.length > 0 ? filteredProjects.map((p, idx) => (
              <div key={p.id || idx} className="p-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl space-y-2 shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-black text-indigo-500 bg-indigo-50 dark:bg-indigo-950/40 px-2 py-0.5 rounded-md uppercase">{p.category}</span>
                  {p.badge && <span className="text-[9px] font-black text-amber-500 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded-md uppercase">{p.badge}</span>}
                </div>
                <h4 className="text-xs font-black text-slate-800 dark:text-slate-100">{p.title}</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium leading-relaxed">{p.description}</p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {p.skills.map(sk => (
                    <span key={sk} className="text-[9px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-2 py-0.5 rounded-md">{sk}</span>
                  ))}
                </div>
              </div>
            )) : <p className="text-xs text-slate-400 font-medium p-4 bg-white dark:bg-slate-900 border border-slate-100 rounded-2xl text-center">No projects listed yet. File your first project above!</p>}
          </div>

          {/* Achievements Display */}
          <div className="space-y-3 mt-4">
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Acclaimed Awards & Trophies</span>
            {filteredAchievements.length > 0 ? filteredAchievements.map((a, idx) => (
              <div key={a.id || idx} className="p-4 bg-emerald-500/5 border border-emerald-100 rounded-2xl flex items-start space-x-3">
                <div className="p-2 bg-emerald-100 text-emerald-600 rounded-xl">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-slate-800 dark:text-slate-100">{a.title}</span>
                    <span className="text-[9px] font-extrabold bg-emerald-100 text-emerald-600 px-2 py-0.5 rounded-md uppercase">{a.awardLevel} Level</span>
                  </div>
                  <p className="text-[11px] text-slate-500 font-medium mt-1 leading-relaxed">{a.description}</p>
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wide block mt-2">{a.authority} • {a.date}</span>
                </div>
              </div>
            )) : <p className="text-xs text-slate-400 font-medium p-4 bg-white dark:bg-slate-900 border border-slate-100 rounded-2xl text-center">No awards registered under this student.</p>}
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
