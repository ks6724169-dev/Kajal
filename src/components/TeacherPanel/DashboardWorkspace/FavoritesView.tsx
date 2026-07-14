import React, { useState } from 'react';
import { 
  Star, 
  Trash2, 
  Pin, 
  Plus, 
  Search, 
  Filter, 
  Bookmark, 
  FileText, 
  Users, 
  BookOpen, 
  BarChart, 
  Cpu, 
  Compass,
  CheckCircle
} from 'lucide-react';

export const FavoritesView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  const [favorites, setFavorites] = useState([
    { id: 1, title: 'Grade 10 Mathematics - Section A', category: 'Classes', isPinned: true, desc: 'Primary core curriculum class for advanced algebra.' },
    { id: 2, title: 'Student: Michael Chang', category: 'Students', isPinned: true, desc: 'Top performing student in calculus Olympiad training.' },
    { id: 3, title: 'Q3 Student Performance & Attendance Report', category: 'Reports', isPinned: true, desc: 'Comprehensive academic analytics across all 3 sections.' },
    { id: 4, title: 'Calculus Limit Theorems Lesson Plan', category: 'Lesson Plans', isPinned: false, desc: 'Interactive whiteboard lesson plan with 5 worked examples.' },
    { id: 5, title: 'AI Quiz Generator Prompt (Advanced Math)', category: 'AI Prompts', isPinned: true, desc: 'Custom prompt template for generating differentiated quiz questions.' },
    { id: 6, title: 'School Accreditation & Policy Handbook', category: 'Documents', isPinned: false, desc: 'Official 2026 guidelines for grade submission and safety.' },
    { id: 7, title: 'Teacher Dashboard & Quick Actions', category: 'Important Pages', isPinned: false, desc: 'Main navigation hub for attendance, grades, and notices.' }
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Classes');
  const [newDesc, setNewDesc] = useState('');

  const categories = [
    'all',
    'Important Pages',
    'Students',
    'Classes',
    'Reports',
    'Documents',
    'Lesson Plans',
    'AI Prompts'
  ];

  const handleTogglePin = (id: number) => {
    setFavorites(favorites.map(f => f.id === id ? { ...f, isPinned: !f.isPinned } : f));
  };

  const handleDelete = (id: number) => {
    setFavorites(favorites.filter(f => f.id !== id));
  };

  const handleAddFavorite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newItem = {
      id: Date.now(),
      title: newTitle,
      category: newCategory,
      isPinned: true,
      desc: newDesc || 'User pinned favorite item.'
    };

    setFavorites([newItem, ...favorites]);
    setNewTitle('');
    setNewDesc('');
    setIsModalOpen(false);
  };

  const filteredFavorites = favorites.filter(fav => {
    const matchesTab = activeTab === 'all' || fav.category === activeTab;
    const matchesSearch = fav.title.toLowerCase().includes(searchQuery.toLowerCase()) || fav.desc.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'Important Pages': return Compass;
      case 'Students': return Users;
      case 'Classes': return BookOpen;
      case 'Reports': return BarChart;
      case 'Documents': return FileText;
      case 'Lesson Plans': return Bookmark;
      case 'AI Prompts': return Cpu;
      default: return Star;
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-20">
      {/* Header & Search */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Star className="w-6 h-6 text-amber-500 fill-amber-500" />
            Favorites & Pinned Quick Access Hub
          </h2>
          <p className="text-xs text-slate-500 mt-1">Pin important pages, students, classes, reports, documents, lesson plans, and AI prompts.</p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input 
              type="text" 
              placeholder="Search favorites..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2.5 bg-amber-600 text-white rounded-xl text-sm font-semibold hover:bg-amber-700 transition flex items-center gap-2 shadow-sm whitespace-nowrap"
          >
            <Plus className="w-4 h-4" /> Add Favorite
          </button>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1 pl-1">
          <Filter className="w-3.5 h-3.5" /> Category:
        </span>
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveTab(cat)}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition whitespace-nowrap capitalize ${activeTab === cat ? 'bg-amber-600 text-white shadow-sm' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Favorites Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredFavorites.length === 0 ? (
          <div className="col-span-full bg-white border border-slate-200 rounded-3xl p-16 text-center text-slate-400 text-sm">
            No favorite items found matching your search or category filter.
          </div>
        ) : (
          filteredFavorites.map((fav) => {
            const IconComp = getCategoryIcon(fav.category);
            return (
              <div 
                key={fav.id} 
                className={`bg-white border rounded-3xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group relative ${fav.isPinned ? 'border-amber-300 ring-2 ring-amber-500/10 bg-amber-50/10' : 'border-slate-200'}`}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shadow-xs">
                      <IconComp className="w-6 h-6" />
                    </div>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => handleTogglePin(fav.id)}
                        className={`p-2 rounded-xl border transition ${fav.isPinned ? 'bg-amber-600 text-white border-amber-600' : 'bg-white border-slate-200 text-slate-400 hover:text-amber-600'}`}
                        title={fav.isPinned ? 'Unpin' : 'Pin'}
                      >
                        <Pin className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(fav.id)}
                        className="p-2 bg-white border border-slate-200 text-slate-400 hover:text-rose-600 rounded-xl transition shadow-xs"
                        title="Remove"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-lg bg-amber-100 text-amber-800 uppercase tracking-wider">
                      {fav.category}
                    </span>
                    <h3 className="text-base font-bold text-slate-900 group-hover:text-amber-700 transition">
                      {fav.title}
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {fav.desc}
                    </p>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
                  <span className="flex items-center gap-1 text-amber-600 font-bold">
                    {fav.isPinned ? 'Pinned to Top' : 'Saved in Favorites'}
                  </span>
                  <button className="text-indigo-600 hover:underline font-bold">Open Item →</button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add Favorite Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-6 animate-in fade-in zoom-in-95 duration-200">
            <h3 className="text-lg font-bold text-slate-900">Add New Favorite Item</h3>

            <form onSubmit={handleAddFavorite} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Item Title</label>
                <input 
                  type="text" 
                  placeholder="e.g. Grade 9 Science Lab Roster"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Category</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
                >
                  <option value="Important Pages">Important Pages</option>
                  <option value="Students">Students</option>
                  <option value="Classes">Classes</option>
                  <option value="Reports">Reports</option>
                  <option value="Documents">Documents</option>
                  <option value="Lesson Plans">Lesson Plans</option>
                  <option value="AI Prompts">AI Prompts</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Short Description</label>
                <textarea 
                  placeholder="Brief note about why this is saved..."
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none h-20"
                ></textarea>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 bg-slate-100 text-slate-700 rounded-xl text-sm font-semibold hover:bg-slate-200 transition"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-5 py-2.5 bg-amber-600 text-white rounded-xl text-sm font-semibold hover:bg-amber-700 transition shadow-sm"
                >
                  Pin to Favorites
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
