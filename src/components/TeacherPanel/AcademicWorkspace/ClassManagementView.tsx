import React, { useState } from 'react';
import { 
  BookOpen, 
  Users, 
  Plus, 
  Search, 
  Trash2, 
  Edit, 
  CheckCircle, 
  MapPin, 
  Calendar, 
  Printer, 
  FileSpreadsheet, 
  FileText, 
  Grid, 
  FileBox, 
  Eye,
  Layers,
  Sparkles
} from 'lucide-react';

export const ClassManagementView: React.FC = () => {
  const [classes, setClasses] = useState([
    { 
      id: 1, 
      name: 'Grade 10 - Advanced Mathematics', 
      code: 'MATH-10A', 
      students: 42, 
      room: 'Room 101', 
      schedule: 'Mon, Wed, Fri (08:00 AM)', 
      status: 'Active',
      subjectAllocation: 'Advanced Calculus & Algebra',
      classStrength: 'Optimal (42/45 capacity)',
      seatingPlan: 'Rows & Columns Standard (6x7 layout)',
      classroomNotes: 'Projector installed. Whiteboard markers refilled. Honors section.'
    },
    { 
      id: 2, 
      name: 'Grade 11 - Calculus AP', 
      code: 'MATH-11B', 
      students: 38, 
      room: 'Lab 2', 
      schedule: 'Tue, Thu (09:00 AM)', 
      status: 'Active',
      subjectAllocation: 'AP Calculus AB Curriculum',
      classStrength: 'Full (38/40 capacity)',
      seatingPlan: 'U-Shape Discussion Layout',
      classroomNotes: 'Requires graphing calculators for Friday session.'
    },
    { 
      id: 3, 
      name: 'Grade 12 - Trigonometry & Statistics', 
      code: 'MATH-12A', 
      students: 35, 
      room: 'Room 105', 
      schedule: 'Mon, Thu (11:00 AM)', 
      status: 'Active',
      subjectAllocation: 'Applied Probability & Trig',
      classStrength: 'Balanced (35/45 capacity)',
      seatingPlan: 'Cluster Group Tables (5 groups of 7)',
      classroomNotes: 'Midterm review scheduled for next week.'
    },
    { 
      id: 4, 
      name: 'Grade 9 - General Foundation Math', 
      code: 'MATH-09C', 
      students: 45, 
      room: 'Room 102', 
      schedule: 'Wed, Fri (10:00 AM)', 
      status: 'Active',
      subjectAllocation: 'Algebra Foundations & Arithmetic',
      classStrength: 'Maximum Capacity (45/45)',
      seatingPlan: 'Standard Classroom Grid',
      classroomNotes: 'Remedial coaching needed for bottom quartile.'
    },
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClass, setSelectedClass] = useState<any>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [newName, setNewName] = useState('');
  const [newCode, setNewCode] = useState('');
  const [newStudents, setNewStudents] = useState('40');
  const [newRoom, setNewRoom] = useState('Room 101');
  const [newSchedule, setNewSchedule] = useState('Mon, Wed (09:00 AM)');
  const [newSubjectAlloc, setNewSubjectAlloc] = useState('Mathematics Curriculum');

  const handleAddClass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    const newCls = {
      id: Date.now(),
      name: newName,
      code: newCode || 'MATH-NEW',
      students: parseInt(newStudents) || 35,
      room: newRoom,
      schedule: newSchedule,
      status: 'Active',
      subjectAllocation: newSubjectAlloc,
      classStrength: 'Optimal',
      seatingPlan: 'Standard 6x7 Grid',
      classroomNotes: 'Newly added class.'
    };
    setClasses([...classes, newCls]);
    setNewName('');
    setNewCode('');
    setIsAddModalOpen(false);
    alert('New class created successfully.');
  };

  const handleDelete = (id: number) => {
    setClasses(classes.filter(c => c.id !== id));
  };

  const handleViewDetails = (cls: any) => {
    setSelectedClass(cls);
    setIsDetailModalOpen(true);
  };

  const handlePrint = (name: string) => {
    alert(`Printing details & roster for ${name}...`);
  };

  const handleExportPDF = (name: string) => {
    alert(`Exporting ${name} class details to PDF...`);
  };

  const handleExportExcel = (name: string) => {
    alert(`Exporting ${name} student count & subject allocation to Excel...`);
  };

  const filteredClasses = classes.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.subjectAllocation.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-20">
      {/* Top Banner */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-emerald-600" />
            Class Management & Assigned Classes Hub
          </h2>
          <p className="text-xs text-slate-500 mt-1">Manage my classes, student counts, subject allocations, class strength, seating plans, and classroom notes.</p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input 
              type="text" 
              placeholder="Search classes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2.5 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 transition flex items-center gap-2 shadow-sm whitespace-nowrap"
          >
            <Plus className="w-4 h-4" /> Add Class
          </button>
        </div>
      </div>

      {/* Classes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredClasses.length === 0 ? (
          <div className="col-span-full bg-white border border-slate-200 rounded-3xl p-16 text-center text-slate-400 text-sm">
            No classes found matching your search.
          </div>
        ) : (
          filteredClasses.map(cls => (
            <div key={cls.id} className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:shadow-md transition flex flex-col justify-between group space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase tracking-wider">
                    {cls.code}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">
                      {cls.status}
                    </span>
                  </div>
                </div>

                <h3 className="text-lg font-bold text-slate-900 group-hover:text-emerald-600 transition">
                  {cls.name}
                </h3>

                <p className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-xl inline-block">
                  Subject: {cls.subjectAllocation}
                </p>

                <div className="grid grid-cols-2 gap-3 text-xs text-slate-600 pt-2 border-t border-slate-100">
                  <span className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5 text-slate-400" /> Students: <b>{cls.students}</b></span>
                  <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-slate-400" /> Room: {cls.room}</span>
                  <span className="flex items-center gap-1.5 col-span-2"><Calendar className="w-3.5 h-3.5 text-slate-400" /> {cls.schedule}</span>
                </div>

                <div className="text-xs text-slate-500 bg-slate-50 p-2.5 rounded-xl border border-slate-100 space-y-1">
                  <p><b>Strength:</b> {cls.classStrength}</p>
                  <p><b>Seating:</b> {cls.seatingPlan}</p>
                </div>
              </div>

              {/* Actions Bar */}
              <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  <button 
                    onClick={() => handleViewDetails(cls)}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-700 rounded-xl text-xs font-semibold transition flex items-center gap-1"
                    title="View Details"
                  >
                    <Eye className="w-3.5 h-3.5" /> View
                  </button>
                  <button 
                    onClick={() => handlePrint(cls.name)}
                    className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl transition"
                    title="Print"
                  >
                    <Printer className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => handleExportPDF(cls.name)}
                    className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl transition"
                    title="Export PDF"
                  >
                    <FileText className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => handleExportExcel(cls.name)}
                    className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl transition"
                    title="Export Excel"
                  >
                    <FileSpreadsheet className="w-4 h-4" />
                  </button>
                </div>

                <button 
                  onClick={() => handleDelete(cls.id)}
                  className="p-2 text-slate-400 hover:text-rose-600 rounded-xl transition"
                  title="Delete Class"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Class Details Modal */}
      {isDetailModalOpen && selectedClass && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 uppercase">
                  {selectedClass.code}
                </span>
                <h3 className="text-xl font-bold text-slate-900 mt-1">{selectedClass.name}</h3>
              </div>
              <button 
                onClick={() => setIsDetailModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-200 font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <div>
                  <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Student Count</span>
                  <p className="text-base font-bold text-slate-900 mt-0.5">{selectedClass.students} Enrolled</p>
                </div>
                <div>
                  <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Classroom Room</span>
                  <p className="text-base font-bold text-slate-900 mt-0.5">{selectedClass.room}</p>
                </div>
                <div>
                  <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Subject Allocation</span>
                  <p className="text-sm font-bold text-indigo-600 mt-0.5">{selectedClass.subjectAllocation}</p>
                </div>
                <div>
                  <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Class Strength</span>
                  <p className="text-sm font-bold text-emerald-600 mt-0.5">{selectedClass.classStrength}</p>
                </div>
              </div>

              <div className="p-4 bg-indigo-50/50 border border-indigo-100 rounded-2xl space-y-2">
                <h4 className="font-bold text-indigo-900 flex items-center gap-1.5">
                  <Grid className="w-4 h-4 text-indigo-600" /> Seating Plan Configuration
                </h4>
                <p className="text-slate-700">{selectedClass.seatingPlan}</p>
              </div>

              <div className="p-4 bg-amber-50/50 border border-amber-100 rounded-2xl space-y-2">
                <h4 className="font-bold text-amber-900 flex items-center gap-1.5">
                  <FileBox className="w-4 h-4 text-amber-600" /> Classroom Notes & Infrastructure Log
                </h4>
                <p className="text-slate-700">{selectedClass.classroomNotes}</p>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
              <button 
                onClick={() => { handlePrint(selectedClass.name); }}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5"
              >
                <Printer className="w-4 h-4" /> Print Details
              </button>
              <button 
                onClick={() => { handleExportPDF(selectedClass.name); }}
                className="px-4 py-2.5 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 transition flex items-center gap-1.5 shadow-sm"
              >
                <FileText className="w-4 h-4" /> Export PDF
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Class Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-6">
            <h3 className="text-lg font-bold text-slate-900">Add New Class & Allocation</h3>
            <form onSubmit={handleAddClass} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Class Title</label>
                <input 
                  type="text" 
                  value={newName} 
                  onChange={(e) => setNewName(e.target.value)} 
                  placeholder="e.g. Grade 10 Physics" 
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Class Code</label>
                <input 
                  type="text" 
                  value={newCode} 
                  onChange={(e) => setNewCode(e.target.value)} 
                  placeholder="e.g. PHYS-10A" 
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Student Count</label>
                  <input 
                    type="number" 
                    value={newStudents} 
                    onChange={(e) => setNewStudents(e.target.value)} 
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Room</label>
                  <input 
                    type="text" 
                    value={newRoom} 
                    onChange={(e) => setNewRoom(e.target.value)} 
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Subject Allocation</label>
                <input 
                  type="text" 
                  value={newSubjectAlloc} 
                  onChange={(e) => setNewSubjectAlloc(e.target.value)} 
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Schedule</label>
                <input 
                  type="text" 
                  value={newSchedule} 
                  onChange={(e) => setNewSchedule(e.target.value)} 
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-4 py-2.5 bg-slate-100 text-slate-700 rounded-xl text-xs font-semibold">Cancel</button>
                <button type="submit" className="px-5 py-2.5 bg-emerald-600 text-white rounded-xl text-xs font-bold shadow-sm">Save Class</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
