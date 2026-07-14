import React, { useState } from 'react';
import { GraduationCap, Award, Book, Briefcase, FileText, CheckCircle, Calendar, Plus, Trash2 } from 'lucide-react';

export const QualificationsView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'degrees' | 'diplomas' | 'certifications' | 'workshops' | 'training' | 'seminars' | 'skills'>('degrees');

  const [degrees, setDegrees] = useState([
    { id: 1, title: 'Master of Science in Mathematics', institution: 'State University', year: '2012', grade: '3.8 GPA (Distinction)' },
    { id: 2, title: 'Bachelor of Education (B.Ed)', institution: 'National Institute of Education', year: '2010', grade: 'First Class' },
    { id: 3, title: 'Bachelor of Science (B.Sc. Mathematics)', institution: 'State University', year: '2009', grade: 'First Class' }
  ]);

  const [diplomas, setDiplomas] = useState([
    { id: 1, title: 'Advanced Diploma in Educational Technology', institution: 'Global EdTech Academy', year: '2015', duration: '1 Year' },
    { id: 2, title: 'Diploma in Child Psychology & Counseling', institution: 'Institute of Behavioral Studies', year: '2014', duration: '6 Months' }
  ]);

  const [certifications, setCertifications] = useState([
    { id: 1, title: 'Google Certified Educator - Level 2', issuer: 'Google for Education', year: '2023', validity: 'Lifetime' },
    { id: 2, title: 'Advanced Calculus Teaching Specialist', issuer: 'International Math Association', year: '2021', validity: '2026' }
  ]);

  const [workshops, setWorkshops] = useState([
    { id: 1, title: 'Interactive STEM Learning & Gamified Pedagogy', organizer: 'National Teachers Forum', date: 'Nov 2024', hours: '16 Hours' },
    { id: 2, title: 'Inclusive Classrooms & Special Needs Support', organizer: 'EduCare Foundation', date: 'Aug 2023', hours: '12 Hours' }
  ]);

  const [training, setTraining] = useState([
    { id: 1, title: 'AI-Assisted Lesson Planning & Assessment', organizer: 'Galaxy EdTech Hub', date: 'January 2025', duration: '3 Weeks' },
    { id: 2, title: 'Advanced Leadership & Mentorship in Academics', organizer: 'Global Pedagogical Institute', date: 'July 2022', duration: '2 Months' }
  ]);

  const [seminars, setSeminars] = useState([
    { id: 1, title: 'Future of Mathematics Education in Digital Era', role: 'Keynote Speaker', location: 'Annual EdCon 2024' },
    { id: 2, title: 'Bridging Gaps in STEM Higher Education', role: 'Panelist', location: 'National Science Symposium 2023' }
  ]);

  const [skillsCerts, setSkillsCerts] = useState([
    { id: 1, title: 'Data Analytics & Student Performance Tracking', issuedBy: 'Coursera', score: '98%' },
    { id: 2, title: 'Advanced Public Speaking & Effective Communication', issuedBy: 'Toastmasters Int.', score: 'Certified' }
  ]);

  const [newItemTitle, setNewItemTitle] = useState('');
  const [newItemSub, setNewItemSub] = useState('');

  const handleAddItem = () => {
    if (!newItemTitle.trim()) return;
    if (activeTab === 'degrees') {
      setDegrees([...degrees, { id: Date.now(), title: newItemTitle, institution: newItemSub || 'University', year: '2026', grade: 'Passed' }]);
    } else if (activeTab === 'diplomas') {
      setDiplomas([...diplomas, { id: Date.now(), title: newItemTitle, institution: newItemSub || 'Institute', year: '2026', duration: '1 Year' }]);
    } else if (activeTab === 'certifications') {
      setCertifications([...certifications, { id: Date.now(), title: newItemTitle, issuer: newItemSub || 'Authority', year: '2026', validity: 'Lifetime' }]);
    } else if (activeTab === 'workshops') {
      setWorkshops([...workshops, { id: Date.now(), title: newItemTitle, organizer: newItemSub || 'Organizer', date: '2026', hours: '10 Hours' }]);
    } else if (activeTab === 'training') {
      setTraining([...training, { id: Date.now(), title: newItemTitle, organizer: newItemSub || 'Provider', date: '2026', duration: '2 Weeks' }]);
    } else if (activeTab === 'seminars') {
      setSeminars([...seminars, { id: Date.now(), title: newItemTitle, role: 'Speaker', location: newItemSub || 'Conference' }]);
    } else if (activeTab === 'skills') {
      setSkillsCerts([...skillsCerts, { id: Date.now(), title: newItemTitle, issuedBy: newItemSub || 'Platform', score: 'Certified' }]);
    }
    setNewItemTitle('');
    setNewItemSub('');
  };

  const handleDelete = (id: number) => {
    if (activeTab === 'degrees') setDegrees(degrees.filter(d => d.id !== id));
    if (activeTab === 'diplomas') setDiplomas(diplomas.filter(d => d.id !== id));
    if (activeTab === 'certifications') setCertifications(certifications.filter(c => c.id !== id));
    if (activeTab === 'workshops') setWorkshops(workshops.filter(w => w.id !== id));
    if (activeTab === 'training') setTraining(training.filter(t => t.id !== id));
    if (activeTab === 'seminars') setSeminars(seminars.filter(s => s.id !== id));
    if (activeTab === 'skills') setSkillsCerts(skillsCerts.filter(s => s.id !== id));
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-20">
      {/* Header Banner */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <GraduationCap className="w-6 h-6 text-indigo-600" />
            Educational & Professional Qualifications
          </h2>
          <p className="text-xs text-slate-500 mt-1">Complete portfolio of academic credentials, certifications, workshops, and skill certificates.</p>
        </div>
        <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-2xl w-full md:w-auto overflow-x-auto">
          <button 
            onClick={() => setActiveTab('degrees')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${activeTab === 'degrees' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
          >
            Degrees ({degrees.length})
          </button>
          <button 
            onClick={() => setActiveTab('diplomas')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${activeTab === 'diplomas' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
          >
            Diplomas ({diplomas.length})
          </button>
          <button 
            onClick={() => setActiveTab('certifications')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${activeTab === 'certifications' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
          >
            Certifications ({certifications.length})
          </button>
          <button 
            onClick={() => setActiveTab('workshops')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${activeTab === 'workshops' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
          >
            Workshops ({workshops.length})
          </button>
          <button 
            onClick={() => setActiveTab('training')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${activeTab === 'training' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
          >
            Training ({training.length})
          </button>
          <button 
            onClick={() => setActiveTab('seminars')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${activeTab === 'seminars' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
          >
            Seminars ({seminars.length})
          </button>
          <button 
            onClick={() => setActiveTab('skills')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${activeTab === 'skills' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
          >
            Skill Certificates ({skillsCerts.length})
          </button>
        </div>
      </div>

      {/* Add New Section */}
      <div className="bg-indigo-50/50 border border-indigo-100 rounded-2xl p-4 flex flex-col md:flex-row gap-3 items-center">
        <input 
          type="text" 
          placeholder={`Enter new ${activeTab} title...`} 
          value={newItemTitle}
          onChange={(e) => setNewItemTitle(e.target.value)}
          className="flex-1 px-4 py-2.5 bg-white border border-indigo-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full"
        />
        <input 
          type="text" 
          placeholder="Institution / Issuer / Organizer..." 
          value={newItemSub}
          onChange={(e) => setNewItemSub(e.target.value)}
          className="flex-1 px-4 py-2.5 bg-white border border-indigo-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full"
        />
        <button 
          onClick={handleAddItem}
          className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 transition flex items-center gap-2 shadow-sm whitespace-nowrap w-full md:w-auto justify-center"
        >
          <Plus className="w-4 h-4" />
          Add Item
        </button>
      </div>

      {/* Content List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {activeTab === 'degrees' && degrees.map(item => (
          <div key={item.id} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition">
            <div className="space-y-3">
              <span className="text-xs px-2.5 py-1 bg-indigo-50 text-indigo-700 font-semibold rounded-lg">Degree</span>
              <h3 className="text-base font-bold text-slate-900">{item.title}</h3>
              <p className="text-xs text-slate-600 font-medium">{item.institution}</p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {item.year}</span>
              <span className="font-semibold text-emerald-600">{item.grade}</span>
              <button onClick={() => handleDelete(item.id)} className="text-slate-400 hover:text-rose-600 transition"><Trash2 className="w-4 h-4" /></button>
            </div>
          </div>
        ))}

        {activeTab === 'diplomas' && diplomas.map(item => (
          <div key={item.id} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition">
            <div className="space-y-3">
              <span className="text-xs px-2.5 py-1 bg-blue-50 text-blue-700 font-semibold rounded-lg">Diploma</span>
              <h3 className="text-base font-bold text-slate-900">{item.title}</h3>
              <p className="text-xs text-slate-600 font-medium">{item.institution}</p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {item.year}</span>
              <span className="font-semibold text-blue-600">{item.duration}</span>
              <button onClick={() => handleDelete(item.id)} className="text-slate-400 hover:text-rose-600 transition"><Trash2 className="w-4 h-4" /></button>
            </div>
          </div>
        ))}

        {activeTab === 'certifications' && certifications.map(item => (
          <div key={item.id} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition">
            <div className="space-y-3">
              <span className="text-xs px-2.5 py-1 bg-purple-50 text-purple-700 font-semibold rounded-lg">Certification</span>
              <h3 className="text-base font-bold text-slate-900">{item.title}</h3>
              <p className="text-xs text-slate-600 font-medium">{item.issuer}</p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {item.year}</span>
              <span className="font-semibold text-purple-600">{item.validity}</span>
              <button onClick={() => handleDelete(item.id)} className="text-slate-400 hover:text-rose-600 transition"><Trash2 className="w-4 h-4" /></button>
            </div>
          </div>
        ))}

        {activeTab === 'workshops' && workshops.map(item => (
          <div key={item.id} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition">
            <div className="space-y-3">
              <span className="text-xs px-2.5 py-1 bg-amber-50 text-amber-700 font-semibold rounded-lg">Workshop</span>
              <h3 className="text-base font-bold text-slate-900">{item.title}</h3>
              <p className="text-xs text-slate-600 font-medium">{item.organizer}</p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {item.date}</span>
              <span className="font-semibold text-amber-600">{item.hours}</span>
              <button onClick={() => handleDelete(item.id)} className="text-slate-400 hover:text-rose-600 transition"><Trash2 className="w-4 h-4" /></button>
            </div>
          </div>
        ))}

        {activeTab === 'training' && training.map(item => (
          <div key={item.id} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition">
            <div className="space-y-3">
              <span className="text-xs px-2.5 py-1 bg-emerald-50 text-emerald-700 font-semibold rounded-lg">Training</span>
              <h3 className="text-base font-bold text-slate-900">{item.title}</h3>
              <p className="text-xs text-slate-600 font-medium">{item.organizer}</p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {item.date}</span>
              <span className="font-semibold text-emerald-600">{item.duration}</span>
              <button onClick={() => handleDelete(item.id)} className="text-slate-400 hover:text-rose-600 transition"><Trash2 className="w-4 h-4" /></button>
            </div>
          </div>
        ))}

        {activeTab === 'seminars' && seminars.map(item => (
          <div key={item.id} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition">
            <div className="space-y-3">
              <span className="text-xs px-2.5 py-1 bg-teal-50 text-teal-700 font-semibold rounded-lg">Seminar</span>
              <h3 className="text-base font-bold text-slate-900">{item.title}</h3>
              <p className="text-xs text-slate-600 font-medium">{item.location}</p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span className="font-semibold text-teal-600">{item.role}</span>
              <button onClick={() => handleDelete(item.id)} className="text-slate-400 hover:text-rose-600 transition"><Trash2 className="w-4 h-4" /></button>
            </div>
          </div>
        ))}

        {activeTab === 'skills' && skillsCerts.map(item => (
          <div key={item.id} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition">
            <div className="space-y-3">
              <span className="text-xs px-2.5 py-1 bg-rose-50 text-rose-700 font-semibold rounded-lg">Skill Cert</span>
              <h3 className="text-base font-bold text-slate-900">{item.title}</h3>
              <p className="text-xs text-slate-600 font-medium">{item.issuedBy}</p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span className="font-semibold text-rose-600">{item.score}</span>
              <button onClick={() => handleDelete(item.id)} className="text-slate-400 hover:text-rose-600 transition"><Trash2 className="w-4 h-4" /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
