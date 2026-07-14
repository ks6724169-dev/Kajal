import React, { useState } from 'react';
import { BookOpen, Plus, Trash2, CheckCircle2, Search, Filter, Edit, Eye, User, Clock, Award } from 'lucide-react';

export const SubjectManagementView: React.FC = () => {
  const [subjects, setSubjects] = useState([
    { 
      id: 1, 
      name: 'Advanced Mathematics', 
      code: 'MATH-101', 
      teacher: 'Dr. John Doe', 
      credits: 4, 
      weeklyPeriods: 6, 
      description: 'Covers advanced algebra, functions, polynomial equations, and analytical geometry foundations.',
      department: 'Mathematics',
      status: 'Active' 
    },
    { 
      id: 2, 
      name: 'Calculus & Analytical Geometry', 
      code: 'MATH-202', 
      teacher: 'Dr. John Doe', 
      credits: 5, 
      weeklyPeriods: 8, 
      description: 'Limits, derivatives, definite integrals, and applications to physics and engineering problems.',
      department: 'Mathematics',
      status: 'Active' 
    },
    { 
      id: 3, 
      name: 'Trigonometry & Vectors', 
      code: 'MATH-103', 
      teacher: 'Prof. Sarah Jenkins', 
      credits: 3, 
      weeklyPeriods: 5, 
      description: 'Triangular identities, vector spaces, dot and cross products, and 3D coordinate systems.',
      department: 'Mathematics',
      status: 'Active' 
    },
    { 
      id: 4, 
      name: 'Applied Statistics', 
      code: 'STAT-301', 
      teacher: 'Prof. Alan Turing', 
      credits: 4, 
      weeklyPeriods: 6, 
      description: 'Probability distributions, hypothesis testing, regression analysis, and data interpretation.',
      department: 'Data Science',
      status: 'Active' 
    }
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDeptFilter, setSelectedDeptFilter] = useState('All');
  const [showFilters, setShowFilters] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [activeSubject, setActiveSubject] = useState<any>(null);

  // Form states
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [teacher, setTeacher] = useState('Dr. John Doe');
  const [credits, setCredits] = useState('4');
  const [weeklyPeriods, setWeeklyPeriods] = useState('6');
  const [description, setDescription] = useState('');
  const [department, setDepartment] = useState('Mathematics');

  const handleAddSubject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    const newSub = {
      id: Date.now(),
      name,
      code: code || 'MATH-NEW',
      teacher,
      credits: parseInt(credits) || 4,
      weeklyPeriods: parseInt(weeklyPeriods) || 5,
      description: description || 'No description provided.',
      department,
      status: 'Active'
    };
    setSubjects([...subjects, newSub]);
    setName('');
    setCode('');
    setDescription('');
    setIsAddModalOpen(false);
    alert('Subject added successfully.');
  };

  const handleUpdateSubject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeSubject) return;
    setSubjects(subjects.map(s => s.id === activeSubject.id ? {
      ...s,
      name: activeSubject.name,
      code: activeSubject.code,
      teacher: activeSubject.teacher,
      credits: Number(activeSubject.credits),
      weeklyPeriods: Number(activeSubject.weeklyPeriods),
      description: activeSubject.description,
      department: activeSubject.department
    } : s));
    setIsEditModalOpen(false);
    alert('Subject updated successfully.');
  };

  const handleDelete = (id: number) => {
    setSubjects(subjects.filter(s => s.id !== id));
  };

  const filteredSubjects = subjects.filter(sub => {
    const matchesSearch = sub.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          sub.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          sub.teacher.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDept = selectedDeptFilter === 'All' || sub.department === selectedDeptFilter;
    return matchesSearch && matchesDept;
  });

  const departments = ['All', 'Mathematics', 'Data Science', 'Physics', 'Computer Science'];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-20">
      {/* Header & Controls */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-emerald-600" />
            Subject Management & Curriculum Directory
          </h2>
          <p className="text-xs text-slate-500 mt-1">Configure subject lists, codes, assigned teachers, credit counts, weekly periods, and descriptions.</p>
        </div>

        <button 
          onClick={() => setIsAddModalOpen(true)} 
          className="px-4 py-2.5 bg-emerald-600 text-white rounded-xl text-xs font-bold shadow-sm flex items-center gap-2 hover:bg-emerald-700 transition"
        >
          <Plus className="w-4 h-4" /> Add Subject
        </button>
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input 
            type="text" 
            placeholder="Search subjects, codes, or teachers..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div className="relative">
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition flex items-center gap-2 shadow-sm"
          >
            <span className="text-sm">❄️</span>
            <span>Filter {selectedDeptFilter !== 'All' ? `(${selectedDeptFilter})` : ''}</span>
          </button>

          {showFilters && (
            <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 py-2 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-4 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 flex items-center gap-1.5">
                <Filter className="w-3.5 h-3.5 text-emerald-600" /> Filter Department
              </div>
              <div className="max-h-60 overflow-y-auto py-1">
                {departments.map(dept => (
                  <button
                    key={dept}
                    onClick={() => {
                      setSelectedDeptFilter(dept);
                      setShowFilters(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-xs font-medium transition flex items-center justify-between ${selectedDeptFilter === dept ? 'bg-emerald-50 text-emerald-700 font-bold' : 'text-slate-700 hover:bg-slate-50'}`}
                  >
                    <span>{dept}</span>
                    {selectedDeptFilter === dept && <span className="text-emerald-600 font-bold">✓</span>}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Subjects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredSubjects.length === 0 ? (
          <div className="col-span-full bg-white border border-slate-200 rounded-3xl p-16 text-center text-slate-400 text-sm">
            No subjects found matching your search or filter.
          </div>
        ) : (
          filteredSubjects.map(sub => (
            <div key={sub.id} className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:shadow-md transition flex flex-col justify-between group space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase tracking-wider">
                    {sub.code}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700 flex items-center gap-1">
                      <Award className="w-3 h-3 text-emerald-600" /> {sub.credits} Credits
                    </span>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {sub.weeklyPeriods} Periods/wk
                    </span>
                  </div>
                </div>

                <h3 className="text-lg font-bold text-slate-900 group-hover:text-emerald-600 transition">
                  {sub.name}
                </h3>

                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {sub.description}
                </p>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-500">
                  <span className="flex items-center gap-1.5 font-medium text-slate-700">
                    <User className="w-3.5 h-3.5 text-emerald-600" /> {sub.teacher}
                  </span>
                  <span className="bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100 font-semibold text-[11px] text-slate-600">
                    {sub.department}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => { setActiveSubject(sub); setIsViewModalOpen(true); }}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-700 rounded-xl font-semibold transition flex items-center gap-1"
                  >
                    <Eye className="w-3.5 h-3.5" /> View
                  </button>
                  <button 
                    onClick={() => { setActiveSubject(sub); setIsEditModalOpen(true); }}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-slate-700 rounded-xl font-semibold transition flex items-center gap-1"
                  >
                    <Edit className="w-3.5 h-3.5" /> Edit
                  </button>
                </div>
                <button 
                  onClick={() => handleDelete(sub.id)} 
                  className="p-2 text-slate-400 hover:text-rose-600 transition rounded-xl"
                  title="Delete Subject"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* View Subject Modal */}
      {isViewModalOpen && activeSubject && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-6">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 uppercase">
                  {activeSubject.code}
                </span>
                <h3 className="text-xl font-bold text-slate-900 mt-1">{activeSubject.name}</h3>
              </div>
              <button onClick={() => setIsViewModalOpen(false)} className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-200 font-bold">✕</button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <div>
                  <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Subject Teacher</span>
                  <p className="text-sm font-bold text-slate-900 mt-0.5 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-emerald-600" /> {activeSubject.teacher}
                  </p>
                </div>
                <div>
                  <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Department</span>
                  <p className="text-sm font-bold text-slate-900 mt-0.5">{activeSubject.department}</p>
                </div>
                <div>
                  <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Credit Units</span>
                  <p className="text-sm font-bold text-emerald-600 mt-0.5">{activeSubject.credits} Credits</p>
                </div>
                <div>
                  <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Weekly Periods</span>
                  <p className="text-sm font-bold text-indigo-600 mt-0.5">{activeSubject.weeklyPeriods} Periods / Week</p>
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Subject Description</span>
                <p className="text-slate-700 leading-relaxed text-xs">{activeSubject.description}</p>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-100">
              <button onClick={() => setIsViewModalOpen(false)} className="px-5 py-2.5 bg-slate-100 text-slate-700 rounded-xl font-semibold text-xs">Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Subject Modal */}
      {isEditModalOpen && activeSubject && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-6">
            <h3 className="text-lg font-bold text-slate-900">Edit Subject: {activeSubject.name}</h3>
            <form onSubmit={handleUpdateSubject} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Subject Name</label>
                <input 
                  type="text" 
                  value={activeSubject.name} 
                  onChange={(e) => setActiveSubject({...activeSubject, name: e.target.value})} 
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-xs" 
                  required 
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Subject Code</label>
                  <input 
                    type="text" 
                    value={activeSubject.code} 
                    onChange={(e) => setActiveSubject({...activeSubject, code: e.target.value})} 
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-xs" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Subject Teacher</label>
                  <input 
                    type="text" 
                    value={activeSubject.teacher} 
                    onChange={(e) => setActiveSubject({...activeSubject, teacher: e.target.value})} 
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-xs" 
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Credits</label>
                  <input 
                    type="number" 
                    value={activeSubject.credits} 
                    onChange={(e) => setActiveSubject({...activeSubject, credits: e.target.value})} 
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-xs" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Weekly Periods</label>
                  <input 
                    type="number" 
                    value={activeSubject.weeklyPeriods} 
                    onChange={(e) => setActiveSubject({...activeSubject, weeklyPeriods: e.target.value})} 
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-xs" 
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Description</label>
                <textarea 
                  rows={3} 
                  value={activeSubject.description} 
                  onChange={(e) => setActiveSubject({...activeSubject, description: e.target.value})} 
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-xs" 
                />
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button type="button" onClick={() => setIsEditModalOpen(false)} className="px-4 py-2.5 bg-slate-100 text-slate-700 rounded-xl text-xs">Cancel</button>
                <button type="submit" className="px-5 py-2.5 bg-emerald-600 text-white rounded-xl text-xs font-bold shadow-sm">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add New Subject Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-6">
            <h3 className="text-lg font-bold text-slate-900">Add New Subject</h3>
            <form onSubmit={handleAddSubject} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Subject Name</label>
                <input 
                  type="text" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  placeholder="e.g. Organic Chemistry" 
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-xs" 
                  required 
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Subject Code</label>
                  <input 
                    type="text" 
                    value={code} 
                    onChange={(e) => setCode(e.target.value)} 
                    placeholder="e.g. CHEM-101" 
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-xs" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Subject Teacher</label>
                  <input 
                    type="text" 
                    value={teacher} 
                    onChange={(e) => setTeacher(e.target.value)} 
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-xs" 
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Credits</label>
                  <input 
                    type="number" 
                    value={credits} 
                    onChange={(e) => setCredits(e.target.value)} 
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-xs" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Weekly Periods</label>
                  <input 
                    type="number" 
                    value={weeklyPeriods} 
                    onChange={(e) => setWeeklyPeriods(e.target.value)} 
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-xs" 
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Description</label>
                <textarea 
                  rows={3} 
                  value={description} 
                  onChange={(e) => setDescription(e.target.value)} 
                  placeholder="Enter subject overview and syllabus goals..." 
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-xs" 
                />
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-4 py-2.5 bg-slate-100 text-slate-700 rounded-xl text-xs">Cancel</button>
                <button type="submit" className="px-5 py-2.5 bg-emerald-600 text-white rounded-xl text-xs font-bold shadow-sm">Save Subject</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
