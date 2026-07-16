import React, { useState } from 'react';
import { 
  Sparkles, 
  Bot, 
  Send, 
  Loader2, 
  BookOpen, 
  Calendar, 
  FileText, 
  Award, 
  TrendingUp,
  CheckCircle2,
  HelpCircle,
  Mic,
  MicOff
} from 'lucide-react';

export const AiHub: React.FC = () => {
  const [activePersona, setActivePersona] = useState<'principal' | 'teacher' | 'tutor' | 'parent'>('principal');
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'user' | 'ai'; text: string }>>([
    {
      sender: 'ai',
      text: 'Hello! I am your Galaxy ERP AI Assistant. How can I optimize institutional performance, lesson planning, or student tutoring for you today?'
    }
  ]);
  const [loading, setLoading] = useState(false);

  // Speech Recognition State
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = React.useRef<any>(null);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser.");
      return;
    }

    if (!recognitionRef.current) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;

      recognitionRef.current.onstart = () => setIsListening(true);
      
      recognitionRef.current.onresult = (event: any) => {
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript + ' ';
          }
        }
        if (finalTranscript) {
          setChatInput((prev) => prev + finalTranscript);
        }
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error("Speech recognition error", event.error);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }

    try {
      recognitionRef.current.start();
    } catch (e) {
      console.error(e);
    }
  };

  // Generator states
  const [generatorTab, setGeneratorTab] = useState<'chat' | 'lesson' | 'timetable' | 'exam' | 'report'>('chat');
  
  // Lesson plan state
  const [lessonSubject, setLessonSubject] = useState('Advanced Mathematics');
  const [lessonGrade, setLessonGrade] = useState('Grade 12');
  const [lessonTopic, setLessonTopic] = useState('Multivariate Calculus & Optimization');
  const [lessonResult, setLessonResult] = useState('');
  const [generatingLesson, setGeneratingLesson] = useState(false);

  // Timetable state
  const [ttClassName, setTtClassName] = useState('Grade 12-A');
  const [ttResult, setTtResult] = useState('');
  const [generatingTt, setGeneratingTt] = useState(false);

  // Exam question paper state
  const [examSubject, setExamSubject] = useState('Computer Science & AI');
  const [examDiff, setExamDiff] = useState('Advanced (Competitive)');
  const [examMarks, setExamMarks] = useState('100');
  const [examResult, setExamResult] = useState('');
  const [generatingExam, setGeneratingExam] = useState(false);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || loading) return;

    const userText = chatInput;
    setChatInput('');
    setChatMessages(prev => [...prev, { sender: 'user', text: userText }]);
    setLoading(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: userText, persona: activePersona })
      });
      const data = await res.json();
      if (data.reply) {
        setChatMessages(prev => [...prev, { sender: 'ai', text: data.reply }]);
      } else {
        setChatMessages(prev => [...prev, { sender: 'ai', text: 'Error generating AI response.' }]);
      }
    } catch (err) {
      setChatMessages(prev => [...prev, { sender: 'ai', text: 'Server connection error.' }]);
    } finally {
      setLoading(false);
    }
  };

  const generateLessonPlan = async () => {
    setGeneratingLesson(true);
    try {
      const res = await fetch('/api/ai/lesson-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject: lessonSubject, grade: lessonGrade, topic: lessonTopic })
      });
      const data = await res.json();
      setLessonResult(data.result || 'No result generated.');
    } catch (err) {
      setLessonResult('Error connecting to AI service.');
    } finally {
      setGeneratingLesson(false);
    }
  };

  const generateTimetable = async () => {
    setGeneratingTt(true);
    try {
      const res = await fetch('/api/ai/timetable', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ institutionName: 'Galaxy Academy', classes: [ttClassName], teachers: ['Dr. Alok', 'Prof. Neha'], workingDays: 5 })
      });
      const data = await res.json();
      setTtResult(data.result || 'No timetable generated.');
    } catch (err) {
      setTtResult('Error generating timetable.');
    } finally {
      setGeneratingTt(false);
    }
  };

  const generateExamPaper = async () => {
    setGeneratingExam(true);
    try {
      const res = await fetch('/api/ai/question-paper', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject: examSubject, grade: 'Grade 12', difficulty: examDiff, totalMarks: examMarks, topics: 'Neural Networks, Data Structures, Algorithms' })
      });
      const data = await res.json();
      setExamResult(data.result || 'No exam paper generated.');
    } catch (err) {
      setExamResult('Error generating exam paper.');
    } finally {
      setGeneratingExam(false);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-violet-900 via-indigo-900 to-slate-900 text-white rounded-3xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-80 bg-pink-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="flex items-center space-x-3 mb-2">
          <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center backdrop-blur-md">
            <Sparkles className="w-6 h-6 text-pink-400" />
          </div>
          <div>
            <h1 className="text-2xl font-black">Galaxy AI Campus Suite (Powered by Gemini)</h1>
            <p className="text-xs text-indigo-200">
              Enterprise-grade generative AI for principals, teachers, student tutors, and automated institutional workflows.
            </p>
          </div>
        </div>

        {/* Generator Navigation Tabs */}
        <div className="flex flex-wrap gap-2 mt-6">
          <button
            onClick={() => setGeneratorTab('chat')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center space-x-2 transition ${
              generatorTab === 'chat' ? 'bg-white text-indigo-950 shadow-md' : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            <Bot className="w-4 h-4" />
            <span>AI Assistants Chat</span>
          </button>
          <button
            onClick={() => setGeneratorTab('lesson')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center space-x-2 transition ${
              generatorTab === 'lesson' ? 'bg-white text-indigo-950 shadow-md' : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>AI Lesson Planner</span>
          </button>
          <button
            onClick={() => setGeneratorTab('timetable')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center space-x-2 transition ${
              generatorTab === 'timetable' ? 'bg-white text-indigo-950 shadow-md' : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>AI Timetable Generator</span>
          </button>
          <button
            onClick={() => setGeneratorTab('exam')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center space-x-2 transition ${
              generatorTab === 'exam' ? 'bg-white text-indigo-950 shadow-md' : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>AI Question Papers</span>
          </button>
        </div>
      </div>

      {/* Tab 1: AI Chat Assistant */}
      {generatorTab === 'chat' && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Persona selector */}
          <div className="flex flex-col gap-6 lg:col-span-1 h-[600px]">
            <div className="bg-white border border-slate-200 rounded-2xl p-4 space-y-2 shrink-0">
              <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Select AI Persona</h2>
              <button
                onClick={() => setActivePersona('principal')}
                className={`w-full text-left p-2 rounded-xl text-xs font-medium flex items-center space-x-3 transition ${
                  activePersona === 'principal' ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' : 'hover:bg-slate-50 text-slate-700'
                }`}
              >
                <span className="text-lg">🏛️</span>
                <div>
                  <div className="font-bold">Principal Advisor</div>
                  <div className="text-[10px] text-slate-500">Institution analytics</div>
                </div>
              </button>
  
              <button
                onClick={() => setActivePersona('teacher')}
                className={`w-full text-left p-2 rounded-xl text-xs font-medium flex items-center space-x-3 transition ${
                  activePersona === 'teacher' ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' : 'hover:bg-slate-50 text-slate-700'
                }`}
              >
                <span className="text-lg">👨‍🏫</span>
                <div>
                  <div className="font-bold">Teacher Assistant</div>
                  <div className="text-[10px] text-slate-500">Pedagogy & lessons</div>
                </div>
              </button>

              <button
                onClick={() => setActivePersona('tutor')}
                className={`w-full text-left p-2 rounded-xl text-xs font-medium flex items-center space-x-3 transition ${
                  activePersona === 'tutor' ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' : 'hover:bg-slate-50 text-slate-700'
                }`}
              >
                <span className="text-lg">🎓</span>
                <div>
                  <div className="font-bold">Student Tutor</div>
                  <div className="text-[10px] text-slate-500">Socratic guidance</div>
                </div>
              </button>

              <button
                onClick={() => setActivePersona('parent')}
                className={`w-full text-left p-2 rounded-xl text-xs font-medium flex items-center space-x-3 transition ${
                  activePersona === 'parent' ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' : 'hover:bg-slate-50 text-slate-700'
                }`}
              >
                <span className="text-lg">👨‍👩‍👦</span>
                <div>
                  <div className="font-bold">Parent Assistant</div>
                  <div className="text-[10px] text-slate-500">Fee, bus & attendance</div>
                </div>
              </button>
            </div>

            {/* Chat History Panel */}
            <div className="bg-white border border-slate-200 rounded-2xl p-4 flex-1 overflow-y-auto">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Recent Chats</h2>
                <button className="text-[10px] font-semibold text-indigo-600 hover:text-indigo-700 bg-indigo-50 px-2 py-1 rounded-md">New Chat</button>
              </div>
              <div className="space-y-2">
                {[
                  { title: 'Student performance analysis Q3', date: 'Today', persona: 'principal' },
                  { title: 'Grade 10 Science lesson plan', date: 'Yesterday', persona: 'teacher' },
                  { title: 'Attendance report template', date: 'Oct 12', persona: 'principal' },
                  { title: 'Parent communication draft', date: 'Oct 10', persona: 'teacher' },
                  { title: 'Upcoming events schedule', date: 'Oct 08', persona: 'principal' },
                ].map((chat, idx) => (
                  <button key={idx} className="w-full text-left p-2.5 rounded-xl hover:bg-slate-50 transition border border-transparent hover:border-slate-100 group">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-semibold text-indigo-600 uppercase">{chat.persona}</span>
                      <span className="text-[9px] text-slate-400 font-medium">{chat.date}</span>
                    </div>
                    <p className="text-xs text-slate-700 font-medium truncate group-hover:text-indigo-700 transition-colors">{chat.title}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Chat Window */}
          lg:col-span-3 bg-white border border-slate-200 rounded-2xl shadow-sm flex flex-col h-[600px] lg:col-span-3
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm flex flex-col h-[600px] lg:col-span-3">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></div>
                <span className="font-bold text-sm text-slate-900 uppercase">
                  Active Persona: {activePersona.toUpperCase()} AI
                </span>
              </div>
              <span className="text-xs bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-full font-medium">
                Gemini 2.5 Flash
              </span>
            </div>

            {/* Messages */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50/50">
              {chatMessages.map((msg, i) => (
                <div key={i} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-xs md:text-sm ${
                    msg.sender === 'user' 
                      ? 'bg-indigo-600 text-white rounded-br-none shadow-md' 
                      : 'bg-white text-slate-800 border border-slate-200 rounded-bl-none shadow-sm'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-white border border-slate-200 rounded-2xl px-4 py-3 flex items-center space-x-2 text-slate-500 text-xs">
                    <Loader2 className="w-4 h-4 animate-spin text-indigo-600" />
                    <span>AI is reasoning and crafting response...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Input Form */}
            <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-200 bg-white flex items-center space-x-2">
              <div className="flex-1 relative flex items-center">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder={`Ask ${activePersona} AI anything about your institution or studies...`}
                  className="w-full bg-slate-100 border border-slate-200 rounded-xl pl-4 pr-12 py-2.5 text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  type="button"
                  onClick={toggleListening}
                  className={`absolute right-2 p-1.5 rounded-lg transition-colors ${
                    isListening ? 'text-red-500 bg-red-100 animate-pulse' : 'text-slate-400 hover:text-indigo-600 hover:bg-slate-200/50'
                  }`}
                  title={isListening ? "Stop listening" : "Start voice input"}
                >
                  {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </button>
              </div>
              <button
                type="submit"
                disabled={loading || !chatInput.trim()}
                className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white px-5 py-2.5 rounded-xl text-xs md:text-sm font-semibold transition flex items-center space-x-1 shadow-md shadow-indigo-600/30 shrink-0"
              >
                <span className="hidden sm:inline">Send</span>
                <Send className="w-4 h-4 sm:ml-1" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Tab 2: AI Lesson Planner */}
      {generatorTab === 'lesson' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
          <h2 className="text-lg font-bold text-slate-900">AI Lesson Plan & Curriculum Generator</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Subject</label>
              <input
                type="text"
                value={lessonSubject}
                onChange={e => setLessonSubject(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Grade Level</label>
              <input
                type="text"
                value={lessonGrade}
                onChange={e => setLessonGrade(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Specific Topic</label>
              <input
                type="text"
                value={lessonTopic}
                onChange={e => setLessonTopic(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs"
              />
            </div>
          </div>
          <button
            onClick={generateLessonPlan}
            disabled={generatingLesson}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-5 py-2.5 rounded-xl text-xs shadow-md shadow-indigo-600/30 transition flex items-center space-x-2"
          >
            {generatingLesson ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            <span>Generate AI Lesson Plan</span>
          </button>

          {lessonResult && (
            <div className="mt-4 p-5 bg-slate-50 border border-slate-200 rounded-2xl text-xs md:text-sm text-slate-800 whitespace-pre-wrap leading-relaxed">
              {lessonResult}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: AI Timetable Generator */}
      {generatorTab === 'timetable' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
          <h2 className="text-lg font-bold text-slate-900">AI Conflict-Free Timetable Generator</h2>
          <div className="max-w-md">
            <label className="block text-xs font-semibold text-slate-700 mb-1">Class / Section</label>
            <input
              type="text"
              value={ttClassName}
              onChange={e => setTtClassName(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs mb-3"
            />
            <button
              onClick={generateTimetable}
              disabled={generatingTt}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-5 py-2.5 rounded-xl text-xs shadow-md shadow-indigo-600/30 transition flex items-center space-x-2"
            >
              {generatingTt ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              <span>Generate Optimized Timetable</span>
            </button>
          </div>

          {ttResult && (
            <div className="mt-4 p-5 bg-slate-50 border border-slate-200 rounded-2xl text-xs md:text-sm text-slate-800 whitespace-pre-wrap leading-relaxed">
              {ttResult}
            </div>
          )}
        </div>
      )}

      {/* Tab 4: AI Question Paper Generator */}
      {generatorTab === 'exam' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
          <h2 className="text-lg font-bold text-slate-900">AI Exam Question Paper Generator</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Subject</label>
              <input
                type="text"
                value={examSubject}
                onChange={e => setExamSubject(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Difficulty</label>
              <select
                value={examDiff}
                onChange={e => setExamDiff(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs"
              >
                <option>Standard (Board Level)</option>
                <option>Advanced (Competitive)</option>
                <option>Foundational</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Total Marks</label>
              <input
                type="text"
                value={examMarks}
                onChange={e => setExamMarks(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs"
              />
            </div>
          </div>
          <button
            onClick={generateExamPaper}
            disabled={generatingExam}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-5 py-2.5 rounded-xl text-xs shadow-md shadow-indigo-600/30 transition flex items-center space-x-2"
          >
            {generatingExam ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            <span>Generate Exam Paper & Answer Key</span>
          </button>

          {examResult && (
            <div className="mt-4 p-5 bg-slate-50 border border-slate-200 rounded-2xl text-xs md:text-sm text-slate-800 whitespace-pre-wrap leading-relaxed">
              {examResult}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
