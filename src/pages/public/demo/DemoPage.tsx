import React from 'react';
import { motion } from 'motion/react';
import { Play, Calendar, ArrowRight, MessageSquare, Monitor, Tablet, Smartphone } from 'lucide-react';
import { Navigation } from '../landing/Navigation';
import { FooterSection } from '../landing/FooterSection';

export const DemoPage: React.FC<{ navigate: (path: string) => void }> = ({ navigate }) => {
  return (
    <div className="min-h-screen bg-white selection:bg-slate-900 selection:text-white">
      <Navigation onNavigate={navigate} />
      
      <main className="pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          {/* Header */}
          <div className="flex flex-col items-center text-center mb-16">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl md:text-7xl font-bold text-slate-900 tracking-tight leading-tight mb-8"
            >
              See it in action.
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xl text-slate-500 max-w-2xl font-medium leading-relaxed"
            >
              Experience the next generation of institutional management. Watch our product film or schedule a live walkthrough with our team.
            </motion.p>
          </div>

          {/* Video Feature */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="relative aspect-video rounded-[3rem] bg-slate-900 overflow-hidden shadow-2xl group mb-32"
          >
            <img 
              src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=2070" 
              alt="Demo Thumbnail"
              className="w-full h-full object-cover opacity-60 group-hover:scale-[1.02] transition-transform duration-1000"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.button 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="w-24 h-24 rounded-full bg-white flex items-center justify-center shadow-2xl group/btn"
              >
                <Play className="w-8 h-8 text-slate-900 fill-slate-900 translate-x-1" />
              </motion.button>
            </div>
            <div className="absolute bottom-10 left-10 right-10 flex justify-between items-end">
              <div>
                <p className="text-white/60 text-xs font-bold uppercase tracking-widest mb-2">Duration: 4:32</p>
                <h3 className="text-2xl font-bold text-white tracking-tight">Galaxy ERP Overview</h3>
              </div>
            </div>
          </motion.div>

          {/* Interactive Options */}
          <div className="grid md:grid-cols-2 gap-8 mb-32">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="p-12 rounded-[3rem] bg-indigo-600 text-white flex flex-col justify-between"
            >
              <div>
                <Calendar className="w-10 h-10 mb-8" />
                <h3 className="text-4xl font-bold mb-4 tracking-tight">Schedule a live demo.</h3>
                <p className="text-indigo-100 text-lg font-medium mb-12">Get a personalized walkthrough tailored to your institution's specific needs.</p>
              </div>
              <button className="flex items-center gap-3 font-bold group">
                Book a session <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
              </button>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="p-12 rounded-[3rem] bg-slate-50 border border-slate-100 text-slate-900 flex flex-col justify-between"
            >
              <div>
                <MessageSquare className="w-10 h-10 text-indigo-600 mb-8" />
                <h3 className="text-4xl font-bold mb-4 tracking-tight">Talk to an expert.</h3>
                <p className="text-slate-500 text-lg font-medium mb-12">Have specific questions about migration or compliance? Our team is here to help.</p>
              </div>
              <button className="flex items-center gap-3 font-bold text-indigo-600 group">
                Open chat <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
              </button>
            </motion.div>
          </div>

          {/* Cross Platform Section */}
          <div className="py-24 border-t border-slate-100 text-center">
            <h2 className="text-3xl font-bold text-slate-900 mb-16 tracking-tight">Experience across every device.</h2>
            <div className="flex flex-wrap justify-center gap-16">
              {[
                { icon: Monitor, label: "Desktop Engine" },
                { icon: Tablet, label: "Campus Pad" },
                { icon: Smartphone, label: "Mobile Sync" }
              ].map((item, i) => (
                <div key={i} className="flex flex-col items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center">
                    <item.icon className="w-8 h-8 text-slate-400" />
                  </div>
                  <span className="text-sm font-bold text-slate-600 uppercase tracking-widest">{item.label}</span>
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
