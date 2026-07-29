import React, { useState } from 'react';
import { Monitor, X, Sparkles, Send, HelpCircle, Eye, CheckCircle2, Shield, ArrowLeft } from 'lucide-react';

interface ScreenExplainModalProps {
  isOpen: boolean;
  onClose: () => void;
  activePath: string;
}

export const ScreenExplainModal: React.FC<ScreenExplainModalProps> = ({
  isOpen,
  onClose,
  activePath
}) => {
  const [messages, setMessages] = useState<Array<{ sender: 'ai' | 'user'; text: string }>>([
    {
      sender: 'ai',
      text: `Screen Context Analyzed! Currently observing active route: "${activePath || 'Executive Overview'}". What would you like to understand about this page or its controls?`
    }
  ]);
  const [inputQuery, setInputQuery] = useState('');

  if (!isOpen) return null;

  const sampleQuestions = [
    'यह page क्या करता है?',
    'यह option किस काम का है?',
    'मुझे यहाँ क्या करना है?'
  ];

  const handleAsk = (q?: string) => {
    const question = q || inputQuery;
    if (!question.trim()) return;

    const newMsgs = [...messages, { sender: 'user' as const, text: question }];
    setMessages(newMsgs);
    if (!q) setInputQuery('');

    setTimeout(() => {
      let reply = "";
      if (question.includes('क्या करता है') || question.includes('what does')) {
        reply = `यह Page (${activePath || 'Executive Overview'}) आपके संस्थान का मुख्य Executive Command Center है। यहाँ से आप सभी कैम्पस के KPIs, Real-time Attendance, Fee Collections और Governance Status को एक साथ Monitor कर सकते हैं।`;
      } else if (question.includes('किस काम का') || question.includes('option')) {
        reply = `Header में दिए गए 'Workspace Launcher' बटन से आप संस्थान के सभी 8 कोर Workspaces (Academic, Finance, Student, Exam, Infrastructure आदि) में सीधे switch कर सकते हैं।`;
      } else if (question.includes('क्या करना है') || question.includes('what should I do')) {
        reply = `1. ऊपर से Campus Scope (e.g. All Campuses या Specific Branch) सेलेक्ट करें।\n2. Real-time KPI Card पर क्लिक करके संबंधित डिटेल रिपोर्ट देखें।\n3. Quick Action Bar से नए Staff, Student या Event का डाटा मैनेज करें।`;
      } else {
        reply = `आपके स्क्रीन Context के अनुसार, इस वर्कस्पेस में सभी आरबीएसी परमिशन एनफोर्स किए गए हैं। आपके रोल के अनुसार सभी कंट्रोल्स एक्टिव हैं।`;
      }

      setMessages([...newMsgs, { sender: 'ai', text: reply }]);
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-[10000] w-screen h-screen bg-slate-900/40 backdrop-blur-md flex flex-col overflow-hidden animate-fade-in text-slate-900">
      <div className="w-full h-full bg-slate-50 flex flex-col overflow-hidden">
        
        {/* Full Screen Top Navigation Bar (Apple Style) */}
        <header className="bg-slate-900/95 backdrop-blur-xl text-white px-4 sm:px-6 py-3 border-b border-slate-800/80 flex items-center justify-between shrink-0 shadow-sm z-20">
          <div className="flex items-center gap-3">
            {/* Small Compact Top-Left ⏮️ Back Button */}
            <button
              onClick={onClose}
              className="px-2.5 py-1.5 rounded-full bg-slate-800/90 hover:bg-slate-700/90 text-slate-200 hover:text-white transition-all cursor-pointer flex items-center gap-1.5 text-xs font-bold border border-slate-700/80 shadow-xs active:scale-95 shrink-0"
              title="Return to Command Center"
            >
              <span className="text-sm leading-none">⏮️</span>
              <span className="hidden xs:inline">Back</span>
            </button>

            <div className="h-5 w-px bg-slate-800 hidden sm:block"></div>

            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-violet-500 to-indigo-600 flex items-center justify-center text-white shadow-sm shadow-violet-500/20 shrink-0">
                <Monitor className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="font-bold text-sm sm:text-base text-white tracking-tight leading-tight">Screen Explain AI</h1>
                  <span className="px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-300 border border-violet-400/30 text-[9px] font-extrabold uppercase tracking-wider hidden sm:inline-block">
                    Interactive AI
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 hidden md:block leading-none mt-0.5">Contextual screen explanation in Hindi & English • Privacy Protected</p>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition flex items-center justify-center cursor-pointer border border-slate-700/80"
            title="Close Full Screen"
          >
            <X className="w-4 h-4" />
          </button>
        </header>

        {/* Screen Context Banner */}
        <div className="px-6 py-2.5 bg-violet-900 text-violet-100 border-b border-violet-800 flex items-center justify-between text-xs shrink-0">
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4 text-violet-300 shrink-0" />
            <span>Active View Analyzing: <strong>{activePath || 'Executive Overview'}</strong></span>
          </div>
          <span className="text-[11px] text-violet-300 font-semibold">Bilingual AI (Hindi & English)</span>
        </div>

        {/* Workspace Content */}
        <main className="flex-1 overflow-y-auto p-6 bg-slate-100/70 max-w-4xl mx-auto w-full flex flex-col justify-between space-y-4">
          
          {/* Chat Messages Container */}
          <div className="space-y-3 flex-1 overflow-y-auto custom-scrollbar p-4 bg-white border border-slate-200 rounded-2xl shadow-sm">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex items-start gap-3 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {m.sender === 'ai' && (
                  <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center text-xs shrink-0 shadow-sm mt-0.5">
                    <Sparkles className="w-4 h-4" />
                  </div>
                )}
                <div
                  className={`p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed max-w-xl whitespace-pre-line ${
                    m.sender === 'user'
                      ? 'bg-indigo-600 text-white rounded-tr-none shadow-sm font-medium'
                      : 'bg-slate-50 border border-slate-200 text-slate-900 rounded-tl-none font-normal'
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
          </div>

          {/* Quick Hindi/English Question Chips */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
            {sampleQuestions.map((q, i) => (
              <button
                key={i}
                onClick={() => handleAsk(q)}
                className="px-3 py-1.5 rounded-xl bg-white hover:bg-indigo-50 hover:text-indigo-700 text-slate-700 text-xs font-bold transition border border-slate-200 shrink-0 cursor-pointer shadow-2xs"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Input Box */}
          <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-2">
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAsk()}
              placeholder="Ask anything about this screen in Hindi or English..."
              className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white"
            />
            <button
              onClick={() => handleAsk()}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl transition cursor-pointer flex items-center gap-2 shadow-sm"
            >
              <span>Ask AI</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>

        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-slate-200 px-6 py-3.5 flex flex-col sm:flex-row items-center justify-between gap-2 shrink-0 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-emerald-600" />
            <span className="font-semibold text-slate-700">Privacy-Protected On-Screen Context Reader</span>
          </div>
          <span className="text-[11px] text-slate-400">Galaxy ERP AI Engine</span>
        </footer>

      </div>
    </div>
  );
};
