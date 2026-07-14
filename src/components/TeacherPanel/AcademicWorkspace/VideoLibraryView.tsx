import React, { useState } from 'react';
import { 
  Video, 
  Play, 
  Download, 
  Share2, 
  Bookmark, 
  BookmarkCheck, 
  Search, 
  ListVideo, 
  Film, 
  Tv, 
  Clock, 
  CheckCircle2, 
  Sparkles,
  Filter
} from 'lucide-react';

export const VideoLibraryView: React.FC = () => {
  const [videos, setVideos] = useState([
    {
      id: 1,
      title: 'Advanced Calculus: Limits & Continuity Masterclass',
      category: 'Recorded Lectures',
      subject: 'Advanced Mathematics',
      grade: 'Grade 10-A',
      duration: '45:20',
      views: 184,
      bookmarked: true,
      playlist: 'Calculus Fundamentals Semester 1',
      thumbnailBg: 'bg-emerald-600',
      description: 'Comprehensive lecture breaking down epsilon-delta limits and continuity criteria with graphical proofs.'
    },
    {
      id: 2,
      title: 'Geometric Intuition Behind Trigonometric Identities',
      category: 'Educational Videos',
      subject: 'Trigonometry',
      grade: 'Grade 12-A',
      duration: '28:15',
      views: 142,
      bookmarked: false,
      playlist: 'Trigonometry Mastery Series',
      thumbnailBg: 'bg-indigo-600',
      description: 'Visual demonstration of unit circle derivations for sum and difference formulas.'
    },
    {
      id: 3,
      title: 'Optimization Problems in Physics & Engineering',
      category: 'Subject Videos',
      subject: 'Advanced Mathematics',
      grade: 'Grade 11-B',
      duration: '35:40',
      views: 98,
      bookmarked: true,
      playlist: 'Calculus Applications',
      thumbnailBg: 'bg-amber-600',
      description: 'Solving real-world related rates and optimization problems step by step.'
    },
    {
      id: 4,
      title: 'Statistical Probability & Variance Explained',
      category: 'Educational Videos',
      subject: 'Applied Statistics',
      grade: 'Grade 11',
      duration: '52:10',
      views: 210,
      bookmarked: false,
      playlist: 'Statistics & Data Science',
      thumbnailBg: 'bg-rose-600',
      description: 'In-depth exploration of normal distribution, variance, and hypothesis testing.'
    }
  ]);

  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<any>(null);
  const [isPlayingModalOpen, setIsPlayingModalOpen] = useState(false);

  const categories = ['All', 'Recorded Lectures', 'Educational Videos', 'Subject Videos', 'Playlists'];

  const toggleBookmark = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setVideos(videos.map(v => v.id === id ? { ...v, bookmarked: !v.bookmarked } : v));
  };

  const handlePlayVideo = (video: any) => {
    setSelectedVideo(video);
    setIsPlayingModalOpen(true);
  };

  const handleDownload = (video: any, e: React.MouseEvent) => {
    e.stopPropagation();
    alert(`Downloading video "${video.title}" (MP4 format)...`);
  };

  const handleShare = (video: any, e: React.MouseEvent) => {
    e.stopPropagation();
    alert(`Secure video link generated for "${video.title}"! Copied to clipboard.`);
  };

  const filteredVideos = videos.filter(v => {
    const matchesCat = activeCategory === 'All' || v.category === activeCategory || (activeCategory === 'Playlists' && v.playlist);
    const matchesSearch = v.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.playlist.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-20">
      {/* Header & Controls */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Video className="w-6 h-6 text-emerald-600" />
            Video Library & Streaming Hub
          </h2>
          <p className="text-xs text-slate-500 mt-1">Browse recorded lectures, educational videos, subject playlists, play in media player, download, share, and bookmark.</p>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input 
            type="text" 
            placeholder="Search videos, playlists..." 
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
            <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 py-2 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-4 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 flex items-center gap-1.5">
                <Filter className="w-3.5 h-3.5 text-emerald-600" /> Filter Category
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

      {/* Videos Grid */}
      <div className="grid grid-cols-1 gap-6">
        {filteredVideos.length === 0 ? (
          <div className="col-span-full bg-white border border-slate-200 rounded-3xl p-16 text-center text-slate-400 text-sm">
            No videos found matching your search.
          </div>
        ) : (
          filteredVideos.map(video => (
            <div 
              key={video.id} 
              onClick={() => handlePlayVideo(video)}
              className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:shadow-md transition flex flex-col md:flex-row gap-6 cursor-pointer group"
            >
              {/* Thumbnail Container */}
              <div className={`w-full md:w-56 h-36 rounded-2xl ${video.thumbnailBg} flex flex-col justify-between p-4 text-white relative shadow-inner shrink-0 overflow-hidden`}>
                <div className="flex justify-between items-start z-10">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-black/30 backdrop-blur-sm uppercase">
                    {video.category}
                  </span>
                  <button 
                    onClick={(e) => toggleBookmark(video.id, e)}
                    className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-sm flex items-center justify-center transition"
                  >
                    {video.bookmarked ? <BookmarkCheck className="w-4 h-4 text-white" /> : <Bookmark className="w-4 h-4 text-white/80" />}
                  </button>
                </div>

                <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition">
                  <div className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-lg">
                    <Play className="w-5 h-5 fill-current ml-0.5" />
                  </div>
                </div>

                <div className="z-10 flex justify-between items-center text-xs font-semibold bg-black/30 backdrop-blur-sm px-2.5 py-1 rounded-lg">
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {video.duration}</span>
                  <span>{video.views} views</span>
                </div>
              </div>

              {/* Details & Actions */}
              <div className="flex flex-col justify-between flex-1 space-y-3">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 uppercase">
                      {video.subject}
                    </span>
                    <span className="text-xs text-slate-500 font-medium">{video.grade}</span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-600 transition leading-snug">
                    {video.title}
                  </h3>

                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {video.description}
                  </p>

                  <p className="text-[11px] font-semibold text-indigo-600 flex items-center gap-1 pt-1">
                    <ListVideo className="w-3.5 h-3.5" /> Playlist: {video.playlist}
                  </p>
                </div>

                {/* Actions */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <button 
                    onClick={(e) => { e.stopPropagation(); handlePlayVideo(video); }}
                    className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold transition flex items-center gap-1 shadow-sm"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" /> Play Video
                  </button>

                  <div className="flex items-center gap-1">
                    <button 
                      onClick={(e) => handleDownload(video, e)} 
                      className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition"
                      title="Download Video"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={(e) => handleShare(video, e)} 
                      className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition"
                      title="Share Link"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Video Player Modal */}
      {isPlayingModalOpen && selectedVideo && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 uppercase">
                  {selectedVideo.category} • {selectedVideo.subject}
                </span>
                <h3 className="text-xl font-bold text-slate-900 mt-1">{selectedVideo.title}</h3>
              </div>
              <button onClick={() => setIsPlayingModalOpen(false)} className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold">✕</button>
            </div>

            <div className="space-y-4 text-xs">
              {/* Simulated Video Player Screen */}
              <div className={`w-full h-64 rounded-2xl ${selectedVideo.thumbnailBg} flex flex-col items-center justify-center text-white shadow-lg relative`}>
                <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center shadow-xl cursor-pointer hover:scale-105 transition">
                  <Play className="w-8 h-8 fill-current ml-1" />
                </div>
                <p className="mt-4 font-bold text-sm tracking-wide">Streaming: {selectedVideo.title}</p>
                <div className="absolute bottom-4 left-4 right-4 bg-black/40 backdrop-blur-md p-3 rounded-xl flex items-center justify-between">
                  <span>00:00 / {selectedVideo.duration}</span>
                  <div className="w-48 bg-white/30 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-emerald-400 w-1/3 h-full rounded-full"></div>
                  </div>
                  <span>HD 1080p</span>
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1">
                <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">Description</span>
                <p className="text-slate-700 leading-relaxed">{selectedVideo.description}</p>
              </div>
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-slate-100">
              <button 
                onClick={(e) => handleDownload(selectedVideo, e)}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold flex items-center gap-1.5"
              >
                <Download className="w-4 h-4" /> Download MP4
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
