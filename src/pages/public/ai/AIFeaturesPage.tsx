import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BrainCircuit, Sparkles, ChevronLeft, Bot, X, Users, UserCircle, 
  Briefcase, GraduationCap, Banknote, Calendar, CheckSquare, 
  MessageSquare, BarChart, FileText, ArrowRight, ShieldCheck, 
  Lock, Key, Zap, CheckCircle2, Play, Paperclip, Mic, Send
} from 'lucide-react';

interface AIFeaturesPageProps {
  navigate: (path: string) => void;
}

export const AIFeaturesPage: React.FC<AIFeaturesPageProps> = ({ navigate }) => {
  const [activeTab, setActiveTab] = useState<'student' | 'teacher' | 'parent'>('student');
  const [chatMessage, setChatMessage] = useState('');
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const aiModules = [
    { icon: Bot, title: 'Galaxy AI Assistant', desc: 'Your 24/7 intelligent helper' },
    { icon: UserCircle, title: 'Galaxy AI Teacher', desc: 'Automated grading & lesson planning' },
    { icon: GraduationCap, title: 'Galaxy AI Student', desc: 'Personalized learning paths' },
    { icon: Users, title: 'Galaxy AI Parent', desc: 'Smart progress updates' },
    { icon: Briefcase, title: 'Galaxy AI Principal', desc: 'Institution-wide insights' },
    { icon: Sparkles, title: 'Galaxy AI Owner', desc: 'Financial & growth predictions' },
    { icon: Banknote, title: 'Galaxy AI Finance', desc: 'Automated fee collection & reminders' },
    { icon: Calendar, title: 'Galaxy AI Attendance', desc: 'Facial recognition & anomaly detection' },
    { icon: CheckSquare, title: 'Galaxy AI Examination', desc: 'Auto-generation of question papers' },
    { icon: MessageSquare, title: 'Galaxy AI Communication', desc: 'Smart auto-replies and translations' },
    { icon: BarChart, title: 'Galaxy AI Analytics', desc: 'Predictive performance modeling' },
    { icon: FileText, title: 'Galaxy AI Reports', desc: 'One-click comprehensive report cards' },
  ];

  const benefits = [
    'Save Time', 'Reduce Paperwork', 'Increase Productivity', 'Better Decision Making',
    'Automation', 'Accuracy', 'Personalization', 'Smart Insights'
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-indigo-500/30">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-100 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <button 
              onClick={() => navigate('/')}
              className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-600 hover:bg-slate-100 hover:text-indigo-600 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
                <BrainCircuit className="w-5 h-5" />
              </div>
              <div>
                <h1 className="font-black text-xl tracking-tight text-slate-900 leading-none mb-1">
                  Galaxy AI
                </h1>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest leading-none">
                  The Intelligence Engine
                </p>
              </div>
            </div>
          </div>
          <button 
            onClick={() => navigate('/')}
            className="hidden md:flex items-center gap-2 px-4 py-2 text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors"
          >
            Close
            <X className="w-4 h-4" />
          </button>
        </div>
      </header>

      <main className="pt-20">
        {/* HERO SECTION */}
        <section className="relative pt-24 pb-32 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[80%] rounded-full bg-gradient-to-br from-indigo-100/60 to-purple-50/60 blur-[120px]" />
            <div className="absolute top-[20%] right-[-20%] w-[50%] h-[70%] rounded-full bg-gradient-to-bl from-cyan-100/60 to-blue-50/60 blur-[120px]" />
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:3rem_3rem]" />
          </div>

          <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 border border-slate-200/60 backdrop-blur-md mb-8 shadow-sm"
            >
              <Sparkles className="w-4 h-4 text-indigo-500" />
              <span className="text-[11px] font-black text-slate-800 tracking-widest uppercase">
                Welcome to the Future of Education
              </span>
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl md:text-7xl font-black text-slate-900 tracking-tight leading-[1.1] mb-6 max-w-4xl mx-auto"
            >
              Meet <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-500">Galaxy AI</span>, Your<br/>Intelligent Copilot.
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-slate-600 font-medium leading-relaxed mb-12 max-w-2xl mx-auto"
            >
              Empowering students, teachers, parents, and administrators through seamless, native artificial intelligence and predictive automation.
            </motion.p>
          </div>
        </section>

        {/* SECTION 2: AI Modules */}
        <section className="py-24 bg-slate-50 border-y border-slate-100">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-4">Intelligent Modules</h2>
              <p className="text-lg text-slate-500 font-medium">Native AI integration across every aspect of your institution.</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {aiModules.map((module, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.05 }}
                  className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:border-indigo-100 transition-all group"
                >
                  <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 mb-6 group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                    <module.icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-slate-900 mb-2">{module.title}</h3>
                  <p className="text-sm font-medium text-slate-500 leading-relaxed">{module.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 3: AI in Action (Visual Mockup) */}
        <section className="py-24 bg-white overflow-hidden">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-4xl font-black text-slate-900 tracking-tight mb-6">
                  Intelligence in Action
                </h2>
                <p className="text-lg text-slate-500 font-medium leading-relaxed mb-8">
                  Watch as Galaxy AI transforms complex data into actionable insights, generates reports instantly, and predicts outcomes before they happen.
                </p>
                <div className="space-y-4">
                  {['Attendance Prediction Model', 'Fee Defaulter Forecasting', 'Weak Student Detection Algorithm', 'Automated Question Paper Generation'].map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      </div>
                      <span className="font-bold text-slate-700">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/10 to-purple-500/10 blur-3xl rounded-[3rem]" />
                <div className="relative bg-slate-900 rounded-[2rem] p-4 shadow-2xl border border-slate-800">
                  <div className="h-6 flex items-center gap-2 px-2 mb-4">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                  <div className="bg-slate-950 rounded-xl overflow-hidden border border-slate-800">
                    <div className="p-4 border-b border-slate-800 flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <BrainCircuit className="w-5 h-5 text-indigo-400" />
                        <span className="font-bold text-white text-sm">Predictive Analytics Engine</span>
                      </div>
                      <div className="text-xs text-emerald-400 font-mono">Model Active</div>
                    </div>
                    <div className="p-6 space-y-6">
                      <div className="flex gap-4">
                        <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center shrink-0">
                          <UserCircle className="w-5 h-5 text-indigo-400" />
                        </div>
                        <div className="bg-slate-800 rounded-2xl rounded-tl-none p-4 text-sm text-slate-300">
                          Analyze Grade 10 Science performance for the last 3 months and identify students needing intervention.
                        </div>
                      </div>
                      <div className="flex gap-4 flex-row-reverse">
                        <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center shrink-0">
                          <Sparkles className="w-5 h-5 text-purple-400" />
                        </div>
                        <div className="bg-indigo-600 rounded-2xl rounded-tr-none p-4 text-sm text-white space-y-3">
                          <p>Analysis complete. I've identified 4 students trending downwards in Physics.</p>
                          <div className="bg-black/20 p-3 rounded-lg border border-white/10">
                            <div className="flex justify-between items-center mb-2">
                              <span className="font-medium">Risk Assessment</span>
                              <span className="text-xs bg-red-500/20 text-red-300 px-2 py-0.5 rounded-full">High</span>
                            </div>
                            <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                              <div className="w-[75%] h-full bg-red-400"></div>
                            </div>
                          </div>
                          <button className="flex items-center gap-2 text-xs font-bold bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg transition-colors">
                            <CheckSquare className="w-3 h-3" />
                            Generate Remedial Plan
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 4: Workflow */}
        <section className="py-24 bg-slate-900 text-white overflow-hidden relative">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem]" />
          
          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-black tracking-tight mb-4">The AI Workflow</h2>
              <p className="text-slate-400 font-medium">Seamless decision making from input to automated action.</p>
            </div>

            <div className="flex flex-col md:flex-row items-center justify-between max-w-4xl mx-auto gap-8 relative">
              <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-slate-800 -translate-y-1/2 -z-10" />
              
              {[
                { icon: UserCircle, label: 'User Request', color: 'from-blue-500 to-cyan-500' },
                { icon: BrainCircuit, label: 'Decision Engine', color: 'from-indigo-500 to-purple-500' },
                { icon: Zap, label: 'Automation', color: 'from-purple-500 to-pink-500' },
                { icon: CheckCircle2, label: 'Result Delivery', color: 'from-emerald-400 to-emerald-600' }
              ].map((step, i) => (
                <div key={i} className="flex flex-col items-center gap-4">
                  <div className={`w-20 h-20 rounded-2xl bg-gradient-to-tr ${step.color} p-0.5 shadow-2xl`}>
                    <div className="w-full h-full bg-slate-900 rounded-[15px] flex items-center justify-center">
                      <step.icon className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  <span className="font-bold text-sm text-slate-300">{step.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 6: Security */}
        <section className="py-24 bg-white border-b border-slate-100">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div className="order-2 lg:order-1 grid grid-cols-2 gap-4">
                {[
                  { icon: Lock, title: 'Private AI', desc: 'Models tuned on your private data only.' },
                  { icon: ShieldCheck, title: 'Secure Gateway', desc: 'Enterprise-grade API filtering.' },
                  { icon: Key, title: 'Tenant Isolation', desc: 'No cross-school data sharing.' },
                  { icon: FileText, title: 'Encrypted', desc: 'End-to-end communication security.' }
                ].map((item, i) => (
                  <div key={i} className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                    <item.icon className="w-8 h-8 text-indigo-600 mb-4" />
                    <h4 className="font-bold text-slate-900 mb-2">{item.title}</h4>
                    <p className="text-sm text-slate-500 font-medium">{item.desc}</p>
                  </div>
                ))}
              </div>
              <div className="order-1 lg:order-2">
                <h2 className="text-4xl font-black text-slate-900 tracking-tight mb-6">
                  Enterprise Grade AI Security
                </h2>
                <p className="text-lg text-slate-500 font-medium leading-relaxed mb-8">
                  We believe that artificial intelligence should be powerful, but never at the cost of your institution's privacy and data security.
                </p>
                <button className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-slate-800 transition-colors">
                  View Security Whitepaper
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 7: AI Demo (Interactive) */}
        <section className="py-24 bg-slate-50">
          <div className="max-w-5xl mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-4">Try Galaxy AI</h2>
              <p className="text-slate-500 font-medium">Select a role to see how AI assists in daily tasks.</p>
            </div>

            <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden flex flex-col md:flex-row h-[600px]">
              {/* Sidebar */}
              <div className="w-full md:w-64 bg-slate-50 border-r border-slate-200 p-4 space-y-2">
                {[
                  { id: 'student', icon: GraduationCap, label: 'Student Persona' },
                  { id: 'teacher', icon: UserCircle, label: 'Teacher Persona' },
                  { id: 'parent', icon: Users, label: 'Parent Persona' },
                ].map(role => (
                  <button
                    key={role.id}
                    onClick={() => setActiveTab(role.id as any)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-colors ${
                      activeTab === role.id 
                        ? 'bg-indigo-600 text-white shadow-md' 
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <role.icon className="w-5 h-5" />
                    {role.label}
                  </button>
                ))}
              </div>

              {/* Chat Area */}
              <div className="flex-1 flex flex-col bg-white">
                <div className="p-4 border-b border-slate-100 flex items-center gap-3 bg-white/80 backdrop-blur-md">
                  <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">Galaxy AI Copilot</h3>
                    <p className="text-xs font-medium text-emerald-600">Online & Ready</p>
                  </div>
                </div>

                <div className="flex-1 p-6 overflow-y-auto space-y-6 bg-slate-50/50">
                  {/* Dynamic Mock Chat based on active tab */}
                  {activeTab === 'student' && (
                    <>
                      <div className="flex gap-4 flex-row-reverse">
                        <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center shrink-0">
                          <UserCircle className="w-4 h-4 text-slate-500" />
                        </div>
                        <div className="bg-slate-900 rounded-2xl rounded-tr-none p-4 text-sm text-white">
                          Can you explain quadratic equations? I'm stuck on my homework.
                        </div>
                      </div>
                      <div className="flex gap-4">
                        <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center shrink-0">
                          <Bot className="w-4 h-4 text-indigo-600" />
                        </div>
                        <div className="bg-white border border-slate-200 shadow-sm rounded-2xl rounded-tl-none p-4 text-sm text-slate-700 space-y-3">
                          <p>Of course! A quadratic equation is basically any equation that can be rearranged in standard form as <b>ax² + bx + c = 0</b>.</p>
                          <p>Let's break it down step-by-step. What specific part is confusing you?</p>
                        </div>
                      </div>
                    </>
                  )}

                  {activeTab === 'teacher' && (
                    <>
                      <div className="flex gap-4 flex-row-reverse">
                        <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center shrink-0">
                          <UserCircle className="w-4 h-4 text-slate-500" />
                        </div>
                        <div className="bg-slate-900 rounded-2xl rounded-tr-none p-4 text-sm text-white">
                          Generate a lesson plan for 8th Grade History covering the Industrial Revolution.
                        </div>
                      </div>
                      <div className="flex gap-4">
                        <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center shrink-0">
                          <Bot className="w-4 h-4 text-indigo-600" />
                        </div>
                        <div className="bg-white border border-slate-200 shadow-sm rounded-2xl rounded-tl-none p-4 text-sm text-slate-700 space-y-3">
                          <p>I've created a comprehensive 45-minute lesson plan for you.</p>
                          <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 flex items-center gap-3">
                            <FileText className="w-6 h-6 text-indigo-500" />
                            <div>
                              <div className="font-bold text-slate-900 text-sm">Industrial_Revolution_Plan.pdf</div>
                              <div className="text-xs text-slate-500">Generated just now • Includes quiz</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  {activeTab === 'parent' && (
                    <>
                      <div className="flex gap-4 flex-row-reverse">
                        <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center shrink-0">
                          <UserCircle className="w-4 h-4 text-slate-500" />
                        </div>
                        <div className="bg-slate-900 rounded-2xl rounded-tr-none p-4 text-sm text-white">
                          How is Sarah doing in Mathematics this term?
                        </div>
                      </div>
                      <div className="flex gap-4">
                        <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center shrink-0">
                          <Bot className="w-4 h-4 text-indigo-600" />
                        </div>
                        <div className="bg-white border border-slate-200 shadow-sm rounded-2xl rounded-tl-none p-4 text-sm text-slate-700 space-y-3">
                          <p>Sarah is performing exceptionally well in Mathematics. Her current average is 92% (A), which is a 5% improvement from last term.</p>
                          <p>She recently scored 95/100 on her Algebra mid-term. The teacher noted she is very participative in class.</p>
                        </div>
                      </div>
                    </>
                  )}
                </div>

                <div className="p-4 bg-white border-t border-slate-100">
                  <div className="flex items-center gap-2">
                    <button className="p-2 text-slate-400 hover:text-indigo-600 transition-colors">
                      <Paperclip className="w-5 h-5" />
                    </button>
                    <div className="flex-1 bg-slate-50 border border-slate-200 rounded-xl flex items-center px-4 py-2 focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:border-indigo-500 transition-all">
                      <input 
                        type="text" 
                        value={chatMessage}
                        onChange={(e) => setChatMessage(e.target.value)}
                        placeholder="Ask Galaxy AI..."
                        className="bg-transparent border-none outline-none w-full text-sm text-slate-900 placeholder:text-slate-400"
                      />
                    </div>
                    <button className="p-2 text-slate-400 hover:text-indigo-600 transition-colors">
                      <Mic className="w-5 h-5" />
                    </button>
                    <button className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-md hover:bg-indigo-700 transition-colors">
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 9: Final CTA */}
        <section className="py-24 bg-slate-900 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/50 via-slate-900 to-purple-900/50" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-500/20 rounded-full blur-[120px] pointer-events-none" />
          
          <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
            <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-6">
              Experience the Future of Education with Galaxy AI
            </h2>
            <p className="text-xl text-indigo-200 font-medium mb-10 max-w-2xl mx-auto">
              Join hundreds of forward-thinking institutions already utilizing artificial intelligence to streamline their operations.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <button 
                onClick={() => navigate('/register')}
                className="px-8 py-4 bg-white text-slate-900 rounded-2xl font-bold text-sm hover:scale-105 transition-all shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)]"
              >
                Register School
              </button>
              <button 
                onClick={() => navigate('/demo')}
                className="px-8 py-4 bg-slate-800 text-white border border-slate-700 rounded-2xl font-bold text-sm hover:bg-slate-700 transition-all flex items-center gap-2"
              >
                <Play className="w-4 h-4" />
                Book Live Demo
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};
