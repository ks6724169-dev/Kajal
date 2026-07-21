import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  DocsSidebar 
} from './components/DocsSidebar';
import { DocsHeader } from './components/DocsHeader';
import { DocsMain } from './components/DocsMain';
import { DocsAIAssistant } from './components/DocsAIAssistant';
import { DocsVideoCenter, DocsDownloads, DocsReleaseNotes } from './components/DocsModules';
import { DocsSupport } from './components/DocsSupport';
import { BrainCircuit, Rocket, ArrowRight } from 'lucide-react';

interface DocumentationPageProps {
  navigate: (path: string) => void;
}

export const DocumentationPage: React.FC<DocumentationPageProps> = ({ navigate }) => {
  const [categories, setCategories] = useState<any[]>([]);
  const [activeCategory, setActiveCategory] = useState('getting-started');
  const [articles, setArticles] = useState<any[]>([]);
  const [activeArticle, setActiveArticle] = useState<any>(null);
  const [videos, setVideos] = useState<any[]>([]);
  const [releases, setReleases] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    Promise.all([
      fetch('/api/v1/documentation/categories').then(res => res.json()),
      fetch('/api/v1/documentation/articles').then(res => res.json()),
      fetch('/api/v1/documentation/videos').then(res => res.json()),
      fetch('/api/v1/documentation/releases').then(res => res.json())
    ]).then(([cats, arts, vids, rels]) => {
      setCategories(cats);
      setArticles(arts);
      setVideos(vids);
      setReleases(rels);
      setActiveArticle(arts[0]); // Default to first article
      setIsLoading(false);
    });
  }, []);

  const handleCategorySelect = (id: string) => {
    setActiveCategory(id);
    const firstArt = articles.find(a => a.category === id);
    if (firstArt) setActiveArticle(firstArt);
  };

  const handleSearch = (query: string) => {
    fetch(`/api/v1/documentation/search?q=${query}`)
      .then(res => res.json())
      .then(results => {
        if (results.length > 0) setActiveArticle(results[0]);
      });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-6">
          <div className="w-16 h-16 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-2xl animate-pulse">
            <BrainCircuit className="w-8 h-8" />
          </div>
          <p className="text-sm font-black text-slate-400 uppercase tracking-widest animate-bounce">
            Initializing Documentation...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-sans">
      <DocsHeader onSearch={handleSearch} navigate={navigate} />
      
      <div className="max-w-[1600px] mx-auto flex">
        <DocsSidebar 
          categories={categories} 
          activeCategory={activeCategory} 
          onSelect={handleCategorySelect} 
        />
        
        <main className="flex-1 min-w-0">
          <div className="max-w-7xl mx-auto">
            {/* Top Quick Start */}
            {activeCategory === 'getting-started' && (
              <div className="p-8 lg:p-16 space-y-12 bg-slate-50 border-b border-slate-100">
                <div className="space-y-4">
                  <h2 className="text-3xl font-black text-slate-900 tracking-tight">Quick Start Cards</h2>
                  <p className="text-slate-500 font-medium">Follow these steps to set up your institution in minutes.</p>
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {[
                    'Create School', 'Register Owner', 'Login', 'Create Principal',
                    'Add Teachers', 'Student Admission', 'Parent Invite', 'Start Attendance'
                  ].map((step, i) => (
                    <motion.button
                      key={i}
                      whileHover={{ y: -5 }}
                      className="p-6 bg-white border border-slate-100 rounded-3xl text-left hover:shadow-xl transition-all group"
                    >
                      <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all mb-4 font-black text-xs">
                        0{i+1}
                      </div>
                      <h4 className="font-black text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors">{step}</h4>
                      <p className="text-xs text-slate-500 font-medium leading-relaxed mb-4">Click to open documentation for this step.</p>
                      <div className="flex items-center gap-2 text-indigo-600 text-[10px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                        Read More <ArrowRight className="w-3 h-3" />
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>
            )}

            <DocsMain article={activeArticle} />

            {/* Global Sections at bottom of main content or separate based on navigation */}
            <div className="p-8 lg:p-16 space-y-32">
              <DocsVideoCenter videos={videos} />
              <DocsDownloads />
              <DocsReleaseNotes releases={releases} />
              <DocsSupport />
            </div>
          </div>
        </main>
      </div>

      <DocsAIAssistant />
    </div>
  );
};
