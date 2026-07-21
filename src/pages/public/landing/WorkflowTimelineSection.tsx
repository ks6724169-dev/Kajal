import React from 'react';
import { motion } from 'motion/react';
import { Building2, UserCircle, Users, GraduationCap, Home, Activity, Sparkles, LineChart, TrendingUp } from 'lucide-react';

const steps = [
  { title: 'Register School', icon: Building2 },
  { title: 'Create Principal', icon: UserCircle },
  { title: 'Create Teachers', icon: Users },
  { title: 'Student Admission', icon: GraduationCap },
  { title: 'Parents Connected', icon: Home },
  { title: 'Daily ERP Operations', icon: Activity },
  { title: 'AI Automation', icon: Sparkles },
  { title: 'Analytics', icon: LineChart },
  { title: 'Growth', icon: TrendingUp },
];

export const WorkflowTimelineSection: React.FC = () => {
  return (
    <div className="py-24 bg-slate-50 relative overflow-hidden" id="workflow">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-sm font-black text-indigo-600 uppercase tracking-widest mb-3">How It Works</h2>
          <h3 className="text-4xl font-black text-slate-900 tracking-tight leading-tight">
            From setup to scale in days.
          </h3>
        </div>

        <div className="relative max-w-4xl mx-auto">
          {/* Vertical Line */}
          <div className="absolute left-[27px] md:left-1/2 top-0 bottom-0 w-1 bg-indigo-100 rounded-full transform md:-translate-x-1/2" />
          
          <div className="space-y-12">
            {steps.map((step, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5 }}
                className={`relative flex items-center gap-6 md:justify-between ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}
              >
                {/* Mobile: Space placeholder, Desktop: Half width */}
                <div className="hidden md:block md:w-[45%]" />
                
                {/* Center Icon */}
                <div className="absolute left-0 md:left-1/2 w-14 h-14 rounded-full bg-white border-4 border-indigo-50 shadow-md flex items-center justify-center transform md:-translate-x-1/2 z-10 text-indigo-600">
                  <step.icon className="w-5 h-5" />
                </div>
                
                {/* Content Card */}
                <div className="ml-16 md:ml-0 md:w-[45%] bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                  <span className="text-xs font-black text-slate-400 uppercase tracking-wider mb-1 block">Step {i + 1}</span>
                  <h4 className="text-lg font-black text-slate-900">{step.title}</h4>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
