import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, 
  Search, 
  Filter, 
  Download, 
  Plus, 
  Printer, 
  Edit2, 
  Trash2, 
  ChevronDown, 
  ChevronUp, 
  MoreVertical, 
  SlidersHorizontal, 
  Eye, 
  X, 
  FileSpreadsheet, 
  Sparkles,
  Check,
  CheckCircle,
  HelpCircle,
  TrendingUp,
  AlertCircle,
  UserCheck,
  Calendar,
  Layers,
  BookOpen,
  FolderOpen
} from 'lucide-react';
import { initialStudents, StudentRecord } from './StudentLifecycle/studentData';

interface SubModuleRendererProps {
  subModuleId: string;
  subModuleName: string;
  onBack: () => void;
  onSelectSubModule?: (subId: string) => void;
  hideHeader?: boolean;
}

// Generate premium mock data for Academic modules
const academicMockData = [
  { id: 'REC-101', title: 'Grade 10 Calculus Foundation', subject: 'Mathematics', stage: 'Unit 2: Limits', progress: 85, status: 'Active', updated: 'July 14, 2026', owner: 'Sarah Johnson' },
  { id: 'REC-102', title: 'AP Physics Wave Mechanics', subject: 'Physics', stage: 'Unit 4: Optics', progress: 60, status: 'Review', updated: 'July 12, 2026', owner: 'Sarah Johnson' },
  { id: 'REC-103', title: 'Chemistry Lab Practical Rubrics', subject: 'Chemistry', stage: 'Unit 1: Kinetics', progress: 100, status: 'Published', updated: 'July 10, 2026', owner: 'Sarah Johnson' },
  { id: 'REC-104', title: 'Grade 11 Algebraic Equations', subject: 'Mathematics', stage: 'Unit 3: Matrices', progress: 40, status: 'Draft', updated: 'July 09, 2026', owner: 'Sarah Johnson' },
  { id: 'REC-105', title: 'Introductory Statistics & Charts', subject: 'Mathematics', stage: 'Unit 5: Probability', progress: 15, status: 'Draft', updated: 'July 08, 2026', owner: 'Sarah Johnson' },
];

export const SubModuleRenderer: React.FC<SubModuleRendererProps> = ({ 
  subModuleId, 
  subModuleName, 
  onBack, 
  onSelectSubModule,
  hideHeader = false
}) => {
  // Determine if this is a Student Lifecycle module or Academic/Other
  const isStudentLifecycle = [
    'student_lifecycle', 'student_list', 'attendance', 'behaviour', 
    'health_records', 'student_documents', 'parent_details', 
    'activities', 'student_portfolio', 'learning_progress'
  ].includes(subModuleId);

  // Core Data Engine
  const [studentData, setStudentData] = useState<StudentRecord[]>(initialStudents);
  const [academicData, setAcademicData] = useState<any[]>(academicMockData);
  
  // Selection & UI States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [sortField, setSortField] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Advanced Filters
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [filterClass, setFilterClass] = useState<string>('All');
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  // Column Visibility States (for hiding/showing columns)
  const [visibleColumns, setVisibleColumns] = useState<Record<string, boolean>>({
    id: true,
    name: true,
    category: true,
    status: true,
    academicStanding: true,
    attendance: true,
    updated: true,
  });
  const [isColumnDropdownOpen, setIsColumnDropdownOpen] = useState(false);

  // Detail Drawer & Add Modal States
  const [activeDrawerItem, setActiveDrawerItem] = useState<any | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form states for Add Entry
  const [newFormFields, setNewFormFields] = useState<Record<string, string>>({
    name: '',
    class: 'Grade 10',
    section: 'A',
    status: 'Active',
    category: 'General',
    attendancePercentage: '95',
    academicStanding: 'Average',
    title: '',
    subject: 'Mathematics',
    stage: '',
    progress: '50'
  });

  // KPI Calculations
  const kpis = useMemo(() => {
    if (isStudentLifecycle) {
      const activeCount = studentData.filter(s => s.status === 'Active').length;
      const avgAttendance = Math.round(studentData.reduce((acc, s) => acc + s.attendancePercentage, 0) / studentData.length);
      const criticalCount = studentData.filter(s => s.behaviourStatus === 'Critical' || s.academicStanding === 'Weak').length;
      return [
        { label: 'Active Students', value: activeCount, change: '94% Engagement', color: 'text-indigo-600', bg: 'bg-indigo-50/50' },
        { label: 'Average Attendance', value: `${avgAttendance}%`, change: '+1.2% this week', color: 'text-emerald-600', bg: 'bg-emerald-50/50' },
        { label: 'Attention Alerts', value: criticalCount, change: 'Action required', color: 'text-rose-600', bg: 'bg-rose-50/50' },
      ];
    } else {
      const activeCount = academicData.filter(a => a.status === 'Active' || a.status === 'Published').length;
      const completedCount = academicData.filter(a => a.progress === 100).length;
      const draftCount = academicData.filter(a => a.status === 'Draft').length;
      return [
        { label: 'Active Workspaces', value: activeCount, change: 'Fully Synced', color: 'text-indigo-600', bg: 'bg-indigo-50/50' },
        { label: 'Syllabus Complete', value: completedCount, change: 'Published units', color: 'text-emerald-600', bg: 'bg-emerald-50/50' },
        { label: 'Draft Outlines', value: draftCount, change: 'In active review', color: 'text-amber-600', bg: 'bg-amber-50/50' },
      ];
    }
  }, [isStudentLifecycle, studentData, academicData]);

  // Handle Sort
  const handleSort = (field: string) => {
    const isAsc = sortField === field && sortOrder === 'asc';
    setSortField(field);
    setSortOrder(isAsc ? 'desc' : 'asc');
  };

  // Filtered & Sorted Records
  const records = useMemo(() => {
    if (isStudentLifecycle) {
      let result = [...studentData];
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        result = result.filter(r => 
          r.name.toLowerCase().includes(query) || 
          r.id.toLowerCase().includes(query) ||
          r.class.toLowerCase().includes(query)
        );
      }
      if (filterStatus !== 'All') {
        result = result.filter(r => r.status === filterStatus);
      }
      if (filterClass !== 'All') {
        result = result.filter(r => r.class === filterClass);
      }
      if (sortField) {
        result.sort((a: any, b: any) => {
          const valA = a[sortField];
          const valB = b[sortField];
          if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
          if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
          return 0;
        });
      }
      return result;
    } else {
      let result = [...academicData];
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        result = result.filter(r => 
          r.title.toLowerCase().includes(query) || 
          r.subject.toLowerCase().includes(query) ||
          r.id.toLowerCase().includes(query)
        );
      }
      if (filterStatus !== 'All') {
        result = result.filter(r => r.status === filterStatus);
      }
      if (sortField) {
        result.sort((a: any, b: any) => {
          const valA = a[sortField];
          const valB = b[sortField];
          if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
          if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
          return 0;
        });
      }
      return result;
    }
  }, [isStudentLifecycle, studentData, academicData, searchQuery, filterStatus, filterClass, sortField, sortOrder]);

  // Pagination calculations
  const totalPages = Math.ceil(records.length / itemsPerPage) || 1;
  const paginatedRecords = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return records.slice(startIndex, startIndex + itemsPerPage);
  }, [records, currentPage]);

  // Selection handlers
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(paginatedRecords.map(r => r.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(selectedId => selectedId !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  // Add Item
  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (isStudentLifecycle) {
      const newStudent: StudentRecord = {
        id: `st-${Date.now().toString().slice(-4)}`,
        rollNumber: (studentData.length + 101).toString(),
        admissionNumber: `ADM-2026-${Date.now().toString().slice(-3)}`,
        name: newFormFields.name || 'New Student Record',
        class: newFormFields.class,
        section: newFormFields.section,
        gender: 'Male',
        category: newFormFields.category as any,
        bloodGroup: 'O+',
        status: newFormFields.status as any,
        attendancePercentage: parseInt(newFormFields.attendancePercentage) || 100,
        behaviourStatus: 'Good',
        healthStatus: 'Fit',
        academicStanding: newFormFields.academicStanding as any,
        parentName: 'Jane Smith',
        parentPhone: '+91 99999 88888',
        parentEmail: 'parent@example.com',
        address: '100, Galaxy Boulevard, New Delhi',
        house: 'Ruby',
        club: 'Coding Club',
        photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'
      };
      setStudentData([newStudent, ...studentData]);
    } else {
      const newAcademic = {
        id: `REC-${Date.now().toString().slice(-3)}`,
        title: newFormFields.title || 'Untitled Curriculum Outline',
        subject: newFormFields.subject,
        stage: newFormFields.stage || 'General Syllabus',
        progress: parseInt(newFormFields.progress) || 0,
        status: newFormFields.status,
        updated: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        owner: 'Sarah Johnson'
      };
      setAcademicData([newAcademic, ...academicData]);
    }
    setIsAddModalOpen(false);
    setSelectedIds([]);
  };

  // Bulk actions
  const handleBulkDelete = () => {
    if (window.confirm(`Are you sure you want to delete ${selectedIds.length} records?`)) {
      if (isStudentLifecycle) {
        setStudentData(studentData.filter(s => !selectedIds.includes(s.id)));
      } else {
        setAcademicData(academicData.filter(a => !selectedIds.includes(a.id)));
      }
      setSelectedIds([]);
    }
  };

  // Export mock
  const handleExport = () => {
    alert('Enterprise data exported successfully (XLSX Format).');
  };

  // Print mock
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      
      {/* Dynamic Header & Breadcrumb */}
      {!hideHeader && (
        <div className="bg-white border-b border-slate-200 px-6 py-4 sticky top-0 z-40 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={onBack} className="p-2 hover:bg-slate-50 rounded-lg text-slate-500 transition">
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-slate-900">{subModuleName} Workspace</h1>
              <p className="text-xs text-slate-400">Manage and organize your data entries efficiently</p>
            </div>
          </div>
        </div>
      )}

      {/* KPI Cards section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {kpis.map((kpi, idx) => (
          <div key={idx} className={`${kpi.bg} border border-slate-200/60 rounded-3xl p-5 shadow-sm hover:shadow transition-all`}>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{kpi.label}</span>
            <div className="flex items-baseline gap-2 mt-2">
              <span className={`text-2xl font-black ${kpi.color}`}>{kpi.value}</span>
              <span className="text-[10px] font-semibold text-slate-500">{kpi.change}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Control Toolbar */}
      <div className="bg-white border border-slate-200 rounded-3xl p-4 flex flex-col md:flex-row justify-between items-center gap-4 shadow-sm">
        
        {/* Left Side: Search & Actions */}
        <div className="flex flex-1 items-center gap-3 w-full">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search records..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-2xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500"
            />
          </div>
          
          <button 
            onClick={() => setIsFilterModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 border border-slate-200 rounded-2xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition"
          >
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            Filters
          </button>

          {/* Column Hide/Show Dropdown Toggle */}
          <div className="relative">
            <button 
              onClick={() => setIsColumnDropdownOpen(!isColumnDropdownOpen)}
              className="flex items-center gap-1.5 px-3 py-2 border border-slate-200 rounded-2xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
              Columns
            </button>

            {isColumnDropdownOpen && (
              <div className="absolute left-0 mt-2 w-48 bg-white border border-slate-200 rounded-2xl shadow-xl p-3 z-50 space-y-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block border-b border-slate-100 pb-1 mb-1">
                  Toggle Columns
                </span>
                {Object.keys(visibleColumns).map((col) => (
                  <label key={col} className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-600 hover:text-slate-900">
                    <input 
                      type="checkbox" 
                      checked={visibleColumns[col]} 
                      onChange={() => setVisibleColumns({ ...visibleColumns, [col]: !visibleColumns[col] })}
                      className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500/20"
                    />
                    <span className="capitalize">{col.replace(/([A-Z])/g, ' $1')}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Global operations */}
        <div className="flex items-center gap-2.5 w-full md:w-auto justify-end">
          {selectedIds.length > 0 && (
            <button 
              onClick={handleBulkDelete}
              className="flex items-center gap-1.5 px-3 py-2 bg-rose-50 text-rose-600 border border-rose-100 rounded-2xl text-xs font-bold hover:bg-rose-100 transition"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Delete ({selectedIds.length})
            </button>
          )}

          <button 
            onClick={handleExport}
            className="p-2 border border-slate-200 rounded-2xl hover:bg-slate-50 text-slate-500 transition"
            title="Export Records"
          >
            <Download className="w-4 h-4" />
          </button>

          <button 
            onClick={handlePrint}
            className="p-2 border border-slate-200 rounded-2xl hover:bg-slate-50 text-slate-500 transition"
            title="Print Records"
          >
            <Printer className="w-4 h-4" />
          </button>

          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white rounded-2xl text-xs font-bold hover:bg-indigo-700 transition shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Add Entry
          </button>
        </div>
      </div>

      {/* Enterprise Data Grid (React Table Canvas) */}
      <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-200 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="px-5 py-4 w-12 text-center sticky left-0 bg-slate-50/70">
                  <input 
                    type="checkbox" 
                    onChange={handleSelectAll}
                    checked={paginatedRecords.length > 0 && selectedIds.length === paginatedRecords.length}
                    className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500/20"
                  />
                </th>
                
                {visibleColumns.id && (
                  <th className="px-5 py-4 cursor-pointer hover:text-slate-700" onClick={() => handleSort('id')}>
                    ID {sortField === 'id' && (sortOrder === 'asc' ? '↑' : '↓')}
                  </th>
                )}
                
                {visibleColumns.name && (
                  <th className="px-5 py-4 cursor-pointer hover:text-slate-700 sticky left-12 bg-slate-50/70 shadow-[2px_0_5px_rgba(0,0,0,0.01)]" onClick={() => handleSort(isStudentLifecycle ? 'name' : 'title')}>
                    {isStudentLifecycle ? 'Student Name' : 'Workspace / Document Title'} {sortField === (isStudentLifecycle ? 'name' : 'title') && (sortOrder === 'asc' ? '↑' : '↓')}
                  </th>
                )}

                {isStudentLifecycle ? (
                  <>
                    {visibleColumns.category && <th className="px-5 py-4">Sect / Category</th>}
                    {visibleColumns.academicStanding && <th className="px-5 py-4">Academic Standing</th>}
                    {visibleColumns.attendance && <th className="px-5 py-4">Attendance</th>}
                  </>
                ) : (
                  <>
                    {visibleColumns.category && <th className="px-5 py-4">Subject</th>}
                    {visibleColumns.academicStanding && <th className="px-5 py-4">Stage / Chapter</th>}
                    {visibleColumns.attendance && <th className="px-5 py-4">Progress</th>}
                  </>
                )}

                {visibleColumns.status && (
                  <th className="px-5 py-4 cursor-pointer hover:text-slate-700" onClick={() => handleSort('status')}>
                    Status {sortField === 'status' && (sortOrder === 'asc' ? '↑' : '↓')}
                  </th>
                )}

                <th className="px-5 py-4 text-right w-24">Actions</th>
              </tr>
            </thead>
            
            <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-600">
              {paginatedRecords.length === 0 ? (
                <tr>
                  <td colSpan={10} className="px-5 py-20 text-center text-slate-400">
                    <FolderOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <span className="font-bold block text-slate-800">No records found</span>
                    <span className="text-[11px] block text-slate-400 mt-1">Try resetting filters or adding a new record</span>
                  </td>
                </tr>
              ) : (
                paginatedRecords.map((record) => {
                  const isSelected = selectedIds.includes(record.id);
                  return (
                    <tr 
                      key={record.id}
                      className={`hover:bg-slate-50/50 transition-colors ${isSelected ? 'bg-indigo-50/20' : ''}`}
                    >
                      <td className="px-5 py-4 text-center sticky left-0 bg-white">
                        <input 
                          type="checkbox" 
                          checked={isSelected}
                          onChange={() => handleSelectOne(record.id)}
                          className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500/20"
                        />
                      </td>

                      {visibleColumns.id && (
                        <td className="px-5 py-4 font-mono text-[10px] text-slate-400">
                          {record.id}
                        </td>
                      )}

                      {visibleColumns.name && (
                        <td className="px-5 py-4 text-slate-950 font-bold sticky left-12 bg-white shadow-[2px_0_5px_rgba(0,0,0,0.01)]">
                          {isStudentLifecycle ? (
                            <div className="flex items-center gap-3">
                              <img src={record.photo} className="w-7 h-7 rounded-full object-cover border border-slate-100" alt="" referrerPolicy="no-referrer" />
                              <div>
                                <span className="block font-bold">{record.name}</span>
                                <span className="text-[10px] text-slate-400 font-semibold">{record.class} - Sec {record.section}</span>
                              </div>
                            </div>
                          ) : (
                            <div>
                              <span className="block font-bold">{record.title}</span>
                              <span className="text-[10px] text-slate-400 font-semibold">Updated: {record.updated}</span>
                            </div>
                          )}
                        </td>
                      )}

                      {isStudentLifecycle ? (
                        <>
                          {visibleColumns.category && (
                            <td className="px-5 py-4">
                              <div className="space-y-0.5">
                                <span className="block text-[11px] font-bold text-slate-700">Category: {record.category}</span>
                                <span className="block text-[10px] text-slate-400">Roll No: {record.rollNumber}</span>
                              </div>
                            </td>
                          )}
                          {visibleColumns.academicStanding && (
                            <td className="px-5 py-4">
                              <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                                record.academicStanding === 'Gifted' ? 'bg-indigo-50 text-indigo-600 border border-indigo-100' :
                                record.academicStanding === 'Above Average' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                                record.academicStanding === 'Average' ? 'bg-slate-50 text-slate-600 border border-slate-100' :
                                'bg-rose-50 text-rose-600 border border-rose-100'
                              }`}>
                                {record.academicStanding}
                              </span>
                            </td>
                          )}
                          {visibleColumns.attendance && (
                            <td className="px-5 py-4">
                              <div className="flex items-center gap-2">
                                <div className="w-16 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                                  <div className="bg-indigo-600 h-1.5" style={{ width: `${record.attendancePercentage}%` }} />
                                </div>
                                <span className="font-mono text-[10px] text-slate-500">{record.attendancePercentage}%</span>
                              </div>
                            </td>
                          )}
                        </>
                      ) : (
                        <>
                          {visibleColumns.category && (
                            <td className="px-5 py-4">
                              <span className="font-semibold text-slate-700">{record.subject}</span>
                            </td>
                          )}
                          {visibleColumns.academicStanding && (
                            <td className="px-5 py-4 text-slate-500 font-medium">
                              {record.stage}
                            </td>
                          )}
                          {visibleColumns.attendance && (
                            <td className="px-5 py-4">
                              <div className="flex items-center gap-2">
                                <div className="w-16 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                                  <div className="bg-emerald-500 h-1.5" style={{ width: `${record.progress}%` }} />
                                </div>
                                <span className="font-mono text-[10px] text-slate-500">{record.progress}%</span>
                              </div>
                            </td>
                          )}
                        </>
                      )}

                      {visibleColumns.status && (
                        <td className="px-5 py-4">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-bold ${
                            record.status === 'Active' || record.status === 'Published'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-100/50'
                              : 'bg-slate-50 text-slate-600 border border-slate-100'
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${record.status === 'Active' || record.status === 'Published' ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                            {record.status}
                          </span>
                        </td>
                      )}

                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button 
                            onClick={() => setActiveDrawerItem(record)}
                            className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-slate-900 transition"
                            title="View Details"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button 
                            onClick={() => {
                              if (window.confirm('This is an enterprise workspace template view. Ready to refactor?')) {
                                setActiveDrawerItem(record);
                              }
                            }}
                            className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-indigo-600 transition"
                            title="Edit"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Sticky Table Footer & Pagination */}
        <div className="bg-slate-50/70 border-t border-slate-200 px-6 py-4 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-bold text-slate-500">
          <span>
            Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, records.length)} of {records.length} records
          </span>
          
          <div className="flex items-center gap-1">
            <button 
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              className="px-3 py-1.5 border border-slate-200 rounded-xl hover:bg-slate-100 disabled:opacity-50 transition"
            >
              Previous
            </button>
            {[...Array(totalPages)].map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentPage(idx + 1)}
                className={`w-8 h-8 rounded-xl border text-center transition ${
                  currentPage === idx + 1 
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm' 
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {idx + 1}
              </button>
            ))}
            <button 
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              className="px-3 py-1.5 border border-slate-200 rounded-xl hover:bg-slate-100 disabled:opacity-50 transition"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Advanced Filter Dialog */}
      {isFilterModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full shadow-2xl space-y-5">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <Filter className="w-4 h-4 text-indigo-600" />
                Advanced Filters
              </h3>
              <button onClick={() => setIsFilterModalOpen(false)} className="p-1 hover:bg-slate-50 rounded-lg text-slate-400">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 text-xs font-semibold">
              <div>
                <label className="block text-slate-600 mb-1.5">Status Filter</label>
                <select 
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white"
                >
                  <option value="All">All Statuses</option>
                  <option value="Active">Active / Published</option>
                  <option value="Draft">Draft</option>
                  <option value="Review">Review</option>
                </select>
              </div>

              {isStudentLifecycle && (
                <div>
                  <label className="block text-slate-600 mb-1.5">Grade Filter</label>
                  <select 
                    value={filterClass}
                    onChange={(e) => setFilterClass(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white"
                  >
                    <option value="All">All Grades</option>
                    <option value="Grade 10">Grade 10</option>
                    <option value="Grade 11">Grade 11</option>
                  </select>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-slate-100 text-xs font-bold">
              <button 
                onClick={() => { setFilterStatus('All'); setFilterClass('All'); setIsFilterModalOpen(false); }}
                className="px-4 py-2 bg-slate-100 text-slate-600 rounded-xl"
              >
                Reset
              </button>
              <button 
                onClick={() => setIsFilterModalOpen(false)}
                className="px-4 py-2 bg-indigo-600 text-white rounded-xl shadow-sm hover:bg-indigo-700"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Right-Side Slidedrawer for View & Edit details */}
      <AnimatePresence>
        {activeDrawerItem && (
          <div className="fixed inset-0 z-50 overflow-hidden">
            <div className="absolute inset-0 bg-slate-900/30 backdrop-blur-sm" onClick={() => setActiveDrawerItem(null)} />
            
            <div className="absolute inset-y-0 right-0 max-w-full flex">
              <motion.div 
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="w-screen max-w-md bg-white shadow-2xl p-6 sm:p-8 flex flex-col justify-between"
              >
                <div className="space-y-6 overflow-y-auto pr-1">
                  
                  {/* Drawer Header */}
                  <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                    <div>
                      <span className="text-[10px] font-black font-mono text-slate-400 bg-slate-100 px-2.5 py-0.5 rounded uppercase">
                        {activeDrawerItem.id}
                      </span>
                      <h3 className="text-base font-black text-slate-900 mt-1.5">
                        {isStudentLifecycle ? 'Student Profile Sheet' : 'Syllabus & Lesson Guide'}
                      </h3>
                    </div>
                    <button onClick={() => setActiveDrawerItem(null)} className="p-1 hover:bg-slate-50 rounded-lg text-slate-400">
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Drawer Content */}
                  <div className="space-y-4 text-xs font-semibold text-slate-600">
                    {isStudentLifecycle ? (
                      <>
                        <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-3xl border border-slate-100">
                          <img src={activeDrawerItem.photo} className="w-12 h-12 rounded-full object-cover border" alt="" referrerPolicy="no-referrer" />
                          <div>
                            <span className="block text-sm font-black text-slate-900">{activeDrawerItem.name}</span>
                            <span className="text-slate-400 text-[10px]">Academic Standing: {activeDrawerItem.academicStanding}</span>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <div>
                            <span className="text-[10px] text-slate-400 block">Class details</span>
                            <p className="text-slate-900 text-xs font-bold mt-0.5">{activeDrawerItem.class} - Section {activeDrawerItem.section}</p>
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-400 block">Admission Number</span>
                            <p className="text-slate-900 font-mono text-xs font-bold mt-0.5">{activeDrawerItem.admissionNumber}</p>
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-400 block">Parent / Guardian Contacts</span>
                            <p className="text-slate-900 text-xs font-bold mt-0.5">{activeDrawerItem.parentName} ({activeDrawerItem.parentPhone})</p>
                            <p className="text-slate-400 font-mono text-[10px] mt-0.5">{activeDrawerItem.parentEmail}</p>
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-400 block">Current Status</span>
                            <p className="text-slate-900 text-xs font-bold mt-0.5">{activeDrawerItem.status}</p>
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="bg-slate-50 p-4 rounded-3xl border border-slate-100 space-y-1">
                          <span className="text-[10px] text-slate-400 uppercase font-bold">{activeDrawerItem.subject}</span>
                          <h4 className="text-sm font-black text-slate-900">{activeDrawerItem.title}</h4>
                        </div>

                        <div className="space-y-3">
                          <div>
                            <span className="text-[10px] text-slate-400 block">Current Course Stage</span>
                            <p className="text-slate-900 text-xs font-bold mt-0.5">{activeDrawerItem.stage}</p>
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-400 block">Workspace Owner</span>
                            <p className="text-slate-900 text-xs font-bold mt-0.5">{activeDrawerItem.owner}</p>
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-400 block">Last Sync / Modified</span>
                            <p className="text-slate-900 font-mono text-xs font-bold mt-0.5">{activeDrawerItem.updated}</p>
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-400 block">Completion Rate</span>
                            <p className="text-slate-900 text-xs font-bold mt-0.5">{activeDrawerItem.progress}% completed</p>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex gap-3 pt-4 border-t border-slate-100 text-xs font-bold mt-4">
                  <button onClick={() => setActiveDrawerItem(null)} className="flex-1 py-3 bg-slate-100 text-slate-700 rounded-xl">
                    Close Details
                  </button>
                  <button 
                    onClick={() => { setActiveDrawerItem(null); alert('Refactored and synced details into core ERP system.'); }}
                    className="flex-1 py-3 bg-indigo-600 text-white rounded-xl shadow-sm hover:bg-indigo-700"
                  >
                    Sync & Save
                  </button>
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* Add New Entry Modal (Stepper / Accordion Section Inspired) */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-5">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-base font-black text-slate-900">
                Log New Entry Workspace
              </h3>
              <button onClick={() => setIsAddModalOpen(false)} className="p-1 hover:bg-slate-50 rounded-lg text-slate-400">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddItem} className="space-y-4 text-xs font-semibold">
              {isStudentLifecycle ? (
                <>
                  <div>
                    <label className="block text-slate-600 mb-1">Student Full Name</label>
                    <input 
                      type="text" 
                      value={newFormFields.name}
                      onChange={(e) => setNewFormFields({ ...newFormFields, name: e.target.value })}
                      placeholder="e.g. Aarav Sharma"
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500"
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-600 mb-1">Grade</label>
                      <select 
                        value={newFormFields.class}
                        onChange={(e) => setNewFormFields({ ...newFormFields, class: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white"
                      >
                        <option value="Grade 10">Grade 10</option>
                        <option value="Grade 11">Grade 11</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-slate-600 mb-1">Section</label>
                      <input 
                        type="text" 
                        value={newFormFields.section}
                        onChange={(e) => setNewFormFields({ ...newFormFields, section: e.target.value })}
                        placeholder="A"
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                      />
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="block text-slate-600 mb-1">Workspace Title / Chapter Outline</label>
                    <input 
                      type="text" 
                      value={newFormFields.title}
                      onChange={(e) => setNewFormFields({ ...newFormFields, title: e.target.value })}
                      placeholder="e.g. Algebra Matrices"
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-600 mb-1">Subject</label>
                      <select 
                        value={newFormFields.subject}
                        onChange={(e) => setNewFormFields({ ...newFormFields, subject: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white"
                      >
                        <option value="Mathematics">Mathematics</option>
                        <option value="Physics">Physics</option>
                        <option value="Chemistry">Chemistry</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-slate-600 mb-1">Stage / Objective</label>
                      <input 
                        type="text" 
                        value={newFormFields.stage}
                        onChange={(e) => setNewFormFields({ ...newFormFields, stage: e.target.value })}
                        placeholder="Unit 1 limits"
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                      />
                    </div>
                  </div>
                </>
              )}

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100 text-xs font-bold">
                <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-4 py-2 bg-slate-100 text-slate-600 rounded-xl">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-xl shadow-sm hover:bg-indigo-700">
                  Save Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
