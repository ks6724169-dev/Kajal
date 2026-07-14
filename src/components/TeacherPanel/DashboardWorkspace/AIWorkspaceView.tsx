import React, { useState } from 'react';
import { 
  Bot, 
  Sparkles, 
  Send, 
  Upload, 
  Mic, 
  Copy, 
  Save, 
  Download, 
  Share2, 
  History, 
  Trash2, 
  CheckCircle, 
  FileText, 
  BookOpen, 
  HelpCircle, 
  Award, 
  BarChart, 
  Users, 
  MessageSquare, 
  Megaphone, 
  Mail, 
  Languages, 
  CheckCheck, 
  FileSearch, 
  Volume2, 
  FileCheck, 
  Cpu,
  RefreshCw,
  Plus
} from 'lucide-react';

export const AIWorkspaceView: React.FC = () => {
  const [activeTool, setActiveTool] = useState<string>('chat');
  const [promptInput, setPromptInput] = useState<string>('');
  const [chatMessages, setChatMessages] = useState([
    { id: 1, sender: 'ai', text: 'Hello! I am your Galaxy ERP AI Assistant. Choose an AI tool from the sidebar or type a prompt below to generate lesson plans, question papers, analyze student performance, and more.' }
  ]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [outputResult, setOutputResult] = useState<string>('');
  const [promptHistory, setPromptHistory] = useState([
    { id: 1, tool: 'AI Lesson Plan Generator', prompt: 'Create a 45-minute lesson plan on Calculus Limits for Grade 10', time: '10 mins ago' },
    { id: 2, tool: 'AI Quiz Generator', prompt: 'Generate 10 multiple choice questions on Trigonometric Identities', time: '1 hour ago' },
    { id: 3, tool: 'AI Parent Message Generator', prompt: 'Draft a polite follow-up message regarding Sarah’s math homework', time: 'Yesterday' }
  ]);

  const [formParams, setFormParams] = useState({
    topic: 'Calculus Limits & Continuity',
    grade: 'Grade 10',
    subject: 'Mathematics',
    difficulty: 'Advanced',
    language: 'English',
    questionCount: '10'
  });

  const [isAiMenuOpen, setIsAiMenuOpen] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);

  const aiToolsList = [
    { id: 'chat', name: 'AI Chat Assistant', icon: Bot, desc: 'General Q&A, brainstorming, and pedagogical advice.' },
    { id: 'lesson', name: 'AI Lesson Plan Generator', icon: BookOpen, desc: 'Detailed 45-min structured lesson plans.' },
    { id: 'homework', name: 'AI Homework Generator', icon: FileText, desc: 'Targeted homework assignments with answer keys.' },
    { id: 'assignment', name: 'AI Assignment Generator', icon: FileCheck, desc: 'Project briefs and rubric assessments.' },
    { id: 'exam', name: 'AI Question Paper Generator', icon: HelpCircle, desc: 'Exam papers with sections (A, B, C) and marks.' },
    { id: 'quiz', name: 'AI Quiz Generator', icon: Award, desc: 'Interactive quizzes with instant scoring keys.' },
    { id: 'performance', name: 'AI Student Performance Analysis', icon: BarChart, desc: 'Diagnostic insights on class test scores.' },
    { id: 'attendance', name: 'AI Attendance Insights', icon: Users, desc: 'Identify chronic absenteeism trends and alerts.' },
    { id: 'parent', name: 'AI Parent Message Generator', icon: MessageSquare, desc: 'Empathetic parent-teacher communication drafts.' },
    { id: 'notice', name: 'AI Notice Generator', icon: Megaphone, desc: 'Official school circulars and event announcements.' },
    { id: 'email', name: 'AI Email Writer', icon: Mail, desc: 'Professional faculty and board correspondence.' },
    { id: 'translation', name: 'AI Translation', icon: Languages, desc: 'Translate educational content across languages.' },
    { id: 'grammar', name: 'AI Grammar Checker', icon: CheckCheck, desc: 'Polish reports, notes, and question papers.' },
    { id: 'summarizer', name: 'AI Summarizer', icon: FileSearch, desc: 'Condense long research papers and notes.' },
    { id: 'ocr', name: 'AI OCR Scanner', icon: FileSearch, desc: 'Extract handwritten notes from scanned worksheets.' },
    { id: 'voicetext', name: 'AI Voice-to-Text', icon: Mic, desc: 'Transcribe spoken lecture notes into text.' },
    { id: 'textspeech', name: 'AI Text-to-Speech', icon: Volume2, desc: 'Convert lesson summaries into audio format.' },
    { id: 'analyzer', name: 'AI File Analyzer', icon: Cpu, desc: 'Deep-dive insights on uploaded PDF documents.' },
    { id: 'pdfsummary', name: 'AI PDF Summary', icon: FileText, desc: 'Quick executive summary of syllabus PDFs.' }
  ];

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!promptInput.trim()) return;

    const userMsg = { id: Date.now(), sender: 'user', text: promptInput };
    setChatMessages(prev => [...prev, userMsg]);
    const currentQuery = promptInput;
    setPromptInput('');
    setIsGenerating(true);

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: currentQuery, persona: 'teacher' })
      });
      const data = await response.json();
      const aiReply = data.reply || data.error || 'No response from AI.';

      setChatMessages(prev => [...prev, { id: Date.now() + 1, sender: 'ai', text: aiReply }]);
      setOutputResult(aiReply);
    } catch (err: any) {
      const errorMsg = `Error communicating with Gemini AI: ${err.message}`;
      setChatMessages(prev => [...prev, { id: Date.now() + 1, sender: 'ai', text: errorMsg }]);
      setOutputResult(errorMsg);
    } finally {
      setIsGenerating(false);
      setPromptHistory(prev => [
        { id: Date.now(), tool: aiToolsList.find(t => t.id === activeTool)?.name || 'AI Assistant', prompt: currentQuery, time: 'Just now' },
        ...prev
      ]);
    }
  };

  const handleGenerateTool = async () => {
    setIsGenerating(true);
    try {
      let endpoint = '/api/ai/chat';
      let payload: any = { prompt: `Generate ${aiToolsList.find(t => t.id === activeTool)?.name} for Topic: ${formParams.topic}, Grade: ${formParams.grade}, Subject: ${formParams.subject}`, persona: 'teacher' };

      if (activeTool === 'lesson') {
        endpoint = '/api/ai/lesson-plan';
        payload = { subject: formParams.subject, grade: formParams.grade, topic: formParams.topic };
      } else if (activeTool === 'exam' || activeTool === 'quiz') {
        endpoint = '/api/ai/question-paper';
        payload = { subject: formParams.subject, grade: formParams.grade, difficulty: formParams.difficulty, totalMarks: 100, topics: formParams.topic };
      }

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      const resultText = data.result || data.reply || data.error || 'Generated successfully.';
      setOutputResult(resultText);
    } catch (err: any) {
      setOutputResult(`Error generating via Gemini AI: ${err.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-20">


      {/* Main Workspace Area */}
      <div className="space-y-6">
        {/* Workspace: Interactive Area */}
        <div className="space-y-6">
          {activeTool === 'chat' ? (
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col h-[700px]">
              {/* Chat Header */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                    <Bot className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Galaxy AI Chat Assistant</h3>
                    <p className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">● Online & Ready</p>
                  </div>
                </div>
                <div className="relative">
                  <button 
                    onClick={() => setIsAiMenuOpen(!isAiMenuOpen)}
                    className="text-xs bg-indigo-50 hover:bg-indigo-100 text-indigo-700 px-3.5 py-2 rounded-xl font-semibold flex items-center gap-2 transition shadow-sm border border-indigo-100"
                  >
                    <Sparkles className="w-4 h-4 text-indigo-600" />
                    <span>Gemini 2.5 Flash Engine</span>
                    <span className="text-[10px] ml-1">▼</span>
                  </button>
                  {isAiMenuOpen && (
                    <div className="absolute right-0 mt-2 w-52 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 py-2 text-xs animate-in fade-in duration-150">
                      <button 
                        onClick={() => {
                          setIsAiMenuOpen(false);
                          setChatMessages([{ id: Date.now(), sender: 'ai', text: 'Hello! I am your Galaxy ERP AI Assistant. How can I help you today?' }]);
                        }}
                        className="w-full text-left px-4 py-2.5 hover:bg-indigo-50 hover:text-indigo-700 text-slate-700 font-medium flex items-center gap-2.5 transition"
                      >
                        <Plus className="w-4 h-4 text-indigo-600" /> New Chat
                      </button>
                      <button 
                        onClick={() => {
                          setIsAiMenuOpen(false);
                          setShowHistoryModal(true);
                        }}
                        className="w-full text-left px-4 py-2.5 hover:bg-indigo-50 hover:text-indigo-700 text-slate-700 font-medium flex items-center gap-2.5 transition"
                      >
                        <History className="w-4 h-4 text-indigo-600" /> Chat History
                      </button>
                      <div className="border-t border-slate-100 my-1.5"></div>
                      <div className="px-4 py-2 text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                        Active Model: Gemini 2.5 Flash
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Chat History Modal */}
              {showHistoryModal && (
                <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
                  <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-2xl max-w-md w-full space-y-4 animate-in fade-in zoom-in duration-200">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                      <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                        <History className="w-5 h-5 text-indigo-600" /> Chat & Prompt History
                      </h3>
                      <button 
                        onClick={() => setShowHistoryModal(false)}
                        className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition"
                      >
                        ✕
                      </button>
                    </div>
                    <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
                      {promptHistory.map((item) => (
                        <div key={item.id} className="p-3.5 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-between text-xs hover:bg-indigo-50/50 transition cursor-pointer" onClick={() => setShowHistoryModal(false)}>
                          <div>
                            <span className="font-bold text-indigo-600">{item.tool}</span>
                            <p className="text-slate-700 font-medium mt-0.5">{item.prompt}</p>
                          </div>
                          <span className="text-[10px] text-slate-400 font-medium whitespace-nowrap ml-2">{item.time}</span>
                        </div>
                      ))}
                    </div>
                    <div className="pt-2 flex justify-end">
                      <button 
                        onClick={() => setShowHistoryModal(false)}
                        className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-semibold hover:bg-indigo-700 transition shadow-sm"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto space-y-4 pr-2">
                {chatMessages.map(msg => (
                  <div key={msg.id} className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                    {msg.sender === 'ai' && (
                      <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center flex-shrink-0 font-bold text-xs">
                        AI
                      </div>
                    )}
                    <div className={`p-4 rounded-2xl text-xs leading-relaxed max-w-xl ${msg.sender === 'user' ? 'bg-indigo-600 text-white rounded-tr-none shadow-sm' : 'bg-slate-50 border border-slate-200 text-slate-800 rounded-tl-none'}`}>
                      {msg.text}
                    </div>
                  </div>
                ))}
                {isGenerating && (
                  <div className="flex gap-3 items-center text-slate-400 text-xs italic">
                    <Bot className="w-5 h-5 text-indigo-600 animate-spin" /> AI is generating response...
                  </div>
                )}
              </div>

              {/* Chat Input Bar */}
              <form onSubmit={handleSendMessage} className="mt-4 pt-4 border-t border-slate-100 flex items-center gap-2">
                <label className="p-2.5 text-slate-400 hover:text-indigo-600 transition cursor-pointer" title="Upload File">
                  <Upload className="w-5 h-5" />
                  <input type="file" className="hidden" onChange={() => alert('File uploaded for AI analysis!')} />
                </label>
                <button type="button" onClick={() => alert('Listening for voice input...')} className="p-2.5 text-slate-400 hover:text-indigo-600 transition" title="Voice Input">
                  <Mic className="w-5 h-5" />
                </button>
                <input 
                  type="text" 
                  placeholder="Ask anything or request AI generation..."
                  value={promptInput}
                  onChange={(e) => setPromptInput(e.target.value)}
                  className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button 
                  type="submit"
                  className="px-5 py-3 bg-indigo-600 text-white rounded-2xl text-xs font-semibold hover:bg-indigo-700 transition flex items-center gap-1.5 shadow-sm"
                >
                  <Send className="w-4 h-4" /> Send
                </button>
              </form>
            </div>
          ) : (
            /* Specific Tool Generator View */
            <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">{aiToolsList.find(t => t.id === activeTool)?.name}</h3>
                    <p className="text-xs text-slate-500">{aiToolsList.find(t => t.id === activeTool)?.desc}</p>
                  </div>
                </div>
                <span className="text-xs px-3 py-1 bg-emerald-50 text-emerald-700 font-semibold rounded-lg flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5" /> Ready
                </span>
              </div>

              {/* Generator Parameter Controls */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-5 rounded-2xl border border-slate-100">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Topic / Subject Matter</label>
                  <input 
                    type="text" 
                    value={formParams.topic}
                    onChange={(e) => setFormParams({...formParams, topic: e.target.value})}
                    className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Grade Level</label>
                  <input 
                    type="text" 
                    value={formParams.grade}
                    onChange={(e) => setFormParams({...formParams, grade: e.target.value})}
                    className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Subject</label>
                  <input 
                    type="text" 
                    value={formParams.subject}
                    onChange={(e) => setFormParams({...formParams, subject: e.target.value})}
                    className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Difficulty / Format</label>
                  <select 
                    value={formParams.difficulty}
                    onChange={(e) => setFormParams({...formParams, difficulty: e.target.value})}
                    className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="Advanced">Advanced (AP/IB)</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Beginner">Beginner / Foundational</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <button 
                  onClick={handleGenerateTool}
                  disabled={isGenerating}
                  className="px-6 py-3 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 transition shadow-sm flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4" /> {isGenerating ? 'Generating...' : 'Generate with AI'}
                </button>
              </div>

              {/* Output Result Box */}
              {outputResult && (
                <div className="space-y-3 pt-4 border-t border-slate-100 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Generated Result</h4>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => { navigator.clipboard.writeText(outputResult); alert('Copied to clipboard!'); }}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-slate-700 rounded-xl text-xs font-semibold transition flex items-center gap-1"
                      >
                        <Copy className="w-3.5 h-3.5" /> Copy
                      </button>
                      <button 
                        onClick={() => alert('Saved to teacher document repository!')}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-slate-700 rounded-xl text-xs font-semibold transition flex items-center gap-1"
                      >
                        <Save className="w-3.5 h-3.5" /> Save
                      </button>
                      <button 
                        onClick={() => {
                          const blob = new Blob([outputResult], { type: 'text/plain' });
                          const url = URL.createObjectURL(blob);
                          const a = document.createElement('a');
                          a.href = url;
                          a.download = `${activeTool}_output.txt`;
                          a.click();
                        }}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-slate-700 rounded-xl text-xs font-semibold transition flex items-center gap-1"
                      >
                        <Download className="w-3.5 h-3.5" /> Download
                      </button>
                      <button 
                        onClick={() => alert('Share link generated!')}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-slate-700 rounded-xl text-xs font-semibold transition flex items-center gap-1"
                      >
                        <Share2 className="w-3.5 h-3.5" /> Share
                      </button>
                    </div>
                  </div>
                  <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-800 font-mono whitespace-pre-wrap leading-relaxed">
                    {outputResult}
                  </div>
                </div>
              )}
            </div>
          )}


        </div>
      </div>
    </div>
  );
};
