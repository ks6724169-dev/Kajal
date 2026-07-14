import React, { useState } from 'react';
import { 
  BookOpen, 
  Plus, 
  Trash2, 
  Search, 
  FileText, 
  FileCode, 
  FileSpreadsheet, 
  Image as ImageIcon, 
  FileAudio, 
  Video, 
  Link as LinkIcon, 
  Download, 
  Share2, 
  Eye, 
  Upload, 
  Filter,
  CheckCircle2,
  FolderOpen,
  FileCheck
} from 'lucide-react';

export const StudyMaterialView: React.FC = () => {
  const [materials, setMaterials] = useState([
    {
      id: 1,
      title: 'Chapter 4 Comprehensive Lecture Notes',
      category: 'Notes',
      fileType: 'pdf',
      subject: 'Advanced Mathematics',
      grade: 'Grade 10-A',
      size: '4.2 MB',
      uploadDate: 'July 10, 2026',
      downloads: 42,
      description: 'Detailed epsilon-delta proofs and limit evaluation rules.'
    },
    {
      id: 2,
      title: 'Differential Calculus Presentation Slides',
      category: 'PPTs',
      fileType: 'ppt',
      subject: 'Advanced Mathematics',
      grade: 'Grade 10-A',
      size: '12.8 MB',
      uploadDate: 'July 08, 2026',
      downloads: 38,
      description: 'Powerpoint slide deck covering derivative rules and optimization.'
    },
    {
      id: 3,
      title: 'Trigonometric Identities Formula Sheet',
      category: 'Word Files',
      fileType: 'doc',
      subject: 'Trigonometry',
      grade: 'Grade 12-A',
      size: '1.5 MB',
      uploadDate: 'July 05, 2026',
      downloads: 35,
      description: 'Complete reference guide for sum/difference and double-angle formulas.'
    },
    {
      id: 4,
      title: 'Unit Circle Geometric Diagram',
      category: 'Images',
      fileType: 'image',
      subject: 'Trigonometry',
      grade: 'Grade 12-A',
      size: '3.1 MB',
      uploadDate: 'July 02, 2026',
      downloads: 29,
      description: 'High-resolution diagram illustrating radian measures and coordinate points.'
    },
    {
      id: 5,
      title: 'Podcast: Real World Calculus Applications',
      category: 'Audio',
      fileType: 'audio',
      subject: 'Advanced Mathematics',
      grade: 'Grade 10-A',
      size: '24.5 MB',
      uploadDate: 'June 28, 2026',
      downloads: 45,
      description: 'Audio discussion explaining rates of change in physics and finance.'
    },
    {
      id: 6,
      title: 'Video Lecture: Chain Rule Made Easy',
      category: 'Videos',
      fileType: 'video',
      subject: 'Advanced Mathematics',
      grade: 'Grade 10-A',
      size: '150.0 MB',
      uploadDate: 'June 25, 2026',
      downloads: 52,
      description: 'Step-by-step video demonstration of composite function differentiation.'
    },
    {
      id: 7,
      title: 'Interactive GeoGebra Limits Simulation',
      category: 'External Links',
      fileType: 'link',
      subject: 'Advanced Mathematics',
      grade: 'Grade 10-A',
      size: 'Web Link',
      uploadDate: 'June 20, 2026',
      downloads: 60,
      description: 'Online interactive sandbox for visualizing limit convergence.'
    }
  ]);

  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState<any>(null);

  // Form states for upload
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Notes');
  const [subject, setSubject] = useState('Advanced Mathematics');
  const [grade, setGrade] = useState('Grade 10-A');
  const [description, setDescription] = useState('');
  const [fileName, setFileName] = useState('Lecture_Material.pdf');

  const categories = ['All', 'Notes', 'PDFs', 'PPTs', 'Word Files', 'Images', 'Audio', 'Videos', 'External Links'];

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    let fileType = 'pdf';
    if (category === 'PPTs') fileType = 'ppt';
    if (category === 'Word Files') fileType = 'doc';
    if (category === 'Images') fileType = 'image';
    if (category === 'Audio') fileType = 'audio';
    if (category === 'Videos') fileType = 'video';
    if (category === 'External Links') fileType = 'link';

    const newMat = {
      id: Date.now(),
      title,
      category,
      fileType,
      subject,
      grade,
      size: '2.4 MB',
      uploadDate: new Date().toLocaleDateString(),
      downloads: 0,
      description: description || 'Uploaded study material.'
    };

    setMaterials([newMat, ...materials]);
    setTitle('');
    setDescription('');
    setIsUploadModalOpen(false);
    alert('Study material uploaded successfully.');
  };

  const handleDelete = (id: number) => {
    setMaterials(materials.filter(m => m.id !== id));
  };

  const handleDownload = (mat: any) => {
    alert(`Downloading ${mat.title}...`);
    setMaterials(materials.map(m => m.id === mat.id ? { ...m, downloads: m.downloads + 1 } : m));
  };

  const handleShare = (mat: any) => {
    alert(`Share link generated for ${mat.title}! Copied to clipboard.`);
  };

  const handlePreview = (mat: any) => {
    setSelectedMaterial(mat);
    setIsPreviewModalOpen(true);
  };

  const filteredMaterials = materials.filter(m => {
    const matchesCat = activeCategory === 'All' || m.category === activeCategory;
    const matchesSearch = m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.grade.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const getCategoryIcon = (cat: string) => {
    switch(cat) {
      case 'Notes':
      case 'PDFs': return <FileText className="w-5 h-5 text-rose-600" />;
      case 'PPTs': return <FileSpreadsheet className="w-5 h-5 text-amber-600" />;
      case 'Word Files': return <FileCode className="w-5 h-5 text-indigo-600" />;
      case 'Images': return <ImageIcon className="w-5 h-5 text-emerald-600" />;
      case 'Audio': return <FileAudio className="w-5 h-5 text-purple-600" />;
      case 'Videos': return <Video className="w-5 h-5 text-sky-600" />;
      case 'External Links': return <LinkIcon className="w-5 h-5 text-blue-600" />;
      default: return <FileText className="w-5 h-5 text-slate-600" />;
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-20">
      {/* Header & Controls */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <FolderOpen className="w-6 h-6 text-emerald-600" />
            Study Material & Resource Repository
          </h2>
          <p className="text-xs text-slate-500 mt-1">Upload, preview, download, and share notes, PDFs, PPTs, Word files, images, audio, videos, and external links.</p>
        </div>

        <button 
          onClick={() => setIsUploadModalOpen(true)}
          className="px-4 py-2.5 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 transition flex items-center gap-2 shadow-sm whitespace-nowrap"
        >
          <Upload className="w-4 h-4" /> Upload Material
        </button>
      </div>

      {/* Search and Filters Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input 
            type="text" 
            placeholder="Search study material..." 
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

      {/* Materials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMaterials.length === 0 ? (
          <div className="col-span-full bg-white border border-slate-200 rounded-3xl p-16 text-center text-slate-400 text-sm">
            No study material found matching your criteria.
          </div>
        ) : (
          filteredMaterials.map(mat => (
            <div key={mat.id} className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:shadow-md transition flex flex-col justify-between group space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center">
                      {getCategoryIcon(mat.category)}
                    </div>
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 uppercase tracking-wider">
                      {mat.category}
                    </span>
                  </div>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
                    {mat.grade}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-600 transition">
                  {mat.title}
                </h3>

                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {mat.description}
                </p>

                <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
                  <span>Subject: <b>{mat.subject}</b></span>
                  <span>{mat.size}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5">
                  <button 
                    onClick={() => handlePreview(mat)}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-700 rounded-xl font-semibold transition flex items-center gap-1"
                    title="Preview"
                  >
                    <Eye className="w-3.5 h-3.5" /> Preview
                  </button>
                  <button 
                    onClick={() => handleDownload(mat)}
                    className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition"
                    title="Download"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => handleShare(mat)}
                    className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition"
                    title="Share"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>

                <button 
                  onClick={() => handleDelete(mat.id)}
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

      {/* Upload Material Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900">Upload Study Material</h3>
              <button onClick={() => setIsUploadModalOpen(false)} className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold">✕</button>
            </div>

            <form onSubmit={handleUpload} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Material Title</label>
                <input 
                  type="text" 
                  value={title} 
                  onChange={(e) => setTitle(e.target.value)} 
                  placeholder="e.g. Chapter 6 Summary Notes" 
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Category Type</label>
                  <select 
                    value={category} 
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl bg-white"
                  >
                    <option value="Notes">Notes</option>
                    <option value="PDFs">PDFs</option>
                    <option value="PPTs">PPTs</option>
                    <option value="Word Files">Word Files</option>
                    <option value="Images">Images</option>
                    <option value="Audio">Audio</option>
                    <option value="Videos">Videos</option>
                    <option value="External Links">External Links</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Subject</label>
                  <input 
                    type="text" 
                    value={subject} 
                    onChange={(e) => setSubject(e.target.value)} 
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Grade Class</label>
                  <input 
                    type="text" 
                    value={grade} 
                    onChange={(e) => setGrade(e.target.value)} 
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">File Name / Link</label>
                  <input 
                    type="text" 
                    value={fileName} 
                    onChange={(e) => setFileName(e.target.value)} 
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Description</label>
                <textarea 
                  rows={3} 
                  value={description} 
                  onChange={(e) => setDescription(e.target.value)} 
                  placeholder="Provide brief summary of the resource..." 
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl resize-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button type="button" onClick={() => setIsUploadModalOpen(false)} className="px-4 py-2.5 bg-slate-100 text-slate-700 rounded-xl font-bold">Cancel</button>
                <button type="submit" className="px-5 py-2.5 bg-emerald-600 text-white rounded-xl font-bold shadow-sm">Upload Material</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Preview Material Modal */}
      {isPreviewModalOpen && selectedMaterial && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 uppercase">
                  {selectedMaterial.category} • {selectedMaterial.subject}
                </span>
                <h3 className="text-xl font-bold text-slate-900 mt-1">{selectedMaterial.title}</h3>
              </div>
              <button onClick={() => setIsPreviewModalOpen(false)} className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold">✕</button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 text-center space-y-3">
                <div className="w-16 h-16 rounded-2xl bg-white border border-slate-200 mx-auto flex items-center justify-center shadow-sm">
                  {getCategoryIcon(selectedMaterial.category)}
                </div>
                <p className="font-bold text-slate-800 text-sm">{selectedMaterial.title}</p>
                <p className="text-slate-500">{selectedMaterial.description}</p>
                <div className="flex justify-center gap-4 text-slate-400 pt-2">
                  <span>Size: <b>{selectedMaterial.size}</b></span>
                  <span>Downloads: <b>{selectedMaterial.downloads}</b></span>
                  <span>Uploaded: <b>{selectedMaterial.uploadDate}</b></span>
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-slate-100">
              <button 
                onClick={() => handleShare(selectedMaterial)} 
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold flex items-center gap-1.5"
              >
                <Share2 className="w-4 h-4" /> Share Link
              </button>
              <div className="flex gap-3">
                <button 
                  onClick={() => handleDownload(selectedMaterial)} 
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold flex items-center gap-1.5"
                >
                  <Download className="w-4 h-4" /> Download
                </button>
                <button 
                  onClick={() => setIsPreviewModalOpen(false)} 
                  className="px-5 py-2.5 bg-emerald-600 text-white rounded-xl font-bold shadow-sm"
                >
                  Close Preview
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
