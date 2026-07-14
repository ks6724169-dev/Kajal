import React, { useState } from 'react';
import { 
  BarChart3, 
  CheckCircle, 
  Plus, 
  Search, 
  Calendar, 
  TrendingUp, 
  FileText, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  RefreshCw,
  Printer
} from 'lucide-react';

export const SyllabusTrackerView: React.FC = () => {
  const [syllabus, setSyllabus] = useState([
    { 
      id: 1, 
      unit: 'Unit 1: Foundations of Limits & Continuity', 
      code: 'MATH-U1',
      totalTopics: 12,
      completedTopics: 12,
      pendingTopics: 0,
      progress: 100, 
      status: 'Completed', 
      targetDate: 'June 15, 2026',
      topicsList: ['Introduction to Limits', 'One-Sided Limits', 'Continuity Criteria', 'Intermediate Value Theorem', 'Epsilon-Delta Definition']
    },
    { 
      id: 2, 
      unit: 'Unit 2: Derivatives & Differentiation Rules', 
      code: 'MATH-U2',
      totalTopics: 15,
      completedTopics: 13,
      pendingTopics: 2,
      progress: 85, 
      status: 'In Progress', 
      targetDate: 'July 15, 2026',
      topicsList: ['First Principles', 'Power Rule', 'Product Rule', 'Quotient Rule', 'Chain Rule', 'Implicit Differentiation']
    },
    { 
      id: 3, 
      unit: 'Unit 3: Applications of Derivatives & Optimization', 
      code: 'MATH-U3',
      totalTopics: 14,
      completedTopics: 6,
      pendingTopics: 8,
      progress: 42, 
      status: 'In Progress', 
      targetDate: 'August 15, 2026',
      topicsList: ['Related Rates', 'Extrema on Intervals', 'Mean Value Theorem', 'Curve Sketching', 'Optimization Problems']
    },
    { 
      id: 4, 
      unit: 'Unit 4: Integral Calculus & Area Under Curve', 
      code: 'MATH-U4',
      totalTopics: 16,
      completedTopics: 0,
      pendingTopics: 16,
      progress: 0, 
      status: 'Not Started', 
      targetDate: 'September 30, 2026',
      topicsList: ['Riemann Sums', 'Definite Integrals', 'Fundamental Theorem of Calculus', 'Integration by Substitution', 'Integration by Parts']
    },
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUnit, setSelectedUnit] = useState<any>(null);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [activeUnitForUpdate, setActiveUnitForUpdate] = useState<any>(null);
  const [newCompletedCount, setNewCompletedCount] = useState('0');

  // Overall calculations
  const totalSyllabusUnits = syllabus.length;
  const totalTopicsCount = syllabus.reduce((acc, curr) => acc + curr.totalTopics, 0);
  const completedTopicsCount = syllabus.reduce((acc, curr) => acc + curr.completedTopics, 0);
  const pendingTopicsCount = totalTopicsCount - completedTopicsCount;
  const overallCompletionPercentage = Math.round((completedTopicsCount / totalTopicsCount) * 100);

  const handleOpenUpdate = (unit: any) => {
    setActiveUnitForUpdate(unit);
    setNewCompletedCount(unit.completedTopics.toString());
    setIsUpdateModalOpen(true);
  };

  const handleSaveProgress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeUnitForUpdate) return;
    const completed = parseInt(newCompletedCount) || 0;
    const clampedCompleted = Math.max(0, Math.min(activeUnitForUpdate.totalTopics, completed));
    const prog = Math.round((clampedCompleted / activeUnitForUpdate.totalTopics) * 100);
    const status = prog === 100 ? 'Completed' : prog > 0 ? 'In Progress' : 'Not Started';

    setSyllabus(syllabus.map(s => s.id === activeUnitForUpdate.id ? {
      ...s,
      completedTopics: clampedCompleted,
      pendingTopics: activeUnitForUpdate.totalTopics - clampedCompleted,
      progress: prog,
      status
    } : s));

    setIsUpdateModalOpen(false);
    alert('Syllabus progress updated successfully.');
  };

  const handleViewReport = () => {
    setIsReportModalOpen(true);
  };

  const filteredSyllabus = syllabus.filter(s => 
    s.unit.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-20">
      {/* Top Banner & Metrics */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-emerald-600" />
            Syllabus Tracker & Progress Analytics Hub
          </h2>
          <p className="text-xs text-slate-500 mt-1">Track total syllabus units, completed topics, pending topics, completion percentages, and milestone target dates.</p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <button 
            onClick={handleViewReport}
            className="px-4 py-2.5 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 transition flex items-center gap-2 shadow-sm whitespace-nowrap"
          >
            <FileText className="w-4 h-4" /> View Full Report
          </button>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Syllabus Topics</span>
          <p className="text-2xl font-bold text-slate-900">{totalTopicsCount} Topics</p>
          <p className="text-xs text-slate-500">Across {totalSyllabusUnits} Units</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Completed Topics</span>
          <p className="text-2xl font-bold text-emerald-600">{completedTopicsCount} Topics</p>
          <p className="text-xs text-emerald-700 font-medium">Successfully taught</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Pending Topics</span>
          <p className="text-2xl font-bold text-indigo-600">{pendingTopicsCount} Topics</p>
          <p className="text-xs text-indigo-700 font-medium">Scheduled ahead</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Overall Completion</span>
          <p className="text-2xl font-bold text-slate-900">{overallCompletionPercentage}%</p>
          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mt-1">
            <div className="bg-emerald-600 h-full rounded-full" style={{ width: `${overallCompletionPercentage}%` }}></div>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input 
            type="text" 
            placeholder="Search syllabus units..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
      </div>

      {/* Units List */}
      <div className="space-y-4">
        {filteredSyllabus.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-3xl p-16 text-center text-slate-400 text-sm">
            No syllabus units found matching your search.
          </div>
        ) : (
          filteredSyllabus.map(item => (
            <div key={item.id} className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6 hover:shadow-md transition">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 uppercase tracking-wider">
                      {item.code}
                    </span>
                    <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" /> Target Date: <b>{item.targetDate}</b>
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">{item.unit}</h3>
                </div>

                <div className="flex items-center gap-3">
                  <span className={`text-xs font-bold px-3 py-1.5 rounded-xl ${item.status === 'Completed' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : item.status === 'In Progress' ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' : 'bg-slate-100 text-slate-600'}`}>
                    {item.status} ({item.progress}%)
                  </span>
                  <button 
                    onClick={() => handleOpenUpdate(item)}
                    className="px-4 py-2 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-700 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
                  >
                    <RefreshCw className="w-3.5 h-3.5" /> Update Progress
                  </button>
                </div>
              </div>

              {/* Progress Bar & Breakdown */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs font-semibold text-slate-600">
                  <span>Completed: <b>{item.completedTopics}</b> / {item.totalTopics} Topics</span>
                  <span>Pending: <b>{item.pendingTopics}</b> Topics</span>
                </div>
                <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden p-0.5 border border-slate-200">
                  <div className="bg-emerald-600 h-full rounded-full transition-all duration-500" style={{ width: `${item.progress}%` }}></div>
                </div>
              </div>

              {/* Topics Preview */}
              <div className="pt-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Included Key Topics:</span>
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                  {item.topicsList.map((t, tidx) => (
                    <span key={tidx} className="text-xs bg-slate-50 border border-slate-200 px-3 py-1 rounded-xl text-slate-700 font-medium">
                      ✓ {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Update Progress Modal */}
      {isUpdateModalOpen && activeUnitForUpdate && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-6">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 uppercase">
                  {activeUnitForUpdate.code}
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-1">Update Progress</h3>
              </div>
              <button onClick={() => setIsUpdateModalOpen(false)} className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold">✕</button>
            </div>

            <form onSubmit={handleSaveProgress} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Unit Title</label>
                <p className="font-semibold text-slate-900 text-sm bg-slate-50 p-3 rounded-xl border border-slate-200">{activeUnitForUpdate.unit}</p>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Completed Topics Count (Total: {activeUnitForUpdate.totalTopics})</label>
                <input 
                  type="number" 
                  min="0"
                  max={activeUnitForUpdate.totalTopics}
                  value={newCompletedCount} 
                  onChange={(e) => setNewCompletedCount(e.target.value)} 
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  required 
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button type="button" onClick={() => setIsUpdateModalOpen(false)} className="px-4 py-2.5 bg-slate-100 text-slate-700 rounded-xl font-bold">Cancel</button>
                <button type="submit" className="px-5 py-2.5 bg-emerald-600 text-white rounded-xl font-bold shadow-sm">Save Progress</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Full Report Modal */}
      {isReportModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100">
              <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <FileText className="w-5 h-5 text-emerald-600" /> Syllabus Completion Executive Report
              </h3>
              <button onClick={() => setIsReportModalOpen(false)} className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold">✕</button>
            </div>

            <div className="space-y-4 text-xs text-slate-700">
              <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">Overall Syllabus Progress</span>
                  <p className="text-xl font-bold text-emerald-900 mt-0.5">{overallCompletionPercentage}% Completed ({completedTopicsCount} of {totalTopicsCount} topics)</p>
                </div>
                <CheckCircle2 className="w-8 h-8 text-emerald-600" />
              </div>

              <div className="space-y-3">
                <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">Unit Breakdown Summary</h4>
                {syllabus.map(s => (
                  <div key={s.id} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between">
                    <div>
                      <p className="font-bold text-slate-900">{s.unit}</p>
                      <p className="text-slate-500 mt-0.5">Target Date: {s.targetDate} • {s.completedTopics}/{s.totalTopics} Topics</p>
                    </div>
                    <span className="font-bold px-3 py-1 bg-white border border-slate-200 rounded-xl text-slate-800">
                      {s.progress}%
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
              <button 
                onClick={() => alert('Printing syllabus completion report...')} 
                className="px-4 py-2.5 bg-slate-100 text-slate-700 rounded-xl font-bold flex items-center gap-1.5"
              >
                <Printer className="w-4 h-4" /> Print Report
              </button>
              <button 
                onClick={() => setIsReportModalOpen(false)} 
                className="px-5 py-2.5 bg-emerald-600 text-white rounded-xl font-bold shadow-sm"
              >
                Close Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
