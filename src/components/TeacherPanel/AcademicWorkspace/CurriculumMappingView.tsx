import React, { useState } from 'react';
import { BookOpen, Compass, Plus, Search, Calendar, CheckCircle2, Award, Layers, Sparkles, Edit, RefreshCw } from 'lucide-react';

export const CurriculumMappingView: React.FC = () => {
  const [curriculums, setCurriculums] = useState([
    {
      id: 1,
      subject: 'Advanced Mathematics',
      grade: 'Grade 10',
      structure: 'Term 1 & Term 2 Core Syllabus',
      chapters: [
        {
          title: 'Chapter 1: Limits & Continuity',
          topics: ['Introduction to Limits', 'One-Sided Limits', 'Continuity Criteria', 'Epsilon-Delta Definition'],
          outcomes: 'Evaluate algebraic limits and determine function continuity.',
          competencies: 'Analytical reasoning, rigorous proof comprehension.',
          timeline: 'Weeks 1 - 3 (July 2026)'
        },
        {
          title: 'Chapter 2: Differential Calculus',
          topics: ['Derivatives from First Principles', 'Power, Product, and Quotient Rules', 'Chain Rule & Implicit Differentiation'],
          outcomes: 'Differentiate complex composite and trigonometric functions.',
          competencies: 'Mathematical modeling and rate-of-change applications.',
          timeline: 'Weeks 4 - 7 (August 2026)'
        }
      ],
      status: 'Mapped'
    },
    {
      id: 2,
      subject: 'Calculus AP',
      grade: 'Grade 11',
      structure: 'Advanced Placement AB Curriculum',
      chapters: [
        {
          title: 'Chapter 1: Integration Techniques',
          topics: ['Riemann Sums', 'Fundamental Theorem of Calculus', 'Integration by Substitution', 'Integration by Parts'],
          outcomes: 'Compute definite and indefinite integrals for transcendental functions.',
          competencies: 'Accumulation problems and area under curve modeling.',
          timeline: 'Weeks 1 - 4 (July 2026)'
        }
      ],
      status: 'Mapped'
    }
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [subject, setSubject] = useState('Trigonometry & Vectors');
  const [grade, setGrade] = useState('Grade 12');
  const [structure, setStructure] = useState('Semester 1 Curriculum');
  const [chapterTitle, setChapterTitle] = useState('Chapter 1: Vector Spaces');
  const [topicsStr, setTopicsStr] = useState('Dot Product, Cross Product, 3D Lines');
  const [outcomes, setOutcomes] = useState('Spatial vector manipulation and geometric proofs.');
  const [competencies, setCompetencies] = useState('Spatial visualization and linear algebra proficiency.');
  const [timeline, setTimeline] = useState('Weeks 1 - 4 (July 2026)');

  const handleMapCurriculum = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim()) return;

    const newMap = {
      id: Date.now(),
      subject,
      grade,
      structure,
      chapters: [
        {
          title: chapterTitle,
          topics: topicsStr.split(',').map(s => s.trim()),
          outcomes,
          competencies,
          timeline
        }
      ],
      status: 'Mapped'
    };

    setCurriculums([newMap, ...curriculums]);
    setSubject('');
    setIsModalOpen(false);
    alert('Curriculum successfully mapped!');
  };

  const filteredCurriculums = curriculums.filter(c => 
    c.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.grade.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.structure.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-20">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Compass className="w-6 h-6 text-emerald-600" />
            Curriculum Mapping & Structure Hub
          </h2>
          <p className="text-xs text-slate-500 mt-1">Structure curriculum chapters, topics, learning outcomes, competencies, and teaching timelines.</p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input 
              type="text" 
              placeholder="Search curriculum..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2.5 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 transition flex items-center gap-2 shadow-sm whitespace-nowrap"
          >
            <Plus className="w-4 h-4" /> Map Curriculum
          </button>
        </div>
      </div>

      {/* Curriculum List */}
      <div className="space-y-6">
        {filteredCurriculums.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-3xl p-16 text-center text-slate-400 text-sm">
            No curriculum mapping found matching your search.
          </div>
        ) : (
          filteredCurriculums.map(item => (
            <div key={item.id} className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 uppercase">
                      {item.grade}
                    </span>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700">
                      {item.structure}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">{item.subject}</h3>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold px-3 py-1 bg-emerald-50 text-emerald-700 rounded-xl flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> {item.status}
                  </span>
                  <button 
                    onClick={() => alert(`Updating curriculum structure for ${item.subject}...`)}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1 transition"
                  >
                    <RefreshCw className="w-3.5 h-3.5" /> Update
                  </button>
                </div>
              </div>

              {/* Chapters & Competencies Breakdown */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Chapters & Competency Mapping</h4>
                {item.chapters.map((ch, idx) => (
                  <div key={idx} className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-3">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                      <h5 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-emerald-600" /> {ch.title}
                      </h5>
                      <span className="text-xs font-semibold bg-white border border-slate-200 px-3 py-1 rounded-xl text-slate-600 flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-slate-400" /> {ch.timeline}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Topics Covered:</span>
                      <div className="flex flex-wrap gap-1.5 mt-1">
                        {ch.topics.map((t, tidx) => (
                          <span key={tidx} className="text-xs bg-white border border-slate-200 px-2.5 py-1 rounded-lg text-slate-700 font-medium">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-slate-200/60 text-xs">
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Learning Outcomes:</span>
                        <p className="text-slate-700 mt-0.5 font-medium">{ch.outcomes}</p>
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Core Competencies:</span>
                        <p className="text-slate-700 mt-0.5 font-medium">{ch.competencies}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Map Curriculum Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900">Map New Curriculum Structure</h3>
              <button onClick={() => setIsModalOpen(false)} className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold">✕</button>
            </div>

            <form onSubmit={handleMapCurriculum} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Subject Name</label>
                  <input 
                    type="text" 
                    value={subject} 
                    onChange={(e) => setSubject(e.target.value)} 
                    placeholder="e.g. Physics Mechanics" 
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Grade Level</label>
                  <input 
                    type="text" 
                    value={grade} 
                    onChange={(e) => setGrade(e.target.value)} 
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Curriculum Structure / Framework</label>
                <input 
                  type="text" 
                  value={structure} 
                  onChange={(e) => setStructure(e.target.value)} 
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Chapter Title</label>
                <input 
                  type="text" 
                  value={chapterTitle} 
                  onChange={(e) => setChapterTitle(e.target.value)} 
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Topics (comma separated)</label>
                <input 
                  type="text" 
                  value={topicsStr} 
                  onChange={(e) => setTopicsStr(e.target.value)} 
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Learning Outcomes</label>
                <textarea 
                  rows={2} 
                  value={outcomes} 
                  onChange={(e) => setOutcomes(e.target.value)} 
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl resize-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Competencies</label>
                <input 
                  type="text" 
                  value={competencies} 
                  onChange={(e) => setCompetencies(e.target.value)} 
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Teaching Timeline</label>
                <input 
                  type="text" 
                  value={timeline} 
                  onChange={(e) => setTimeline(e.target.value)} 
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2.5 bg-slate-100 text-slate-700 rounded-xl font-bold">Cancel</button>
                <button type="submit" className="px-5 py-2.5 bg-emerald-600 text-white rounded-xl font-bold shadow-sm">Save & Map Curriculum</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
