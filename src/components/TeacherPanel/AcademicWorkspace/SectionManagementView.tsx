import React, { useState } from 'react';
import { Layers, Search, Eye, Users, User, MapPin, Plus, Trash2, BookOpen } from 'lucide-react';

export const SectionManagementView: React.FC = () => {
  const [sections, setSections] = useState([
    { id: 1, name: 'Section A', class: 'Grade 10 - Advanced Mathematics', teacher: 'Dr. John Doe', strength: 42, classroom: 'Room 101', status: 'Active' },
    { id: 2, name: 'Section B', class: 'Grade 10 - Advanced Mathematics', teacher: 'Prof. Sarah Jenkins', strength: 40, classroom: 'Room 103', status: 'Active' },
    { id: 3, name: 'Section A', class: 'Grade 11 - Calculus AP', teacher: 'Dr. John Doe', strength: 38, classroom: 'Lab 2', status: 'Active' },
    { id: 4, name: 'Section A', class: 'Grade 12 - Trigonometry & Statistics', teacher: 'Prof. Alan Turing', strength: 35, classroom: 'Room 105', status: 'Active' },
    { id: 5, name: 'Section C', class: 'Grade 9 - General Foundation Math', teacher: 'Dr. John Doe', strength: 45, classroom: 'Room 102', status: 'Active' }
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSection, setSelectedSection] = useState<any>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [name, setName] = useState('Section D');
  const [className, setClassName] = useState('Grade 10 - Advanced Mathematics');
  const [teacher, setTeacher] = useState('Dr. John Doe');
  const [strength, setStrength] = useState('40');
  const [classroom, setClassroom] = useState('Room 106');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setSections([...sections, {
      id: Date.now(),
      name,
      class: className,
      teacher,
      strength: parseInt(strength) || 40,
      classroom,
      status: 'Active'
    }]);
    setName('');
    setIsAddModalOpen(false);
    alert('Section added successfully.');
  };

  const handleDelete = (id: number) => {
    setSections(sections.filter(s => s.id !== id));
  };

  const filteredSections = sections.filter(sec => 
    sec.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    sec.class.toLowerCase().includes(searchQuery.toLowerCase()) ||
    sec.teacher.toLowerCase().includes(searchQuery.toLowerCase()) ||
    sec.classroom.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-20">
      {/* Header & Controls */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Layers className="w-6 h-6 text-emerald-600" />
            Section Management & Classroom Allocation Hub
          </h2>
          <p className="text-xs text-slate-500 mt-1">Manage section lists, class association, section teachers, student strengths, and classroom allocations.</p>
        </div>

        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2.5 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 transition flex items-center gap-2 shadow-sm"
        >
          <Plus className="w-4 h-4" /> Add Section
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input 
            type="text" 
            placeholder="Search sections, classes, teachers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
      </div>

      {/* Sections Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSections.length === 0 ? (
          <div className="col-span-full bg-white border border-slate-200 rounded-3xl p-16 text-center text-slate-400 text-sm">
            No sections found matching your search.
          </div>
        ) : (
          filteredSections.map(sec => (
            <div key={sec.id} className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:shadow-md transition flex flex-col justify-between group space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase tracking-wider">
                    {sec.name}
                  </span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                    {sec.status}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-600 transition flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-slate-400 flex-shrink-0" /> {sec.class}
                </h3>

                <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 pt-2 border-t border-slate-100">
                  <span className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5 text-slate-400" /> Strength: <b>{sec.strength}</b></span>
                  <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-slate-400" /> {sec.classroom}</span>
                </div>

                <div className="text-xs text-slate-700 font-medium flex items-center gap-1.5 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <User className="w-3.5 h-3.5 text-emerald-600" /> Teacher: <b>{sec.teacher}</b>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <button 
                  onClick={() => { setSelectedSection(sec); setIsViewModalOpen(true); }}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-700 rounded-xl text-xs font-semibold transition flex items-center gap-1"
                >
                  <Eye className="w-3.5 h-3.5" /> View Details
                </button>
                <button 
                  onClick={() => handleDelete(sec.id)}
                  className="p-2 text-slate-400 hover:text-rose-600 transition rounded-xl"
                  title="Delete Section"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* View Modal */}
      {isViewModalOpen && selectedSection && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-6">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 uppercase">
                  {selectedSection.name}
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-1">{selectedSection.class}</h3>
              </div>
              <button onClick={() => setIsViewModalOpen(false)} className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-200 font-bold">✕</button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <div>
                  <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Section Teacher</span>
                  <p className="text-sm font-bold text-slate-900 mt-0.5 flex items-center gap-1">
                    <User className="w-3.5 h-3.5 text-emerald-600" /> {selectedSection.teacher}
                  </p>
                </div>
                <div>
                  <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Student Strength</span>
                  <p className="text-sm font-bold text-slate-900 mt-0.5">{selectedSection.strength} Students</p>
                </div>
                <div className="col-span-2">
                  <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Classroom Allocation</span>
                  <p className="text-sm font-bold text-emerald-600 mt-0.5 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" /> {selectedSection.classroom}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-100">
              <button onClick={() => setIsViewModalOpen(false)} className="px-5 py-2.5 bg-slate-100 text-slate-700 rounded-xl font-semibold text-xs">Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Add Section Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-6">
            <h3 className="text-lg font-bold text-slate-900">Add New Section</h3>
            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Section Name / ID</label>
                <input 
                  type="text" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  placeholder="e.g. Section C" 
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-xs" 
                  required 
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Associated Class</label>
                <input 
                  type="text" 
                  value={className} 
                  onChange={(e) => setClassName(e.target.value)} 
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-xs" 
                  required 
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Section Teacher</label>
                <input 
                  type="text" 
                  value={teacher} 
                  onChange={(e) => setTeacher(e.target.value)} 
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-xs" 
                  required 
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Student Strength</label>
                  <input 
                    type="number" 
                    value={strength} 
                    onChange={(e) => setStrength(e.target.value)} 
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-xs" 
                    required 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Classroom Allocation</label>
                  <input 
                    type="text" 
                    value={classroom} 
                    onChange={(e) => setClassroom(e.target.value)} 
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-xs" 
                    required 
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-4 py-2.5 bg-slate-100 text-slate-700 rounded-xl text-xs">Cancel</button>
                <button type="submit" className="px-5 py-2.5 bg-emerald-600 text-white rounded-xl text-xs font-bold shadow-sm">Save Section</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
