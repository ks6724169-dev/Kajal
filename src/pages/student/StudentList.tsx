import React, { useState } from 'react';
import { useStudents } from '../../hooks/useStudents';
import { StudentSearch, StudentFilter, StudentStatistics } from '../../components/student/StudentCommon';
import { StudentCard } from '../../components/student/StudentCards';
import { useStudentAnalytics } from '../../hooks/useStudentAnalytics';
import { UserPlus, Download, FileSpreadsheet, Trash2, Edit, ChevronRight } from 'lucide-react';

interface StudentListProps {
  onSelectStudent: (id: string) => void;
  onOpenAdmission: () => void;
}

export const StudentList: React.FC<StudentListProps> = ({ onSelectStudent, onOpenAdmission }) => {
  const { students, selectedStudentId, setSelectedStudentId } = useStudents();
  const analytics = useStudentAnalytics();

  const [query, setQuery] = useState('');
  const [grade, setGrade] = useState('All Grades');
  const [house, setHouse] = useState('All Houses');
  const [type, setType] = useState<'all' | 'weak' | 'gifted'>('all');

  // Filter logic
  const filtered = students.filter(s => {
    const matchesQuery = s.name.toLowerCase().includes(query.toLowerCase()) || 
                         s.admissionNo.toLowerCase().includes(query.toLowerCase());
    const matchesGrade = grade === 'All Grades' || s.grade === grade;
    const matchesHouse = house === 'All Houses' || s.house === house;
    
    let matchesType = true;
    if (type === 'weak') matchesType = s.isWeak;
    if (type === 'gifted') matchesType = s.isGifted;

    return matchesQuery && matchesGrade && matchesHouse && matchesType;
  });

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-800 dark:text-slate-100 tracking-tight">Active Student Roster</h2>
          <p className="text-xs text-slate-400 font-medium">Manage corporate directories, academic filters, and core student lists.</p>
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          <button className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 text-slate-700 dark:text-slate-300 font-bold px-3.5 py-2 rounded-xl text-xs flex items-center space-x-1.5 transition cursor-pointer">
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
          
          <button 
            onClick={onOpenAdmission}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold px-4 py-2.5 rounded-xl text-xs shadow-md shadow-indigo-600/20 transition flex items-center space-x-1.5 cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>New Admission</span>
          </button>
        </div>
      </div>

      {/* Statistics board */}
      <StudentStatistics 
        total={analytics.total}
        avgGPA={analytics.avgGPA}
        avgAttendance={analytics.avgAttendance}
        weakCount={analytics.weakCount}
        giftedCount={analytics.giftedCount}
      />

      {/* Control panel: search + filters */}
      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-4 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-2xs">
        <div className="w-full md:w-96">
          <StudentSearch query={query} setQuery={setQuery} />
        </div>
        <StudentFilter 
          selectedGrade={grade} 
          setSelectedGrade={setGrade} 
          selectedHouse={house} 
          setSelectedHouse={setHouse} 
          selectedType={type} 
          setSelectedType={setType} 
        />
      </div>

      {/* Interactive Grid List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {filtered.length > 0 ? filtered.map(s => (
          <StudentCard 
            key={s.id} 
            student={s} 
            selected={selectedStudentId === s.id}
            onClick={() => {
              setSelectedStudentId(s.id);
              onSelectStudent(s.id);
            }}
          />
        )) : (
          <div className="col-span-full py-16 text-center bg-white dark:bg-slate-900 border border-dashed border-slate-200 dark:border-slate-800 rounded-3xl">
            <span className="text-3xl">🔍</span>
            <h3 className="text-sm font-black text-slate-800 dark:text-slate-200 mt-2">No student records found</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto font-medium">Try loosening your filters or adding a new student through the Admission Portal.</p>
          </div>
        )}
      </div>
    </div>
  );
};
