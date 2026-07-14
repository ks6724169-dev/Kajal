import React, { useState } from 'react';
import { 
  FileText, 
  Plus, 
  Trash2, 
  Calendar, 
  Award, 
  Search, 
  Paperclip, 
  CheckCircle, 
  Clock, 
  UserCheck, 
  MessageSquare,
  Upload,
  Edit,
  Eye
} from 'lucide-react';

export const AssignmentsView: React.FC = () => {
  const [assignments, setAssignments] = useState([
    { 
      id: 1, 
      title: 'Calculus Mid-Term Mini Project', 
      type: 'Project',
      subject: 'Advanced Mathematics', 
      gradeClass: 'Grade 10-A', 
      maxMarks: 50, 
      dueDate: 'July 25, 2026', 
      status: 'Active',
      attachment: 'Calculus_Guidelines.pdf',
      description: 'Analyze real-world rate of change using parametric curves and graphical plots.',
      submissionsCount: 38,
      totalStudents: 42
    },
    { 
      id: 2, 
      title: 'Vector Geometry Case Study', 
      type: 'Research Paper',
      subject: 'Trigonometry', 
      gradeClass: 'Grade 12-A', 
      maxMarks: 30, 
      dueDate: 'July 28, 2026', 
      status: 'Active',
      attachment: 'Vector_Rubric.docx',
      description: 'Investigate 3D vector spaces and dot product applications in spatial physics.',
      submissionsCount: 30,
      totalStudents: 35
    },
    { 
      id: 3, 
      title: 'Statistical Probability Analysis', 
      type: 'Problem Set',
      subject: 'Applied Statistics', 
      gradeClass: 'Grade 11-B', 
      maxMarks: 40, 
      dueDate: 'August 05, 2026', 
      status: 'Draft',
      attachment: 'Stats_Problem_Set.pdf',
      description: 'Hypothesis testing and normal distribution calculations.',
      submissionsCount: 0,
      totalStudents: 38
    },
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAssignment, setSelectedAssignment] = useState<any>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  // Form states for creating assignment
  const [title, setTitle] = useState('');
  const [type, setType] = useState('Project');
  const [subject, setSubject] = useState('Advanced Mathematics');
  const [gradeClass, setGradeClass] = useState('Grade 10-A');
  const [maxMarks, setMaxMarks] = useState('50');
  const [dueDate, setDueDate] = useState('2026-08-01');
  const [attachment, setAttachment] = useState('Assignment_Brief.pdf');
  const [description, setDescription] = useState('');

  // Evaluation modal state for a student submission
  const [selectedSubmission, setSelectedSubmission] = useState<any>(null);
  const [awardedMarks, setAwardedMarks] = useState('45');
  const [feedback, setFeedback] = useState('Excellent work on the limit derivations. Very thorough graphs.');
  const [isEvaluateModalOpen, setIsEvaluateModalOpen] = useState(false);

  const handleCreateAssignment = (e: React.FormEvent, status: 'Active' | 'Draft') => {
    e.preventDefault();
    if (!title.trim()) return;

    const newAssignment = {
      id: Date.now(),
      title,
      type,
      subject,
      gradeClass,
      maxMarks: parseInt(maxMarks) || 50,
      dueDate,
      status,
      attachment,
      description: description || 'Complete the assignment according to rubric guidelines.',
      submissionsCount: 0,
      totalStudents: 40
    };

    setAssignments([newAssignment, ...assignments]);
    setTitle('');
    setDescription('');
    setIsCreateModalOpen(false);
    alert(`Assignment ${status === 'Active' ? 'published' : 'saved as draft'} successfully.`);
  };

  const handleDelete = (id: number) => {
    setAssignments(assignments.filter(a => a.id !== id));
  };

  const handleOpenReview = (assignment: any) => {
    setSelectedAssignment(assignment);
    setIsReviewModalOpen(true);
  };

  const handleOpenEvaluate = (sub: any) => {
    setSelectedSubmission(sub);
    setAwardedMarks(sub.marks ? sub.marks.toString() : '42');
    setFeedback(sub.feedback || 'Great effort! Ensure proper notation in step 3.');
    setIsEvaluateModalOpen(true);
  };

  const handleSaveEvaluation = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Evaluation saved for ${selectedSubmission?.name}: ${awardedMarks}/${selectedAssignment?.maxMarks} marks.`);
    setIsEvaluateModalOpen(false);
  };

  const filteredAssignments = assignments.filter(a => 
    a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.gradeClass.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-20">
      {/* Header & Controls */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <FileText className="w-6 h-6 text-emerald-600" />
            Assignment Management & Student Evaluation Hub
          </h2>
          <p className="text-xs text-slate-500 mt-1">Create assignments, track types, set due dates, upload attachments, review submissions, and assign marks & feedback.</p>
        </div>

        <button 
          onClick={() => setIsCreateModalOpen(true)}
          className="px-4 py-2.5 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 transition flex items-center gap-2 shadow-sm whitespace-nowrap"
        >
          <Plus className="w-4 h-4" /> Create Assignment
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input 
            type="text" 
            placeholder="Search assignments, types, subjects..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
      </div>

      {/* Assignments Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAssignments.length === 0 ? (
          <div className="col-span-full bg-white border border-slate-200 rounded-3xl p-16 text-center text-slate-400 text-sm">
            No assignments found matching your search.
          </div>
        ) : (
          filteredAssignments.map(a => (
            <div key={a.id} className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:shadow-md transition flex flex-col justify-between group space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase tracking-wider">
                    {a.type}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                      {a.gradeClass}
                    </span>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 flex items-center gap-1">
                      <Award className="w-3 h-3" /> {a.maxMarks} Marks
                    </span>
                  </div>
                </div>

                <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-600 transition">
                  {a.title}
                </h3>

                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {a.description}
                </p>

                <div className="flex items-center gap-1.5 text-xs text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-xl border border-indigo-100">
                  <Paperclip className="w-3.5 h-3.5" /> File: <b>{a.attachment}</b>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
                  <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5 text-slate-400" /> Due: {a.dueDate}</span>
                </div>
              </div>

              {/* Submissions & Actions */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                <button 
                  onClick={() => handleOpenReview(a)}
                  className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-xl font-bold transition flex items-center gap-1"
                >
                  <UserCheck className="w-3.5 h-3.5" /> Submissions ({a.submissionsCount}/{a.totalStudents})
                </button>
                <button 
                  onClick={() => handleDelete(a.id)}
                  className="p-2 text-slate-400 hover:text-rose-600 transition rounded-xl"
                  title="Delete Assignment"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Create Assignment Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900">Create New Assignment</h3>
              <button onClick={() => setIsCreateModalOpen(false)} className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold">✕</button>
            </div>

            <form className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Assignment Title</label>
                <input 
                  type="text" 
                  value={title} 
                  onChange={(e) => setTitle(e.target.value)} 
                  placeholder="e.g. Statistical Analysis Project" 
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Assignment Type</label>
                  <select 
                    value={type} 
                    onChange={(e) => setType(e.target.value)}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl bg-white"
                  >
                    <option value="Project">Project</option>
                    <option value="Research Paper">Research Paper</option>
                    <option value="Problem Set">Problem Set</option>
                    <option value="Presentation">Presentation</option>
                    <option value="Lab Report">Lab Report</option>
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
                  <label className="block font-bold text-slate-700 mb-1">Due Date</label>
                  <input 
                    type="date" 
                    value={dueDate} 
                    onChange={(e) => setDueDate(e.target.value)} 
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Attach Guidelines / File</label>
                <input 
                  type="text" 
                  value={attachment} 
                  onChange={(e) => setAttachment(e.target.value)} 
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Assignment Description</label>
                <textarea 
                  rows={3} 
                  value={description} 
                  onChange={(e) => setDescription(e.target.value)} 
                  placeholder="Provide rubrics and instructions..." 
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl resize-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button 
                  type="button" 
                  onClick={(e) => handleCreateAssignment(e, 'Draft')}
                  className="px-4 py-2.5 bg-slate-100 text-slate-700 rounded-xl font-bold"
                >
                  Save Draft
                </button>
                <button 
                  type="button" 
                  onClick={(e) => handleCreateAssignment(e, 'Active')}
                  className="px-5 py-2.5 bg-emerald-600 text-white rounded-xl font-bold shadow-sm"
                >
                  Publish Assignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Review & Evaluate Submissions Modal */}
      {isReviewModalOpen && selectedAssignment && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 uppercase">
                  {selectedAssignment.subject} • Max: {selectedAssignment.maxMarks} Marks
                </span>
                <h3 className="text-xl font-bold text-slate-900 mt-1">{selectedAssignment.title}</h3>
              </div>
              <button onClick={() => setIsReviewModalOpen(false)} className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold">✕</button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex justify-between items-center">
                <div>
                  <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Student Submissions</span>
                  <p className="text-base font-bold text-slate-900 mt-0.5">{selectedAssignment.submissionsCount} of {selectedAssignment.totalStudents} Submitted</p>
                </div>
                <span className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-xl font-bold border border-emerald-200">
                  Due: {selectedAssignment.dueDate}
                </span>
              </div>

              <div className="space-y-3">
                <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">Submissions & Grading List</h4>
                {[
                  { name: 'Alice Smith', file: 'Alice_Calculus_Project.pdf', date: 'July 24, 03:20 PM', status: 'Graded', marks: 48, feedback: 'Outstanding graphical accuracy!' },
                  { name: 'Bob Johnson', file: 'Bob_Project_Draft.pdf', date: 'July 24, 05:10 PM', status: 'Pending', marks: null, feedback: '' },
                  { name: 'Charlie Brown', file: 'Charlie_Vector_Work.pdf', date: 'July 25, 09:00 AM', status: 'Pending', marks: null, feedback: '' },
                  { name: 'Diana Prince', file: '-', date: 'Not Submitted', status: 'Missing', marks: null, feedback: '' },
                ].map((sub, sidx) => (
                  <div key={sidx} className="bg-white border border-slate-200 p-4 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                    <div>
                      <p className="font-bold text-slate-900 text-sm">{sub.name}</p>
                      <p className="text-slate-500 mt-0.5">File: <span className="text-indigo-600 font-medium">{sub.file}</span> • Submitted: {sub.date}</p>
                      {sub.feedback && <p className="text-emerald-700 mt-1 italic">Feedback: "{sub.feedback}"</p>}
                    </div>

                    <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                      <span className={`px-2.5 py-1 rounded-lg font-semibold text-xs ${sub.status === 'Graded' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : sub.status === 'Pending' ? 'bg-indigo-50 text-indigo-700' : 'bg-rose-50 text-rose-700'}`}>
                        {sub.status === 'Graded' ? `${sub.marks}/${selectedAssignment.maxMarks} Marks` : sub.status}
                      </span>
                      <button 
                        onClick={() => handleOpenEvaluate(sub)}
                        className="px-3 py-1.5 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition"
                      >
                        Evaluate
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-100">
              <button onClick={() => setIsReviewModalOpen(false)} className="px-5 py-2.5 bg-slate-100 text-slate-700 rounded-xl font-bold">Close Review</button>
            </div>
          </div>
        </div>
      )}

      {/* Evaluate Student Submission Modal */}
      {isEvaluateModalOpen && selectedSubmission && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-6">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900">Evaluate: {selectedSubmission.name}</h3>
              <button onClick={() => setIsEvaluateModalOpen(false)} className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold">✕</button>
            </div>

            <form onSubmit={handleSaveEvaluation} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Submitted File</label>
                <p className="font-semibold text-indigo-600 bg-indigo-50 p-3 rounded-xl border border-indigo-100 flex items-center gap-2">
                  <Paperclip className="w-4 h-4" /> {selectedSubmission.file}
                </p>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Awarded Marks (Max: {selectedAssignment?.maxMarks})</label>
                <input 
                  type="number" 
                  max={selectedAssignment?.maxMarks || 50}
                  value={awardedMarks} 
                  onChange={(e) => setAwardedMarks(e.target.value)} 
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-xs"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Teacher Feedback & Comments</label>
                <textarea 
                  rows={4} 
                  value={feedback} 
                  onChange={(e) => setFeedback(e.target.value)} 
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-xs resize-none"
                  placeholder="Provide constructive feedback..."
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button type="button" onClick={() => setIsEvaluateModalOpen(false)} className="px-4 py-2.5 bg-slate-100 text-slate-700 rounded-xl font-bold">Cancel</button>
                <button type="submit" className="px-5 py-2.5 bg-emerald-600 text-white rounded-xl font-bold shadow-sm">Save & Publish Grade</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
