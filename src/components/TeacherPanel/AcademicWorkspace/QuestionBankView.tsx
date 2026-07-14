import React, { useState } from 'react';
import { 
  HelpCircle, 
  Plus, 
  Trash2, 
  Search, 
  Filter, 
  Download, 
  Edit, 
  BookOpen, 
  Sparkles, 
  CheckCircle2, 
  Layers, 
  Award,
  FileText
} from 'lucide-react';

export const QuestionBankView: React.FC = () => {
  const [questions, setQuestions] = useState([
    {
      id: 1,
      type: 'MCQ',
      subject: 'Advanced Mathematics',
      topic: 'Limits & Continuity',
      difficulty: 'Medium',
      question: 'What is the limit of (sin x) / x as x approaches 0?',
      options: ['0', '1', 'Infinity', 'Does not exist'],
      correctAnswer: '1',
      marks: 2,
      tags: ['Calculus', 'Limits']
    },
    {
      id: 2,
      type: 'Short Answer',
      subject: 'Advanced Mathematics',
      topic: 'Derivatives',
      difficulty: 'Easy',
      question: 'State the power rule for differentiating x^n with respect to x.',
      options: [],
      correctAnswer: 'd/dx (x^n) = n * x^(n-1)',
      marks: 3,
      tags: ['Derivatives', 'Power Rule']
    },
    {
      id: 3,
      type: 'Long Answer',
      subject: 'Advanced Mathematics',
      topic: 'Optimization',
      difficulty: 'Hard',
      question: 'Find the dimensions of a rectangle with perimeter 100 meters that maximizes its area. Show complete calculus proof.',
      options: [],
      correctAnswer: '25m x 25m (Square)',
      marks: 10,
      tags: ['Optimization', 'Calculus Applications']
    },
    {
      id: 4,
      type: 'HOTS Questions',
      subject: 'Advanced Mathematics',
      topic: 'Continuity & IVT',
      difficulty: 'Hard',
      question: 'Prove that if f(x) is continuous on [a, b] and f(a) < 0 < f(b), then there exists at least one c in (a, b) such that f(c) = 0.',
      options: [],
      correctAnswer: 'Intermediate Value Theorem application proof.',
      marks: 8,
      tags: ['HOTS', 'IVT']
    },
    {
      id: 5,
      type: 'Competency Questions',
      subject: 'Advanced Mathematics',
      topic: 'Real World Rates of Change',
      difficulty: 'Medium',
      question: 'A conical water tank has radius 5m and height 10m. Water is flowing in at 2 m³/min. How fast is the water level rising when depth is 4m?',
      options: [],
      correctAnswer: 'dr/dt = 2 / (8*pi) m/min',
      marks: 5,
      tags: ['Competency', 'Related Rates']
    },
    {
      id: 6,
      type: 'Previous Year Questions',
      subject: 'Advanced Mathematics',
      topic: 'Integration',
      difficulty: 'Hard',
      question: 'Evaluate the definite integral of x * e^x from x = 0 to x = 1 using integration by parts. (Board Exam 2024)',
      options: [],
      correctAnswer: '1 (since [x*e^x - e^x] evaluated from 0 to 1 equals 1)',
      marks: 6,
      tags: ['PYQ', 'Integration by Parts']
    }
  ]);

  const [activeTypeTab, setActiveTypeTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [showFilters, setShowFilters] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [activeQuestion, setActiveQuestion] = useState<any>(null);

  // Form states for Add Question
  const [qType, setQType] = useState('MCQ');
  const [qSubject, setQSubject] = useState('Advanced Mathematics');
  const [qTopic, setQTopic] = useState('Limits');
  const [qDifficulty, setQDifficulty] = useState('Medium');
  const [qText, setQText] = useState('');
  const [qMarks, setQMarks] = useState('5');
  const [qAnswer, setQAnswer] = useState('');
  const [qOptions, setQOptions] = useState('Option A, Option B, Option C, Option D');

  const questionTypes = [
    'All',
    'MCQ',
    'Short Answer',
    'Long Answer',
    'HOTS Questions',
    'Competency Questions',
    'Previous Year Questions'
  ];

  const handleAddQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!qText.trim()) return;

    const newQ = {
      id: Date.now(),
      type: qType,
      subject: qSubject,
      topic: qTopic,
      difficulty: qDifficulty,
      question: qText,
      options: qType === 'MCQ' ? qOptions.split(',').map(o => o.trim()) : [],
      correctAnswer: qAnswer || 'Standard Solution Key',
      marks: parseInt(qMarks) || 5,
      tags: [qTopic, qType]
    };

    setQuestions([newQ, ...questions]);
    setQText('');
    setQAnswer();
    setIsAddModalOpen(false);
    alert('Question added successfully to Question Bank.');
  };

  const handleDelete = (id: number) => {
    setQuestions(questions.filter(q => q.id !== id));
  };

  const handleExportBank = () => {
    alert(`Exporting ${filteredQuestions.length} questions as PDF / Question Paper format...`);
  };

  const filteredQuestions = questions.filter(q => {
    const matchesType = activeTypeTab === 'All' || q.type === activeTypeTab;
    const matchesDiff = selectedDifficulty === 'All' || q.difficulty === selectedDifficulty;
    const matchesSearch = q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.subject.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesDiff && matchesSearch;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-20">
      {/* Header & Controls */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <HelpCircle className="w-6 h-6 text-emerald-600" />
            Question Bank & Assessment Repository
          </h2>
          <p className="text-xs text-slate-500 mt-1">Manage MCQs, Short Answers, Long Answers, HOTS, Competency, and Previous Year Questions with advanced filters and export.</p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <button 
            onClick={handleExportBank}
            className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition flex items-center gap-2 shadow-sm whitespace-nowrap"
          >
            <Download className="w-4 h-4" /> Export Questions
          </button>
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2.5 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 transition flex items-center gap-2 shadow-sm whitespace-nowrap"
          >
            <Plus className="w-4 h-4" /> Add Question
          </button>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input 
            type="text" 
            placeholder="Search question text, topics..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500">Difficulty:</span>
            <select 
              value={selectedDifficulty} 
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700"
            >
              <option value="All">All Difficulties</option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>

          <div className="relative">
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition flex items-center gap-2 shadow-sm"
            >
              <span className="text-sm">❄️</span>
              <span>Filter {activeTypeTab !== 'All' ? `(${activeTypeTab})` : ''}</span>
            </button>

            {showFilters && (
              <div className="absolute right-0 mt-2 w-64 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 py-2 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-4 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 flex items-center gap-1.5">
                  <Filter className="w-3.5 h-3.5 text-emerald-600" /> Filter Question Type
                </div>
                <div className="max-h-60 overflow-y-auto py-1">
                  {questionTypes.map(t => (
                    <button
                      key={t}
                      onClick={() => {
                        setActiveTypeTab(t);
                        setShowFilters(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-xs font-medium transition flex items-center justify-between ${activeTypeTab === t ? 'bg-emerald-50 text-emerald-700 font-bold' : 'text-slate-700 hover:bg-slate-50'}`}
                    >
                      <span>{t}</span>
                      {activeTypeTab === t && <span className="text-emerald-600 font-bold">✓</span>}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Question Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredQuestions.length === 0 ? (
          <div className="col-span-full bg-white border border-slate-200 rounded-3xl p-16 text-center text-slate-400 text-sm">
            No questions found matching your filter criteria.
          </div>
        ) : (
          filteredQuestions.map(q => (
            <div key={q.id} className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:shadow-md transition flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 uppercase tracking-wider border border-emerald-200">
                      {q.type}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${q.difficulty === 'Hard' ? 'bg-rose-50 text-rose-700' : q.difficulty === 'Medium' ? 'bg-amber-50 text-amber-700' : 'bg-blue-50 text-blue-700'}`}>
                      {q.difficulty}
                    </span>
                  </div>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 flex items-center gap-1">
                    <Award className="w-3 h-3" /> {q.marks} Marks
                  </span>
                </div>

                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  {q.subject} • Topic: {q.topic}
                </p>

                <h3 className="text-sm font-bold text-slate-900 leading-snug">
                  {q.question}
                </h3>

                {q.type === 'MCQ' && q.options && q.options.length > 0 && (
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    {q.options.map((opt, oidx) => (
                      <div key={oidx} className={`text-xs p-2.5 rounded-xl border font-medium ${opt === q.correctAnswer ? 'bg-emerald-50 border-emerald-300 text-emerald-800' : 'bg-slate-50 border-slate-200 text-slate-700'}`}>
                        {String.fromCharCode(65 + oidx)}. {opt}
                      </div>
                    ))}
                  </div>
                )}

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs text-slate-700">
                  <span className="font-bold text-slate-900">Answer Key:</span> {q.correctAnswer}
                </div>
              </div>

              {/* Actions */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5">
                  {q.tags.map((t, tidx) => (
                    <span key={tidx} className="text-[10px] bg-slate-100 px-2 py-0.5 rounded-md text-slate-600 font-medium">
                      #{t}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-1">
                  <button 
                    onClick={() => { setActiveQuestion(q); setIsPreviewModalOpen(true); }}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-700 rounded-xl font-bold transition"
                  >
                    View Details
                  </button>
                  <button 
                    onClick={() => handleDelete(q.id)}
                    className="p-2 text-slate-400 hover:text-rose-600 transition rounded-xl"
                    title="Delete Question"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Question Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900">Add New Question</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold">✕</button>
            </div>

            <form onSubmit={handleAddQuestion} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Question Type</label>
                  <select 
                    value={qType} 
                    onChange={(e) => setQType(e.target.value)}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl bg-white"
                  >
                    <option value="MCQ">MCQ</option>
                    <option value="Short Answer">Short Answer</option>
                    <option value="Long Answer">Long Answer</option>
                    <option value="HOTS Questions">HOTS Questions</option>
                    <option value="Competency Questions">Competency Questions</option>
                    <option value="Previous Year Questions">Previous Year Questions</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Difficulty Level</label>
                  <select 
                    value={qDifficulty} 
                    onChange={(e) => setQDifficulty(e.target.value)}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl bg-white"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Subject</label>
                  <input 
                    type="text" 
                    value={qSubject} 
                    onChange={(e) => setQSubject(e.target.value)} 
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Topic</label>
                  <input 
                    type="text" 
                    value={qTopic} 
                    onChange={(e) => setQTopic(e.target.value)} 
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Marks</label>
                  <input 
                    type="number" 
                    value={qMarks} 
                    onChange={(e) => setQMarks(e.target.value)} 
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Question Statement</label>
                <textarea 
                  rows={3} 
                  value={qText} 
                  onChange={(e) => setQText(e.target.value)} 
                  placeholder="Enter question text here..." 
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl resize-none"
                  required
                />
              </div>

              {qType === 'MCQ' && (
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Options (Comma separated)</label>
                  <input 
                    type="text" 
                    value={qOptions} 
                    onChange={(e) => setQOptions(e.target.value)} 
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl"
                  />
                </div>
              )}

              <div>
                <label className="block font-bold text-slate-700 mb-1">Correct Answer / Solution Key</label>
                <input 
                  type="text" 
                  value={qAnswer} 
                  onChange={(e) => setQAnswer(e.target.value)} 
                  placeholder="Enter correct answer..." 
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-4 py-2.5 bg-slate-100 text-slate-700 rounded-xl font-bold">Cancel</button>
                <button type="submit" className="px-5 py-2.5 bg-emerald-600 text-white rounded-xl font-bold shadow-sm">Save Question</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {isPreviewModalOpen && activeQuestion && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-2xl space-y-6">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 uppercase">
                  {activeQuestion.type} • {activeQuestion.subject}
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-1">Question Preview</h3>
              </div>
              <button onClick={() => setIsPreviewModalOpen(false)} className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold">✕</button>
            </div>

            <div className="space-y-4 text-xs text-slate-700">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex justify-between font-bold text-slate-500">
                  <span>Topic: {activeQuestion.topic}</span>
                  <span className="text-emerald-700">{activeQuestion.marks} Marks • {activeQuestion.difficulty}</span>
                </div>
                <p className="text-sm font-bold text-slate-900 leading-relaxed">{activeQuestion.question}</p>
                {activeQuestion.options && activeQuestion.options.length > 0 && (
                  <div className="space-y-1.5 pt-2">
                    {activeQuestion.options.map((o: string, idx: number) => (
                      <div key={idx} className="bg-white p-2.5 rounded-xl border border-slate-200">
                        {String.fromCharCode(65 + idx)}. {o}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-200 space-y-1">
                <span className="font-bold text-emerald-900 uppercase tracking-wider text-[10px]">Verified Solution Key</span>
                <p className="font-medium text-emerald-800">{activeQuestion.correctAnswer}</p>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-100">
              <button onClick={() => setIsPreviewModalOpen(false)} className="px-5 py-2.5 bg-emerald-600 text-white rounded-xl font-bold shadow-sm">Close Preview</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
