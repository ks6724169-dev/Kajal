import React from 'react';
import { motion } from 'motion/react';
import { 
  Sparkles, Brain, Zap, LineChart, 
  Search, MessageCircle, Bot, Cpu,
  BarChart, Target, Lightbulb, TrendingUp
} from 'lucide-react';
import { Navigation } from '../landing/Navigation';
import { FooterSection } from '../landing/FooterSection';

export const IntelligencePage: React.FC<{ navigate: (path: string) => void }> = ({ navigate }) => {
  return (
    <div className="min-h-screen bg-[#F5F5F7] selection:bg-slate-900 selection:text-white">
      <Navigation onNavigate={navigate} />
      
      <main className="pt-40 pb-32">
        <div className="max-w-7xl mx-auto px-8 md:px-12">
          {/* Hero */}
          <div className="max-w-4xl mb-40">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white border border-slate-200 shadow-sm text-[11px] font-bold text-indigo-600 uppercase tracking-widest mb-10"
            >
              <Sparkles className="w-4 h-4" /> Galaxy Intelligence
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-6xl md:text-8xl font-bold text-slate-900 tracking-tight leading-[1.02] mb-12"
            >
              Intelligence. <br />
              <span className="text-slate-400">Built into the core.</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-2xl md:text-3xl text-slate-500 font-medium leading-tight tracking-tight max-w-3xl"
            >
              Beyond simple automation. We've engineered a predictive intelligence layer that understands your institution's rhythm and anticipates its needs.
            </motion.p>
          </div>

          {/* AI Features Grid */}
          <div className="grid md:grid-cols-2 gap-8 mb-40">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="p-16 rounded-[3.5rem] bg-slate-900 text-white relative overflow-hidden group shadow-2xl"
            >
              <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 blur-[120px] rounded-full group-hover:scale-150 transition-transform duration-1000"></div>
              <div className="relative z-10">
                <Brain className="w-16 h-16 text-indigo-400 mb-12" />
                <h3 className="text-5xl font-bold mb-8 tracking-tight leading-tight">Predictive Analytics.</h3>
                <p className="text-slate-400 text-xl font-medium leading-relaxed mb-12">Galaxy AI analyzes institutional data to forecast student performance, fee trends, and resource requirements with unprecedented accuracy.</p>
                <div className="flex flex-wrap gap-4">
                  <div className="px-5 py-2.5 rounded-2xl bg-white/5 border border-white/10 text-xs font-bold text-indigo-300 uppercase tracking-widest">Trend Forecasting</div>
                  <div className="px-5 py-2.5 rounded-2xl bg-white/5 border border-white/10 text-xs font-bold text-indigo-300 uppercase tracking-widest">Risk Assessment</div>
                </div>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="p-16 rounded-[3.5rem] bg-white border border-slate-200/50 shadow-sm hover:shadow-2xl transition-all duration-500 group"
            >
              <div className="w-16 h-16 rounded-[1.5rem] bg-[#F5F5F7] flex items-center justify-center mb-12 group-hover:scale-105 transition-transform">
                <Target className="w-8 h-8 text-indigo-600" />
              </div>
              <h3 className="text-5xl font-bold text-slate-900 mb-8 tracking-tight leading-tight">Adaptive Systems.</h3>
              <p className="text-slate-500 text-xl font-medium leading-relaxed mb-12">Automated scheduling that balances staff preferences, classroom availability, and student electives instantly.</p>
              <div className="flex flex-wrap gap-4">
                <div className="px-5 py-2.5 rounded-2xl bg-indigo-50 border border-indigo-100 text-xs font-bold text-indigo-600 uppercase tracking-widest">Dynamic Balancing</div>
                <div className="px-5 py-2.5 rounded-2xl bg-indigo-50 border border-indigo-100 text-xs font-bold text-indigo-600 uppercase tracking-widest">Conflict Resolver</div>
              </div>
            </motion.div>
          </div>

          {/* Intelligence Capabilities */}
          <div className="py-32 border-t border-slate-200">
            <h2 className="text-4xl font-bold text-slate-900 mb-20 tracking-tight">Core Capabilities.</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-20">
              {[
                { icon: Search, title: "Natural Language Search", desc: "Ask Galaxy anything. 'Show me students with declining math scores' or 'What is our projected revenue?'" },
                { icon: MessageCircle, title: "Smart Communications", desc: "Automated, personalized drafting of newsletters, reports, and alerts for parents and staff." },
                { icon: LineChart, title: "Institutional Wisdom", desc: "Executive-level insights that surface critical bottlenecks before they become institutional issues." }
              ].map((item, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="space-y-6"
                >
                  <div className="w-12 h-12 rounded-xl bg-white shadow-sm border border-slate-200/50 flex items-center justify-center">
                    <item.icon className="w-6 h-6 text-indigo-600" />
                  </div>
                  <h4 className="text-2xl font-bold text-slate-900 tracking-tight leading-tight">{item.title}</h4>
                  <p className="text-lg text-slate-500 font-medium leading-relaxed tracking-tight">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <FooterSection onNavigate={navigate} />
    </div>
  );
};
