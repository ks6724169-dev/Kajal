import React, { useState } from 'react';
import { 
  FolderKanban, 
  Plus, 
  Trash2, 
  Calendar, 
  Award, 
  Search, 
  FileText, 
  Users, 
  User, 
  CheckCircle2, 
  Clock, 
  Edit, 
  Sparkles, 
  CheckSquare,
  BarChart3,
  Sliders
} from 'lucide-react';

export const ProjectManagementView: React.FC = () => {
  const [projects, setProjects] = useState([
    {
      id: 1,
      title: 'Advanced Calculus Solar System Modeling',
      type: 'Group Project',
      subject: 'Advanced Mathematics',
      gradeClass: 'Grade 10-A',
      deadlines: 'August 15, 2026',
      maxMarks: 100,
      status: 'In Progress',
      progress: 65,
      teamSize: 4,
      rubrics: ['Mathematical Accuracy (40%)', 'Visualization & Model (30%)', 'Presentation (30%)'],
      description: 'Model elliptical planetary orbits using parametric equations and calculus differential equations.',
      submissionsCount: 8,
      totalTeams: 10
    },
    {
      id: 2,
      title: 'Trigonometric Architecture Blueprint',
      type: 'Individual Project',
      subject: 'Trigonometry',
      gradeClass: 'Grade 12-A',
      deadlines: 'July 30, 2026',
      maxMarks: 50,
      status: 'Active',
      progress: 30,
      teamSize: 1,
      rubrics: ['Design & Blueprint (50%)', 'Calculations (50%)'],
      description: 'Design a sustainable bridge structure applying trigonometric sine and cosine rule calculations.',
      submissionsCount: 15,
      totalTeams: 35
    },
    {
      id: 3,
      title: 'Statistical Survey on Urban Traffic Flow',
      type: 'Group Project',
      subject: 'Applied Statistics',
      gradeClass: 'Grade 11-B',
      deadlines: 'September 10, 2026',
      maxMarks: 75,
      status: 'Draft',
      progress: 0,
      teamSize: 3,
      rubrics: ['Data Collection (35%)', 'Statistical Analysis (40%)', 'Conclusion (25%)'],
      description: 'Collect peak-hour intersection data and perform hypothesis testing and confidence intervals.',
      submissionsCount: 0,
      totalTeams: 12
    }
  ]);

  const [activeTab, setActiveTab] = useState<'all' | 'individual' | 'group'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEvaluateModalOpen, setIsEvaluateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Form states for Add Project
  const [title, setTitle] = useState('');
  const [type, setType] = useState('Group Project');
  const [subject, setSubject] = useState('Advanced Mathematics');
  const [gradeClass, setGradeClass] = useState('Grade 10-A');
  const [deadlines, setDeadlines] = useState('2026-08-30');
  const [maxMarks, setMaxMarks] = useState('100');
  const [rubricsStr, setRubricsStr] = useState('Accuracy (50%), Presentation (50%)');
  const [description, setDescription] = useState('');

  // Evaluation state
  const [selectedSubmission, setSelectedSubmission] = useState<any>(null);
  const [awardedMarks, setAwardedMarks] = useState('90');
  const [evalFeedback, setEvalFeedback] = useState('Exceptional orbital calculations and clean visualization!');

  const handleAddProject = (e: React.FormEvent, status: string) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newProj = {
      id: Date.now(),
      title,
      type,
      subject,
      gradeClass,
      deadlines,
      maxMarks: parseInt(maxMarks) || 100,
      status,
      progress: status === 'Draft' ? 0 : 20,
      teamSize: type === 'Group Project' ? 4 : 1,
      rubrics: rubricsStr.split(',').map(r => r.trim()),
      description,
      submissionsCount: 0,
      totalTeams: 10
    };

    setProjects([newProj, ...projects]);
    setTitle('');
    setDescription('');
    setIsAddModalOpen(false);
    alert('Project created successfully.');
  };

  const handleDelete = (id: number) => {
    setProjects(projects.filter(p => p.id !== id));
  };

  const handleOpenEvaluate = (proj: any) => {
    setSelectedProject(proj);
    setIsEvaluateModalOpen(true);
  };

  const filteredProjects = projects.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.gradeClass.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (activeTab === 'individual') return matchesSearch && p.type === 'Individual Project';
    if (activeTab === 'group') return matchesSearch && p.type === 'Group Project';
    return matchesSearch;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-20">
      {/* Header & Controls */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <FolderKanban className="w-6 h-6 text-emerald-600" />
            Project Management & Evaluation Hub
          </h2>
          <p className="text-xs text-slate-500 mt-1">Manage individual and group projects, strict deadlines, custom rubrics, student evaluations, and real-time progress tracking.</p>
        </div>

        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2.5 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 transition flex items-center gap-2 shadow-sm whitespace-nowrap"
        >
          <Plus className="w-4 h-4" /> Add New Project
        </button>
      </div>

      {/* Tabs & Search */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${activeTab === 'all' ? 'bg-emerald-600 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
          >
            All Projects ({projects.length})
          </button>
          <button 
            onClick={() => setActiveTab('individual')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${activeTab === 'individual' ? 'bg-emerald-600 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
          >
            <User className="w-3.5 h-3.5" /> Individual
          </button>
          <button 
            onClick={() => setActiveTab('group')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${activeTab === 'group' ? 'bg-emerald-600 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
          >
            <Users className="w-3.5 h-3.5" /> Group
          </button>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input 
            type="text" 
            placeholder="Search projects..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.length === 0 ? (
          <div className="col-span-full bg-white border border-slate-200 rounded-3xl p-16 text-center text-slate-400 text-sm">
            No projects found matching your criteria.
          </div>
        ) : (
          filteredProjects.map(proj => (
            <div key={proj.id} className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:shadow-md transition flex flex-col justify-between group space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-lg uppercase tracking-wider flex items-center gap-1 ${proj.type === 'Group Project' ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' : 'bg-amber-50 text-amber-700 border border-amber-200'}`}>
                    {proj.type === 'Group Project' ? <Users className="w-3 h-3" /> : <User className="w-3 h-3" />}
                    {proj.type}
                  </span>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
                    {proj.gradeClass}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-600 transition">
                  {proj.title}
                </h3>

                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {proj.description}
                </p>

                {/* Rubrics Preview */}
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Evaluation Rubrics:</span>
                  <div className="flex flex-wrap gap-1">
                    {proj.rubrics.map((r, ridx) => (
                      <span key={ridx} className="text-[11px] bg-slate-50 border border-slate-200 px-2.5 py-0.5 rounded-lg text-slate-700 font-medium">
                        ✓ {r}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Progress Tracking */}
                <div className="space-y-1.5 pt-2">
                  <div className="flex justify-between items-center text-xs font-semibold text-slate-600">
                    <span>Progress Tracker</span>
                    <span><b>{proj.progress}%</b></span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden border border-slate-200">
                    <div className="bg-emerald-600 h-full rounded-full transition-all duration-500" style={{ width: `${proj.progress}%` }}></div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
                  <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5 text-slate-400" /> Deadline: {proj.deadlines}</span>
                  <span className="font-semibold text-indigo-600 flex items-center gap-1"><Award className="w-3.5 h-3.5" /> {proj.maxMarks} Marks</span>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                <button 
                  onClick={() => handleOpenEvaluate(proj)}
                  className="px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-xl font-bold transition flex items-center gap-1.5"
                >
                  <CheckSquare className="w-3.5 h-3.5" /> Evaluate ({proj.submissionsCount}/{proj.totalTeams})
                </button>
                <div className="flex items-center gap-1">
                  <button 
                    onClick={() => handleDelete(proj.id)}
                    className="p-2 text-slate-400 hover:text-rose-600 transition rounded-xl"
                    title="Delete Project"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Project Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900">Add New Project Assignment</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold">✕</button>
            </div>

            <form className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Project Title</label>
                <input 
                  type="text" 
                  value={title} 
                  onChange={(e) => setTitle(e.target.value)} 
                  placeholder="e.g. Environmental Data Modeling" 
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Project Type</label>
                  <select 
                    value={type} 
                    onChange={(e) => setType(e.target.value)}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl bg-white"
                  >
                    <option value="Group Project">Group Project</option>
                    <option value="Individual Project">Individual Project</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Subject</label>
                  <input 
                    type="text" 
                    value={subject} 
                    onChange={(e) => setSubject(e.target.value)} 
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Grade Class</label>
                  <input 
                    type="text" 
                    value={gradeClass} 
                    onChange={(e) => setGradeClass(e.target.value)} 
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Max Marks</label>
                  <input 
                    type="number" 
                    value={maxMarks} 
                    onChange={(e) => setMaxMarks(e.target.value)} 
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Deadline Date</label>
                  <input 
                    type="date" 
                    value={deadlines} 
                    onChange={(e) => setDeadlines(e.target.value)} 
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Evaluation Rubrics (Comma separated)</label>
                <input 
                  type="text" 
                  value={rubricsStr} 
                  onChange={(e) => setRubricsStr(e.target.value)} 
                  placeholder="e.g. Accuracy (50%), Design (50%)" 
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Project Description & Guidelines</label>
                <textarea 
                  rows={3} 
                  value={description} 
                  onChange={(e) => setDescription(e.target.value)} 
                  placeholder="Provide detailed project objectives..." 
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl resize-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button 
                  type="button" 
                  onClick={(e) => handleAddProject(e, 'Draft')}
                  className="px-4 py-2.5 bg-slate-100 text-slate-700 rounded-xl font-bold"
                >
                  Save Draft
                </button>
                <button 
                  type="button" 
                  onClick={(e) => handleAddProject(e, 'Active')}
                  className="px-5 py-2.5 bg-emerald-600 text-white rounded-xl font-bold shadow-sm"
                >
                  Publish Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Evaluate Project Modal */}
      {isEvaluateModalOpen && selectedProject && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 uppercase">
                  {selectedProject.subject} • Max: {selectedProject.maxMarks} Marks
                </span>
                <h3 className="text-xl font-bold text-slate-900 mt-1">Evaluate: {selectedProject.title}</h3>
              </div>
              <button onClick={() => setIsEvaluateModalOpen(false)} className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold">✕</button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex justify-between items-center">
                <div>
                  <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Submissions Status</span>
                  <p className="text-base font-bold text-slate-900 mt-0.5">{selectedProject.submissionsCount} of {selectedProject.totalTeams} Teams Submitted</p>
                </div>
                <span className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-xl font-bold border border-emerald-200">
                  Deadline: {selectedProject.deadlines}
                </span>
              </div>

              <div className="space-y-3">
                <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">Submissions & Rubric Evaluation</h4>
                {[
                  { team: 'Team Alpha (Alice, Bob, Charlie)', submittedDate: 'Aug 14, 2026', status: 'Graded', score: 94, feedback: 'Immaculate calculations and model representation.' },
                  { team: 'Team Beta (Diana, Evan)', submittedDate: 'Aug 14, 2026', status: 'Pending Review', score: null, feedback: '' },
                  { team: 'Team Gamma (Fiona, George, Harry)', submittedDate: 'Pending', status: 'Not Submitted', score: null, feedback: '' },
                ].map((sub, sidx) => (
                  <div key={sidx} className="bg-white border border-slate-200 p-4 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                    <div>
                      <p className="font-bold text-slate-900 text-sm">{sub.team}</p>
                      <p className="text-slate-500 mt-0.5">Submitted: {sub.submittedDate}</p>
                      {sub.feedback && <p className="text-emerald-700 mt-1 italic">Feedback: "{sub.feedback}"</p>}
                    </div>

                    <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                      <span className={`px-2.5 py-1 rounded-lg font-semibold text-xs ${sub.status === 'Graded' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : sub.status === 'Pending Review' ? 'bg-indigo-50 text-indigo-700' : 'bg-slate-100 text-slate-600'}`}>
                        {sub.status === 'Graded' ? `${sub.score}/${selectedProject.maxMarks} Marks` : sub.status}
                      </span>
                      <button 
                        onClick={() => alert(`Opening rubric grading sheet for ${sub.team}...`)}
                        className="px-3.5 py-1.5 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition"
                      >
                        Grade Rubrics
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-100">
              <button onClick={() => setIsEvaluateModalOpen(false)} className="px-5 py-2.5 bg-slate-100 text-slate-700 rounded-xl font-bold">Close Evaluation</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
