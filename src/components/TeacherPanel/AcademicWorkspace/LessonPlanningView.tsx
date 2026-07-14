import React, { useState } from 'react';
import { 
  BookOpen, 
  Calendar, 
  Plus, 
  Search, 
  Filter, 
  CheckCircle, 
  Clock, 
  FileText, 
  Edit, 
  Trash2, 
  Save, 
  Send,
  Target,
  Wrench,
  BookMarked,
  Award
} from 'lucide-react';

export const LessonPlanningView: React.FC = () => {
  const [activePlanType, setActivePlanType] = useState<'annual' | 'monthly' | 'weekly' | 'daily'>('daily');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [lessonPlans, setLessonPlans] = useState([
    {
      id: 1,
      title: 'Limits & Continuity Mastery (Day 1)',
      type: 'daily',
      grade: 'Grade 10 - Section A',
      subject: 'Advanced Mathematics',
      learningObjectives: 'Students will understand the epsilon-delta limit definition and evaluate indeterminate forms.',
      teachingMethods: 'Interactive Whiteboard demonstration, Socratic questioning, Think-Pair-Share.',
      teachingAids: 'Graphing calculators, projection slides, GeoGebra simulation.',
      homeworkPlanning: 'Problem Set 4.1 (Questions 1 to 15 odd).',
      learningOutcomes: 'Mastery of direct substitution and factoring limits.',
      status: 'Published',
      date: 'July 12, 2026'
    },
    {
      id: 2,
      title: 'Week 3: Derivative Rules & Product Rule Proof',
      type: 'weekly',
      grade: 'Grade 10 - Section A & B',
      subject: 'Advanced Mathematics',
      learningObjectives: 'Derive the product rule from first principles and apply to polynomial functions.',
      teachingMethods: 'Collaborative group problem solving and algebraic proof breakdown.',
      teachingAids: 'Worksheets, colored markers, slide deck.',
      homeworkPlanning: 'Derivation practice sheet and 10 drill questions.',
      learningOutcomes: 'Students can differentiate any algebraic product smoothly.',
      status: 'Published',
      date: 'Week of July 15, 2026'
    },
    {
      id: 3,
      title: 'July Monthly Curriculum: Differential Calculus',
      type: 'monthly',
      grade: 'Grade 10 (All Sections)',
      subject: 'Advanced Mathematics',
      learningObjectives: 'Comprehensive coverage of limits, derivatives, and rate of change applications.',
      teachingMethods: 'Lecture series, lab sessions, and weekly formative quizzes.',
      teachingAids: 'Textbook Chapter 4 & 5, online portal.',
      homeworkPlanning: 'Weekly assignment sets due every Friday.',
      learningOutcomes: 'Strong foundation in single-variable calculus.',
      status: 'Draft',
      date: 'July 2026'
    },
    {
      id: 4,
      title: 'Academic Year 2026-2027 Math Syllabus Masterplan',
      type: 'annual',
      grade: 'Grade 10',
      subject: 'Advanced Mathematics',
      learningObjectives: 'Complete Grade 10 mathematics curriculum across 3 academic terms.',
      teachingMethods: 'Blended learning model with classroom teaching and digital quizzes.',
      teachingAids: 'Curriculum handbook, smart boards, online math lab.',
      homeworkPlanning: 'Continuous formative assessments.',
      learningOutcomes: 'Excellence in board exams and Olympiad preparation.',
      status: 'Published',
      date: '2026 - 2027 Term'
    }
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [type, setType] = useState<'annual' | 'monthly' | 'weekly' | 'daily'>('daily');
  const [grade, setGrade] = useState('Grade 10 - Section A');
  const [subject, setSubject] = useState('Advanced Mathematics');
  const [learningObjectives, setLearningObjectives] = useState('');
  const [teachingMethods, setTeachingMethods] = useState('');
  const [teachingAids, setTeachingAids] = useState('');
  const [homeworkPlanning, setHomeworkPlanning] = useState('');
  const [learningOutcomes, setLearningOutcomes] = useState('');

  const handleCreatePlan = (e: React.FormEvent, status: 'Published' | 'Draft') => {
    e.preventDefault();
    if (!title.trim()) return;

    const newPlan = {
      id: Date.now(),
      title,
      type,
      grade,
      subject,
      learningObjectives: learningObjectives || 'Standard curriculum objectives.',
      teachingMethods: teachingMethods || 'Direct instruction and guided practice.',
      teachingAids: teachingAids || 'Whiteboard and textbooks.',
      homeworkPlanning: homeworkPlanning || 'Chapter exercises.',
      learningOutcomes: learningOutcomes || 'Core competency achieved.',
      status,
      date: new Date().toLocaleDateString()
    };

    setLessonPlans([newPlan, ...lessonPlans]);
    setTitle('');
    setLearningObjectives('');
    setTeachingMethods('');
    setTeachingAids('');
    setHomeworkPlanning('');
    setLearningOutcomes('');
    setIsModalOpen(false);
    alert(`Lesson plan ${status === 'Published' ? 'published' : 'saved as draft'} successfully.`);
  };

  const handleDelete = (id: number) => {
    setLessonPlans(lessonPlans.filter(p => p.id !== id));
  };

  const filteredPlans = lessonPlans.filter(plan => {
    const matchesTab = activePlanType === 'all' || plan.type === activePlanType;
    const matchesSearch = plan.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          plan.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          plan.grade.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-20">
      {/* Header & Controls */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-emerald-600" />
            Lesson Planning & Curriculum Hub
          </h2>
          <p className="text-xs text-slate-500 mt-1">Manage annual, monthly, weekly, and daily lesson plans with objectives, methods, aids, and outcomes.</p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input 
              type="text" 
              placeholder="Search plans..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2.5 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 transition flex items-center gap-2 shadow-sm whitespace-nowrap"
          >
            <Plus className="w-4 h-4" /> Create Plan
          </button>
        </div>
      </div>

      {/* Plan Type Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {(['daily', 'weekly', 'monthly', 'annual'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActivePlanType(tab)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap capitalize ${activePlanType === tab ? 'bg-emerald-600 text-white shadow-sm' : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'}`}
          >
            {tab} Lesson Plan
          </button>
        ))}
      </div>

      {/* Lesson Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredPlans.length === 0 ? (
          <div className="col-span-full bg-white border border-slate-200 rounded-3xl p-16 text-center text-slate-400 text-sm">
            No lesson plans found for this category or search query.
          </div>
        ) : (
          filteredPlans.map(plan => (
            <div key={plan.id} className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:shadow-md transition flex flex-col justify-between group space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase tracking-wider">
                    {plan.type} Plan • {plan.grade}
                  </span>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${plan.status === 'Published' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                    {plan.status}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-slate-900 group-hover:text-emerald-600 transition">
                  {plan.title}
                </h3>

                <p className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-xl inline-block">
                  Subject: {plan.subject}
                </p>

                <div className="space-y-2 text-xs text-slate-700 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <p><b>🎯 Learning Objectives:</b> {plan.learningObjectives}</p>
                  <p><b>⚙️ Teaching Methods:</b> {plan.teachingMethods}</p>
                  <p><b>🛠️ Teaching Aids:</b> {plan.teachingAids}</p>
                  <p><b>📚 Homework Planning:</b> {plan.homeworkPlanning}</p>
                  <p><b>🏆 Learning Outcomes:</b> {plan.learningOutcomes}</p>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" /> {plan.date}
                </span>
                <div className="flex items-center gap-2">
                  <button className="text-emerald-600 hover:underline font-bold">Edit</button>
                  <button onClick={() => handleDelete(plan.id)} className="text-slate-400 hover:text-rose-600 font-semibold">Delete</button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Create Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900">Create New Lesson Plan</h3>
              <button onClick={() => setIsModalOpen(false)} className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold">✕</button>
            </div>

            <form className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Plan Title</label>
                  <input 
                    type="text" 
                    value={title} 
                    onChange={(e) => setTitle(e.target.value)} 
                    placeholder="e.g. Quadratic Equations Masterclass" 
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Plan Scope Type</label>
                  <select 
                    value={type} 
                    onChange={(e) => setType(e.target.value as any)}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl bg-white"
                  >
                    <option value="daily">Daily Lesson Plan</option>
                    <option value="weekly">Weekly Plan</option>
                    <option value="monthly">Monthly Plan</option>
                    <option value="annual">Annual Plan</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Grade & Section</label>
                  <input 
                    type="text" 
                    value={grade} 
                    onChange={(e) => setGrade(e.target.value)} 
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl"
                  />
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

              <div>
                <label className="block font-bold text-slate-700 mb-1">Learning Objectives</label>
                <textarea 
                  rows={2} 
                  value={learningObjectives} 
                  onChange={(e) => setLearningObjectives(e.target.value)} 
                  placeholder="What will students learn?"
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl resize-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Teaching Methods</label>
                <input 
                  type="text" 
                  value={teachingMethods} 
                  onChange={(e) => setTeachingMethods(e.target.value)} 
                  placeholder="e.g. Inquiry-based learning, direct instruction" 
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Teaching Aids & Materials</label>
                <input 
                  type="text" 
                  value={teachingAids} 
                  onChange={(e) => setTeachingAids(e.target.value)} 
                  placeholder="e.g. Projector, Graphing calculators, GeoGebra" 
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Homework Planning</label>
                <input 
                  type="text" 
                  value={homeworkPlanning} 
                  onChange={(e) => setHomeworkPlanning(e.target.value)} 
                  placeholder="e.g. Exercise 5.2 Q1-Q10" 
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Expected Learning Outcomes</label>
                <input 
                  type="text" 
                  value={learningOutcomes} 
                  onChange={(e) => setLearningOutcomes(e.target.value)} 
                  placeholder="e.g. Mastery of root factorization" 
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button 
                  type="button" 
                  onClick={(e) => handleCreatePlan(e, 'Draft')}
                  className="px-4 py-2.5 bg-slate-100 text-slate-700 rounded-xl font-bold flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" /> Save Draft
                </button>
                <button 
                  type="button" 
                  onClick={(e) => handleCreatePlan(e, 'Published')}
                  className="px-5 py-2.5 bg-emerald-600 text-white rounded-xl font-bold shadow-sm flex items-center gap-1.5"
                >
                  <Send className="w-4 h-4" /> Publish Plan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
