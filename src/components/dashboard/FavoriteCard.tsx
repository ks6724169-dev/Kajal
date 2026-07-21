import React from 'react';
import { useStore } from '../../stores/StoreContext';
import { Star, Link2, BookOpen, GraduationCap, Settings, Sparkles, LayoutDashboard } from 'lucide-react';

interface FavoriteCardProps {
  onNavigate: (tabId: string) => void;
}

export const FavoriteCard: React.FC<FavoriteCardProps> = ({ onNavigate }) => {
  const { favorites, toggleFavorite } = useStore();

  const favoriteItems = [
    { id: 'dashboard', label: 'BI Analytics Dashboard', icon: <LayoutDashboard className="w-3.5 h-3.5" />, path: '/dashboard' },
    { id: 'ai_hub', label: 'AI Campus Suite (Gemini)', icon: <Sparkles className="w-3.5 h-3.5" />, path: '/ai-hub' },
    { id: 'students', label: 'Students & Admissions', icon: <GraduationCap className="w-3.5 h-3.5" />, path: '/students' },
    { id: 'fees', label: 'Fee & UPI Collection', icon: <Settings className="w-3.5 h-3.5" />, path: '/fees' },
    { id: 'exams', label: 'Exams & OMR Scanner', icon: <BookOpen className="w-3.5 h-3.5" />, path: '/exams' },
  ];

  // Filter items matching favorited paths (or ids)
  const activeFavorites = favoriteItems.filter(item => 
    favorites.includes(item.path) || favorites.includes(item.id)
  );

  return (
    <div className="space-y-3.5 w-full">
      <div className="flex items-center justify-between pb-1 border-b border-slate-100 dark:border-slate-800/40">
        <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider flex items-center gap-1">
          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" /> Bookmarked Workspaces
        </span>
        <span className="text-[10px] text-slate-400 font-medium">({activeFavorites.length} pinned)</span>
      </div>

      {activeFavorites.length > 0 ? (
        <div className="grid grid-cols-1 gap-2">
          {activeFavorites.map((item) => (
            <div 
              key={item.id}
              className="flex items-center justify-between p-2.5 rounded-xl border border-slate-100 dark:border-slate-800/40 bg-slate-50/30 dark:bg-slate-900/40 hover:bg-white dark:hover:bg-slate-800/60 hover:border-slate-200 dark:hover:border-slate-700/60 hover:shadow-xs transition duration-150 group"
            >
              <button 
                onClick={() => onNavigate(item.id)}
                className="flex items-center space-x-2.5 text-xs font-bold text-slate-700 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 text-left min-w-0 flex-1"
              >
                <span className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-500 group-hover:bg-indigo-500/20 transition shrink-0 flex items-center justify-center">
                  {item.icon}
                </span>
                <span className="truncate">{item.label}</span>
              </button>
              
              <button
                onClick={() => toggleFavorite(item.path)}
                title="Remove bookmark"
                className="p-1 rounded-md text-amber-400 hover:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 shrink-0 transition"
              >
                <Star className="w-3.5 h-3.5 fill-current" />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-6 text-[10px] text-slate-400 font-medium leading-relaxed bg-slate-50/40 dark:bg-slate-900/10 border border-dashed border-slate-200 dark:border-slate-800/80 rounded-xl px-4">
          No active favorites pinned. Click on the star icon in the command center or pages to pin them to this workspace board.
        </div>
      )}
    </div>
  );
};
