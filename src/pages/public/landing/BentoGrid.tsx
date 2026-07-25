import React from 'react';
import { motion } from 'motion/react';
import { 
  Zap, 
  Shield, 
  BarChart3, 
  Users, 
  Calendar, 
  Cloud,
  MousePointer2,
  Lock,
  Globe,
  Sparkles
} from 'lucide-react';

const CARDS = [
  {
    title: "Intelligence First",
    description: "Deep analytics for institutional growth.",
    icon: BarChart3,
    size: "large",
    color: "bg-blue-500",
    image: "https://images.unsplash.com/photo-1551288049-bbb653283b56?auto=format&fit=crop&q=80&w=800"
  },
  {
    title: "Zero-Trust Security",
    description: "Military-grade data protection.",
    icon: Shield,
    size: "small",
    color: "bg-emerald-500"
  },
  {
    title: "Global Sync",
    description: "Real-time updates across campuses.",
    icon: Globe,
    size: "small",
    color: "bg-indigo-500"
  },
  {
    title: "Collaborative Ecosystem",
    description: "Connect teachers, parents, and students in one unified space.",
    icon: Users,
    size: "medium",
    color: "bg-purple-500"
  },
  {
    title: "Adaptive Scheduling",
    description: "AI-driven automated timetables.",
    icon: Calendar,
    size: "small",
    color: "bg-amber-500"
  }
];

export const BentoGrid = () => {
  return (
    <section className="py-24 px-6 md:px-12 bg-white selection:bg-slate-900 selection:text-white">
      <div className="max-w-7xl mx-auto">
        <div className="mb-16 text-center">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 mb-4"
          >
            Engineered for Excellence.
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-slate-500 max-w-2xl mx-auto"
          >
            A cohesive suite of tools designed to elevate the educational experience through precision and clarity.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-4 h-full md:h-[600px]">
          {/* Main Large Card */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="md:col-span-2 md:row-span-2 bg-slate-50 rounded-[2.5rem] p-10 flex flex-col justify-between overflow-hidden relative group border border-slate-100 hover:border-slate-200 transition-all"
          >
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center mb-6">
                <BarChart3 className="w-6 h-6 text-blue-500" />
              </div>
              <h3 className="text-3xl font-bold text-slate-900 mb-3 tracking-tight">Intelligence at scale.</h3>
              <p className="text-slate-500 max-w-xs text-lg font-medium leading-tight">Advanced reporting that turns data into institutional wisdom.</p>
            </div>
            
            <div className="absolute bottom-0 right-0 w-3/4 h-1/2 translate-y-4 translate-x-4">
              <img 
                src="https://images.unsplash.com/photo-1551288049-bbb653283b56?auto=format&fit=crop&q=80&w=800" 
                alt="Analytics"
                className="w-full h-full object-cover rounded-tl-3xl shadow-2xl group-hover:scale-105 transition-transform duration-700"
              />
            </div>
          </motion.div>

          {/* Medium Card */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="md:col-span-2 bg-slate-900 rounded-[2.5rem] p-10 flex flex-col justify-between overflow-hidden relative group"
          >
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center mb-6">
                <Sparkles className="w-6 h-6 text-indigo-400" />
              </div>
              <h3 className="text-3xl font-bold text-white mb-3 tracking-tight">AI-Powered core.</h3>
              <p className="text-slate-400 max-w-sm text-lg font-medium leading-tight">The first ERP with a native intelligence layer that anticipates your needs.</p>
            </div>
            <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-indigo-500/20 blur-[80px] rounded-full"></div>
          </motion.div>

          {/* Small Card 1 */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="bg-emerald-50 rounded-[2rem] p-8 flex flex-col justify-between border border-emerald-100/50 hover:bg-emerald-100/30 transition-colors"
          >
            <Shield className="w-8 h-8 text-emerald-600 mb-4" />
            <div>
              <h4 className="text-xl font-bold text-slate-900 mb-1 tracking-tight">Encrypted.</h4>
              <p className="text-sm text-slate-500 font-medium">Privacy built-in from day one.</p>
            </div>
          </motion.div>

          {/* Small Card 2 */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="bg-blue-50 rounded-[2rem] p-8 flex flex-col justify-between border border-blue-100/50 hover:bg-blue-100/30 transition-colors"
          >
            <Globe className="w-8 h-8 text-blue-600 mb-4" />
            <div>
              <h4 className="text-xl font-bold text-slate-900 mb-1 tracking-tight">Worldwide.</h4>
              <p className="text-sm text-slate-500 font-medium">Synced across every timezone.</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
