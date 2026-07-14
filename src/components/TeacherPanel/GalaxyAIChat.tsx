import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, ArrowLeft, Send, Mic, User, Plus, Image as ImageIcon, Camera, Smile, FileText, HardDrive, BookOpen, Film, Music, Layout, Search, Book, Menu, MessageSquare, Settings, X, Edit3, ChevronDown, Check, MoreVertical, Share2, Download, Clock, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface GalaxyAIChatProps {
  onBack: () => void;
  onOpenProfile?: () => void;
}

export const GalaxyAIChat: React.FC<GalaxyAIChatProps> = ({ onBack, onOpenProfile }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'ai',
      text: 'Hello, Sarah! I am Galaxy AI. I can help you with lesson planning, grading insights, student performance analysis, or administrative tasks. How can I assist you today?'
    }
  ]);
  const [input, setInput] = useState('');
  const [isAttachmentMenuOpen, setIsAttachmentMenuOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isHeaderMenuOpen, setIsHeaderMenuOpen] = useState(false);
  const [isChatHistoryModalOpen, setIsChatHistoryModalOpen] = useState(false);
  const [personalIntelligence, setPersonalIntelligence] = useState(true);
  const [isThinking, setIsThinking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleNewChat = () => {
    setMessages([
      {
        id: Date.now(),
        sender: 'ai',
        text: 'New chat started. How can I assist you with your teacher workspace today?'
      }
    ]);
    setIsSidebarOpen(false);
  };

  const handleSidebarOption = (label: string) => {
    setIsSidebarOpen(false);
    if (label === 'Search chats') {
      setMessages(prev => [
        ...prev,
        { id: Date.now(), sender: 'ai', text: 'Search chats mode activated. Type keywords in the chat box to search through lesson plans, assignments, and historical prompts.' }
      ]);
    } else if (label === 'New notebook') {
      setMessages(prev => [
        ...prev,
        { id: Date.now(), sender: 'ai', text: 'New notebook created. You can now save generated lesson plans and reference documents here.' }
      ]);
    } else {
      setMessages(prev => [
        ...prev,
        { id: Date.now(), sender: 'user', text: `[Selected: ${label}]` },
        { id: Date.now() + 1, sender: 'ai', text: `Activated ${label} mode. How would you like to proceed in your teacher workspace?` }
      ]);
    }
  };

  const handleSelectRecent = (title: string) => {
    setIsSidebarOpen(false);
    setMessages(prev => [
      ...prev,
      { id: Date.now(), sender: 'user', text: title },
      { id: Date.now() + 1, sender: 'ai', text: `Loaded previous conversation: "${title}". You can continue or ask follow-up questions.` }
    ]);
  };

  const handleProfileClick = () => {
    setIsSidebarOpen(false);
    if (onOpenProfile) {
      onOpenProfile();
    } else {
      onBack();
    }
  };

  const handleFileSelected = (e: React.ChangeEvent<HTMLInputElement>, type: string) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const fileName = files[0].name;
      setIsAttachmentMenuOpen(false);
      setMessages(prev => [
        ...prev,
        { id: Date.now(), sender: 'user', text: `[Uploaded ${type}: ${fileName}]` },
        { id: Date.now() + 1, sender: 'ai', text: `Successfully received ${type} (${fileName}). Analyzing file with Gemini 2.5 Flash for your teacher workspace...` }
      ]);
    }
  };

  const handleShareChat = () => {
    setIsHeaderMenuOpen(false);
    const chatText = messages.map(m => `${m.sender.toUpperCase()}: ${m.text}`).join('\n\n');
    navigator.clipboard.writeText(chatText).then(() => {
      setMessages(prev => [
        ...prev,
        { id: Date.now(), sender: 'ai', text: 'Chat conversation copied to clipboard successfully! You can now paste and share it.' }
      ]);
    }).catch(() => {
      setMessages(prev => [
        ...prev,
        { id: Date.now(), sender: 'ai', text: 'Failed to copy chat to clipboard.' }
      ]);
    });
  };

  const handleDownloadChat = () => {
    setIsHeaderMenuOpen(false);
    const chatText = messages.map(m => `${m.sender.toUpperCase()}: ${m.text}`).join('\n\n');
    const blob = new Blob([chatText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `GalaxyAI-Chat-${new Date().toISOString().slice(0, 10)}.txt`;
    link.click();
    URL.revokeObjectURL(url);
    setMessages(prev => [
      ...prev,
      { id: Date.now(), sender: 'ai', text: 'Chat downloaded as text file successfully.' }
    ]);
  };
  const handleMenuOptionClick = (label: string) => {
    if (label === 'Photos') {
      photoInputRef.current?.click();
      return;
    }
    if (label === 'Camera') {
      cameraInputRef.current?.click();
      return;
    }
    if (label === 'Files') {
      fileInputRef.current?.click();
      return;
    }

    setIsAttachmentMenuOpen(false);
    setMessages(prev => [
      ...prev,
      { id: Date.now(), sender: 'user', text: `[Action: Selected ${label}]` },
      { id: Date.now() + 1, sender: 'ai', text: `Activated ${label} tool. How can I assist you with this in your teacher workspace today?` }
    ]);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isThinking) return;
    
    const userPrompt = input;
    setMessages(prev => [...prev, { id: Date.now(), sender: 'user', text: userPrompt }]);
    setInput('');
    setIsThinking(true);
    
    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: userPrompt, persona: 'teacher' })
      });
      const data = await res.json();
      if (data.reply) {
        setMessages(prev => [...prev, { id: Date.now() + 1, sender: 'ai', text: data.reply }]);
      } else {
        setMessages(prev => [...prev, { id: Date.now() + 1, sender: 'ai', text: data.error || 'Sorry, I encountered an error generating the AI response.' }]);
      }
    } catch (err) {
      setMessages(prev => [...prev, { id: Date.now() + 1, sender: 'ai', text: 'Server connection error. Please try again.' }]);
    } finally {
      setIsThinking(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex flex-col h-full bg-white relative z-10 w-full"
    >
      {/* Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="fixed inset-0 bg-black/40 z-[60]"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-80 bg-white z-[70] shadow-2xl flex flex-col"
            >
              <div className="p-4 pt-6 pb-2">
                <button 
                  onClick={() => setIsSidebarOpen(false)}
                  className="p-2 -ml-2 text-slate-700 hover:bg-slate-100 rounded-full transition-colors flex items-center gap-2 mb-4"
                >
                  <Menu className="w-6 h-6" />
                </button>
                
                <button 
                  onClick={handleNewChat}
                  className="w-full flex items-center justify-between p-4 bg-[#f0f4f9] rounded-2xl hover:bg-[#e9eef6] transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <Edit3 className="w-5 h-5 text-slate-700" />
                    <span className="font-medium text-slate-800">New chat</span>
                  </div>
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-2">
                <div className="space-y-1 mb-6">
                  {[
                    { icon: <Search className="w-5 h-5" />, label: 'Search chats' },
                    { icon: <ImageIcon className="w-5 h-5" />, label: 'Images' },
                    { icon: <Film className="w-5 h-5" />, label: 'Videos' },
                    { icon: <Layout className="w-5 h-5" />, label: 'Library' },
                  ].map((item, idx) => (
                    <button 
                      key={idx} 
                      onClick={() => handleSidebarOption(item.label)}
                      className="w-full flex items-center gap-4 p-3 hover:bg-slate-100 rounded-xl transition-colors text-left"
                    >
                      <div className="text-slate-700 ml-1">{item.icon}</div>
                      <span className="font-medium text-slate-800">{item.label}</span>
                    </button>
                  ))}
                </div>

                <div className="px-4 mb-2">
                  <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Notebooks</h3>
                </div>
                <button 
                  onClick={() => handleSidebarOption('New notebook')}
                  className="w-full flex items-center gap-4 p-3 hover:bg-slate-100 rounded-xl transition-colors mb-6 text-left"
                >
                  <div className="text-slate-700 ml-1"><Plus className="w-5 h-5" /></div>
                  <span className="font-medium text-slate-800">New notebook</span>
                </button>

                <div className="px-4 mb-2">
                  <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Recents</h3>
                </div>
                <div className="space-y-1">
                  {[
                    'GitHub Copilot Student Setup Guide',
                    'School Software Yearly Cost Discussion',
                    'SaaS Business Account Aur Cards SBI',
                    'editor help karne ke sujhao',
                    'Lovable project helper'
                  ].map((title, idx) => (
                    <button 
                      key={idx} 
                      onClick={() => handleSelectRecent(title)}
                      className="w-full flex items-center gap-3 p-3 hover:bg-slate-100 rounded-xl transition-colors group text-left"
                    >
                      <MessageSquare className="w-4 h-4 text-slate-400 shrink-0 ml-2 group-hover:text-slate-600" />
                      <span className="text-sm font-medium text-slate-700 truncate">{title}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-4 border-t border-slate-100 mt-auto">
                <button 
                  onClick={handleProfileClick}
                  className="w-full flex items-center justify-between p-3 hover:bg-slate-100 rounded-xl transition-colors text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center border border-indigo-200">
                      <User className="w-4 h-4 text-indigo-700" />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-medium text-slate-800 leading-tight">Sarah Johnson</p>
                      <p className="text-xs text-slate-500">PRO</p>
                    </div>
                  </div>
                  <Settings className="w-5 h-5 text-slate-400" />
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Header */}
      <header className="sticky top-0 z-50 bg-white px-4 h-16 flex items-center justify-between flex-shrink-0 relative">
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-1.5 text-slate-800 font-medium hover:bg-slate-100 px-3 py-1.5 rounded-lg transition-colors -ml-1">
            Galaxy AI <ChevronDown className="w-4 h-4 text-slate-500" />
          </button>
        </div>

        <div className="relative">
          <button
            onClick={() => setIsHeaderMenuOpen(!isHeaderMenuOpen)}
            className="p-2 text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-colors flex items-center justify-center"
            title="Options"
          >
            <MoreVertical className="w-5 h-5" />
          </button>

          {isHeaderMenuOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50">
              <button
                onClick={() => {
                  setIsHeaderMenuOpen(false);
                  setIsChatHistoryModalOpen(true);
                }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors text-left"
              >
                <Clock className="w-4 h-4 text-slate-500" />
                <span>Chat History</span>
              </button>

              <button
                onClick={() => {
                  setIsHeaderMenuOpen(false);
                  handleNewChat();
                }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors text-left"
              >
                <Edit3 className="w-4 h-4 text-slate-500" />
                <span>New Chat</span>
              </button>

              <button
                onClick={handleShareChat}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors text-left"
              >
                <Share2 className="w-4 h-4 text-slate-500" />
                <span>Share Chat</span>
              </button>

              <button
                onClick={handleDownloadChat}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors text-left"
              >
                <Download className="w-4 h-4 text-slate-500" />
                <span>Download Chat</span>
              </button>

              <div className="border-t border-slate-100 my-1"></div>

              <button
                onClick={() => {
                  setIsHeaderMenuOpen(false);
                  onBack();
                }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-rose-600 hover:bg-rose-50 transition-colors text-left"
              >
                <LogOut className="w-4 h-4 text-rose-500" />
                <span>Exit</span>
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Chat History Modal */}
      {isChatHistoryModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <Clock className="w-5 h-5 text-indigo-600" /> Chat History
              </h3>
              <button 
                onClick={() => setIsChatHistoryModalOpen(false)}
                className="p-1.5 hover:bg-slate-100 rounded-full transition-colors text-slate-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
              {[
                { title: 'GitHub Copilot Student Setup Guide', date: 'Yesterday' },
                { title: 'School Software Yearly Cost Discussion', date: '3 days ago' },
                { title: 'SaaS Business Account Aur Cards SBI', date: '5 days ago' },
                { title: 'editor help karne ke sujhao', date: 'Last week' },
                { title: 'Lovable project helper', date: '2 weeks ago' }
              ].map((item, idx) => (
                <div 
                  key={idx}
                  onClick={() => {
                    setIsChatHistoryModalOpen(false);
                    handleSelectRecent(item.title);
                  }}
                  className="p-3.5 bg-slate-50 hover:bg-indigo-50/50 rounded-2xl border border-slate-100 cursor-pointer transition-all flex items-center justify-between group"
                >
                  <div>
                    <p className="text-sm font-medium text-slate-800 group-hover:text-indigo-600 transition-colors">{item.title}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{item.date}</p>
                  </div>
                  <MessageSquare className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 transition-colors" />
                </div>
              ))}
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setIsChatHistoryModalOpen(false)}
                className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-xl transition-colors text-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-slate-50">
        <div className="max-w-4xl mx-auto space-y-6">
          {messages.map((msg) => (
            <div 
              key={msg.id} 
              className={`flex gap-4 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm ${
                msg.sender === 'user' ? 'bg-indigo-100 text-indigo-700' : 'bg-gradient-to-tr from-indigo-500 to-purple-500 text-white'
              }`}>
                {msg.sender === 'user' ? <User className="w-5 h-5" /> : <Sparkles className="w-5 h-5" />}
              </div>
              <div className={`max-w-[85%] rounded-3xl p-5 shadow-sm ${
                msg.sender === 'user' 
                  ? 'bg-indigo-600 text-white rounded-tr-none' 
                  : 'bg-white border border-slate-100 text-blue-900 rounded-tl-none'
              }`}>
                {msg.sender === 'ai' ? (
                  <div className="space-y-2">
                    {msg.text.split('\n').filter(l => l.trim().length > 0).map((line, idx) => {
                      const cleanLine = line.replace(/###+/g, '').replace(/##+/g, '').replace(/#+/g, '').replace(/\*\*/g, '').replace(/\*/g, '').trim();
                      const isHeading = idx === 0 || cleanLine.endsWith(':') || (cleanLine.length < 50 && !cleanLine.includes('.'));
                      if (isHeading && idx === 0) {
                        return <h4 key={idx} className="font-extrabold text-red-700 text-lg tracking-tight mb-2">{cleanLine}</h4>;
                      } else if (isHeading) {
                        return <h5 key={idx} className="font-bold text-red-600 text-base mt-3 mb-1">{cleanLine}</h5>;
                      }
                      return <p key={idx} className="text-blue-900 text-base leading-relaxed font-normal">{cleanLine}</p>;
                    })}
                  </div>
                ) : (
                  <p className="text-base leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                )}
              </div>
            </div>
          ))}
          {isThinking && (
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm bg-gradient-to-tr from-indigo-500 to-purple-500 text-white animate-pulse">
                <Sparkles className="w-5 h-5" />
              </div>
              <div className="max-w-[85%] rounded-3xl p-4 shadow-sm bg-white border border-slate-100 text-slate-700 rounded-tl-none flex items-center gap-3">
                <span className="text-sm font-medium text-slate-600">Galaxy AI is thinking</span>
                <div className="flex gap-1.5 items-center">
                  <div className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="p-4 md:p-6 bg-white flex-shrink-0 relative">
        <div className="max-w-4xl mx-auto relative">
          <AnimatePresence>
            {isAttachmentMenuOpen && (
              <motion.div 
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute bottom-full left-0 right-0 mb-4 bg-white rounded-3xl shadow-lg border border-slate-100 overflow-hidden"
              >
                <input 
                  type="file" 
                  ref={photoInputRef} 
                  onChange={(e) => handleFileSelected(e, 'Photo')} 
                  accept="image/*" 
                  className="hidden" 
                />
                <input 
                  type="file" 
                  ref={cameraInputRef} 
                  onChange={(e) => handleFileSelected(e, 'Camera Capture')} 
                  accept="image/*" 
                  capture="environment" 
                  className="hidden" 
                />
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={(e) => handleFileSelected(e, 'Document')} 
                  className="hidden" 
                />

                <div className="p-4 pb-6">
                  {/* Top row large rounded buttons */}
                  <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                    {[
                      { icon: <ImageIcon className="w-6 h-6" />, label: 'Photos' },
                      { icon: <Camera className="w-6 h-6" />, label: 'Camera' },
                      { icon: <Smile className="w-6 h-6" />, label: 'Avatar' },
                      { icon: <FileText className="w-6 h-6" />, label: 'Files' },
                      { icon: <HardDrive className="w-6 h-6" />, label: 'Drive' },
                      { icon: <BookOpen className="w-6 h-6" />, label: 'Notebooks' },
                    ].map((item, idx) => (
                      <button 
                        key={idx} 
                        onClick={() => handleMenuOptionClick(item.label)}
                        className="flex flex-col items-center gap-2 min-w-[80px]"
                      >
                        <div className="w-16 h-16 rounded-3xl bg-[#f0f4f9] hover:bg-[#e9eef6] transition-colors flex items-center justify-center text-slate-700">
                          {item.icon}
                        </div>
                        <span className="text-xs font-medium text-slate-700">{item.label}</span>
                      </button>
                    ))}
                  </div>
                  
                  {/* Vertical List */}
                  <div className="space-y-1 mt-2">
                    {[
                      { icon: <ImageIcon className="w-5 h-5" />, title: 'Images', subtitle: 'Create and edit' },
                      { icon: <Film className="w-5 h-5" />, title: 'Videos', subtitle: 'Bring ideas to life' },
                      { icon: <Music className="w-5 h-5" />, title: 'Music', subtitle: 'Make audio tracks' },
                      { icon: <Layout className="w-5 h-5" />, title: 'Canvas', subtitle: 'Code, write, or make slides' },
                      { icon: <Search className="w-5 h-5" />, title: 'Deep research', subtitle: 'Get detailed reports' },
                      { icon: <Book className="w-5 h-5" />, title: 'Guided learning', subtitle: 'Get step-by-step help' },
                    ].map((item, idx) => (
                      <button 
                        key={idx} 
                        onClick={() => handleMenuOptionClick(item.title)}
                        className="w-full flex items-center gap-4 p-3 hover:bg-[#f0f4f9] rounded-xl transition-colors text-left"
                      >
                        <div className="text-slate-700">{item.icon}</div>
                        <div>
                          <p className="text-sm font-medium text-slate-800">{item.title}</p>
                          <p className="text-xs text-slate-500">{item.subtitle}</p>
                        </div>
                      </button>
                    ))}
                    
                    <div 
                      onClick={() => {
                        setPersonalIntelligence(!personalIntelligence);
                        setIsAttachmentMenuOpen(false);
                        setMessages(prev => [
                          ...prev,
                          { id: Date.now(), sender: 'ai', text: `Personal Intelligence mode is now ${!personalIntelligence ? 'Enabled' : 'Disabled'}.` }
                        ]);
                      }}
                      className="w-full flex items-center justify-between p-3 hover:bg-[#f0f4f9] rounded-xl transition-colors mt-2 border-t border-slate-100 pt-3 cursor-pointer"
                    >
                      <div className="flex items-center gap-4">
                        <div className="text-slate-700"><Sparkles className="w-5 h-5" /></div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-medium text-slate-800">Personal Intelligence</p>
                            <span className="text-[10px] bg-slate-200 px-2 py-0.5 rounded-full font-medium">Labs</span>
                          </div>
                          <p className="text-xs text-slate-500">Personalize chat when helpful</p>
                        </div>
                      </div>
                      <div className={`w-10 h-6 rounded-full flex items-center p-1 transition-colors ${personalIntelligence ? 'bg-indigo-600 justify-end' : 'bg-slate-300 justify-start'}`}>
                        <div className="w-4 h-4 bg-white rounded-full"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          <div className="relative flex items-center bg-[#f0f4f9] rounded-full p-2 focus-within:bg-[#e9eef6] transition-all">
            <button 
              onClick={() => setIsAttachmentMenuOpen(!isAttachmentMenuOpen)} 
              className={`p-2.5 rounded-full transition-colors ${isAttachmentMenuOpen ? 'bg-indigo-100 text-indigo-700' : 'text-slate-600 hover:bg-slate-200/50'}`} 
              title="Add attachment"
            >
              {isAttachmentMenuOpen ? <X className="w-6 h-6" /> : <Plus className="w-6 h-6" />}
            </button>
            
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask Galaxy AI..."
              className="flex-1 max-h-[200px] min-h-[44px] bg-transparent resize-none py-3 px-3 focus:outline-none text-[16px] text-slate-800 placeholder:text-slate-600 leading-tight"
              rows={1}
            />
            
            <div className="flex items-center gap-1 pr-1">
              {!input.trim() ? (
                <button className="p-2.5 text-slate-600 hover:bg-slate-200/50 rounded-full transition-colors" title="Voice input">
                  <Mic className="w-6 h-6" />
                </button>
              ) : (
                <button 
                  onClick={handleSend}
                  className="p-2.5 text-slate-600 hover:bg-slate-200/50 rounded-full transition-colors"
                  title="Send message"
                >
                  <Send className="w-6 h-6" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
