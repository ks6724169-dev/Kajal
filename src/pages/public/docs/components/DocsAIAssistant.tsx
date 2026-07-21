import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BrainCircuit, Send, X, Bot, Sparkles, MessageSquare } from 'lucide-react';

export const DocsAIAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState<{ role: 'user' | 'ai', content: string }[]>([
    { role: 'ai', content: 'Hi! I am Galaxy AI. How can I help you with documentation today?' }
  ]);

  const handleSend = () => {
    if (!message.trim()) return;
    
    const newChat = [...chat, { role: 'user', content: message } as const];
    setChat(newChat);
    setMessage('');

    // Mock AI Response
    setTimeout(() => {
      setChat([...newChat, { 
        role: 'ai', 
        content: `I found some articles related to "${message}". You might want to check the "Getting Started" section or the "Registration Guide". Would you like me to open one for you?` 
      }]);
    }, 1000);
  };

  return (
    <div className="fixed bottom-8 right-8 z-[100]">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="absolute bottom-20 right-0 w-[400px] max-w-[calc(100vw-2rem)] bg-white rounded-[2rem] shadow-2xl border border-slate-100 overflow-hidden flex flex-col h-[550px]"
          >
            {/* Header */}
            <div className="p-6 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center">
                  <BrainCircuit className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-sm tracking-tight">Galaxy AI Assistant</h3>
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Active Docs Mode</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {chat.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-4 rounded-2xl text-sm font-medium leading-relaxed ${
                    msg.role === 'user' 
                    ? 'bg-indigo-600 text-white rounded-br-none' 
                    : 'bg-slate-50 text-slate-700 rounded-bl-none border border-slate-100'
                  }`}>
                    {msg.content}
                  </div>
                </div>
              ))}
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-slate-100 bg-slate-50">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Ask anything about Galaxy..."
                  className="w-full pl-5 pr-14 py-4 bg-white border border-slate-200 rounded-2xl font-bold text-slate-900 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all shadow-sm"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                />
                <button 
                  onClick={handleSend}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center hover:bg-slate-800 transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
              <div className="mt-3 flex items-center gap-4 overflow-x-auto pb-1 no-scrollbar">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest shrink-0">Try:</span>
                {['Register School', 'Fees Guide', 'Galaxy AI'].map(tag => (
                  <button 
                    key={tag}
                    onClick={() => setMessage(`Tell me about ${tag}`)}
                    className="text-[10px] font-bold text-slate-500 hover:text-indigo-600 transition-colors whitespace-nowrap"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`w-16 h-16 rounded-full flex items-center justify-center text-white shadow-2xl transition-all duration-500 ${
          isOpen ? 'bg-slate-900' : 'bg-gradient-to-br from-indigo-600 to-purple-700'
        }`}
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
        {!isOpen && (
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-500 border-2 border-white rounded-full flex items-center justify-center">
            <Sparkles className="w-3 h-3 text-white" />
          </div>
        )}
      </motion.button>
    </div>
  );
};
