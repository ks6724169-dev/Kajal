import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Send, Trash2, BookOpen, Clock, Bot, User, Check, Zap, X } from 'lucide-react';
import { useStore } from '../stores/StoreContext';
import { Button } from '../design-system/CoreComponents';

// Prompt Templates
export const PROMPT_LIBRARY = [
  { id: '1', title: 'Autoscale Analytics', category: 'Scaling', text: 'Analyze regional node metrics for cluster us-east-1 and suggest horizontal scaling policies.' },
  { id: '2', title: 'SaaS Cost Leak Audit', category: 'Billing', text: 'Audit multi-region hosting billing footprints to target $500+ monthly budget savings.' },
  { id: '3', title: 'GDPR Compliance Check', category: 'Security', text: 'Audit deployment strategies and container database schemas against SOC2 and GDPR standards.' },
  { id: '4', title: 'Failover Risk Assessment', category: 'Disaster', text: 'Evaluate recent microservice telemetry to predict node crash risk index.' }
];

export const AIWorkspaceFoundation: React.FC = () => {
  const { language } = useStore();
  const [messages, setMessages] = useState<any[]>([
    { id: '1', sender: 'assistant', text: 'Welcome to Galaxy AI Assistant. I can optimize cluster nodes, audit regional latency, trigger horizontal scaling policies, or generate SOC2 readiness reports. Select a recipe from the Prompt Library below or ask any operations question.' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'chat' | 'library' | 'history'>('chat');
  const [history, setHistory] = useState<string[]>([
    'Analyze cluster AP-South nodes',
    'Audit GDPR compliance',
    'Calculate failover risk scoring'
  ]);

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || input;
    if (!text.trim()) return;

    const userMsg = { id: String(Date.now()), sender: 'user', text };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    // Call simulated delay
    setTimeout(() => {
      let reply = `Based on current multi-region telemetry:
- AP-SOUTH-1 nodes latency is optimal (12ms).
- US-EAST-1 has redundant worker nodes active (node-04 and node-05).
- Recommendation: Merge us-east-1 workloads into node-01 and node-02 to save approx $450/month.
- Autoscale policy is safe (RPO and RTO within threshold).`;

      if (text.toLowerCase().includes('gdpr') || text.toLowerCase().includes('soc2')) {
        reply = `GDPR & SOC2 Audit Summary:
1. Row Level Security is ACTIVE on tenant mapped tables.
2. Cross-border geo-failovers are currently mapped within EU boundaries for European clients (compliant).
3. Action Required: Rotate secrets in vault-02 immediately. ISO27001 readiness score: 94%.`;
      } else if (text.toLowerCase().includes('scale') || text.toLowerCase().includes('autoscale')) {
        reply = `Horizontal Auto-scaling Audit:
- Suggested min: 3 nodes, max: 15 nodes.
- CPU threshold trigger: 75% utilization sustained for 180s.
- This will optimize response latency during peak hours (13:00 - 15:00 UTC).`;
      }

      setMessages((prev) => [...prev, { id: String(Date.now() + 1), sender: 'assistant', text: reply }]);
      setHistory((prev) => [text, ...prev.filter(h => h !== text)].slice(0, 10));
      setLoading(false);
    }, 1200);
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 text-slate-100 rounded-2xl overflow-hidden border border-slate-800">
      {/* Header */}
      <div className="px-5 py-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Bot className="h-5 w-5 text-indigo-400" />
          <span className="text-xs font-bold tracking-wider uppercase font-mono">GALAXY OPERATIONS AI</span>
        </div>
        <div className="flex space-x-1 bg-slate-900 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab('chat')}
            className={`px-2 py-1 text-[10px] font-bold rounded ${activeTab === 'chat' ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}
          >
            Chat
          </button>
          <button
            onClick={() => setActiveTab('library')}
            className={`px-2 py-1 text-[10px] font-bold rounded ${activeTab === 'library' ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}
          >
            Library
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-2 py-1 text-[10px] font-bold rounded ${activeTab === 'history' ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}
          >
            History
          </button>
        </div>
      </div>

      {/* Main Panel Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {activeTab === 'chat' && (
          <div className="space-y-4">
            {messages.map((m) => (
              <div key={m.id} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-xl p-3 text-xs leading-relaxed ${
                  m.sender === 'user'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-800 text-slate-100 border border-slate-700'
                }`}>
                  <div className="flex items-center space-x-1.5 mb-1 opacity-80 text-[10px] font-mono font-bold">
                    {m.sender === 'user' ? <User className="h-3 w-3" /> : <Bot className="h-3 w-3 text-indigo-400" />}
                    <span>{m.sender === 'user' ? 'OPERATOR' : 'GALAXY_AI'}</span>
                  </div>
                  <div className="whitespace-pre-wrap">{m.text}</div>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-slate-800 text-slate-100 border border-slate-700 rounded-xl p-3 text-xs flex items-center space-x-2">
                  <div className="flex space-x-1">
                    <div className="h-1.5 w-1.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="h-1.5 w-1.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="h-1.5 w-1.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">OPTIMIZING CLUSTER MODEL...</span>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'library' && (
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center space-x-2">
              <BookOpen className="h-4 w-4 text-indigo-400" />
              <span>Click to Load Recipe</span>
            </h4>
            {PROMPT_LIBRARY.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  setInput(item.text);
                  setActiveTab('chat');
                }}
                className="p-3 bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 rounded-xl cursor-pointer transition-colors"
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-bold text-slate-200">{item.title}</span>
                  <span className="text-[9px] font-mono bg-indigo-950 text-indigo-300 px-1 rounded">{item.category}</span>
                </div>
                <p className="text-[11px] text-slate-400 line-clamp-2">{item.text}</p>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'history' && (
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center space-x-2">
              <Clock className="h-4 w-4 text-indigo-400" />
              <span>Recent Inquiries</span>
            </h4>
            {history.map((text, idx) => (
              <div
                key={idx}
                onClick={() => {
                  handleSend(text);
                  setActiveTab('chat');
                }}
                className="p-2.5 bg-slate-800/40 hover:bg-slate-800/80 border border-slate-800 rounded-lg cursor-pointer text-xs text-slate-300 font-medium truncate flex items-center justify-between"
              >
                <span>{text}</span>
                <Sparkles className="h-3.5 w-3.5 text-indigo-400 opacity-60" />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Input Box */}
      {activeTab === 'chat' && (
        <div className="p-3 bg-slate-950 border-t border-slate-800 flex items-center space-x-2">
          <input
            type="text"
            placeholder="Ask Galaxy AI (e.g. Audit GDPR compliance)..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 outline-none focus:border-indigo-500"
          />
          <button
            onClick={() => handleSend()}
            className="p-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white transition-colors"
          >
            <Send className="h-3.5 w-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};

// Expandable Assistant Widget
export const AssistantWidget: React.FC = () => {
  const [open, setOpen] = useState(false);
  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            className="mb-3 w-80 h-96 shadow-2xl rounded-2xl overflow-hidden"
          >
            <AIWorkspaceFoundation />
          </motion.div>
        )}
      </AnimatePresence>
      <button
        onClick={() => setOpen(!open)}
        className="h-12 w-12 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full flex items-center justify-center shadow-2xl cursor-pointer hover:scale-105 active:scale-95 transition-all"
      >
        {open ? <X className="h-5 w-5" /> : <Sparkles className="h-5 w-5 animate-pulse" />}
      </button>
    </div>
  );
};
