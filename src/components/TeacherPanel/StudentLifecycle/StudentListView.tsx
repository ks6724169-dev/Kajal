import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Download, 
  Printer, 
  Plus, 
  Eye, 
  Edit, 
  Trash2, 
  CheckSquare, 
  Square, 
  X, 
  FileText, 
  Award, 
  AlertCircle,
  UserCheck,
  Paperclip
} from 'lucide-react';
import { initialStudents, StudentRecord } from './studentData';

interface StudentListViewProps {
  onSelectStudent?: (student: StudentRecord) => void;
}

export const StudentListView: React.FC<StudentListViewProps> = () => {
  const [students, setStudents] = useState<StudentRecord[]>(initialStudents);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClass, setSelectedClass] = useState('All');
  const [selectedSection, setSelectedSection] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [viewingStudent, setViewingStudent] = useState<StudentRecord | null>(null);
  const [editingStudent, setEditingStudent] = useState<StudentRecord | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [activeDropdownId, setActiveDropdownId] = useState<string | null>(null);

  // New Student form state
  const [newStudent, setNewStudent] = useState<Partial<StudentRecord>>({
    name: '',
    rollNumber: '',
    admissionNumber: '',
    class: 'Grade 10',
    section: 'A',
    gender: 'Male',
    category: 'General',
    bloodGroup: 'B+',
    status: 'Active',
    parentName: '',
    parentPhone: '',
    parentEmail: '',
    address: '',
    house: 'Sapphire',
    club: 'Science Club',
    photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'
  });

  const filteredStudents = students.filter(st => {
    const matchesSearch = st.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          st.rollNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          st.admissionNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          st.parentName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesClass = selectedClass === 'All' || st.class === selectedClass;
    const matchesSection = selectedSection === 'All' || st.section === selectedSection;
    const matchesCategory = selectedCategory === 'All' || st.category === selectedCategory;
    const matchesStatus = selectedStatus === 'All' || st.status === selectedStatus;
    return matchesSearch && matchesClass && matchesSection && matchesCategory && matchesStatus;
  });

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredStudents.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredStudents.map(s => s.id));
    }
  };

  const toggleSelectOne = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(i => i !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleExportPDF = () => {
    alert(`Exporting ${selectedIds.length > 0 ? selectedIds.length : filteredStudents.length} student records to PDF...`);
  };

  const handleExportExcel = () => {
    alert(`Exporting ${selectedIds.length > 0 ? selectedIds.length : filteredStudents.length} student records to Excel...`);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStudent) return;
    setStudents(students.map(s => s.id === editingStudent.id ? editingStudent : s));
    setEditingStudent(null);
    alert('Student record updated successfully!');
  };

  const handleAddStudent = (e: React.FormEvent) => {
    e.preventDefault();
    const created: StudentRecord = {
      id: `st-${Date.now()}`,
      rollNumber: newStudent.rollNumber || '109',
      admissionNumber: newStudent.admissionNumber || `ADM-2023-${Math.floor(100 + Math.random() * 900)}`,
      name: newStudent.name || 'New Student',
      class: newStudent.class || 'Grade 10',
      section: newStudent.section || 'A',
      gender: (newStudent.gender as any) || 'Male',
      category: (newStudent.category as any) || 'General',
      bloodGroup: newStudent.bloodGroup || 'B+',
      status: 'Active',
      attendancePercentage: 90,
      behaviourStatus: 'Good',
      healthStatus: 'Fit',
      academicStanding: 'Average',
      parentName: newStudent.parentName || 'Parent Name',
      parentPhone: newStudent.parentPhone || '+91 98765 43210',
      parentEmail: newStudent.parentEmail || 'parent@example.com',
      address: newStudent.address || 'City Address',
      house: (newStudent.house as any) || 'Ruby',
      club: (newStudent.club as any) || 'Science Club',
      photo: newStudent.photo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'
    };
    setStudents([created, ...students]);
    setIsAddModalOpen(false);
    alert('New student added successfully!');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Header & Actions */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Student Directory & List</h2>
          <p className="text-xs text-slate-500 mt-0.5">Manage complete student records, admission details, and statuses ({filteredStudents.length} Students)</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="relative md:col-span-2">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by name, roll no, admission no, parent..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>

          <div>
            <select 
              value={selectedClass} 
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full py-3.5 px-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            >
              <option value="All">All Classes</option>
              <option value="Grade 10">Grade 10</option>
              <option value="Grade 9">Grade 9</option>
              <option value="Grade 8">Grade 8</option>
            </select>
          </div>

          <div>
            <select 
              value={selectedSection} 
              onChange={(e) => setSelectedSection(e.target.value)}
              className="w-full py-3.5 px-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            >
              <option value="All">All Sections</option>
              <option value="A">Section A</option>
              <option value="B">Section B</option>
            </select>
          </div>

          <div>
            <select 
              value={selectedCategory} 
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full py-3.5 px-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            >
              <option value="All">All Categories</option>
              <option value="General">General</option>
              <option value="OBC">OBC</option>
              <option value="SC">SC</option>
              <option value="ST">ST</option>
            </select>
          </div>
        </div>
      </div>

      {/* Student Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-5 px-8">Student Name</th>
                <th className="py-5 px-8">Father Name</th>
                <th className="py-5 px-8">Mobile Number</th>
                <th className="py-5 px-8 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm font-medium text-slate-700">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-16 text-center text-slate-400 text-base">
                    No students found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredStudents.map(student => (
                  <tr key={student.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-5 px-8">
                      <div className="flex items-center gap-4">
                        <img 
                          src={student.photo} 
                          alt={student.name} 
                          className="w-12 h-12 rounded-full object-cover border border-slate-200 shadow-sm"
                          referrerPolicy="no-referrer"
                        />
                        <span className="font-bold text-base text-slate-900">{student.name}</span>
                      </div>
                    </td>
                    <td className="py-5 px-8 font-semibold text-slate-800 text-base">
                      {student.parentName}
                    </td>
                    <td className="py-5 px-8 font-mono text-slate-600 text-base">
                      {student.parentPhone}
                    </td>
                    <td className="py-5 px-8 text-right relative">
                      <div className="flex items-center justify-end">
                        <button 
                          onClick={() => setActiveDropdownId(activeDropdownId === student.id ? null : student.id)}
                          className="p-3 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-slate-700 rounded-2xl transition shadow-sm font-semibold flex items-center gap-1"
                          title="Actions"
                        >
                          <span className="text-xl">🖇</span>
                        </button>

                        {activeDropdownId === student.id && (
                          <div className="absolute right-8 top-16 w-44 bg-white rounded-2xl shadow-2xl border border-slate-200 py-2.5 z-20 animate-in fade-in zoom-in-95 text-left">
                            <button
                              onClick={() => {
                                setViewingStudent(student);
                                setActiveDropdownId(null);
                              }}
                              className="w-full px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 flex items-center gap-3 transition"
                            >
                              <Eye className="w-4 h-4 text-indigo-500" />
                              View
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Student Modal - Comprehensive 10 Sections PDF Format */}
      {viewingStudent && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-4xl w-full p-8 shadow-2xl border border-slate-200 space-y-8 my-8 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95">
            {/* Header & Print/PDF Actions */}
            <div className="flex justify-between items-center border-b border-slate-200 pb-6 print:border-black">
              <div className="flex items-center gap-5">
                <img 
                  src={viewingStudent.photo} 
                  alt={viewingStudent.name} 
                  className="w-20 h-20 rounded-2xl object-cover border-2 border-indigo-600 shadow-md"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <h2 className="text-2xl font-black text-slate-900">{viewingStudent.name}</h2>
                  <p className="text-sm font-semibold text-slate-500 mt-0.5">Admission No: {viewingStudent.admissionNumber} | Roll No: {viewingStudent.rollNumber}</p>
                  <span className="inline-block mt-2 px-3 py-1 bg-indigo-50 text-indigo-700 rounded-lg text-xs font-bold">
                    Official Student Comprehensive Dossier (10 Sections)
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => window.print()}
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl text-sm font-bold shadow-md flex items-center gap-2 transition"
                >
                  <Download className="w-4 h-4" />
                  <span>Download PDF / Print</span>
                </button>
                <button 
                  onClick={() => setViewingStudent(null)}
                  className="p-2.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* 10 Sections Grid */}
            <div className="space-y-6 text-sm">
              {/* Section 1: Student Information */}
              <div className="bg-slate-50 p-5 rounded-3xl border border-slate-200 space-y-3">
                <h3 className="font-extrabold text-slate-900 text-base border-b border-slate-200 pb-2 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs">1</span>
                  Student Information
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-1">
                  <div><span className="text-slate-500 text-xs block font-semibold">Full Name</span><span className="font-bold text-slate-900">{viewingStudent.name}</span></div>
                  <div><span className="text-slate-500 text-xs block font-semibold">Gender</span><span className="font-bold text-slate-900">{viewingStudent.gender}</span></div>
                  <div><span className="text-slate-500 text-xs block font-semibold">Category</span><span className="font-bold text-slate-900">{viewingStudent.category}</span></div>
                  <div><span className="text-slate-500 text-xs block font-semibold">Blood Group</span><span className="font-bold text-slate-900">{viewingStudent.bloodGroup}</span></div>
                  <div><span className="text-slate-500 text-xs block font-semibold">Date of Birth</span><span className="font-bold text-slate-900">15 Aug 2008</span></div>
                  <div><span className="text-slate-500 text-xs block font-semibold">Aadhaar Number</span><span className="font-bold text-slate-900 font-mono">XXXX-XXXX-4821</span></div>
                  <div><span className="text-slate-500 text-xs block font-semibold">Religion</span><span className="font-bold text-slate-900">General</span></div>
                  <div><span className="text-slate-500 text-xs block font-semibold">Nationality</span><span className="font-bold text-slate-900">Indian</span></div>
                </div>
              </div>

              {/* Section 2: Academic Information */}
              <div className="bg-slate-50 p-5 rounded-3xl border border-slate-200 space-y-3">
                <h3 className="font-extrabold text-slate-900 text-base border-b border-slate-200 pb-2 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs">2</span>
                  Academic Information
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-1">
                  <div><span className="text-slate-500 text-xs block font-semibold">Class & Section</span><span className="font-bold text-slate-900">{viewingStudent.class} - {viewingStudent.section}</span></div>
                  <div><span className="text-slate-500 text-xs block font-semibold">Roll Number</span><span className="font-bold text-slate-900">{viewingStudent.rollNumber}</span></div>
                  <div><span className="text-slate-500 text-xs block font-semibold">Admission Date</span><span className="font-bold text-slate-900">01 Apr 2023</span></div>
                  <div><span className="text-slate-500 text-xs block font-semibold">Academic Session</span><span className="font-bold text-slate-900">2026-27</span></div>
                  <div><span className="text-slate-500 text-xs block font-semibold">House</span><span className="font-bold text-slate-900">{viewingStudent.house} House</span></div>
                  <div><span className="text-slate-500 text-xs block font-semibold">Club</span><span className="font-bold text-slate-900">{viewingStudent.club}</span></div>
                  <div><span className="text-slate-500 text-xs block font-semibold">Attendance</span><span className="font-bold text-emerald-600">{viewingStudent.attendancePercentage}%</span></div>
                  <div><span className="text-slate-500 text-xs block font-semibold">Academic Standing</span><span className="font-bold text-indigo-600">{viewingStudent.academicStanding}</span></div>
                </div>
              </div>

              {/* Section 3: Parent / Guardian Information */}
              <div className="bg-slate-50 p-5 rounded-3xl border border-slate-200 space-y-3">
                <h3 className="font-extrabold text-slate-900 text-base border-b border-slate-200 pb-2 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs">3</span>
                  Parent / Guardian Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
                  <div><span className="text-slate-500 text-xs block font-semibold">Father / Guardian Name</span><span className="font-bold text-slate-900">{viewingStudent.parentName}</span></div>
                  <div><span className="text-slate-500 text-xs block font-semibold">Mobile Number</span><span className="font-bold text-slate-900 font-mono">{viewingStudent.parentPhone}</span></div>
                  <div><span className="text-slate-500 text-xs block font-semibold">Email ID</span><span className="font-bold text-slate-900">{viewingStudent.parentEmail}</span></div>
                  <div><span className="text-slate-500 text-xs block font-semibold">Occupation</span><span className="font-bold text-slate-900">Professional / Business</span></div>
                  <div><span className="text-slate-500 text-xs block font-semibold">Annual Income</span><span className="font-bold text-slate-900">₹ 8,50,000</span></div>
                  <div><span className="text-slate-500 text-xs block font-semibold">Aadhaar Number</span><span className="font-bold text-slate-900 font-mono">XXXX-XXXX-9912</span></div>
                </div>
              </div>

              {/* Section 4: Contact Information */}
              <div className="bg-slate-50 p-5 rounded-3xl border border-slate-200 space-y-3">
                <h3 className="font-extrabold text-slate-900 text-base border-b border-slate-200 pb-2 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs">4</span>
                  Contact Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                  <div><span className="text-slate-500 text-xs block font-semibold">Current Address</span><span className="font-bold text-slate-900">{viewingStudent.address}</span></div>
                  <div><span className="text-slate-500 text-xs block font-semibold">Permanent Address</span><span className="font-bold text-slate-900">{viewingStudent.address}</span></div>
                  <div><span className="text-slate-500 text-xs block font-semibold">City / State / Pin Code</span><span className="font-bold text-slate-900">New Delhi, Delhi - 110001</span></div>
                  <div><span className="text-slate-500 text-xs block font-semibold">Emergency Contact Number</span><span className="font-bold text-slate-900 font-mono">{viewingStudent.parentPhone}</span></div>
                </div>
              </div>

              {/* Section 5: Transport Information */}
              <div className="bg-slate-50 p-5 rounded-3xl border border-slate-200 space-y-3">
                <h3 className="font-extrabold text-slate-900 text-base border-b border-slate-200 pb-2 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs">5</span>
                  Transport Information
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-1">
                  <div><span className="text-slate-500 text-xs block font-semibold">Transport Required</span><span className="font-bold text-emerald-600">Yes (School Bus)</span></div>
                  <div><span className="text-slate-500 text-xs block font-semibold">Pickup Point</span><span className="font-bold text-slate-900">Central Square Stop</span></div>
                  <div><span className="text-slate-500 text-xs block font-semibold">Route Number</span><span className="font-bold text-slate-900">Route #4</span></div>
                  <div><span className="text-slate-500 text-xs block font-semibold">Vehicle Number</span><span className="font-bold text-slate-900 font-mono">DL-01-AB-1234</span></div>
                </div>
              </div>

              {/* Section 6: Hostel Information */}
              <div className="bg-slate-50 p-5 rounded-3xl border border-slate-200 space-y-3">
                <h3 className="font-extrabold text-slate-900 text-base border-b border-slate-200 pb-2 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs">6</span>
                  Hostel Information
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-1">
                  <div><span className="text-slate-500 text-xs block font-semibold">Hostel Required</span><span className="font-bold text-slate-700">Not Required (Day Scholar)</span></div>
                  <div><span className="text-slate-500 text-xs block font-semibold">Hostel Name</span><span className="font-bold text-slate-400">N/A</span></div>
                  <div><span className="text-slate-500 text-xs block font-semibold">Room & Bed Number</span><span className="font-bold text-slate-400">N/A</span></div>
                </div>
              </div>

              {/* Section 7: Medical Information */}
              <div className="bg-slate-50 p-5 rounded-3xl border border-slate-200 space-y-3">
                <h3 className="font-extrabold text-slate-900 text-base border-b border-slate-200 pb-2 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs">7</span>
                  Medical Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                  <div><span className="text-slate-500 text-xs block font-semibold">Medical Conditions</span><span className="font-bold text-slate-900">{viewingStudent.medicalNotes || 'None reported'}</span></div>
                  <div><span className="text-slate-500 text-xs block font-semibold">Allergies</span><span className="font-bold text-slate-900">None</span></div>
                  <div><span className="text-slate-500 text-xs block font-semibold">Doctor Name</span><span className="font-bold text-slate-900">Dr. R. K. Malhotra</span></div>
                  <div><span className="text-slate-500 text-xs block font-semibold">Emergency Medical Contact</span><span className="font-bold text-slate-900 font-mono">{viewingStudent.parentPhone}</span></div>
                </div>
              </div>

              {/* Section 8: Fee Information */}
              <div className="bg-slate-50 p-5 rounded-3xl border border-slate-200 space-y-3">
                <h3 className="font-extrabold text-slate-900 text-base border-b border-slate-200 pb-2 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs">8</span>
                  Fee Information
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-1">
                  <div><span className="text-slate-500 text-xs block font-semibold">Admission Fee</span><span className="font-bold text-slate-900">₹ 15,000 (Paid)</span></div>
                  <div><span className="text-slate-500 text-xs block font-semibold">Tuition Fee</span><span className="font-bold text-slate-900">₹ 45,000 (Paid)</span></div>
                  <div><span className="text-slate-500 text-xs block font-semibold">Transport Fee</span><span className="font-bold text-slate-900">₹ 12,000 (Paid)</span></div>
                  <div><span className="text-slate-500 text-xs block font-semibold">Total Fee Status</span><span className="font-bold text-emerald-600">Fully Paid (0 Dues)</span></div>
                </div>
              </div>

              {/* Section 9: Documents Upload */}
              <div className="bg-slate-50 p-5 rounded-3xl border border-slate-200 space-y-3">
                <h3 className="font-extrabold text-slate-900 text-base border-b border-slate-200 pb-2 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs">9</span>
                  Documents Upload
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-1 text-xs">
                  <div className="p-2.5 bg-white rounded-xl border border-slate-200 flex items-center gap-2 font-semibold text-slate-700">✓ Student Photo Verified</div>
                  <div className="p-2.5 bg-white rounded-xl border border-slate-200 flex items-center gap-2 font-semibold text-slate-700">✓ Birth Certificate</div>
                  <div className="p-2.5 bg-white rounded-xl border border-slate-200 flex items-center gap-2 font-semibold text-slate-700">✓ Aadhaar Card Verified</div>
                  <div className="p-2.5 bg-white rounded-xl border border-slate-200 flex items-center gap-2 font-semibold text-slate-700">✓ Transfer Certificate (TC)</div>
                </div>
              </div>

              {/* Section 10: System Generated Information */}
              <div className="bg-slate-50 p-5 rounded-3xl border border-slate-200 space-y-3">
                <h3 className="font-extrabold text-slate-900 text-base border-b border-slate-200 pb-2 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs">10</span>
                  System Generated Information
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-1">
                  <div><span className="text-slate-500 text-xs block font-semibold">Student Login ID</span><span className="font-bold text-slate-900 font-mono">STU2026101</span></div>
                  <div><span className="text-slate-500 text-xs block font-semibold">Username</span><span className="font-bold text-slate-900 font-mono">aarav.sharma101</span></div>
                  <div><span className="text-slate-500 text-xs block font-semibold">Account Status</span><span className="font-bold text-emerald-600">{viewingStudent.status}</span></div>
                  <div><span className="text-slate-500 text-xs block font-semibold">Created Date</span><span className="font-bold text-slate-900">24/05/2025 10:30 AM</span></div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
              <button 
                onClick={() => setViewingStudent(null)}
                className="px-6 py-3 bg-slate-900 text-white rounded-2xl text-sm font-bold hover:bg-slate-800 transition shadow-md"
              >
                Close Dossier
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Student Modal */}
      {editingStudent && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form onSubmit={handleSaveEdit} className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold text-slate-900">Edit Student Record</h3>
              <button type="button" onClick={() => setEditingStudent(null)} className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Student Full Name</label>
                <input 
                  type="text" 
                  value={editingStudent.name}
                  onChange={(e) => setEditingStudent({...editingStudent, name: e.target.value})}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Roll Number</label>
                  <input 
                    type="text" 
                    value={editingStudent.rollNumber}
                    onChange={(e) => setEditingStudent({...editingStudent, rollNumber: e.target.value})}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Attendance %</label>
                  <input 
                    type="number" 
                    value={editingStudent.attendancePercentage}
                    onChange={(e) => setEditingStudent({...editingStudent, attendancePercentage: Number(e.target.value)})}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Class</label>
                  <select 
                    value={editingStudent.class}
                    onChange={(e) => setEditingStudent({...editingStudent, class: e.target.value})}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  >
                    <option value="Grade 10">Grade 10</option>
                    <option value="Grade 9">Grade 9</option>
                    <option value="Grade 8">Grade 8</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Section</label>
                  <select 
                    value={editingStudent.section}
                    onChange={(e) => setEditingStudent({...editingStudent, section: e.target.value})}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  >
                    <option value="A">Section A</option>
                    <option value="B">Section B</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Parent Phone</label>
                <input 
                  type="text" 
                  value={editingStudent.parentPhone}
                  onChange={(e) => setEditingStudent({...editingStudent, parentPhone: e.target.value})}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  required
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
              <button 
                type="button" 
                onClick={() => setEditingStudent(null)}
                className="px-4 py-2 bg-slate-100 text-slate-600 rounded-xl text-xs font-bold"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-sm"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Add Student Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form onSubmit={handleAddStudent} className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold text-slate-900">Add New Student</h3>
              <button type="button" onClick={() => setIsAddModalOpen(false)} className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Student Full Name *</label>
                <input 
                  type="text" 
                  placeholder="e.g. Rahul Sharma"
                  value={newStudent.name}
                  onChange={(e) => setNewStudent({...newStudent, name: e.target.value})}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Roll Number *</label>
                  <input 
                    type="text" 
                    placeholder="e.g. 109"
                    value={newStudent.rollNumber}
                    onChange={(e) => setNewStudent({...newStudent, rollNumber: e.target.value})}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Blood Group</label>
                  <select 
                    value={newStudent.bloodGroup}
                    onChange={(e) => setNewStudent({...newStudent, bloodGroup: e.target.value})}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  >
                    <option value="A+">A+</option>
                    <option value="B+">B+</option>
                    <option value="O+">O+</option>
                    <option value="AB+">AB+</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Class</label>
                  <select 
                    value={newStudent.class}
                    onChange={(e) => setNewStudent({...newStudent, class: e.target.value})}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  >
                    <option value="Grade 10">Grade 10</option>
                    <option value="Grade 9">Grade 9</option>
                    <option value="Grade 8">Grade 8</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Section</label>
                  <select 
                    value={newStudent.section}
                    onChange={(e) => setNewStudent({...newStudent, section: e.target.value})}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  >
                    <option value="A">Section A</option>
                    <option value="B">Section B</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Parent Name</label>
                  <input 
                    type="text" 
                    placeholder="Parent Full Name"
                    value={newStudent.parentName}
                    onChange={(e) => setNewStudent({...newStudent, parentName: e.target.value})}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Parent Phone</label>
                  <input 
                    type="text" 
                    placeholder="+91..."
                    value={newStudent.parentPhone}
                    onChange={(e) => setNewStudent({...newStudent, parentPhone: e.target.value})}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
              <button 
                type="button" 
                onClick={() => setIsAddModalOpen(false)}
                className="px-4 py-2 bg-slate-100 text-slate-600 rounded-xl text-xs font-bold"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-sm"
              >
                Save Student
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
