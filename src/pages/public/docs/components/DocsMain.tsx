import React from 'react';
import { Clock, Calendar, CheckCircle2, AlertTriangle, ExternalLink, Play, FileText, Download } from 'lucide-react';
import { motion } from 'motion/react';

interface DocsMainProps {
  article: any;
}

export const DocsMain: React.FC<DocsMainProps> = ({ article }) => {
  if (!article) {
    return (
      <div className="flex-1 p-8 lg:p-16 flex items-center justify-center text-slate-400">
        <div className="text-center space-y-4">
          <FileText className="w-16 h-16 mx-auto opacity-20" />
          <p className="font-bold text-lg">Select an article to start reading</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-8 lg:p-16 max-w-4xl mx-auto w-full">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        key={article.id}
        className="space-y-12"
      >
        {/* Article Meta */}
        <div className="space-y-6">
          <div className="flex flex-wrap items-center gap-4 text-xs font-black uppercase tracking-widest text-slate-400">
            <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-50 rounded-full">
              <Clock className="w-3.5 h-3.5" />
              {article.readingTime}
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-50 rounded-full">
              <Calendar className="w-3.5 h-3.5" />
              Updated {article.lastUpdated}
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full">
              v{article.version}
            </div>
          </div>
          
          <h1 className="text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            {article.title}
          </h1>
          <p className="text-xl text-slate-500 font-medium leading-relaxed">
            {article.description}
          </p>
        </div>

        {/* Article Content - Mocked with rich UI blocks */}
        <div className="prose prose-slate max-w-none space-y-8">
          <div className="p-8 bg-slate-900 rounded-[2rem] text-white overflow-hidden relative group">
             <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-[100px] -mr-32 -mt-32" />
             <div className="relative flex items-center justify-between">
                <div>
                   <h4 className="text-indigo-400 text-xs font-black uppercase tracking-widest mb-2">Video Tutorial</h4>
                   <p className="font-bold text-lg">Watch how to set up your school in 5 minutes</p>
                </div>
                <button className="w-16 h-16 rounded-full bg-white flex items-center justify-center text-slate-900 hover:scale-110 transition-transform shadow-xl">
                   <Play className="w-6 h-6 fill-current" />
                </button>
             </div>
          </div>

          <div className="space-y-4">
             <h2 className="text-2xl font-black text-slate-900 tracking-tight">Prerequisites</h2>
             <div className="grid sm:grid-cols-2 gap-4">
                {['Valid School License', 'UDISE+ Certificate', 'Principal Details', 'Staff Records'].map((item, i) => (
                   <div key={i} className="flex items-center gap-3 p-4 bg-emerald-50/50 border border-emerald-100 rounded-2xl">
                      <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                      <span className="font-bold text-sm text-slate-700">{item}</span>
                   </div>
                ))}
             </div>
          </div>

          <div className="p-6 bg-amber-50 border border-amber-100 rounded-2xl flex gap-4">
             <AlertTriangle className="w-6 h-6 text-amber-500 shrink-0" />
             <div>
                <p className="text-sm font-black text-amber-900 mb-1 uppercase tracking-widest">Important Warning</p>
                <p className="text-sm text-amber-800 font-medium leading-relaxed">
                   Once a school is registered, the primary owner email cannot be changed without enterprise support verification.
                </p>
             </div>
          </div>

          <div className="bg-slate-50 border border-slate-100 rounded-3xl p-8 space-y-4">
             <h3 className="text-xl font-black text-slate-900">Step 1: Account Activation</h3>
             <p className="text-slate-600 font-medium leading-relaxed">
                Log in to your GALAXY ERP portal using the credentials sent to your registered email. Navigate to the "Institution Hub" from the sidebar.
             </p>
             <div className="relative bg-slate-900 rounded-xl p-6 font-mono text-xs text-indigo-300 leading-relaxed overflow-x-auto shadow-xl">
                <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-4">
                   <span className="text-slate-500 font-bold uppercase tracking-widest">galaxy-erp --setup</span>
                   <button className="text-slate-500 hover:text-white transition-colors">Copy</button>
                </div>
                <code>
                   {`$ npx galaxy-erp init school\n[INFO] Validating credentials...\n[INFO] Provisioning dedicated cloud node...\n[SUCCESS] Node active at school-node-123.galaxy-erp.com`}
                </code>
             </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="pt-16 border-t border-slate-100 flex flex-wrap items-center justify-between gap-8">
           <div className="flex items-center gap-4">
              <span className="text-sm font-black text-slate-400 uppercase tracking-widest">Was this helpful?</span>
              <div className="flex items-center gap-2">
                 <button className="px-4 py-2 bg-slate-50 hover:bg-emerald-50 hover:text-emerald-600 rounded-lg text-sm font-bold transition-all border border-slate-100 hover:border-emerald-100">Yes</button>
                 <button className="px-4 py-2 bg-slate-50 hover:bg-rose-50 hover:text-rose-600 rounded-lg text-sm font-bold transition-all border border-slate-100 hover:border-rose-100">No</button>
              </div>
           </div>
           
           <div className="flex items-center gap-4">
              <button className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-indigo-600 transition-colors">
                 <Download className="w-4 h-4" />
                 Download PDF
              </button>
              <button className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-indigo-600 transition-colors">
                 <ExternalLink className="w-4 h-4" />
                 View on GitHub
              </button>
           </div>
        </div>
      </motion.div>
    </div>
  );
};
