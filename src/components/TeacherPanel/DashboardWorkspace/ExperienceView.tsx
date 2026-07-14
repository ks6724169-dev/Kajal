import React, { useState } from 'react';
import { Briefcase, Building, Calendar as CalendarIcon, MapPin, Award, BookOpen, Star, Plus, Trash2, CheckCircle2 } from 'lucide-react';

export const ExperienceView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'schools' | 'colleges' | 'orgs' | 'teaching' | 'industry' | 'subjects' | 'achievements' | 'awards'>('all');

  const [schools, setSchools] = useState([
    { id: 1, role: 'Senior Mathematics Teacher', name: 'Galaxy International School', location: 'New York, NY', duration: 'Aug 2018 - Present', desc: 'Leading mathematics department and advanced placement calculus.' },
    { id: 2, role: 'Mathematics Teacher', name: 'Lincoln High School', location: 'Boston, MA', duration: 'Sep 2013 - Jul 2018', desc: 'Taught algebra and geometry to high school students.' }
  ]);

  const [colleges, setColleges] = useState([
    { id: 1, role: 'Guest Lecturer in Calculus', name: 'State University College of Engineering', location: 'New York, NY', duration: '2020 - 2023', desc: 'Conducted weekend advanced calculus workshops for undergraduate students.' }
  ]);

  const [organizations, setOrganizations] = useState([
    { id: 1, role: 'Curriculum Advisor', name: 'National Math Teachers Association', location: 'Washington, DC', duration: '2021 - Present', desc: 'Advising on modern STEM curriculum frameworks and standard assessments.' }
  ]);

  const [industryExp, setIndustryExp] = useState([
    { id: 1, role: 'Educational Data Analyst', name: 'EdTech Innovations Corp', location: 'Remote', duration: '2011 - 2013', desc: 'Analyzed student learning outcome metrics and software usability for interactive math learning tools.' }
  ]);

  const subjectsTaught = [
    'Advanced Calculus (AP/IB)', 'Linear Algebra', 'Trigonometry & Geometry', 'General Mathematics', 'STEM Quantitative Analysis'
  ];

  const [achievements, setAchievements] = useState([
    { id: 1, title: '100% Student Board Exam Pass Rate', year: '2023, 2024', desc: 'Achieved consecutive years of 100% passing rate with over 45% students scoring distinction.' },
    { id: 2, title: 'Best Teacher Innovation Award', year: '2022', desc: 'Recognized for gamified classroom learning models adopted school-wide.' }
  ]);

  const [awards, setAwards] = useState([
    { id: 1, title: 'National Excellence in STEM Education Medal', issuer: 'Ministry of Education', year: '2023' },
    { id: 2, title: 'Outstanding Educator Recognition', issuer: 'State Board of Education', year: '2019' }
  ]);

  const [newItemTitle, setNewItemTitle] = useState('');
  const [newItemSub, setNewItemSub] = useState('');

  const handleAdd = () => {
    if (!newItemTitle.trim()) return;
    if (activeTab === 'schools') {
      setSchools([...schools, { id: Date.now(), role: newItemTitle, name: newItemSub || 'School', location: 'City', duration: '2025 - Present', desc: 'Newly added school experience.' }]);
    } else if (activeTab === 'colleges') {
      setColleges([...colleges, { id: Date.now(), role: newItemTitle, name: newItemSub || 'College', location: 'City', duration: '2025', desc: 'Newly added college experience.' }]);
    } else if (activeTab === 'orgs') {
      setOrganizations([...organizations, { id: Date.now(), role: newItemTitle, name: newItemSub || 'Organization', location: 'City', duration: '2025', desc: 'Newly added organization.' }]);
    } else if (activeTab === 'industry') {
      setIndustryExp([...industryExp, { id: Date.now(), role: newItemTitle, name: newItemSub || 'Company', location: 'City', duration: '2025', desc: 'Newly added industry experience.' }]);
    } else if (activeTab === 'achievements') {
      setAchievements([...achievements, { id: Date.now(), title: newItemTitle, year: '2025', desc: newItemSub || 'Achievement description.' }]);
    } else if (activeTab === 'awards') {
      setAwards([...awards, { id: Date.now(), title: newItemTitle, issuer: newItemSub || 'Issuing Authority', year: '2025' }]);
    }
    setNewItemTitle('');
    setNewItemSub('');
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-20">
      {/* Header & Tabs */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Briefcase className="w-6 h-6 text-indigo-600" />
            Experience, Subjects, Achievements & Awards
          </h2>
          <p className="text-xs text-slate-500 mt-1">Complete professional history, teaching records, industry credentials, and accolades.</p>
        </div>
        <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-2xl w-full md:w-auto overflow-x-auto">
          {(['all', 'schools', 'colleges', 'orgs', 'industry', 'subjects', 'achievements', 'awards'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap capitalize ${activeTab === tab ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Add new bar if activeTab is addable */}
      {['schools', 'colleges', 'orgs', 'industry', 'achievements', 'awards'].includes(activeTab) && (
        <div className="bg-indigo-50/50 border border-indigo-100 rounded-2xl p-4 flex flex-col md:flex-row gap-3 items-center">
          <input
            type="text"
            placeholder={`Enter ${activeTab} title / role...`}
            value={newItemTitle}
            onChange={(e) => setNewItemTitle(e.target.value)}
            className="flex-1 px-4 py-2.5 bg-white border border-indigo-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full"
          />
          <input
            type="text"
            placeholder="Institution / Organization / Issuer..."
            value={newItemSub}
            onChange={(e) => setNewItemSub(e.target.value)}
            className="flex-1 px-4 py-2.5 bg-white border border-indigo-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full"
          />
          <button
            onClick={handleAdd}
            className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 transition flex items-center gap-2 shadow-sm whitespace-nowrap w-full md:w-auto justify-center"
          >
            <Plus className="w-4 h-4" />
            Add {activeTab}
          </button>
        </div>
      )}

      {/* Main Content Layout */}
      <div className="space-y-8">
        {(activeTab === 'all' || activeTab === 'schools' || activeTab === 'teaching') && (
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
              <Building className="w-5 h-5 text-indigo-600" /> Previous Schools
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {schools.map(item => (
                <div key={item.id} className="p-5 bg-slate-50 border border-slate-100 rounded-2xl flex flex-col justify-between">
                  <div className="space-y-2">
                    <span className="text-xs px-2 py-0.5 bg-indigo-50 text-indigo-700 font-semibold rounded">{item.role}</span>
                    <h4 className="text-base font-bold text-slate-900">{item.name}</h4>
                    <p className="text-xs text-slate-500 flex items-center gap-2"><MapPin className="w-3.5 h-3.5" /> {item.location} | <CalendarIcon className="w-3.5 h-3.5" /> {item.duration}</p>
                    <p className="text-xs text-slate-600 pt-2 leading-relaxed">{item.desc}</p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-200/60 flex justify-end">
                    <button onClick={() => setSchools(schools.filter(s => s.id !== item.id))} className="text-slate-400 hover:text-rose-600 transition text-xs flex items-center gap-1 font-semibold">
                      <Trash2 className="w-3.5 h-3.5" /> Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {(activeTab === 'all' || activeTab === 'colleges') && (
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
              <Building className="w-5 h-5 text-indigo-600" /> Colleges & Universities
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {colleges.map(item => (
                <div key={item.id} className="p-5 bg-slate-50 border border-slate-100 rounded-2xl flex flex-col justify-between">
                  <div className="space-y-2">
                    <span className="text-xs px-2 py-0.5 bg-blue-50 text-blue-700 font-semibold rounded">{item.role}</span>
                    <h4 className="text-base font-bold text-slate-900">{item.name}</h4>
                    <p className="text-xs text-slate-500 flex items-center gap-2"><MapPin className="w-3.5 h-3.5" /> {item.location} | <CalendarIcon className="w-3.5 h-3.5" /> {item.duration}</p>
                    <p className="text-xs text-slate-600 pt-2 leading-relaxed">{item.desc}</p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-200/60 flex justify-end">
                    <button onClick={() => setColleges(colleges.filter(c => c.id !== item.id))} className="text-slate-400 hover:text-rose-600 transition text-xs flex items-center gap-1 font-semibold">
                      <Trash2 className="w-3.5 h-3.5" /> Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {(activeTab === 'all' || activeTab === 'orgs') && (
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
              <Briefcase className="w-5 h-5 text-indigo-600" /> Organizations & Committees
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {organizations.map(item => (
                <div key={item.id} className="p-5 bg-slate-50 border border-slate-100 rounded-2xl flex flex-col justify-between">
                  <div className="space-y-2">
                    <span className="text-xs px-2 py-0.5 bg-purple-50 text-purple-700 font-semibold rounded">{item.role}</span>
                    <h4 className="text-base font-bold text-slate-900">{item.name}</h4>
                    <p className="text-xs text-slate-500 flex items-center gap-2"><MapPin className="w-3.5 h-3.5" /> {item.location} | <CalendarIcon className="w-3.5 h-3.5" /> {item.duration}</p>
                    <p className="text-xs text-slate-600 pt-2 leading-relaxed">{item.desc}</p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-200/60 flex justify-end">
                    <button onClick={() => setOrganizations(organizations.filter(o => o.id !== item.id))} className="text-slate-400 hover:text-rose-600 transition text-xs flex items-center gap-1 font-semibold">
                      <Trash2 className="w-3.5 h-3.5" /> Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {(activeTab === 'all' || activeTab === 'industry') && (
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
              <Briefcase className="w-5 h-5 text-indigo-600" /> Industry Experience
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {industryExp.map(item => (
                <div key={item.id} className="p-5 bg-slate-50 border border-slate-100 rounded-2xl flex flex-col justify-between">
                  <div className="space-y-2">
                    <span className="text-xs px-2 py-0.5 bg-emerald-50 text-emerald-700 font-semibold rounded">{item.role}</span>
                    <h4 className="text-base font-bold text-slate-900">{item.name}</h4>
                    <p className="text-xs text-slate-500 flex items-center gap-2"><MapPin className="w-3.5 h-3.5" /> {item.location} | <CalendarIcon className="w-3.5 h-3.5" /> {item.duration}</p>
                    <p className="text-xs text-slate-600 pt-2 leading-relaxed">{item.desc}</p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-200/60 flex justify-end">
                    <button onClick={() => setIndustryExp(industryExp.filter(i => i.id !== item.id))} className="text-slate-400 hover:text-rose-600 transition text-xs flex items-center gap-1 font-semibold">
                      <Trash2 className="w-3.5 h-3.5" /> Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {(activeTab === 'all' || activeTab === 'subjects') && (
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
              <BookOpen className="w-5 h-5 text-indigo-600" /> Subjects Taught
            </h3>
            <div className="flex flex-wrap gap-3">
              {subjectsTaught.map((sub, idx) => (
                <div key={idx} className="px-4 py-2 bg-indigo-50 text-indigo-700 font-semibold text-sm rounded-xl border border-indigo-100 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-indigo-600" />
                  {sub}
                </div>
              ))}
            </div>
          </div>
        )}

        {(activeTab === 'all' || activeTab === 'achievements') && (
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
              <Star className="w-5 h-5 text-amber-500" /> Key Achievements
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {achievements.map(item => (
                <div key={item.id} className="p-5 bg-amber-50/40 border border-amber-100 rounded-2xl flex flex-col justify-between">
                  <div className="space-y-2">
                    <span className="text-xs px-2 py-0.5 bg-amber-100 text-amber-800 font-bold rounded">{item.year}</span>
                    <h4 className="text-base font-bold text-slate-900">{item.title}</h4>
                    <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-amber-200/60 flex justify-end">
                    <button onClick={() => setAchievements(achievements.filter(a => a.id !== item.id))} className="text-slate-400 hover:text-rose-600 transition text-xs flex items-center gap-1 font-semibold">
                      <Trash2 className="w-3.5 h-3.5" /> Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {(activeTab === 'all' || activeTab === 'awards') && (
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
              <Award className="w-5 h-5 text-purple-600" /> Awards & Honors
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {awards.map(item => (
                <div key={item.id} className="p-5 bg-purple-50/40 border border-purple-100 rounded-2xl flex flex-col justify-between">
                  <div className="space-y-2">
                    <span className="text-xs px-2 py-0.5 bg-purple-100 text-purple-800 font-bold rounded">{item.year}</span>
                    <h4 className="text-base font-bold text-slate-900">{item.title}</h4>
                    <p className="text-xs text-slate-600 font-medium">{item.issuer}</p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-purple-200/60 flex justify-end">
                    <button onClick={() => setAwards(awards.filter(a => a.id !== item.id))} className="text-slate-400 hover:text-rose-600 transition text-xs flex items-center gap-1 font-semibold">
                      <Trash2 className="w-3.5 h-3.5" /> Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
