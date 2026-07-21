import React, { useState } from 'react';
import { useStudents } from '../../hooks/useStudents';
import { HealthCard } from '../../components/student/StudentCards';
import { Heart, Save, Activity } from 'lucide-react';

export const StudentHealth: React.FC = () => {
  const { students, updateStudent } = useStudents();
  const [selectedStudent, setSelectedStudent] = useState(students[0]?.id || '');
  const [height, setHeight] = useState('172 cm');
  const [weight, setWeight] = useState('64 kg');
  const [bloodGroup, setBloodGroup] = useState('O+');
  const [allergies, setAllergies] = useState('Peanuts, Dust');
  const [medicalConditions, setMedicalConditions] = useState('None');

  const student = students.find(s => s.id === selectedStudent) || students[0];

  const handleUpdateHealth = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent) return;

    updateStudent(selectedStudent, {
      healthRecord: {
        height,
        weight,
        bloodGroup,
        allergies: allergies.split(',').map(s => s.trim()).filter(Boolean),
        medicalConditions: medicalConditions.split(',').map(s => s.trim()).filter(Boolean),
        lastCheckupDate: new Date().toISOString().split('T')[0],
        vaccinations: student?.healthRecord?.vaccinations || []
      }
    });

    alert('Clinical health records successfully compiled and saved.');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h2 className="text-xl font-black text-slate-800 dark:text-slate-100 tracking-tight">Clinical Student Health Registry</h2>
        <p className="text-xs text-slate-400 font-medium">Log annual physical measurements, update chronic condition declarations, and audit allergen profiles.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left column: update form */}
        <form onSubmit={handleUpdateHealth} className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-5 md:p-6 rounded-3xl space-y-4 shadow-2xs">
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">Select Target Student</label>
            <select 
              value={selectedStudent} 
              onChange={e => {
                setSelectedStudent(e.target.value);
                const s = students.find(x => x.id === e.target.value);
                if (s) {
                  setHeight(s.healthRecord.height);
                  setWeight(s.healthRecord.weight);
                  setBloodGroup(s.healthRecord.bloodGroup);
                  setAllergies(s.healthRecord.allergies.join(', '));
                  setMedicalConditions(s.healthRecord.medicalConditions.join(', '));
                }
              }} 
              className="form-select"
            >
              {students.map(s => (
                <option key={s.id} value={s.id}>{s.name} ({s.grade})</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">Height</label>
              <input type="text" value={height} onChange={e => setHeight(e.target.value)} className="form-input" />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">Weight</label>
              <input type="text" value={weight} onChange={e => setWeight(e.target.value)} className="form-input" />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">Blood Group</label>
              <select value={bloodGroup} onChange={e => setBloodGroup(e.target.value)} className="form-select">
                <option>O+</option>
                <option>O-</option>
                <option>A+</option>
                <option>A-</option>
                <option>B+</option>
                <option>B-</option>
                <option>AB+</option>
                <option>AB-</option>
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">Allergens List (comma separated)</label>
            <input type="text" value={allergies} onChange={e => setAllergies(e.target.value)} className="form-input" />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">Chronic Conditions (comma separated)</label>
            <input type="text" value={medicalConditions} onChange={e => setMedicalConditions(e.target.value)} className="form-input" />
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold py-2.5 rounded-xl text-xs flex items-center justify-center space-x-2 transition shadow-md shadow-indigo-600/15 cursor-pointer"
          >
            <Save className="w-4.5 h-4.5" />
            <span>Update Clinical Record</span>
          </button>
        </form>

        {/* Right column: health card view */}
        <div className="space-y-6">
          {student && <HealthCard student={student} />}
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
