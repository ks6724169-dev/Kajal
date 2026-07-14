import React, { useState } from 'react';
import { 
  FlaskConical, 
  Plus, 
  Trash2, 
  Edit, 
  CheckCircle2, 
  Search, 
  FileText, 
  Users, 
  Award, 
  BookOpen, 
  Calendar,
  CheckSquare
} from 'lucide-react';

export const PracticalLabView: React.FC = () => {
  const [practicals, setPracticals] = useState([
    {
      id: 1,
      title: 'Experiment 1: Parametric Curve Plotting & Calculus Verification',
      subject: 'Advanced Mathematics',
      grade: 'Grade 10-A',
      labManual: 'Manual_Exp1_Calculus_Curves.pdf',
      attendanceCount: 40,
      totalStudents: 42,
      status: 'Completed',
      vivaAverage: '8.5 / 10',
      observationStatus: 'Verified & Signed',
      description: 'Using graphing calculators and software to plot parametric functions and verify derivative tangent lines.'
    },
    {
      id: 2,
      title: 'Experiment 2: Trigonometric Triangulation & Height Measurement',
      subject: 'Trigonometry',
      grade: 'Grade 12-A',
      labManual: 'Manual_Exp2_Trig_Survey.pdf',
      attendanceCount: 34,
      totalStudents: 35,
      status: 'Active Lab Session',
      vivaAverage: 'Pending',
      observationStatus: 'In Progress',
      description: 'Outdoor field measurements applying sine and cosine rules to calculate campus building heights.'
    },
    {
      id: 3,
      title: 'Experiment 3: Statistical Probability Distribution Simulations',
      subject: 'Applied Statistics',
      grade: 'Grade 11-B',
      labManual: 'Manual_Exp3_Probability.pdf',
      attendanceCount: 0,
      totalStudents: 38,
      status: 'Scheduled',
      vivaAverage: 'N/A',
      observationStatus: 'Not Started',
      description: 'Monte Carlo simulations of coin flips and dice rolls to verify central limit theorem.'
    }
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEvaluateModalOpen, setIsEvaluateModalOpen] = useState(false);
  const [selectedPractical, setSelectedPractical] = useState<any>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('Advanced Mathematics');
  const [grade, setGrade] = useState('Grade 10-A');
  const [labManual, setLabManual] = useState('Lab_Manual_Template.pdf');
  const [description, setDescription] = useState('');

  const handleAddPractical = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newPrac = {
      id: Date.now(),
      title,
      subject,
      grade,
      labManual,
      attendanceCount: 0,
      totalStudents: 40,
      status: 'Scheduled',
      vivaAverage: 'Pending',
      observationStatus: 'Not Started',
      description
    };

    setPracticals([newPrac, ...practicals]);
    setTitle('');
    setDescription('');
    setIsAddModalOpen(false);
    alert('Practical experiment added successfully.');
  };

  const handleDelete = (id: number) => {
    setPracticals(practicals.filter(p => p.id !== id));
  };

  const handleEvaluate = (prac: any) => {
    setSelectedPractical(prac);
    setIsEvaluateModalOpen(true);
  };

  const filteredPracticals = practicals.filter(p => 
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.grade.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-20">
      {/* Header & Controls */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <FlaskConical className="w-6 h-6 text-emerald-600" />
            Practical & Lab Management Hub
          </h2>
          <p className="text-xs text-slate-500 mt-1">Manage practical lists, lab manuals, experiment records, observations, viva marks, and lab attendance.</p>
        </div>

        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2.5 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 transition flex items-center gap-2 shadow-sm whitespace-nowrap"
        >
          <Plus className="w-4 h-4" /> Add Practical Experiment
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input 
            type="text" 
            placeholder="Search practicals, subjects..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
      </div>

      {/* Practicals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPracticals.length === 0 ? (
          <div className="col-span-full bg-white border border-slate-200 rounded-3xl p-16 text-center text-slate-400 text-sm">
            No practical experiments found matching your search.
          </div>
        ) : (
          filteredPracticals.map(prac => (
            <div key={prac.id} className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:shadow-md transition flex flex-col justify-between group space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-lg uppercase tracking-wider ${prac.status === 'Completed' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : prac.status === 'Active Lab Session' ? 'bg-amber-50 text-amber-700 border border-amber-200 animate-pulse' : 'bg-slate-100 text-slate-600'}`}>
                    {prac.status}
                  </span>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
                    {prac.grade}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-600 transition leading-snug">
                  {prac.title}
                </h3>

                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {prac.description}
                </p>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>Lab Manual:</span>
                    <span className="font-semibold text-indigo-600">{prac.labManual}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Lab Attendance:</span>
                    <span className="font-bold text-slate-900">{prac.attendanceCount}/{prac.totalStudents}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Viva Marks Avg:</span>
                    <span className="font-bold text-emerald-700">{prac.vivaAverage}</span>
                  </div>
                </div>

                <div className="text-xs text-slate-500">
                  Observation Status: <b className="text-slate-900">{prac.observationStatus}</b>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                <button 
                  onClick={() => handleEvaluate(prac)}
                  className="px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-xl font-bold transition flex items-center gap-1.5"
                >
                  <CheckSquare className="w-3.5 h-3.5" /> Evaluate Records
                </button>
                <button 
                  onClick={() => handleDelete(prac.id)}
                  className="p-2 text-slate-400 hover:text-rose-600 transition rounded-xl"
                  title="Delete Practical"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Practical Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-2xl space-y-6">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900">Add Practical Experiment</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold">✕</button>
            </div>

            <form onSubmit={handleAddPractical} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Experiment Title</label>
                <input 
                  type="text" 
                  value={title} 
                  onChange={(e) => setTitle(e.target.value)} 
                  placeholder="e.g. Experiment 4: Vector Field Simulations" 
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Subject</label>
                  <input 
                    type="text" 
                    value={subject} 
                    onChange={(e) => setSubject(e.target.value)} 
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Grade Class</label>
                  <input 
                    type="text" 
                    value={grade} 
                    onChange={(e) => setGrade(e.target.value)} 
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Lab Manual File Name</label>
                <input 
                  type="text" 
                  value={labManual} 
                  onChange={(e) => setLabManual(e.target.value)} 
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Experiment Description & Guidelines</label>
                <textarea 
                  rows={3} 
                  value={description} 
                  onChange={(e) => setDescription(e.target.value)} 
                  placeholder="Enter objective and procedures..." 
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl resize-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-4 py-2.5 bg-slate-100 text-slate-700 rounded-xl font-bold">Cancel</button>
                <button type="submit" className="px-5 py-2.5 bg-emerald-600 text-white rounded-xl font-bold shadow-sm">Save Experiment</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Evaluate Records Modal */}
      {isEvaluateModalOpen && selectedPractical && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 uppercase">
                  {selectedPractical.subject} • {selectedPractical.grade}
                </span>
                <h3 className="text-xl font-bold text-slate-900 mt-1">Evaluate: {selectedPractical.title}</h3>
              </div>
              <button onClick={() => setIsEvaluateModalOpen(false)} className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold">✕</button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex justify-between items-center">
                <div>
                  <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Lab Manual & Attendance</span>
                  <p className="text-base font-bold text-slate-900 mt-0.5">{selectedPractical.labManual} ({selectedPractical.attendanceCount}/{selectedPractical.totalStudents} Present)</p>
                </div>
                <span className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-xl font-bold border border-emerald-200">
                  {selectedPractical.status}
                </span>
              </div>

              <div className="space-y-3">
                <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">Student Observation & Viva Evaluation</h4>
                {[
                  { student: 'Alice Smith', observation: 'Accurate calculations & clean graph plot.', vivaScore: '9 / 10', status: 'Approved' },
                  { student: 'Bob Johnson', observation: 'Minor scaling error corrected during review.', vivaScore: '8 / 10', status: 'Approved' },
                  { student: 'Charlie Davis', observation: 'Pending submission of graph data.', vivaScore: 'Pending', status: 'Review Needed' },
                ].map((rec, ridx) => (
                  <div key={ridx} className="bg-white border border-slate-200 p-4 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                    <div>
                      <p className="font-bold text-slate-900 text-sm">{rec.student}</p>
                      <p className="text-slate-600 mt-0.5">Observation: "{rec.observation}"</p>
                    </div>

                    <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                      <span className={`px-2.5 py-1 rounded-lg font-semibold text-xs ${rec.status === 'Approved' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700'}`}>
                        Viva: {rec.vivaScore}
                      </span>
                      <button 
                        onClick={() => alert(`Opening grading modal for ${rec.student}...`)}
                        className="px-3.5 py-1.5 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition"
                      >
                        Grade Viva
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
