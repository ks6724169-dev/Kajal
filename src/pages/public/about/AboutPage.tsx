import React from 'react';
import { motion } from 'motion/react';
import { Target, Users, Zap, Award, Globe, Heart } from 'lucide-react';
import { Navigation } from '../landing/Navigation';
import { FooterSection } from '../landing/FooterSection';

export const AboutPage: React.FC<{ navigate: (path: string) => void }> = ({ navigate }) => {
  return (
    <div className="min-h-screen bg-[#F5F5F7] selection:bg-slate-900 selection:text-white">
      <Navigation onNavigate={navigate} />
      
      <main className="pt-40 pb-32">
        <div className="max-w-7xl mx-auto px-8 md:px-12">
          {/* Mission */}
          <div className="max-w-4xl mb-40">
            <motion.span 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-[11px] font-black text-indigo-600 uppercase tracking-[0.3em] mb-8 inline-block"
            >
              Our Philosophy
            </motion.span>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-6xl md:text-8xl font-bold text-slate-900 tracking-tight leading-[1.02] mb-12"
            >
              Excellence <br />
              <span className="text-slate-400">is a standard.</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-2xl md:text-3xl text-slate-500 font-medium leading-tight tracking-tight max-w-3xl"
            >
              We believe administrative complexity shouldn't stand in the way of education. Galaxy is engineered to provide institutions with the world's most elegant operating system.
            </motion.p>
          </div>

          {/* Core Values */}
          <div className="grid md:grid-cols-3 gap-16 mb-40">
            {[
              { icon: Target, title: "Precision", desc: "Every line of code and every pixel is crafted for absolute reliability and clarity." },
              { icon: Zap, title: "Velocity", desc: "Building tools that move as fast as modern education, eliminating bottlenecks instantly." },
              { icon: Heart, title: "Humanity", desc: "Designing around the real-world workflows of teachers and administrators." }
            ].map((value, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="group"
              >
                <div className="w-16 h-16 rounded-[1.5rem] bg-white shadow-sm border border-slate-200/50 flex items-center justify-center text-indigo-600 mb-8 transition-transform group-hover:scale-105">
                  <value.icon className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 tracking-tight mb-4">{value.title}</h3>
                <p className="text-slate-500 font-medium leading-relaxed">{value.desc}</p>
              </motion.div>
            ))}
          </div>

          {/* Team / Stats - Bento Style */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-20 border-t border-slate-200">
            {[
              { label: "Global Hubs", value: "12" },
              { label: "Specialists", value: "600+" },
              { label: "Markets", value: "40+" },
              { label: "Awards", value: "24" }
            ].map((stat, i) => (
              <div key={i} className="text-center md:text-left">
                <p className="text-5xl font-bold text-slate-900 tracking-tighter mb-2">{stat.value}</p>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </main>

      <FooterSection onNavigate={navigate} />
    </div>
  );
};
