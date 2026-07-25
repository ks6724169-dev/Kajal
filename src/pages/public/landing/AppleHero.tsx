import React from 'react';
import { motion } from 'motion/react';
import { ChevronRight, Play, ShieldCheck } from 'lucide-react';
import { FeaturesSidebar } from './components/FeaturesSidebar';
import { authStore } from '../../../store/authStore';

export const AppleHero: React.FC<{ onNavigate: (path: string) => void }> = ({ onNavigate }) => {
  const handleTestOwnerLogin = () => {
    authStore.login({
      id: 'dev-owner-1',
      name: 'Development Owner',
      role: 'organization_owner',
      email: 'owner@example.com'
    }, false);
    onNavigate('/app');
  };

  return (
    <section className="relative pt-32 pb-20 overflow-hidden bg-white selection:bg-slate-900 selection:text-white">
      {/* Background soft glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none">
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[80%] h-[80%] bg-gradient-to-b from-indigo-50/50 to-transparent rounded-full blur-[120px]"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <div className="grid lg:grid-cols-12 gap-16 items-center">
          
          {/* Left Column: Content */}
          <div className="lg:col-span-8 flex flex-col items-start text-left">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="mb-8"
            >
              <span className="px-4 py-1.5 rounded-full bg-slate-50 border border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-widest">
                Introducing Galaxy ERP 2.0
              </span>
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="text-6xl md:text-[5.5rem] font-bold text-slate-900 tracking-tight leading-[1.05] mb-8 max-w-4xl"
            >
              Intelligence. <br />
              <span className="text-slate-400">At the heart of education.</span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="text-xl md:text-2xl text-slate-500 max-w-2xl font-medium leading-relaxed mb-12"
            >
              The ultimate operating system for modern institutions. Built for speed, security, and absolute clarity.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-wrap items-center gap-6"
            >
              <button 
                onClick={() => onNavigate('/register')}
                className="px-10 py-4 bg-slate-900 text-white rounded-full font-bold text-sm hover:bg-slate-800 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-xl shadow-slate-200"
              >
                Start for free
              </button>
              <button 
                onClick={() => onNavigate('/demo')}
                className="flex items-center gap-2 text-indigo-600 font-bold hover:gap-3 transition-all group"
              >
                Watch the film <Play className="w-4 h-4 fill-indigo-600" />
              </button>

              {/* Developer Testing Tool */}
              <div className="w-full mt-4 flex items-center gap-4">
                <button
                  onClick={handleTestOwnerLogin}
                  className="group flex items-center gap-2 px-6 py-2.5 bg-slate-50 hover:bg-indigo-600 text-slate-500 hover:text-white rounded-full text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 border border-slate-200/50 hover:border-indigo-500 shadow-sm"
                >
                  <ShieldCheck className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
                  <span>Test Owner Dashboard</span>
                </button>
                <span className="text-[9px] font-bold text-slate-300 uppercase tracking-widest hidden md:inline">Development Tool</span>
              </div>
            </motion.div>

            {/* Device Showcase - Using a clean glass frame effect */}
            <motion.div
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="mt-20 w-full relative"
            >
              <div className="relative aspect-[16/9] rounded-[2rem] bg-slate-50 border border-slate-200 shadow-2xl overflow-hidden group">
                 <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5"></div>
                 <div className="absolute inset-4 rounded-2xl bg-white border border-slate-100 shadow-inner flex items-center justify-center overflow-hidden">
                    <img 
                      src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=2426" 
                      alt="App Preview"
                      className="w-full h-full object-cover opacity-90 group-hover:scale-[1.02] transition-transform duration-1000"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-white/20 to-transparent"></div>
                 </div>
              </div>
              
              {/* Floating accent elements */}
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-indigo-500/10 blur-3xl rounded-full"></div>
              <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-purple-500/10 blur-3xl rounded-full"></div>
            </motion.div>
          </div>

          {/* Right Column: Features Sidebar */}
          <div className="lg:col-span-4 hidden lg:flex flex-col items-center justify-start h-full pt-20">
            <FeaturesSidebar />
          </div>

        </div>
      </div>
    </section>
  );
};
