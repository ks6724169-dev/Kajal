import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, MessageSquare, Mic, Image, LineChart } from 'lucide-react';

export const AiSection: React.FC = () => {
  return (
    <div id="ai" className="py-24 bg-slate-950 relative overflow-hidden text-white">
      {/* Background Orbs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-600/30 rounded-full blur-[120px] mix-blend-screen pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-600/20 rounded-full blur-[100px] mix-blend-screen pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-md mb-8">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-200">Galaxy AI</span>
            </div>

            <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-6 leading-tight">
              An intelligent assistant <br />
              built right in.
            </h2>
            
            <p className="text-lg text-slate-400 font-medium mb-8 max-w-lg">
              Automate routine tasks, generate insights, and get smart recommendations. Galaxy AI understands your school's data to help you make better decisions.
            </p>

            <div className="space-y-4">
              {[
                { icon: <MessageSquare className="w-5 h-5" />, text: "Generate Timetables & Notices instantly" },
                { icon: <LineChart className="w-5 h-5" />, text: "Predictive student performance analytics" },
                { icon: <Mic className="w-5 h-5" />, text: "Voice-driven commands and reporting" },
                { icon: <Image className="w-5 h-5" />, text: "Automated document OCR and processing" }
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                    {item.icon}
                  </div>
                  <span className="font-bold text-slate-200">{item.text}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl shadow-indigo-500/20 relative z-10 overflow-hidden">
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500"></div>
              
              <div className="flex items-center gap-4 border-b border-slate-800 pb-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-indigo-500 to-cyan-400 flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-white">Galaxy AI</h4>
                  <p className="text-xs text-indigo-400 font-medium">Always ready to help</p>
                </div>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-slate-800 flex-shrink-0"></div>
                  <div className="bg-slate-800 text-sm text-slate-300 p-4 rounded-2xl rounded-tl-none border border-slate-700">
                    Can you generate a timetable for Grade 10 Science section?
                  </div>
                </div>
                
                <div className="flex gap-3 flex-row-reverse">
                  <div className="w-8 h-8 rounded-full bg-indigo-500 flex-shrink-0 flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                  <div className="bg-indigo-600 text-sm text-white p-4 rounded-2xl rounded-tr-none shadow-lg">
                    <p className="mb-2">I've generated the timetable ensuring no teacher conflicts and following the board guidelines.</p>
                    <div className="bg-indigo-700/50 rounded-lg p-3 text-xs font-mono">
                      timetable_grade10_sci.pdf
                    </div>
                  </div>
                </div>
              </div>

              <div className="relative">
                <input 
                  type="text" 
                  disabled 
                  placeholder="Ask Galaxy AI..." 
                  className="w-full bg-slate-800 border border-slate-700 text-white text-sm rounded-xl py-3 pl-4 pr-12 focus:outline-none"
                />
                <button className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>

            {/* Decorative dots */}
            <div className="absolute -right-8 -bottom-8 w-64 h-64 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-500/20 to-transparent blur-xl -z-10"></div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
