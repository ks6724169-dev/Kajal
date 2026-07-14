import React, { useState } from 'react';
import { 
  BookOpen, 
  Plus, 
  Trash2, 
  Calendar, 
  CheckCircle, 
  Search, 
  FileText, 
  Paperclip, 
  Sparkles, 
  Edit, 
  CheckCircle2, 
  Clock, 
  Award,
  Upload,
  UserCheck
} from 'lucide-react';

export const HomeworkView: React.FC = () => {
  const [homeworkList, setHomeworkList] = useState([
    { 
      id: 1, 
      title: 'Chapter 4 Limits Practice Problems (1-25)', 
      subject: 'Advanced Mathematics', 
      grade: 'Grade 10-A', 
      dueDate: 'July 15, 2026', 
      submissionsCount: 38,
      totalStudents: 42,
      status: 'Published',
      attachment: 'Limits_Problem_Set_4.pdf',
      description: 'Solve all odd questions from section 4.2. Show complete epsilon-delta derivations where applicable.',
      aiSuggestionUsed: true
    },
    { 
      id: 2, 
      title: 'Trigonometric Identities Derivation Sheet', 
      subject: 'Trigonometry', 
      grade: 'Grade 12-A', 
      dueDate: 'July 18, 2026', 
      submissionsCount: 30,
      totalStudents: 35,
      status: 'Published',
      attachment: 'Trig_Identities_Handout.docx',
      description: 'Derive the sum and difference formulas for sine and cosine using unit circle proofs.',
      aiSuggestionUsed: false
    },
    { 
      id: 3, 
      title: 'Linear Matrix Transformations Worksheet', 
      subject: 'Calculus AP', 
      grade: 'Grade 11-B', 
      dueDate: 'July 20, 2026', 
      submissionsCount: 12,
      totalStudents: 38,
      status: 'Draft',
      attachment: 'Matrix_Transformations.pdf',
      description: 'Calculate eigenvalues and eigenvectors for 2x2 rotation matrices.',
      aiSuggestionUsed: true
    }
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedHomework, setSelectedHomework] = useState<any>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEvaluationModalOpen, setIsEvaluationModalOpen] = useState(false);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);

  // Form states
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('Advanced Mathematics');
  const [grade, setGrade] = useState('Grade 10-A');
  const [dueDate, setDueDate] = useState('2026-07-25');
  const [description, setDescription] = useState('');
  const [attachmentName, setAttachmentName] = useState('Assignment_Guidelines.pdf');

  // AI Prompt generator
  const [aiPromptTopic, setAiPromptTopic] = useState('Calculus Limits & Continuity');
  const [aiGeneratedText, setAiGeneratedText] = useState('');

  const handleCreateHomework = (e: React.FormEvent, status: 'Published' | 'Draft') => {
    e.preventDefault();
    if (!title.trim()) return;

    const newHw = {
      id: Date.now(),
      title,
      subject,
      grade,
      dueDate,
      submissionsCount: 0,
      totalStudents: 40,
      status,
      attachment: attachmentName,
      description: description || 'Complete the assigned questions thoroughly.',
      aiSuggestionUsed: false
    };

    setHomeworkList([newHw, ...homeworkList]);
    setTitle('');
    setDescription('');
    setIsCreateModalOpen(false);
    alert(`Homework ${status === 'Published' ? 'published' : 'saved as draft'} successfully.`);
  };

  const handleDelete = (id: number) => {
    setHomeworkList(homeworkList.filter(h => h.id !== id));
  };

  const handleAiSuggest = () => {
    setAiGeneratedText(`🤖 AI Generated Homework Task for "${aiPromptTopic}":\n1. Analyze function behavior near asymptotic bounds.\n2. Complete 10 rigorous problem sets on limit evaluation.\n3. Write a 1-paragraph summary on real-world rate of change applications.`);
    setIsAiModalOpen(true);
  };

  const handleApplyAiSuggestion = () => {
    setTitle(`Practice Assignment: ${aiPromptTopic}`);
    setDescription(aiGeneratedText);
    setIsAiModalOpen(false);
    setIsCreateModalOpen(true);
  };

  const filteredHomework = homeworkList.filter(h => 
    h.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    h.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
    h.grade.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-20">
      {/* Top Banner & Controls */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-emerald-600" />
            Homework Management & Submissions Hub
          </h2>
          <p className="text-xs text-slate-500 mt-1">Create homework assignments, set due dates, attach files, review student submissions, evaluate work, and use AI suggestions.</p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <button 
            onClick={handleAiSuggest}
            className="px-4 py-2.5 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-xl text-xs font-bold hover:bg-indigo-100 transition flex items-center gap-2 shadow-sm whitespace-nowrap"
          >
            <Sparkles className="w-4 h-4 text-indigo-600" /> AI Homework Ideas
          </button>
          <button 
            onClick={() => setIsCreateModalOpen(true)}
            className="px-4 py-2.5 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 transition flex items-center gap-2 shadow-sm whitespace-nowrap"
          >
            <Plus className="w-4 h-4" /> Create Homework
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input 
            type="text" 
            placeholder="Search homework or subjects..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
      </div>

      {/* Homework List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredHomework.length === 0 ? (
          <div className="col-span-full bg-white border border-slate-200 rounded-3xl p-16 text-center text-slate-400 text-sm">
            No homework assignments found matching your search.
          </div>
        ) : (
          filteredHomework.map(hw => (
            <div key={hw.id} className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:shadow-md transition flex flex-col justify-between group space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase tracking-wider">
                    {hw.subject}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                      {hw.grade}
                    </span>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${hw.status === 'Published' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                      {hw.status}
                    </span>
                  </div>
                </div>

                <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-600 transition">
                  {hw.title}
                </h3>

                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {hw.description}
                </p>

                <div className="flex items-center gap-1.5 text-xs text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-xl border border-indigo-100">
                  <Paperclip className="w-3.5 h-3.5" /> Attachment: <b>{hw.attachment}</b>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
                  <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5 text-slate-400" /> Due: {hw.dueDate}</span>
                </div>
              </div>

              {/* Submissions & Actions */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                <button 
                  onClick={() => { setSelectedHomework(hw); setIsEvaluationModalOpen(true); }}
                  className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-xl font-bold transition flex items-center gap-1"
                >
                  <UserCheck className="w-3.5 h-3.5" /> Submissions ({hw.submissionsCount}/{hw.totalStudents})
                </button>
                <button 
                  onClick={() => handleDelete(hw.id)}
                  className="p-2 text-slate-400 hover:text-rose-600 transition rounded-xl"
                  title="Delete Homework"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Create Homework Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900">Create & Assign New Homework</h3>
              <button onClick={() => setIsCreateModalOpen(false)} className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold">✕</button>
            </div>

            <form className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Homework Title</label>
                <input 
                  type="text" 
                  value={title} 
                  onChange={(e) => setTitle(e.target.value)} 
                  placeholder="e.g. Chapter 5 Problem Set" 
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
                  <label className="block font-bold text-slate-700 mb-1">Grade / Class</label>
                  <input 
                    type="text" 
                    value={grade} 
                    onChange={(e) => setGrade(e.target.value)} 
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Due Date</label>
                  <input 
                    type="date" 
                    value={dueDate} 
                    onChange={(e) => setDueDate(e.target.value)} 
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Attach Files</label>
                  <input 
                    type="text" 
                    value={attachmentName} 
                    onChange={(e) => setAttachmentName(e.target.value)} 
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Homework Description & Instructions</label>
                <textarea 
                  rows={4} 
                  value={description} 
                  onChange={(e) => setDescription(e.target.value)} 
                  placeholder="Provide detailed instructions for students..." 
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl resize-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button 
                  type="button" 
                  onClick={(e) => handleCreateHomework(e, 'Draft')}
                  className="px-4 py-2.5 bg-slate-100 text-slate-700 rounded-xl font-bold"
                >
                  Save Draft
                </button>
                <button 
                  type="button" 
                  onClick={(e) => handleCreateHomework(e, 'Published')}
                  className="px-5 py-2.5 bg-emerald-600 text-white rounded-xl font-bold shadow-sm"
                >
                  Publish Homework
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Submissions & Evaluation Modal */}
      {isEvaluationModalOpen && selectedHomework && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 uppercase">
                  {selectedHomework.subject}
                </span>
                <h3 className="text-xl font-bold text-slate-900 mt-1">{selectedHomework.title}</h3>
              </div>
              <button onClick={() => setIsEvaluationModalOpen(false)} className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold">✕</button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex justify-between items-center">
                <div>
                  <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Submission Status</span>
                  <p className="text-base font-bold text-slate-900 mt-0.5">{selectedHomework.submissionsCount} of {selectedHomework.totalStudents} Students Submitted</p>
                </div>
                <span className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-xl font-bold border border-emerald-200">
                  {Math.round((selectedHomework.submissionsCount / selectedHomework.totalStudents) * 100)}% Turnout
                </span>
              </div>

              <div className="space-y-3">
                <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">Student Submissions & Evaluation</h4>
                {[
                  { name: 'Alice Smith', status: 'Submitted', date: 'July 14, 04:30 PM', grade: 'A (95/100)' },
                  { name: 'Bob Johnson', status: 'Submitted', date: 'July 14, 05:15 PM', grade: 'B+ (88/100)' },
                  { name: 'Charlie Brown', status: 'Pending Review', date: 'July 14, 06:00 PM', grade: 'Needs Grading' },
                  { name: 'Diana Prince', status: 'Not Submitted', date: '-', grade: 'Missing' },
                ].map((sub, sidx) => (
                  <div key={sidx} className="bg-white border border-slate-200 p-4 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                    <div>
                      <p className="font-bold text-slate-900 text-sm">{sub.name}</p>
                      <p className="text-slate-500 mt-0.5">Submitted on: {sub.date}</p>
                    </div>
                    <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                      <span className={`px-2.5 py-1 rounded-lg font-semibold text-xs ${sub.status === 'Submitted' ? 'bg-emerald-50 text-emerald-700' : sub.status === 'Pending Review' ? 'bg-indigo-50 text-indigo-700' : 'bg-rose-50 text-rose-700'}`}>
                        {sub.grade}
                      </span>
                      <button 
                        onClick={() => alert(`Opening grading interface for ${sub.name}...`)}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-700 rounded-xl font-bold transition"
                      >
                        Grade
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-100">
              <button onClick={() => setIsEvaluationModalOpen(false)} className="px-5 py-2.5 bg-emerald-600 text-white rounded-xl font-bold shadow-sm">Close</button>
            </div>
          </div>
        </div>
      )}

      {/* AI Homework Generator Modal */}
      {isAiModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-6">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-600" /> AI Homework Assistant
              </h3>
              <button onClick={() => setIsAiModalOpen(false)} className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold">✕</button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Topic or Curriculum Focus</label>
                <input 
                  type="text" 
                  value={aiPromptTopic} 
                  onChange={(e) => setAiPromptTopic(e.target.value)} 
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Generated Homework Draft</label>
                <textarea 
                  rows={6} 
                  value={aiGeneratedText} 
                  onChange={(e) => setAiGeneratedText(e.target.value)} 
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-800 font-medium leading-relaxed resize-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
              <button onClick={() => setIsAiModalOpen(false)} className="px-4 py-2.5 bg-slate-100 text-slate-700 rounded-xl font-bold">Cancel</button>
              <button 
                onClick={handleApplyAiSuggestion}
                className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-bold shadow-sm flex items-center gap-1.5"
              >
                Use This Homework
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
