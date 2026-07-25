import React from 'react';
import { motion } from 'motion/react';
import { Search, Book, MessageCircle, Video, HelpCircle, ArrowRight } from 'lucide-react';
import { Navigation } from '../landing/Navigation';
import { FooterSection } from '../landing/FooterSection';

export const HelpCenterPage: React.FC<{ navigate: (path: string) => void }> = ({ navigate }) => {
  return (
    <div className="min-h-screen bg-[#F5F5F7] selection:bg-slate-900 selection:text-white">
      <Navigation onNavigate={navigate} />
      
      <main className="pt-40 pb-32">
        <div className="max-w-7xl mx-auto px-8 md:px-12">
          {/* Header */}
          <div className="flex flex-col items-center text-center mb-24">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-6xl md:text-8xl font-bold text-slate-900 tracking-tight leading-[1.02] mb-12"
            >
              How can we <br />
              <span className="text-slate-400">support you?</span>
            </motion.h1>
            <div className="w-full max-w-3xl relative">
              <Search className="absolute left-7 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search resources, guides, and tutorials..."
                className="w-full pl-16 pr-8 py-6 rounded-full bg-white border border-slate-200/50 shadow-[0_8px_32px_rgba(0,0,0,0.04)] focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-400 transition-all font-medium text-xl placeholder:text-slate-300"
              />
            </div>
          </div>

          {/* Categories */}
          <div className="grid md:grid-cols-3 gap-8 mb-40">
            {[
              { icon: Book, title: "Fundamentals", count: "12 units", desc: "Master the core principles and architecture of Galaxy ERP." },
              { icon: Video, title: "Masterclass", count: "32 sessions", desc: "In-depth video explorations of advanced features." },
              { icon: HelpCircle, title: "Solutions", count: "100+ articles", desc: "Immediate answers to common operational questions." }
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="p-12 rounded-[3rem] bg-white border border-slate-200/50 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group cursor-pointer"
              >
                <div className="w-16 h-16 rounded-[1.5rem] bg-[#F5F5F7] flex items-center justify-center mb-8 group-hover:scale-105 transition-transform">
                  <item.icon className="w-8 h-8 text-indigo-600" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2 tracking-tight">{item.title}</h3>
                <p className="text-[11px] font-black text-indigo-600 uppercase tracking-[0.2em] mb-6">{item.count}</p>
                <p className="text-lg text-slate-500 font-medium leading-tight tracking-tight">{item.desc}</p>
              </motion.div>
            ))}
          </div>

          {/* Popular Topics */}
          <div className="py-32 border-t border-slate-200">
            <div className="flex items-end justify-between mb-16">
              <h2 className="text-4xl font-bold text-slate-900 tracking-tight">Popular Topics</h2>
              <button className="text-[13px] font-bold text-indigo-600 hover:underline">View all library</button>
            </div>
            <div className="grid md:grid-cols-2 gap-x-24 gap-y-4">
              {[
                "Managing multi-campus permissions",
                "Automating fee collection cycles",
                "Generating AI-powered student reports",
                "Customizing the parent portal experience",
                "Integrating with external payment gateways",
                "Managing staff attendance and payroll"
              ].map((topic, i) => (
                <div key={i} className="flex items-center justify-between py-6 border-b border-slate-200 group cursor-pointer">
                  <span className="text-xl font-bold text-slate-600 group-hover:text-slate-900 transition-colors tracking-tight">{topic}</span>
                  <ArrowRight className="w-6 h-6 text-slate-200 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <FooterSection onNavigate={navigate} />
    </div>
  );
};
