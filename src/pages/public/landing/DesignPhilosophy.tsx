import React from 'react';
import { motion } from 'motion/react';
import { MousePointer2, Layers, Cpu, ShieldCheck, Sparkles } from 'lucide-react';

export const DesignPhilosophy = () => {
  return (
    <section className="py-32 px-6 md:px-12 bg-slate-50 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-[10px] font-bold text-indigo-600 uppercase tracking-widest mb-6"
            >
              <Cpu className="w-3 h-3" /> Hardware-Software Integration
            </motion.div>
            
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight leading-tight mb-8"
            >
              Clarity is the <br />
              new powerful.
            </motion.h2>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-lg text-slate-500 font-medium leading-relaxed mb-10"
            >
              We've stripped away the noise of traditional management systems. Every button, every transition, and every report is designed to provide immediate insight without the friction of complexity.
            </motion.p>

            <div className="space-y-6">
              {[
                { title: "Precision Components", desc: "Pixel-perfect interface designed for focus.", icon: Layers },
                { title: "Fluid Interactions", desc: "Response times measured in milliseconds.", icon: MousePointer2 },
                { title: "Privacy First", desc: "End-to-end data sovereignty by default.", icon: ShieldCheck }
              ].map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + (idx * 0.1) }}
                  className="flex gap-4 p-4 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center shrink-0">
                    <item.icon className="w-5 h-5 text-slate-600" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{item.title}</h4>
                    <p className="text-xs text-slate-500 font-medium">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative z-10 aspect-square rounded-[3rem] bg-white shadow-2xl border border-slate-100 overflow-hidden"
            >
               <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(99,102,241,0.1),transparent)]"></div>
               <div className="absolute inset-10 border-2 border-dashed border-slate-100 rounded-[2rem] flex items-center justify-center">
                  <div className="relative">
                    <div className="w-32 h-32 rounded-3xl bg-indigo-600 shadow-2xl flex items-center justify-center animate-pulse">
                      <Sparkles className="w-12 h-12 text-white" />
                    </div>
                    {/* Animated rings */}
                    <div className="absolute -inset-4 border border-indigo-100 rounded-[2.5rem] animate-[ping_3s_linear_infinite]"></div>
                    <div className="absolute -inset-12 border border-indigo-50/50 rounded-[3.5rem] animate-[ping_4s_linear_infinite_1s]"></div>
                  </div>
               </div>
            </motion.div>
            
            {/* Absolute positioned callouts */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="absolute top-10 -right-10 bg-white p-4 rounded-2xl shadow-xl border border-slate-100 z-20 hidden md:block"
            >
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Latency</p>
              <p className="text-xl font-bold text-emerald-500 tracking-tight">0.02ms</p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="absolute bottom-10 -left-10 bg-white p-4 rounded-2xl shadow-xl border border-slate-100 z-20 hidden md:block"
            >
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Uptime</p>
              <p className="text-xl font-bold text-slate-900 tracking-tight">99.99%</p>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};
