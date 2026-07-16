import React, { useState } from 'react';
import { INITIAL_STUDENTS } from '../../constants/mockData';
import { Student } from '../../types';
import { 
  Users, 
  Search, 
  UserPlus, 
  QrCode, 
  Mail, 
  Phone, 
  Award, 
  X, 
  CheckCircle2, 
  Download,
  Printer
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const StudentsPortal: React.FC = () => {
  const [students, setStudents] = useState<Student[]>(INITIAL_STUDENTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStudentForId, setSelectedStudentForId] = useState<Student | null>(null);
  const [showAdmissionModal, setShowAdmissionModal] = useState(false);

  // New admission form state
  const [newName, setNewName] = useState('');
  const [newGrade, setNewGrade] = useState('Grade 9-A');
  const [newParent, setNewParent] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newEmail, setNewEmail] = useState('');

  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.admissionNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.grade.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddAdmission = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const newStudent: Student = {
      id: `s_${Date.now()}`,
      admissionNo: `APEX2026${Math.floor(100 + Math.random() * 900)}`,
      name: newName,
      grade: newGrade,
      section: 'A',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      parentName: newParent || 'Parent / Guardian',
      phone: newPhone || '+91 98765 00000',
      email: newEmail || 'student@apex.edu',
      feeStatus: 'pending',
      feeDueAmount: 35000,
      attendanceRate: 100,
      gpa: 4.0,
      busRoute: 'Route #1 (Green Park)'
    };

    setStudents([newStudent, ...students]);
    setShowAdmissionModal(false);
    confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });

    // Reset
    setNewName('');
    setNewParent('');
    setNewPhone('');
    setNewEmail('');
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Student Information System (SIS) & Admissions</h1>
          <p className="text-xs text-slate-500">Manage student records, academic profiles, digital ID cards, and online admissions.</p>
        </div>
        <button
          onClick={() => setShowAdmissionModal(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-2.5 rounded-xl text-xs shadow-md shadow-indigo-600/30 transition flex items-center space-x-2"
        >
          <UserPlus className="w-4 h-4" />
          <span>New Online Admission</span>
        </button>
      </div>

      {/* Search & Filters */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search by student name, ID or grade..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div className="flex items-center space-x-2 text-xs text-slate-500">
          <span>Showing <strong>{filteredStudents.length}</strong> active students</span>
        </div>
      </div>

      {/* Students Table / Grid */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="p-4">Student & ID</th>
                <th className="p-4">Grade & Section</th>
                <th className="p-4">Parent / Contact</th>
                <th className="p-4">Attendance</th>
                <th className="p-4">Fee Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredStudents.map(student => (
                <tr key={student.id} className="hover:bg-slate-50/80 transition">
                  <td className="p-4 flex items-center space-x-3">
                    <img src={student.avatar} alt={student.name} className="w-10 h-10 rounded-full object-cover border border-slate-200 shadow-sm" />
                    <div>
                      <div className="font-bold text-slate-900">{student.name}</div>
                      <div className="text-[11px] text-slate-500 font-mono">{student.admissionNo}</div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="font-medium text-slate-800">{student.grade}</span>
                    <div className="text-[11px] text-slate-500">{student.busRoute}</div>
                  </td>
                  <td className="p-4">
                    <div className="font-medium text-slate-800">{student.parentName}</div>
                    <div className="text-[11px] text-slate-500 flex items-center space-x-1">
                      <Phone className="w-3 h-3 text-slate-400" />
                      <span>{student.phone}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                      {student.attendanceRate}%
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-full font-semibold uppercase text-[10px] ${
                      student.feeStatus === 'paid' ? 'bg-emerald-100 text-emerald-700' :
                      student.feeStatus === 'pending' ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-750'
                    }`}>
                      {student.feeStatus}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => setSelectedStudentForId(student)}
                      className="bg-indigo-50 hover:bg-indigo-100 text-indigo-600 px-3 py-1.5 rounded-lg font-semibold transition flex items-center space-x-1 ml-auto"
                    >
                      <QrCode className="w-3.5 h-3.5" />
                      <span>Digital ID</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Digital ID Card Modal */}
      {selectedStudentForId && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full shadow-2xl overflow-hidden border border-slate-200">
            <div className="bg-gradient-to-r from-indigo-600 to-violet-600 p-6 text-white text-center relative">
              <button 
                onClick={() => setSelectedStudentForId(null)}
                className="absolute right-4 top-4 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 p-1.5 rounded-full"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="w-16 h-16 rounded-full overflow-hidden mx-auto border-2 border-white shadow-lg mb-3">
                <img src={selectedStudentForId.avatar} alt={selectedStudentForId.name} className="w-full h-full object-cover" />
              </div>
              <h2 className="text-lg font-bold">{selectedStudentForId.name}</h2>
              <p className="text-xs text-indigo-200">{selectedStudentForId.grade}</p>
            </div>

            <div className="p-6 space-y-4 text-center">
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex items-center justify-center space-x-4">
                <div className="w-24 h-24 bg-white border border-slate-300 rounded-xl p-2 flex items-center justify-center shadow-inner">
                  {/* Simulated QR Code */}
                  <div className="w-full h-full bg-slate-950 rounded-lg flex items-center justify-center text-white font-mono text-[10px] text-center p-1">
                    [SECURE QR ID]
                  </div>
                </div>
                <div className="text-left text-xs space-y-1">
                  <div><strong>ID No:</strong> {selectedStudentForId.admissionNo}</div>
                  <div><strong>Phone:</strong> {selectedStudentForId.phone}</div>
                  <div><strong>Bus:</strong> {selectedStudentForId.busRoute}</div>
                  <div><strong>Status:</strong> <span className="text-emerald-600 font-bold uppercase">{selectedStudentForId.feeStatus}</span></div>
                </div>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => alert('Digital ID downloaded successfully.')}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-800 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center space-x-1.5 transition"
                >
                  <Download className="w-4 h-4" />
                  <span>Download PDF</span>
                </button>
                <button
                  onClick={() => window.print()}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center space-x-1.5 transition"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print ID Card</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Online Admission Modal */}
      {showAdmissionModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden border border-slate-200">
            <div className="p-6 border-b border-slate-200 flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900">New Online Admission Application</h2>
              <button onClick={() => setShowAdmissionModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAddAdmission} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Student Full Name</label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                  placeholder="e.g. Rahul Verma"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Grade / Course</label>
                  <select
                    value={newGrade}
                    onChange={e => setNewGrade(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  >
                    <option>Grade 9-A</option>
                    <option>Grade 10-A</option>
                    <option>Grade 11-B</option>
                    <option>Grade 12-A</option>
                    <option>B.Tech CSE - 1st Year</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Parent / Guardian Name</label>
                  <input
                    type="text"
                    required
                    value={newParent}
                    onChange={e => setNewParent(e.target.value)}
                    placeholder="e.g. Anil Verma"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number</label>
                  <input
                    type="text"
                    required
                    value={newPhone}
                    onChange={e => setNewPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={newEmail}
                    onChange={e => setNewEmail(e.target.value)}
                    placeholder="student@apex.edu"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
              </div>
              <div className="pt-4 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowAdmissionModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-md shadow-indigo-600/30 transition"
                >
                  Submit & Enroll
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
