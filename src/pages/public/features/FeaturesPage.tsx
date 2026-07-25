import React from 'react';
import { motion } from 'motion/react';
import { 
  LayoutDashboard, GraduationCap, UserCheck, Calculator, 
  Sparkles, Shield, BarChart3, Globe, Zap, Users,
  BookOpen, ClipboardCheck, MessageSquare, Clock
} from 'lucide-react';
import { Navigation } from '../landing/Navigation';
import { FooterSection } from '../landing/FooterSection';

const MODULES = [
  {
    id: 'control-center',
    title: 'Control Center',
    description: 'The central nervous system of your institution. Manage campuses, staff, and policies from a single intuitive dashboard.',
    icon: LayoutDashboard,
    color: 'text-blue-500',
    bg: 'bg-blue-50',
    features: ['Multi-campus management', 'Policy engine', 'Staff directory', 'Real-time monitoring']
  },
  {
    id: 'student-hub',
    title: 'Student Hub',
    description: 'A 360-degree view of every student. Track academic progress, behavior, and personal growth with deep granularity.',
    icon: GraduationCap,
    color: 'text-indigo-500',
    bg: 'bg-indigo-50',
    features: ['Academic transcripts', 'Progress reports', 'Portfolio management', 'Behavior tracking']
  },
  {
    id: 'attendance',
    title: 'Attendance 2.0',
    description: 'AI-assisted attendance tracking that syncs instantly across all devices. No more paper, no more errors.',
    icon: UserCheck,
    color: 'text-emerald-500',
    bg: 'bg-emerald-50',
    features: ['Biometric integration', 'Mobile sync', 'Automated alerts', 'Analytics reports']
  },
  {
    id: 'finance',
    title: 'Fee Engine',
    description: 'Automated fee collection and financial reporting. Transparent, secure, and completely frictionless for parents.',
    icon: Calculator,
    color: 'text-amber-500',
    bg: 'bg-amber-50',
    features: ['Online payments', 'Automated invoicing', 'Fee structure builder', 'Expense tracking']
  }
];

export const FeaturesPage: React.FC<{ navigate: (path: string) => void }> = ({ navigate }) => {
  return (
    <div className="min-h-screen bg-[#F5F5F7] selection:bg-slate-900 selection:text-white">
      <Navigation onNavigate={navigate} />
      
      <main className="pt-40 pb-32">
        <div className="max-w-7xl mx-auto px-8 md:px-12">
          {/* Header */}
          <div className="max-w-4xl mb-32">
            <motion.span 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-[11px] font-black text-indigo-600 uppercase tracking-[0.3em] mb-8 inline-block"
            >
              The Architecture
            </motion.span>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-6xl md:text-8xl font-bold text-slate-900 tracking-tight leading-[1.02] mb-12"
            >
              Every tool <br />
              <span className="text-slate-400">for the modern era.</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-2xl text-slate-500 font-medium leading-tight tracking-tight max-w-3xl"
            >
              Galaxy isn't just a management system. It's a cohesive ecosystem designed to eliminate friction and empower educators globally.
            </motion.p>
          </div>

          {/* Modules Grid */}
          <div className="grid md:grid-cols-2 gap-8 mb-40">
            {MODULES.map((module, idx) => (
              <motion.div
                key={module.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="group p-12 rounded-[3.5rem] bg-white border border-slate-200/50 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500"
              >
                <div className={`w-16 h-16 rounded-[1.5rem] ${module.bg} flex items-center justify-center mb-10 transition-transform group-hover:scale-105`}>
                  <module.icon className={`w-8 h-8 ${module.color}`} />
                </div>
                <h3 className="text-4xl font-bold text-slate-900 mb-4 tracking-tight leading-tight">{module.title}</h3>
                <p className="text-slate-500 text-xl font-medium leading-tight tracking-tight mb-12">{module.description}</p>
                
                <div className="grid grid-cols-2 gap-6">
                  {module.features.map((feature, fIdx) => (
                    <div key={fIdx} className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-slate-200" />
                      <span className="text-[13px] font-bold text-slate-600 tracking-tight">{feature}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Deep Features List */}
          <div className="py-32 border-t border-slate-200">
            <h2 className="text-4xl font-bold text-slate-900 mb-20 tracking-tight">Core Infrastructure.</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-16">
              {[
                { icon: BookOpen, title: "LMS Integrated", desc: "Native learning management." },
                { icon: ClipboardCheck, title: "Exam Portal", desc: "Online assessment engine." },
                { icon: MessageSquare, title: "Smart Comms", desc: "Multi-channel notifications." },
                { icon: Clock, title: "Time Table", desc: "AI-driven scheduling." },
                { icon: Globe, title: "Multilingual", desc: "Global localizations." },
                { icon: Shield, title: "Compliance", desc: "Audit-ready reporting." },
                { icon: BarChart3, title: "Insights", desc: "Executive dashboards." },
                { icon: Zap, title: "API First", desc: "Seamless integrations." }
              ].map((item, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.05 }}
                  className="space-y-4"
                >
                  <item.icon className="w-8 h-8 text-slate-300" />
                  <h4 className="text-lg font-bold text-slate-900 tracking-tight leading-tight">{item.title}</h4>
                  <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest leading-none">{item.desc}</p>
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
