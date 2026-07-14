import React, { useState } from 'react';
import { 
  BookMarked, 
  Search, 
  Bookmark, 
  BookmarkCheck, 
  Download, 
  Share2, 
  BookOpen, 
  FileText, 
  ChevronRight, 
  Star, 
  CheckCircle2, 
  Layers,
  Filter
} from 'lucide-react';

export const EBookLibraryView: React.FC = () => {
  const [books, setBooks] = useState([
    {
      id: 1,
      title: 'Advanced Engineering Calculus & Analysis',
      category: 'Mathematics',
      author: 'Dr. Robert Sterling',
      grade: 'Grade 10 - 12',
      pages: 450,
      coverColor: 'bg-emerald-600',
      progress: 75,
      bookmarked: true,
      chapters: [
        { title: 'Chapter 1: Limits & Infinite Series', pages: '1 - 65', progress: 100 },
        { title: 'Chapter 2: Differential Calculus Foundations', pages: '66 - 150', progress: 100 },
        { title: 'Chapter 3: Integral Calculus Applications', pages: '151 - 280', progress: 60 },
        { title: 'Chapter 4: Multivariable Vector Spaces', pages: '281 - 450', progress: 15 },
      ],
      description: 'Comprehensive textbook on single and multivariable calculus with rigorous proofs and problem sets.'
    },
    {
      id: 2,
      title: 'Mastering Trigonometry & Analytical Geometry',
      category: 'Mathematics',
      author: 'Prof. Helen Vance',
      grade: 'Grade 11 - 12',
      pages: 320,
      coverColor: 'bg-indigo-600',
      progress: 40,
      bookmarked: false,
      chapters: [
        { title: 'Chapter 1: Unit Circle & Trigonometric Functions', pages: '1 - 80', progress: 100 },
        { title: 'Chapter 2: Identities and Equations', pages: '81 - 170', progress: 50 },
        { title: 'Chapter 3: Conic Sections in Polar Coordinates', pages: '171 - 320', progress: 0 },
      ],
      description: 'In-depth exploration of trigonometric identities, complex numbers, and polar graphing.'
    },
    {
      id: 3,
      title: 'Applied Statistics & Probability Modeling',
      category: 'Statistics',
      author: 'Dr. Alan Turing',
      grade: 'Grade 11',
      pages: 280,
      coverColor: 'bg-amber-600',
      progress: 20,
      bookmarked: true,
      chapters: [
        { title: 'Chapter 1: Descriptive Statistics & Variance', pages: '1 - 70', progress: 100 },
        { title: 'Chapter 2: Probability Distributions', pages: '71 - 160', progress: 0 },
        { title: 'Chapter 3: Hypothesis Testing & ANOVA', pages: '161 - 280', progress: 0 },
      ],
      description: 'Practical guide to statistical inference, regression analysis, and probabilistic forecasting.'
    },
    {
      id: 4,
      title: 'Physics Mechanics: Kinematics & Dynamics',
      category: 'Science',
      author: 'Dr. Isaac Newton Jr.',
      grade: 'Grade 10',
      pages: 390,
      coverColor: 'bg-rose-600',
      progress: 90,
      bookmarked: false,
      chapters: [
        { title: 'Chapter 1: Newton Laws of Motion', pages: '1 - 120', progress: 100 },
        { title: 'Chapter 2: Work, Energy & Power', pages: '121 - 250', progress: 100 },
        { title: 'Chapter 3: Rotational Dynamics & Momentum', pages: '251 - 390', progress: 70 },
      ],
      description: 'Fundamental mechanics textbook with real-world physics lab experiments and calculations.'
    }
  ]);

  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedBook, setSelectedBook] = useState<any>(null);
  const [isReaderModalOpen, setIsReaderModalOpen] = useState(false);

  const categories = ['All', 'Mathematics', 'Statistics', 'Science'];

  const toggleBookmark = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setBooks(books.map(b => b.id === id ? { ...b, bookmarked: !b.bookmarked } : b));
  };

  const handleOpenBook = (book: any) => {
    setSelectedBook(book);
    setIsReaderModalOpen(true);
  };

  const handleDownload = (book: any, e: React.MouseEvent) => {
    e.stopPropagation();
    alert(`Downloading "${book.title}" (PDF format)...`);
  };

  const handleShare = (book: any, e: React.MouseEvent) => {
    e.stopPropagation();
    alert(`Secure share link generated for "${book.title}"! Copied to clipboard.`);
  };

  const filteredBooks = books.filter(b => {
    const matchesCat = activeCategory === 'All' || b.category === activeCategory;
    const matchesSearch = b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-20">
      {/* Header & Controls */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <BookMarked className="w-6 h-6 text-emerald-600" />
            eBook Library & Digital Reader Hub
          </h2>
          <p className="text-xs text-slate-500 mt-1">Explore digital books, browse chapters by categories, track reading progress, bookmark favorites, open in reader, and download or share.</p>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input 
            type="text" 
            placeholder="Search books, authors..." 
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

      {/* Books Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredBooks.length === 0 ? (
          <div className="col-span-full bg-white border border-slate-200 rounded-3xl p-16 text-center text-slate-400 text-sm">
            No eBooks found matching your search.
          </div>
        ) : (
          filteredBooks.map(book => (
            <div 
              key={book.id} 
              onClick={() => handleOpenBook(book)}
              className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between group cursor-pointer space-y-4"
            >
              <div className="space-y-3">
                {/* Book Cover Banner */}
                <div className={`h-40 rounded-2xl ${book.coverColor} p-4 flex flex-col justify-between text-white relative shadow-inner`}>
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-black/20 backdrop-blur-sm uppercase">
                      {book.category}
                    </span>
                    <button 
                      onClick={(e) => toggleBookmark(book.id, e)}
                      className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-sm flex items-center justify-center transition"
                    >
                      {book.bookmarked ? <BookmarkCheck className="w-4 h-4 text-white" /> : <Bookmark className="w-4 h-4 text-white/80" />}
                    </button>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold leading-snug line-clamp-2">{book.title}</h3>
                    <p className="text-[11px] text-white/80 mt-1">{book.author}</p>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="space-y-1">
                  <div className="flex justify-between items-center text-[11px] font-semibold text-slate-500">
                    <span>Reading Progress</span>
                    <span className="text-emerald-700 font-bold">{book.progress}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden border border-slate-200">
                    <div className="bg-emerald-600 h-full rounded-full transition-all duration-500" style={{ width: `${book.progress}%` }}></div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <button 
                  onClick={(e) => { e.stopPropagation(); handleOpenBook(book); }}
                  className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-xl font-bold transition flex items-center gap-1"
                >
                  <BookOpen className="w-3.5 h-3.5" /> Open Reader
                </button>
                <div className="flex items-center gap-1">
                  <button 
                    onClick={(e) => handleDownload(book, e)} 
                    className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition"
                    title="Download Book"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>
                  <button 
                    onClick={(e) => handleShare(book, e)} 
                    className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition"
                    title="Share Book"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Reader & Chapters Modal */}
      {isReaderModalOpen && selectedBook && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 uppercase">
                  {selectedBook.category} • {selectedBook.grade}
                </span>
                <h3 className="text-xl font-bold text-slate-900 mt-1">{selectedBook.title}</h3>
                <p className="text-xs text-slate-500">Author: {selectedBook.author} • {selectedBook.pages} Pages</p>
              </div>
              <button onClick={() => setIsReaderModalOpen(false)} className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold">✕</button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">Overview</span>
                <p className="text-slate-700 leading-relaxed">{selectedBook.description}</p>
              </div>

              <div className="space-y-3">
                <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">Table of Chapters & Progress</h4>
                {selectedBook.chapters.map((ch: any, cidx: number) => (
                  <div key={cidx} className="bg-white border border-slate-200 p-4 rounded-2xl flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="font-bold text-slate-900 text-sm flex items-center gap-2">
                        <FileText className="w-4 h-4 text-emerald-600" /> {ch.title}
                      </p>
                      <p className="text-slate-400">Pages: {ch.pages}</p>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className={`px-2.5 py-1 rounded-lg font-semibold ${ch.progress === 100 ? 'bg-emerald-50 text-emerald-700' : ch.progress > 0 ? 'bg-indigo-50 text-indigo-700' : 'bg-slate-100 text-slate-600'}`}>
                        {ch.progress === 100 ? 'Completed' : `${ch.progress}%`}
                      </span>
                      <button 
                        onClick={() => alert(`Opening chapter reader for ${ch.title}...`)}
                        className="px-3.5 py-1.5 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition"
                      >
                        Read
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-slate-100">
              <button 
                onClick={(e) => handleDownload(selectedBook, e)}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold flex items-center gap-1.5"
              >
                <Download className="w-4 h-4" /> Download eBook
              </button>
              <button 
                onClick={() => setIsReaderModalOpen(false)}
                className="px-5 py-2.5 bg-emerald-600 text-white rounded-xl font-bold shadow-sm"
              >
                Close Reader
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
