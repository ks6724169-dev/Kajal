import React, { useState } from 'react';
import { 
  FolderKanban, 
  Plus, 
  Trash2, 
  Search, 
  Upload, 
  Download, 
  Share2, 
  FileText, 
  FileSpreadsheet, 
  Layers, 
  CheckCircle2, 
  Sparkles,
  Presentation,
  CheckSquare,
  Filter
} from 'lucide-react';

export const ClassroomResourcesView: React.FC = () => {
  const [resources, setResources] = useState([
    {
      id: 1,
      title: 'Interactive Geometric Proof Teaching Aid Kit',
      category: 'Teaching Aids',
      fileType: 'pdf',
      grade: 'Grade 10-A',
      size: '8.4 MB',
      uploadDate: 'July 10, 2026',
      downloads: 45,
      description: 'Physical and digital classroom demonstration models for angle chasing and circle theorems.'
    },
    {
      id: 2,
      title: 'Calculus Limit Evaluation Practice Worksheet',
      category: 'Worksheets',
      fileType: 'doc',
      grade: 'Grade 10-A',
      size: '2.1 MB',
      uploadDate: 'July 08, 2026',
      downloads: 62,
      description: 'Printable 20-question practice worksheet covering indeterminate forms and L’Hôpital’s rule.'
    },
    {
      id: 3,
      title: 'Smart Board Interactive Derivative Slides (.notebook)',
      category: 'Smart Board Files',
      fileType: 'notebook',
      grade: 'Grade 12-A',
      size: '18.5 MB',
      uploadDate: 'July 05, 2026',
      downloads: 38,
      description: 'Smart Notebook interactive lesson file with draggable tangent lines and live curve generators.'
    },
    {
      id: 4,
      title: 'Trigonometric Unit Circle GeoGebra Applet',
      category: 'Interactive Content',
      fileType: 'link',
      grade: 'Grade 12-A',
      size: 'Web Link',
      uploadDate: 'July 02, 2026',
      downloads: 50,
      description: 'Interactive HTML5 simulation demonstrating sine wave generation from unit circle coordinates.'
    },
    {
      id: 5,
      title: 'Standard Lesson Plan & Rubric Template',
      category: 'Templates',
      fileType: 'docx',
      grade: 'All Grades',
      size: '1.2 MB',
      uploadDate: 'June 28, 2026',
      downloads: 75,
      description: 'Standardized institutional lesson plan template adhering to curriculum standards.'
    }
  ]);

  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  // Form states
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Teaching Aids');
  const [grade, setGrade] = useState('Grade 10-A');
  const [description, setDescription] = useState('');
  const [fileName, setFileName] = useState('Resource_File.pdf');

  const categories = ['All', 'Teaching Aids', 'Worksheets', 'Smart Board Files', 'Interactive Content', 'Templates'];

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newRes = {
      id: Date.now(),
      title,
      category,
      fileType: category === 'Smart Board Files' ? 'notebook' : category === 'Worksheets' ? 'doc' : 'pdf',
      grade,
      size: '3.5 MB',
      uploadDate: new Date().toLocaleDateString(),
      downloads: 0,
      description: description || 'Classroom resource file.'
    };

    setResources([newRes, ...resources]);
    setTitle('');
    setDescription('');
    setIsUploadModalOpen(false);
    alert('Classroom resource uploaded successfully.');
  };

  const handleDelete = (id: number) => {
    setResources(resources.filter(r => r.id !== id));
  };

  const handleDownload = (res: any) => {
    alert(`Downloading ${res.title}...`);
  };

  const handleShare = (res: any) => {
    alert(`Secure share link generated for ${res.title}! Copied to clipboard.`);
  };

  const filteredResources = resources.filter(r => {
    const matchesCat = activeCategory === 'All' || r.category === activeCategory;
    const matchesSearch = r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.grade.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-20">
      {/* Header & Controls */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <FolderKanban className="w-6 h-6 text-emerald-600" />
            Classroom Resources & Pedagogical Aids
          </h2>
          <p className="text-xs text-slate-500 mt-1">Manage teaching aids, worksheets, smart board files, interactive content, and templates with upload, download, share, and delete actions.</p>
        </div>

        <button 
          onClick={() => setIsUploadModalOpen(true)}
          className="px-4 py-2.5 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 transition flex items-center gap-2 shadow-sm whitespace-nowrap"
        >
          <Upload className="w-4 h-4" /> Upload Resource
        </button>
      </div>

      {/* Search and Filters Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input 
            type="text" 
            placeholder="Search classroom resources..." 
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

      {/* Resources Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredResources.length === 0 ? (
          <div className="col-span-full bg-white border border-slate-200 rounded-3xl p-16 text-center text-slate-400 text-sm">
            No classroom resources found matching your search.
          </div>
        ) : (
          filteredResources.map(res => (
            <div key={res.id} className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:shadow-md transition flex flex-col justify-between group space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 uppercase tracking-wider border border-emerald-200">
                    {res.category}
                  </span>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
                    {res.grade}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-600 transition leading-snug">
                  {res.title}
                </h3>

                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {res.description}
                </p>

                <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
                  <span>Size: <b>{res.size}</b></span>
                  <span>Downloads: <b>{res.downloads}</b></span>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5">
                  <button 
                    onClick={() => handleDownload(res)}
                    className="px-3.5 py-1.5 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-700 rounded-xl font-bold transition flex items-center gap-1"
                  >
                    <Download className="w-3.5 h-3.5" /> Download
                  </button>
                  <button 
                    onClick={() => handleShare(res)}
                    className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition"
                    title="Share"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>

                <button 
                  onClick={() => handleDelete(res.id)}
                  className="p-2 text-slate-400 hover:text-rose-600 transition rounded-xl"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Upload Resource Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-2xl space-y-6">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900">Upload Classroom Resource</h3>
              <button onClick={() => setIsUploadModalOpen(false)} className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold">✕</button>
            </div>

            <form onSubmit={handleUpload} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Resource Title</label>
                <input 
                  type="text" 
                  value={title} 
                  onChange={(e) => setTitle(e.target.value)} 
                  placeholder="e.g. Chapter 4 Visual Teaching Aid" 
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Category</label>
                  <select 
                    value={category} 
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl bg-white"
                  >
                    <option value="Teaching Aids">Teaching Aids</option>
                    <option value="Worksheets">Worksheets</option>
                    <option value="Smart Board Files">Smart Board Files</option>
                    <option value="Interactive Content">Interactive Content</option>
                    <option value="Templates">Templates</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Grade Class</label>
                  <input 
                    type="text" 
                    value={grade} 
                    onChange={(e) => setGrade(e.target.value)} 
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">File Name</label>
                <input 
                  type="text" 
                  value={fileName} 
                  onChange={(e) => setFileName(e.target.value)} 
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Description</label>
                <textarea 
                  rows={3} 
                  value={description} 
                  onChange={(e) => setDescription(e.target.value)} 
                  placeholder="Provide brief resource summary..." 
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl resize-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button type="button" onClick={() => setIsUploadModalOpen(false)} className="px-4 py-2.5 bg-slate-100 text-slate-700 rounded-xl font-bold">Cancel</button>
                <button type="submit" className="px-5 py-2.5 bg-emerald-600 text-white rounded-xl font-bold shadow-sm">Upload Resource</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
