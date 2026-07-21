import React from 'react';
import { motion } from 'motion/react';
import { LayoutDashboard, Users, UserCheck, Calculator, BrainCircuit, Activity } from 'lucide-react';

export const InteractivePreviewSection: React.FC = () => {
  return (
    <div className="py-32 bg-slate-950 relative overflow-hidden" id="preview">
      {/* Background lights */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-sm font-black text-indigo-400 uppercase tracking-widest mb-3">Experience Galaxy ERP</h2>
          <h3 className="text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
            See the future of education management
          </h3>
        </div>

        <div className="relative mx-auto max-w-5xl">
          {/* Laptop Mockup */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="relative z-10 bg-slate-900 rounded-t-3xl rounded-b-xl border-[8px] border-slate-800 shadow-2xl shadow-indigo-500/20 aspect-[16/10] overflow-hidden flex flex-col"
          >
            {/* Mockup Top Bar */}
            <div className="h-12 bg-slate-950 border-b border-slate-800 flex items-center px-4 justify-between">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-slate-700"></div>
                <div className="w-3 h-3 rounded-full bg-slate-700"></div>
                <div className="w-3 h-3 rounded-full bg-slate-700"></div>
              </div>
              <div className="w-1/3 h-6 bg-slate-800 rounded-md"></div>
              <div className="flex gap-4 items-center">
                <div className="w-6 h-6 rounded-full bg-slate-800"></div>
                <div className="w-8 h-8 rounded-full bg-indigo-500"></div>
              </div>
            </div>
            
            {/* Dashboard UI */}
            <div className="flex-1 bg-slate-50 flex">
              {/* Sidebar */}
              <div className="w-48 border-r border-slate-200 bg-white p-4 flex flex-col gap-4">
                <div className="h-8 bg-indigo-100 rounded-lg flex items-center px-3 gap-2">
                  <LayoutDashboard className="w-4 h-4 text-indigo-600" />
                  <div className="w-20 h-2 bg-indigo-200 rounded-full"></div>
                </div>
                <div className="h-8 bg-slate-50 hover:bg-slate-100 rounded-lg flex items-center px-3 gap-2">
                  <Users className="w-4 h-4 text-slate-400" />
                  <div className="w-16 h-2 bg-slate-200 rounded-full"></div>
                </div>
                <div className="h-8 bg-slate-50 hover:bg-slate-100 rounded-lg flex items-center px-3 gap-2">
                  <UserCheck className="w-4 h-4 text-slate-400" />
                  <div className="w-24 h-2 bg-slate-200 rounded-full"></div>
                </div>
              </div>
              
              {/* Main Area */}
              <div className="flex-1 p-6 flex flex-col gap-6">
                <div className="flex justify-between items-center">
                  <div className="w-48 h-6 bg-slate-200 rounded-md"></div>
                  <div className="w-32 h-8 bg-indigo-600 rounded-lg"></div>
                </div>
                
                {/* Stats */}
                <div className="grid grid-cols-3 gap-4">
                  {[1,2,3].map((i) => (
                    <div key={i} className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex flex-col gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-100"></div>
                      <div className="w-16 h-2 bg-slate-200 rounded-full"></div>
                      <div className="w-24 h-6 bg-slate-800 rounded-md"></div>
                    </div>
                  ))}
                </div>
                
                {/* Chart Area */}
                <div className="flex-1 bg-white rounded-xl border border-slate-100 shadow-sm p-4 flex items-end gap-2">
                   {[40, 60, 45, 80, 55, 90, 75, 100, 85, 70].map((h, i) => (
                     <motion.div 
                       key={i}
                       initial={{ height: 0 }}
                       whileInView={{ height: `${h}%` }}
                       viewport={{ once: true }}
                       transition={{ duration: 1, delay: i * 0.1 }}
                       className="flex-1 bg-indigo-500 rounded-t-sm"
                     />
                   ))}
                </div>
              </div>
            </div>
          </motion.div>
          
          {/* Base of laptop */}
          <div className="relative z-0 h-4 bg-slate-800 rounded-b-3xl mx-auto w-[105%] -ml-[2.5%] shadow-2xl"></div>

          {/* Floating Tablet */}
          <motion.div 
            initial={{ opacity: 0, x: -50, y: 50 }}
            whileInView={{ opacity: 1, x: -80, y: 80 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.3 }}
            className="absolute bottom-0 left-0 w-48 aspect-[3/4] bg-slate-900 rounded-2xl border-[6px] border-slate-800 shadow-2xl z-20 flex flex-col overflow-hidden"
          >
             <div className="flex-1 bg-slate-50 p-3 flex flex-col gap-3">
               <div className="flex justify-between items-center">
                 <div className="w-6 h-6 rounded-full bg-indigo-600"></div>
                 <div className="w-16 h-2 bg-slate-200 rounded-full"></div>
               </div>
               <div className="w-full h-32 bg-white rounded-lg shadow-sm border border-slate-100 p-2 flex flex-col justify-end gap-1">
                 {[1,2,3,4].map((i) => <div key={i} className="w-full h-4 bg-slate-100 rounded-sm"></div>)}
               </div>
               <div className="grid grid-cols-2 gap-2 flex-1">
                 <div className="bg-emerald-50 rounded-lg"></div>
                 <div className="bg-indigo-50 rounded-lg"></div>
               </div>
             </div>
          </motion.div>

          {/* Floating Mobile */}
          <motion.div 
            initial={{ opacity: 0, x: 50, y: 50 }}
            whileInView={{ opacity: 1, x: 80, y: 120 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.5 }}
            className="absolute bottom-0 right-0 w-24 aspect-[9/19] bg-slate-900 rounded-[2rem] border-[4px] border-slate-800 shadow-2xl z-30 flex flex-col overflow-hidden"
          >
             <div className="flex-1 bg-slate-50 p-2 flex flex-col gap-2">
               <div className="w-12 h-1 bg-slate-200 rounded-full mx-auto mt-1 mb-2"></div>
               <div className="w-full h-12 bg-indigo-600 rounded-xl"></div>
               <div className="flex-1 bg-white rounded-xl shadow-sm border border-slate-100"></div>
               <div className="flex-1 bg-white rounded-xl shadow-sm border border-slate-100"></div>
             </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
