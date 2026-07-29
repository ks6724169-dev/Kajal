import React, { useState } from 'react';
import { Bot, Sparkles, X, Send, HelpCircle, Lightbulb, ChevronRight, MessageSquare } from 'lucide-react';

interface AIHelpModalProps {
  isOpen: boolean;
  onClose: () => void;
  activePath: string;
}

export const AIHelpModal: React.FC<AIHelpModalProps> = ({
  isOpen,
  onClose,
  activePath
}) => {
  const [messages, setMessages] = useState<Array<{ sender: 'ai' | 'user'; text: string }>>([
    {
      sender: 'ai',
      text: `Greetings! I am Galaxy ERP's AI Institution Assistant. I am tuned to your active workspace context (${activePath || 'Overview'}). How can I assist you with administrative workflows, reports, or campus governance today?`
    }
  ]);
  const [inputQuery, setInputQuery] = useState('');

  if (!isOpen) return null;

  const quickPrompts = [
    'How do I manage multi-campus permissions?',
    'Where can I view fee collection summaries?',
    'How to generate student report cards?',
    'Explain the 3-level navigation system'
  ];

  const handleSend = (queryText?: string) => {
    const textToSend = queryText || inputQuery;
    if (!textToSend.trim()) return;

    // Append user message
    const updated = [...messages, { sender: 'user' as const, text: textToSend }];
    setMessages(updated);
    if (!queryText) setInputQuery('');

    // Generate contextual response
    setTimeout(() => {
      let aiReply = "I am processing your query across Galaxy ERP's institution database. You can navigate through the 8 core Workspaces from the Workspace Launcher in the header.";
      const lower = textToSend.toLowerCase();

      if (lower.includes('fee') || lower.includes('payment')) {
        aiReply = "To manage fees: Open Workspace 5 (Finance, HR & Resource Management) -> Fee Structure & Billing. You can generate receipts, send automated fee reminders, and review pending balances.";
      } else if (lower.includes('campus') || lower.includes('permission')) {
        aiReply = "Multi-campus scope is controlled via the Header Campus Switcher. Institution Owners can switch across 'All Campuses', while Principals and Vice Principals are scoped to their assigned campus.";
      } else if (lower.includes('report') || lower.includes('student') || lower.includes('card')) {
        aiReply = "Student report cards can be generated under Workspace 4 (Assessment, Examination & Results) -> Report Cards & Transcripts, or printed directly via Records Exchange Hub in this Command Hub.";
      } else if (lower.includes('navigation') || lower.includes('3-level')) {
        aiReply = "Galaxy ERP uses a 3-Level Navigation Hierarchy: 1. Workspace (8 Core Operational Hubs) -> 2. Work Group -> 3. Work/Feature. Click the Workspace Launcher icon in the header to switch hubs instantly.";
      }

      setMessages([...updated, { sender: 'ai', text: aiReply }]);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md animate-fade-in">
      <div 
        className="bg-white border border-slate-200/80 rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col h-[520px] transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-600/30 border border-indigo-400/30 flex items-center justify-center text-indigo-300">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-sm sm:text-base leading-none">Galaxy AI Assistant</h3>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-extrabold">Online</span>
              </div>
              <p className="text-xs text-indigo-200/80 mt-0.5">Contextual Administrative Guidance</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Chat Body */}
        <div className="p-4 overflow-y-auto custom-scrollbar flex-1 space-y-3 bg-slate-50/50">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex items-start gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.sender === 'ai' && (
                <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center text-xs shrink-0 mt-1">
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
              )}
              <div
                className={`p-3 rounded-2xl text-xs sm:text-sm max-w-[85%] ${
                  msg.sender === 'user'
                    ? 'bg-indigo-600 text-white rounded-tr-none shadow-sm'
                    : 'bg-white border border-slate-200/80 text-slate-800 rounded-tl-none shadow-3xs'
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-4 py-2 bg-white border-t border-slate-100 flex items-center gap-2 overflow-x-auto no-scrollbar">
          <Lightbulb className="w-3.5 h-3.5 text-amber-500 shrink-0" />
          {quickPrompts.map((prompt, i) => (
            <button
              key={i}
              onClick={() => handleSend(prompt)}
              className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-slate-600 text-[11px] font-medium whitespace-nowrap transition border border-slate-200/60 shrink-0 cursor-pointer"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-white border-t border-slate-200/80 flex items-center gap-2">
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask AI about administrative tasks, modules, or features..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white transition"
          />
          <button
            onClick={() => handleSend()}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5 shrink-0 cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Send</span>
          </button>
        </div>
      </div>
    </div>
  );
};
