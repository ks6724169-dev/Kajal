import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Calendar, FileBarChart, IndianRupee, Activity, Users, ShieldAlert, Mic, LineChart, GraduationCap } from 'lucide-react';

const aiFeatures = [
  { title: 'AI Attendance', icon: Users },
  { title: 'AI Report Generator', icon: FileBarChart },
  { title: 'AI Fee Prediction', icon: IndianRupee },
  { title: 'AI Timetable', icon: Calendar },
  { title: 'AI Exam Analysis', icon: Activity },
  { title: 'AI Weak Student Detection', icon: ShieldAlert },
  { title: 'AI Parent Assistant', icon: Sparkles },
  { title: 'AI Teacher Assistant', icon: GraduationCap },
  { title: 'AI Voice Commands', icon: Mic },
  { title: 'AI Analytics', icon: LineChart },
];

export const AIFeaturesSection: React.FC = () => {
  return (
    <div className="py-24 bg-indigo-950 relative overflow-hidden" id="ai-features">
      {/* Background gradients */}
      <div className="absolute top-0 right-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-indigo-600/30 rounded-full blur-[150px] mix-blend-screen" />
        <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] bg-cyan-500/20 rounded-full blur-[120px] mix-blend-screen" />
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 backdrop-blur-md mb-6">
            <Sparkles className="w-4 h-4 text-indigo-300" />
            <span className="text-xs font-black text-indigo-100 tracking-wider uppercase">Galaxy AI</span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight mb-4">
            One AI for every user.
          </h2>
          <p className="text-lg text-indigo-200 font-medium">
            Intelligent automation and insights built natively into every module.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {aiFeatures.map((feat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="group relative bg-white/5 backdrop-blur-lg border border-white/10 p-6 rounded-3xl hover:bg-white/10 transition-colors flex flex-col items-center justify-center text-center overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/0 via-indigo-500/0 to-indigo-400/20 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="w-12 h-12 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-300 mb-4 group-hover:scale-110 transition-transform">
                <feat.icon className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-white relative z-10">{feat.title}</h4>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
