import React, { useState } from 'react';
import * as LucideIcons from 'lucide-react';
import { MODULE_CATEGORIES, SHARED_PLATFORM_CAPABILITIES, ModuleInfo } from '../../data/modulesRegistry';

interface ModulesCataloguePageProps {
  onNavigate: (path: string) => void;
}

export const ModulesCataloguePage: React.FC<ModulesCataloguePageProps> = ({ onNavigate }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Gather unique categories
  const categoriesList = ['All', ...MODULE_CATEGORIES.map(cat => cat.name)];

  // Filter modules based on query and category
  const getFilteredCategories = () => {
    return MODULE_CATEGORIES.map(cat => {
      // Filter modules inside this category
      const matchedModules = cat.modules.filter(mod => {
        const matchesQuery = 
          mod.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          mod.description.toLowerCase().includes(searchQuery.toLowerCase());
        
        const matchesCategory = selectedCategory === 'All' || cat.name === selectedCategory;
        
        return matchesQuery && matchesCategory;
      });

      return {
        ...cat,
        modules: matchedModules
      };
    }).filter(cat => cat.modules.length > 0);
  };

  const filteredCategories = getFilteredCategories();

  // Total matching modules count
  const totalMatches = filteredCategories.reduce((acc, cat) => acc + cat.modules.length, 0);

  const getModuleColors = (category: string) => {
    switch (category) {
      case "Organization & Administration":
        return {
          bg: "bg-sky-50/40 hover:bg-sky-100/40",
          border: "border-sky-100 hover:border-sky-300",
          iconBg: "bg-sky-100 text-sky-600 group-hover:bg-sky-600 group-hover:text-white",
          text: "text-sky-900 group-hover:text-sky-700",
          badge: "bg-sky-100/60 text-sky-700 border-sky-200/30",
          btn: "text-sky-700 hover:text-sky-800"
        };
      case "Student & Enrollment":
        return {
          bg: "bg-emerald-50/40 hover:bg-emerald-100/40",
          border: "border-emerald-100 hover:border-emerald-300",
          iconBg: "bg-emerald-100 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white",
          text: "text-emerald-900 group-hover:text-emerald-700",
          badge: "bg-emerald-100/60 text-emerald-700 border-emerald-200/30",
          btn: "text-emerald-700 hover:text-emerald-800"
        };
      case "Academic":
        return {
          bg: "bg-violet-50/40 hover:bg-violet-100/40",
          border: "border-violet-100 hover:border-violet-300",
          iconBg: "bg-violet-100 text-violet-600 group-hover:bg-violet-600 group-hover:text-white",
          text: "text-violet-900 group-hover:text-violet-700",
          badge: "bg-violet-100/60 text-violet-700 border-violet-200/30",
          btn: "text-violet-700 hover:text-violet-800"
        };
      case "People & Workforce":
        return {
          bg: "bg-teal-50/40 hover:bg-teal-100/40",
          border: "border-teal-100 hover:border-teal-300",
          iconBg: "bg-teal-100 text-teal-600 group-hover:bg-teal-600 group-hover:text-white",
          text: "text-teal-900 group-hover:text-teal-700",
          badge: "bg-teal-100/60 text-teal-700 border-teal-200/30",
          btn: "text-teal-700 hover:text-teal-800"
        };
      case "Finance":
        return {
          bg: "bg-rose-50/40 hover:bg-rose-100/40",
          border: "border-rose-100 hover:border-rose-300",
          iconBg: "bg-rose-100 text-rose-600 group-hover:bg-rose-600 group-hover:text-white",
          text: "text-rose-900 group-hover:text-rose-700",
          badge: "bg-rose-100/60 text-rose-700 border-rose-200/30",
          btn: "text-rose-700 hover:text-rose-800"
        };
      case "Operations":
        return {
          bg: "bg-cyan-50/40 hover:bg-cyan-100/40",
          border: "border-cyan-100 hover:border-cyan-300",
          iconBg: "bg-cyan-100 text-cyan-600 group-hover:bg-cyan-600 group-hover:text-white",
          text: "text-cyan-900 group-hover:text-cyan-700",
          badge: "bg-cyan-100/60 text-cyan-700 border-cyan-200/30",
          btn: "text-cyan-700 hover:text-cyan-800"
        };
      case "Communication & Growth":
        return {
          bg: "bg-pink-50/40 hover:bg-pink-100/40",
          border: "border-pink-100 hover:border-pink-300",
          iconBg: "bg-pink-100 text-pink-600 group-hover:bg-pink-600 group-hover:text-white",
          text: "text-pink-900 group-hover:text-pink-700",
          badge: "bg-pink-100/60 text-pink-700 border-pink-200/30",
          btn: "text-pink-700 hover:text-pink-800"
        };
      case "Intelligence & AI":
        return {
          bg: "bg-purple-50/40 hover:bg-purple-100/40",
          border: "border-purple-100 hover:border-purple-300",
          iconBg: "bg-purple-100 text-purple-600 group-hover:bg-purple-600 group-hover:text-white",
          text: "text-purple-900 group-hover:text-purple-700",
          badge: "bg-purple-100/60 text-purple-700 border-purple-200/30",
          btn: "text-purple-700 hover:text-purple-800"
        };
      case "Enterprise & Platform":
        return {
          bg: "bg-amber-50/40 hover:bg-amber-100/40",
          border: "border-amber-100 hover:border-amber-300",
          iconBg: "bg-amber-100 text-amber-600 group-hover:bg-amber-600 group-hover:text-white",
          text: "text-amber-900 group-hover:text-amber-700",
          badge: "bg-amber-100/60 text-amber-700 border-amber-200/30",
          btn: "text-amber-700 hover:text-amber-800"
        };
      case "Reserved Core Modules":
      default:
        return {
          bg: "bg-indigo-50/40 hover:bg-indigo-100/40",
          border: "border-indigo-100 hover:border-indigo-300",
          iconBg: "bg-indigo-100 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white",
          text: "text-indigo-900 group-hover:text-indigo-700",
          badge: "bg-indigo-100/60 text-indigo-700 border-indigo-200/30",
          btn: "text-indigo-700 hover:text-indigo-800"
        };
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen text-slate-800 flex flex-col animate-fade-in">
      {/* Catalogue Sub-header */}
      <div className="bg-white border-b border-slate-200 px-6 py-8 md:px-12">
        <div className="max-w-7xl mx-auto space-y-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1.5 text-xs font-bold text-indigo-600 uppercase tracking-widest">
                <span>🧩</span> Galaxy ERP Master Catalogue
              </div>
              <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight leading-tight">
                Enterprise Module Hub
              </h2>
              <p className="text-sm text-slate-500 max-w-2xl mt-1 leading-relaxed">
                Centralized registry of all 28 Core Modules and foundational platform micro-services defining the Galaxy educational operating ecosystem.
              </p>
            </div>
            
            {/* Quick stats badge */}
            <div className="inline-flex shrink-0 items-center gap-4 bg-slate-50 border border-slate-200/80 rounded-2xl px-4 py-3">
              <div className="text-center">
                <div className="text-lg font-black text-slate-900 leading-none">28</div>
                <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Core Modules</div>
              </div>
              <div className="h-8 w-px bg-slate-200"></div>
              <div className="text-center">
                <div className="text-lg font-black text-indigo-600 leading-none">14</div>
                <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Platform Services</div>
              </div>
            </div>
          </div>

          {/* Live search input and filter buttons */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-4">
            <div className="md:col-span-2 relative">
              <LucideIcons.Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search modules by name or capability..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 hover:bg-slate-100/50 focus:bg-white text-sm border border-slate-200 focus:border-indigo-500 rounded-xl outline-none transition"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <LucideIcons.X className="w-4 h-4" />
                </button>
              )}
            </div>
            
            {/* Category selection filter dropdown */}
            <div className="relative">
              <LucideIcons.Filter className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 text-slate-700 text-sm border border-slate-200 rounded-xl outline-none transition cursor-pointer appearance-none"
              >
                {categoriesList.map((cat, idx) => (
                  <option key={idx} value={cat}>{cat}</option>
                ))}
              </select>
              <LucideIcons.ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid Content */}
      <div className="flex-1 p-6 md:p-12 max-w-7xl w-full mx-auto space-y-12">
        {totalMatches === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center space-y-4">
            <div className="text-4xl text-slate-300">🔍</div>
            <h3 className="font-bold text-slate-800">No matching modules found</h3>
            <p className="text-xs text-slate-500 max-w-sm">
              We couldn't find any modules matching "{searchQuery}". Try clearing search query or category filters.
            </p>
            <button
              onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}
              className="px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded-lg cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="space-y-10">
            {filteredCategories.map((catGroup, idx) => (
              <div key={idx} className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
                  <h3 className="font-bold text-slate-800 text-base md:text-lg">
                    {catGroup.name}
                  </h3>
                  <span className="px-2 py-0.5 text-[10px] font-bold text-slate-500 bg-slate-200/60 rounded-full">
                    {catGroup.modules.length}
                  </span>
                </div>

                {/* Modules Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {catGroup.modules.map((mod) => {
                    const IconComp = (LucideIcons as any)[mod.iconName] || LucideIcons.HelpCircle;
                    const colors = getModuleColors(mod.category);
                    return (
                      <div
                        key={mod.id}
                        onClick={() => onNavigate(mod.path)}
                        className={`border ${colors.border} ${colors.bg} hover:shadow-lg rounded-2xl p-6 transition-all duration-300 cursor-pointer flex flex-col justify-between group`}
                      >
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div className={`w-11 h-11 ${colors.iconBg} rounded-xl flex items-center justify-center border border-white/40 shadow-xs transition duration-200`}>
                              <IconComp className="w-5 h-5" />
                            </div>
                            <span className={`text-[9px] font-black border ${colors.badge} px-2.5 py-0.5 rounded-full uppercase tracking-widest`}>
                              Coming Soon
                            </span>
                          </div>
                          
                          <div>
                            <h4 className={`font-black text-sm transition ${colors.text}`}>
                              {mod.name}
                            </h4>
                            <p className="text-slate-600 text-xs mt-1.5 leading-relaxed line-clamp-2 group-hover:text-slate-700 transition">
                              {mod.description}
                            </p>
                          </div>
                        </div>

                        <div className={`mt-5 pt-3.5 border-t border-slate-100/60 flex items-center justify-between text-xs font-black ${colors.btn} group-hover:translate-x-1 transition-all duration-200`}>
                          <span>View Module Scope</span>
                          <LucideIcons.ArrowRight className="w-4 h-4" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Dedicated Shared Platform Layer Section */}
        <section className="bg-white border border-slate-200/80 rounded-2xl p-6 md:p-8 space-y-6">
          <div className="border-b border-slate-200 pb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-widest">
                <span>🧩</span> Shared Platform Layer
              </div>
              <h3 className="text-lg md:text-xl font-black text-slate-900">
                Core Architectural Capabilities
              </h3>
            </div>
            
            <button
              onClick={() => onNavigate('module_shared_platform')}
              className="px-3.5 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold rounded-xl transition cursor-pointer flex items-center gap-1.5 shrink-0 self-start sm:self-auto"
            >
              <span>Platform Services Page</span>
              <LucideIcons.ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Capabilities Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {SHARED_PLATFORM_CAPABILITIES.map((cap, index) => (
              <div 
                key={index}
                className="bg-slate-50/50 border border-slate-200/60 p-4 rounded-xl space-y-1 flex flex-col justify-between"
              >
                <div>
                  <h5 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></span>
                    {cap.name}
                  </h5>
                  <p className="text-[11px] text-slate-500 mt-1 leading-normal">
                    {cap.description}
                  </p>
                </div>
                
                <div className="pt-2 text-[9px] font-extrabold text-indigo-600 uppercase tracking-wide">
                  Architectural Core
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};
