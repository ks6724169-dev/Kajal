import React, { useState } from 'react';
import { useStudents } from '../../hooks/useStudents';
import { DocumentCard } from '../../components/student/StudentCards';
import { Files, Upload, CheckCircle2 } from 'lucide-react';

export const StudentDocuments: React.FC = () => {
  const { students, updateStudent } = useStudents();
  const [selectedStudent, setSelectedStudent] = useState(students[0]?.id || '');
  const [docName, setDocName] = useState('');
  const [category, setCategory] = useState<'Admission Form' | 'Transfer Certificate' | 'Report Card' | 'Medical Cert' | 'ID Proof'>('ID Proof');

  const student = students.find(s => s.id === selectedStudent) || students[0];

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent || !docName.trim()) return;

    const newDoc = {
      id: `doc_${Date.now()}`,
      name: docName,
      category,
      fileUrl: '#',
      uploadedAt: new Date().toISOString().split('T')[0],
      size: '1.5 MB'
    };

    updateStudent(selectedStudent, {
      documents: [newDoc, ...(student?.documents || [])]
    });

    setDocName('');
    alert('Document added successfully to digital SIS locker!');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h2 className="text-xl font-black text-slate-800 dark:text-slate-100 tracking-tight">Student Digital Document Locker</h2>
        <p className="text-xs text-slate-400 font-medium">Store, audit, and preview regulatory school transfer certificates, medical reports, and admission forms.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Upload Form */}
        <form onSubmit={handleUpload} className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-5 rounded-3xl space-y-4 shadow-2xs h-fit">
          <div className="flex items-center space-x-1.5 text-indigo-600 border-b border-slate-100 dark:border-slate-800 pb-2">
            <Upload className="w-4.5 h-4.5" />
            <h4 className="text-xs font-black uppercase tracking-wider">Upload New Document</h4>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">Select Target Student</label>
            <select value={selectedStudent} onChange={e => setSelectedStudent(e.target.value)} className="form-select">
              {students.map(s => (
                <option key={s.id} value={s.id}>{s.name} ({s.grade})</option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">Document Name</label>
            <input type="text" required value={docName} onChange={e => setDocName(e.target.value)} placeholder="e.g. CBSE 10th Marksheet" className="form-input" />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">Document Category</label>
            <select value={category} onChange={e => setCategory(e.target.value as any)} className="form-select">
              <option value="Admission Form">Admission Form</option>
              <option value="Transfer Certificate">Transfer Certificate</option>
              <option value="Report Card">Report Card</option>
              <option value="Medical Cert">Medical Cert</option>
              <option value="ID Proof">ID Proof</option>
            </select>
          </div>

          <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold py-2.5 rounded-xl text-xs flex items-center justify-center space-x-1.5 transition shadow-sm cursor-pointer">
            <span>Archive Document</span>
          </button>
        </form>

        {/* Display documents locker */}
        <div className="md:col-span-2 space-y-3">
          <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Locker Files Archive</span>
          {student && student.documents.length > 0 ? student.documents.map(doc => (
            <DocumentCard key={doc.id} doc={doc} />
          )) : <p className="text-xs text-slate-400 font-medium p-4 bg-white dark:bg-slate-900 border border-slate-100 rounded-2xl text-center">No documents uploaded for this candidate yet.</p>}
        </div>
      </div>

      <style>{`
        .form-input {
          width: 100%;
          background: rgb(248, 250, 252);
          border: 1px solid rgb(226, 232, 240);
          border-radius: 12px;
          padding: 10px 14px;
          font-size: 12px;
          font-weight: 500;
          color: rgb(30, 41, 59);
          outline: none;
        }
        .dark .form-input {
          background: rgb(15, 23, 42);
          border-color: rgb(30, 41, 59);
          color: rgb(241, 245, 249);
        }
        .form-select {
          width: 100%;
          background: rgb(248, 250, 252);
          border: 1px solid rgb(226, 232, 240);
          border-radius: 12px;
          padding: 10px 14px;
          font-size: 12px;
          font-weight: 600;
          color: rgb(51, 65, 85);
          outline: none;
          cursor: pointer;
        }
        .dark .form-select {
          background: rgb(15, 23, 42);
          border-color: rgb(30, 41, 59);
          color: rgb(226, 226, 240);
        }
      `}</style>
    </div>
  );
};
