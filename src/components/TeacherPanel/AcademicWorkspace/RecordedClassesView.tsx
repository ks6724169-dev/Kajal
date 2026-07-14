import React, { useState } from 'react';
import { 
  Video, 
  Play, 
  Download, 
  Trash2, 
  Share2, 
  Search, 
  Calendar, 
  Clock, 
  HardDrive, 
  CheckCircle2, 
  Film,
  Filter
} from 'lucide-react';

export const RecordedClassesView: React.FC = () => {
  const [recordings, setRecordings] = useState([
    {
      id: 1,
      title: 'Advanced Calculus Lecture: Epsilon-Delta Limits',
      subject: 'Advanced Mathematics',
      grade: 'Grade 10-A',
      date: 'July 10, 2026',
      duration: '58:45',
      fileSize: '450.2 MB',
      thumbnailBg: 'bg-emerald-600'
    },
    {
      id: 2,
      title: 'Trigonometric Identities & Unit Circle Derivations',
      subject: 'Trigonometry',
      grade: 'Grade 12-A',
      date: 'July 08, 2026',
      duration: '45:10',
      fileSize: '320.5 MB',
      thumbnailBg: 'bg-indigo-600'
    },
    {
      id: 3,
      title: 'Applied Statistics & Variance Problem Solving',
      subject: 'Applied Statistics',
      grade: 'Grade 11-B',
      date: 'July 05, 2026',
      duration: '52:30',
      fileSize: '385.0 MB',
      thumbnailBg: 'bg-amber-600'
    },
    {
      id: 4,
      title: 'Calculus Optimization & Related Rates Workshop',
      subject: 'Advanced Mathematics',
      grade: 'Grade 10-A',
      date: 'July 01, 2026',
      duration: '01:05:12',
      fileSize: '510.8 MB',
      thumbnailBg: 'bg-rose-600'
    }
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedRecording, setSelectedRecording] = useState<any>(null);
  const [isPlayingModalOpen, setIsPlayingModalOpen] = useState(false);

  const categories = ['All', 'Advanced Mathematics', 'Trigonometry', 'Applied Statistics'];

  const handleDelete = (id: number) => {
    setRecordings(recordings.filter(r => r.id !== id));
  };

  const handlePlay = (rec: any) => {
    setSelectedRecording(rec);
    setIsPlayingModalOpen(true);
  };

  const handleDownload = (rec: any) => {
    alert(`Downloading recording "${rec.title}" (${rec.fileSize})...`);
  };

  const handleShare = (rec: any) => {
    alert(`Secure sharing link generated for "${rec.title}"! Copied to clipboard.`);
  };

  const filteredRecordings = recordings.filter(r => {
    const matchesSearch = r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.grade.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = activeCategory === 'All' || r.subject === activeCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-20">
      {/* Header & Controls */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Film className="w-6 h-6 text-emerald-600" />
            Recorded Classes & Cloud Archives Hub
          </h2>
          <p className="text-xs text-slate-500 mt-1">Access recorded class sessions, review subjects, dates, durations, file sizes, play video playback, download, share, and delete.</p>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input 
            type="text" 
            placeholder="Search recordings, subjects..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div className="relative">
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition flex items-center gap-2 shadow-sm"
          >
            <span className="text-sm">❄️</span>
            <span>Filter {activeCategory !== 'All' ? `(${activeCategory})` : ''}</span>
          </button>

          {showFilters && (
            <div className="absolute right-0 mt-2 w-64 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 py-2 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-4 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 flex items-center gap-1.5">
                <Filter className="w-3.5 h-3.5 text-emerald-600" /> Filter Subject
              </div>
              <div className="max-h-60 overflow-y-auto py-1">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => {
                      setActiveCategory(cat);
                      setShowFilters(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-xs font-medium transition flex items-center justify-between ${activeCategory === cat ? 'bg-emerald-50 text-emerald-700 font-bold' : 'text-slate-700 hover:bg-slate-50'}`}
                  >
                    <span>{cat}</span>
                    {activeCategory === cat && <span className="text-emerald-600 font-bold">✓</span>}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Recordings Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredRecordings.length === 0 ? (
          <div className="col-span-full bg-white border border-slate-200 rounded-3xl p-16 text-center text-slate-400 text-sm">
            No recorded classes found matching your search.
          </div>
        ) : (
          filteredRecordings.map(rec => (
            <div key={rec.id} className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:shadow-md transition flex flex-col justify-between group space-y-5">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 uppercase tracking-wider border border-emerald-200">
                    {rec.subject}
                  </span>
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                    {rec.grade}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-600 transition leading-snug">
                  {rec.title}
                </h3>

                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
                  <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5 text-slate-400" /> {rec.date}</span>
                  <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-slate-400" /> {rec.duration}</span>
                  <span className="flex items-center gap-1"><HardDrive className="w-3.5 h-3.5 text-slate-400" /> {rec.fileSize}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <button 
                  onClick={() => handlePlay(rec)}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
                  title="Play Recording"
                >
                  <Play className="w-3.5 h-3.5 fill-current" /> Play Recording
                </button>
                <div className="flex items-center gap-1.5">
                  <button 
                    onClick={() => handleDownload(rec)}
                    className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition"
                    title="Download Recording"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => handleShare(rec)}
                    className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition"
                    title="Share Recording"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => handleDelete(rec.id)}
                    className="p-2.5 bg-slate-100 hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition rounded-xl"
                    title="Delete Recording"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Video Player Modal */}
      {isPlayingModalOpen && selectedRecording && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl space-y-6">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 uppercase">
                  {selectedRecording.subject} • {selectedRecording.grade}
                </span>
                <h3 className="text-xl font-bold text-slate-900 mt-1">{selectedRecording.title}</h3>
              </div>
              <button onClick={() => setIsPlayingModalOpen(false)} className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold">✕</button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="w-full h-64 bg-slate-900 rounded-2xl flex flex-col items-center justify-center text-white relative shadow-lg">
                <div className="w-16 h-16 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-xl cursor-pointer hover:scale-105 transition">
                  <Play className="w-8 h-8 fill-current ml-1" />
                </div>
                <p className="mt-4 font-bold text-sm tracking-wide">Playing Cloud Archive: {selectedRecording.title}</p>
                <div className="absolute bottom-4 left-4 right-4 bg-black/40 backdrop-blur-md p-3 rounded-xl flex items-center justify-between text-slate-200">
                  <span>00:00 / {selectedRecording.duration}</span>
                  <div className="w-48 bg-white/30 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-emerald-400 w-1/4 h-full rounded-full"></div>
                  </div>
                  <span>{selectedRecording.fileSize}</span>
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-slate-100">
              <button 
                onClick={() => handleDownload(selectedRecording)}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold flex items-center gap-1.5"
              >
                <Download className="w-4 h-4" /> Download File
              </button>
              <button 
                onClick={() => setIsPlayingModalOpen(false)}
                className="px-5 py-2.5 bg-emerald-600 text-white rounded-xl font-bold shadow-sm"
              >
                Close Player
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
