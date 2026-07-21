import React from 'react';
import { Play, Download, ChevronRight, CheckCircle2, IndianRupee, Globe, BookOpen, Clock } from 'lucide-react';
import { motion } from 'motion/react';

// --- Video Center ---
export const DocsVideoCenter: React.FC<{ videos: any[] }> = ({ videos }) => (
  <div className="space-y-10">
    <div className="flex items-center justify-between">
      <h2 className="text-3xl font-black text-slate-900 tracking-tight">Video Learning Center</h2>
      <button className="text-sm font-black text-indigo-600 hover:text-indigo-700 uppercase tracking-widest flex items-center gap-2 transition-colors">
        View All Tutorials <ChevronRight className="w-4 h-4" />
      </button>
    </div>
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {videos.map((video) => (
        <motion.div 
          key={video.id}
          whileHover={{ y: -5 }}
          className="group bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all overflow-hidden"
        >
          <div className="aspect-video relative overflow-hidden">
            <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
            <div className="absolute inset-0 bg-slate-900/20 group-hover:bg-slate-900/40 transition-colors" />
            <div className="absolute bottom-4 right-4 px-2 py-1 bg-slate-900/80 backdrop-blur text-[10px] font-black text-white rounded">
              {video.duration}
            </div>
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="w-12 h-12 rounded-full bg-white text-slate-900 flex items-center justify-center shadow-2xl scale-90 group-hover:scale-100 transition-transform">
                <Play className="w-5 h-5 fill-current" />
              </div>
            </div>
          </div>
          <div className="p-6">
            <h3 className="font-black text-slate-900 mb-4">{video.title}</h3>
            <button className="w-full py-3 bg-slate-50 text-slate-900 rounded-xl font-bold text-xs hover:bg-slate-100 transition-colors flex items-center justify-center gap-2">
              Watch Tutorial <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </motion.div>
      ))}
    </div>
  </div>
);

// --- Downloads ---
export const DocsDownloads: React.FC = () => {
  const manuals = [
    { name: 'User Manual', type: 'PDF', size: '2.4 MB' },
    { name: 'Admin Guide', type: 'PDF', size: '4.8 MB' },
    { name: 'Teacher Guide', type: 'DOCX', size: '1.2 MB' },
    { name: 'Parent Guide', type: 'PDF', size: '3.1 MB' }
  ];

  return (
    <div className="space-y-10">
      <h2 className="text-3xl font-black text-slate-900 tracking-tight text-center">Download Center</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {manuals.map((manual, idx) => (
          <div key={idx} className="p-6 bg-slate-50 border border-slate-100 rounded-[2rem] hover:bg-white hover:shadow-xl transition-all group">
            <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-slate-400 group-hover:text-indigo-600 group-hover:scale-110 transition-all shadow-sm mb-6">
              <Download className="w-6 h-6" />
            </div>
            <h3 className="font-black text-slate-900 mb-1">{manual.name}</h3>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">{manual.type} • {manual.size}</p>
            <button className="w-full py-3 bg-white text-slate-900 rounded-xl font-bold text-xs border border-slate-100 hover:border-indigo-100 hover:text-indigo-600 transition-all">
              Download
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- Release Notes ---
export const DocsReleaseNotes: React.FC<{ releases: any[] }> = ({ releases }) => (
  <div className="space-y-12">
    <div className="text-center space-y-4">
      <h2 className="text-4xl font-black text-slate-900 tracking-tight">Release Notes</h2>
      <p className="text-slate-500 font-medium">Keep track of the latest updates and improvements.</p>
    </div>
    <div className="max-w-3xl mx-auto space-y-12 relative before:absolute before:left-[19px] before:top-2 before:bottom-2 before:w-px before:bg-slate-100">
      {releases.map((release, idx) => (
        <div key={idx} className="relative pl-16">
          <div className="absolute left-0 top-0 w-10 h-10 rounded-full bg-white border border-slate-100 flex items-center justify-center shadow-sm">
            <div className="w-2.5 h-2.5 rounded-full bg-indigo-600" />
          </div>
          <div className="bg-white p-8 border border-slate-100 rounded-[2.5rem] shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-6">
              <div>
                <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black uppercase tracking-widest mb-2 inline-block">
                  {release.version}
                </span>
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">{release.type} Update</h3>
              </div>
              <span className="text-sm font-bold text-slate-400 flex items-center gap-2">
                <Clock className="w-4 h-4" />
                {release.date}
              </span>
            </div>
            <div className="space-y-6">
              <div className="space-y-3">
                <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">New Features</h4>
                <div className="space-y-2">
                  {release.features.map((f: any, i: number) => (
                    <div key={i} className="flex items-center gap-3 text-sm font-medium text-slate-700">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      {f}
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-3">
                <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">Bug Fixes</h4>
                <div className="space-y-2">
                  {release.fixes.map((f: any, i: number) => (
                    <div key={i} className="flex items-center gap-3 text-sm font-medium text-slate-600">
                      <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                      {f}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);
