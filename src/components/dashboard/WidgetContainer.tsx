import React, { useState } from 'react';
import { useStore } from '../../stores/StoreContext';
import { Settings, RefreshCw, Eye, EyeOff, LayoutGrid, Check, Sliders, Sparkles } from 'lucide-react';

interface WidgetContainerProps {
  role: string;
  visibleWidgets: string[];
  setVisibleWidgets: (widgets: string[]) => void;
  defaultWidgets: string[];
  accentColor: string;
  setAccentColor: (color: string) => void;
  density: 'comfortable' | 'compact';
  setDensity: (den: 'comfortable' | 'compact') => void;
  fontSize: 'sm' | 'md' | 'lg';
  setFontSize: (size: 'sm' | 'md' | 'lg') => void;
}

export const WidgetContainer: React.FC<WidgetContainerProps> = ({
  role,
  visibleWidgets,
  setVisibleWidgets,
  defaultWidgets,
  accentColor,
  setAccentColor,
  density,
  setDensity,
  fontSize,
  setFontSize
}) => {
  const { theme, setTheme } = useStore();
  const [isOpen, setIsOpen] = useState(false);

  // Map of available widgets with readable names
  const allWidgets: Record<string, { label: string; desc: string }> = {
    kpi: { label: 'Numerical KPIs & Metrics', desc: 'Summary of student registrations, fees, or lessons' },
    revenue: { label: 'Financial Revenue Area Chart', desc: 'SaaS fee targets vs collected funds' },
    attendance: { label: 'Student Attendance Bar Chart', desc: 'Weekly class attendance trend averages' },
    distribution: { label: 'Class Distribution Donut Chart', desc: 'Percentage breakdown across school grades' },
    performance: { label: 'Academic Performance Horizontal Chart', desc: 'Subject grade performance tracking' },
    ai_insights: { label: 'AI Workspace Copilot & Insights', desc: 'Real-time daily alerts and smart actions' },
    recent_activity: { label: 'Recent Activity Logs & Audits', desc: 'System-wide audit trail logs' },
    notifications: { label: 'Notifications & Alerts Hub', desc: 'Interactive real-time priorities tracker' },
    weather: { label: 'Localized Weather & Ingress advisories', desc: 'Weather condition recommendations' },
    favorites: { label: 'Bookmarked Pinned Modules', desc: 'Shortcuts to your pinned pages' }
  };

  const accents = [
    { name: 'Indigo Space', value: 'indigo', colorClass: 'bg-indigo-600' },
    { name: 'Emerald Nature', value: 'emerald', colorClass: 'bg-emerald-500' },
    { name: 'Violet Cyber', value: 'violet', colorClass: 'bg-violet-600' },
    { name: 'Rose Petal', value: 'rose', colorClass: 'bg-rose-500' },
    { name: 'Amber Glow', value: 'amber', colorClass: 'bg-amber-500' }
  ];

  const handleToggleWidget = (id: string) => {
    if (visibleWidgets.includes(id)) {
      setVisibleWidgets(visibleWidgets.filter(w => w !== id));
    } else {
      setVisibleWidgets([...visibleWidgets, id]);
    }
  };

  const handleReset = () => {
    setVisibleWidgets(defaultWidgets);
    setAccentColor('indigo');
    setDensity('comfortable');
    setFontSize('md');
    setTheme('light');
  };

  return (
    <div className="relative z-20">
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 px-3.5 py-2.5 rounded-xl text-xs font-bold transition shadow-2xs cursor-pointer select-none text-slate-700 dark:text-slate-300"
      >
        <Sliders className="w-4 h-4 text-slate-400" />
        <span>Customize View</span>
      </button>

      {/* Floating Settings Dropdown Panel */}
      {isOpen && (
        <div className="absolute right-0 mt-2.5 w-96 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl py-4 px-5 z-50">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800/60 mb-4">
            <div className="flex items-center gap-1.5">
              <Settings className="w-4 h-4 text-indigo-500" />
              <span className="text-xs font-extrabold text-slate-800 dark:text-slate-100 uppercase tracking-wider">Dashboard Customizer</span>
            </div>
            <button
              onClick={handleReset}
              title="Reset to default dashboard configurations"
              className="text-[10px] text-indigo-600 dark:text-indigo-400 font-bold hover:underline flex items-center gap-1 transition"
            >
              <RefreshCw className="w-3 h-3" /> Reset
            </button>
          </div>

          <div className="space-y-4 max-h-[360px] overflow-y-auto pr-1">
            {/* Theme selection */}
            <div>
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-2">Visual Theme Mode</span>
              <div className="grid grid-cols-3 gap-2">
                {(['light', 'dark', 'high-contrast'] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setTheme(t)}
                    className={`text-[10px] font-extrabold px-2 py-2 rounded-xl border transition capitalize ${
                      theme === t 
                        ? 'bg-indigo-500/10 border-indigo-500 text-indigo-600 dark:text-indigo-400' 
                        : 'border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/40'
                    }`}
                  >
                    {t.replace('-', ' ')}
                  </button>
                ))}
              </div>
            </div>

            {/* Accent Color selection */}
            <div>
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-2">Brand Accent Color</span>
              <div className="flex items-center gap-2">
                {accents.map((acc) => (
                  <button
                    key={acc.value}
                    onClick={() => setAccentColor(acc.value)}
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-white border-2 transition ${acc.colorClass} ${
                      accentColor === acc.value ? 'border-indigo-400 scale-110' : 'border-transparent hover:scale-105'
                    }`}
                    title={acc.name}
                  >
                    {accentColor === acc.value && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Viewport Density and Font Size */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-2">Grid Density</span>
                <div className="grid grid-cols-2 gap-1.5">
                  {(['comfortable', 'compact'] as const).map((den) => (
                    <button
                      key={den}
                      onClick={() => setDensity(den)}
                      className={`text-[9px] font-bold px-2 py-2 rounded-lg border transition uppercase tracking-wider ${
                        density === den 
                          ? 'bg-indigo-500/10 border-indigo-500 text-indigo-600 dark:text-indigo-400 font-extrabold' 
                          : 'border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-50'
                      }`}
                    >
                      {den}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-2">Font Sizing</span>
                <div className="grid grid-cols-3 gap-1">
                  {(['sm', 'md', 'lg'] as const).map((sz) => (
                    <button
                      key={sz}
                      onClick={() => setFontSize(sz)}
                      className={`text-[9px] font-bold py-2 rounded-lg border transition uppercase ${
                        fontSize === sz 
                          ? 'bg-indigo-500/10 border-indigo-500 text-indigo-600 dark:text-indigo-400 font-extrabold' 
                          : 'border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-50'
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Widgets Toggle list */}
            <div>
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-2">Visible Widgets</span>
              <div className="space-y-1.5">
                {Object.entries(allWidgets).map(([id, item]) => {
                  const isVisible = visibleWidgets.includes(id);
                  return (
                    <button
                      key={id}
                      onClick={() => handleToggleWidget(id)}
                      className={`w-full text-left p-2 rounded-xl border flex items-center justify-between transition ${
                        isVisible 
                          ? 'bg-indigo-500/5 border-slate-200 dark:border-slate-800/60' 
                          : 'border-slate-100 dark:border-slate-900/40 opacity-50 bg-slate-50/20'
                      }`}
                    >
                      <div className="min-w-0 pr-2">
                        <div className="text-[11px] font-bold text-slate-700 dark:text-slate-200 leading-tight">{item.label}</div>
                        <p className="text-[9px] text-slate-400 dark:text-slate-500 leading-none truncate mt-0.5">{item.desc}</p>
                      </div>
                      <span className="shrink-0 text-slate-400">
                        {isVisible ? <Eye className="w-3.5 h-3.5 text-indigo-500" /> : <EyeOff className="w-3.5 h-3.5" />}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Action Close footer */}
          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between">
            <span className="text-[9px] text-slate-400 font-medium">Layout saved per session</span>
            <button
              onClick={() => setIsOpen(false)}
              className="bg-indigo-500 hover:bg-indigo-600 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg transition"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
