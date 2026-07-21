import React, { useState } from 'react';
import { useStudents } from '../../hooks/useStudents';
import { UserPlus, ArrowRight, ArrowLeft, CheckCircle2, Save } from 'lucide-react';
import confetti from 'canvas-confetti';

interface StudentAdmissionProps {
  onSuccess: () => void;
}

export const StudentAdmission: React.FC<StudentAdmissionProps> = ({ onSuccess }) => {
  const { addStudent } = useStudents();
  const [step, setStep] = useState(1);

  // Form Fields
  const [name, setName] = useState('');
  const [grade, setGrade] = useState('Grade 11');
  const [section, setSection] = useState('A');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [busRoute, setBusRoute] = useState('Route #1 (Green Park)');
  
  const [fatherName, setFatherName] = useState('');
  const [fatherPhone, setFatherPhone] = useState('');
  const [fatherOccupation, setFatherOccupation] = useState('');
  const [motherName, setMotherName] = useState('');
  const [motherPhone, setMotherPhone] = useState('');
  const [motherOccupation, setMotherOccupation] = useState('');
  const [address, setAddress] = useState('');

  const [house, setHouse] = useState<'Red Gryphons' | 'Blue Krakens' | 'Green Hydras' | 'Gold Phoenixes'>('Gold Phoenixes');
  const [club, setClub] = useState<'Coding & AI Club' | 'Robotics Society' | 'Debate & Oratory' | 'Drama & Arts' | 'Eco Warriors'>('Coding & AI Club');
  const [portfolioSummary, setPortfolioSummary] = useState('');

  const handleNextStep = () => {
    if (step < 3) setStep(step + 1);
  };

  const handlePrevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    // Call store
    addStudent({
      name,
      grade,
      section,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150', // standard high quality avatar placeholder
      parentName: fatherName || 'Parent Guardian',
      phone: phone || '+91 98765 00000',
      email: email || 'student@apex.edu',
      feeStatus: 'pending',
      feeDueAmount: 35000,
      attendanceRate: 100,
      gpa: 4.0,
      busRoute,
      house,
      club,
      parentInfo: {
        fatherName: fatherName || 'Father Guardian',
        fatherOccupation: fatherOccupation || 'Professional',
        fatherPhone: fatherPhone || '+91 98765 00000',
        motherName: motherName || 'Mother Guardian',
        motherOccupation: motherOccupation || 'Professional',
        motherPhone: motherPhone || '+91 98765 00001',
        emergencyContact: `${fatherName || 'Parent'} (${fatherPhone || '+91 98765 00000'})`,
        address: address || 'Galaxy Campus Residential Quarters'
      },
      isWeak: false,
      isGifted: false,
      promotionStatus: 'recommended',
      portfolioSummary: portfolioSummary || 'New candidate enrolled for current academic term.'
    });

    confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });
    onSuccess();
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h2 className="text-xl font-black text-slate-800 dark:text-slate-100 tracking-tight">On-line Student Admission</h2>
        <p className="text-xs text-slate-400 font-medium">Verify credentials, allocate houses and societies, and register family index cards.</p>
      </div>

      {/* Progress Wizard tracker */}
      <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-4 rounded-2xl text-xs font-bold text-slate-400">
        <span className={step === 1 ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-500'}>1. Candidate Profile</span>
        <ChevronIcon />
        <span className={step === 2 ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-500'}>2. Family & Guardians</span>
        <ChevronIcon />
        <span className={step === 3 ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-500'}>3. Extra-curriculars</span>
      </div>

      <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-5 md:p-6 rounded-3xl space-y-6 shadow-2xs">
        {step === 1 && (
          <div className="space-y-4">
            <h3 className="text-sm font-extrabold text-slate-800 dark:text-slate-100 uppercase tracking-wider">Candidate Profile Details</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">Full Name</label>
                <input 
                  type="text" 
                  required 
                  value={name} 
                  onChange={e => setName(e.target.value)} 
                  placeholder="e.g. Ramesh Kumar" 
                  className="form-input" 
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">Grade Selection</label>
                  <select value={grade} onChange={e => setGrade(e.target.value)} className="form-select">
                    <option>Grade 9</option>
                    <option>Grade 10</option>
                    <option>Grade 11</option>
                    <option>Grade 12</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">Section</label>
                  <select value={section} onChange={e => setSection(e.target.value)} className="form-select">
                    <option>A</option>
                    <option>B</option>
                    <option>C</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">Email Address</label>
                <input 
                  type="email" 
                  required 
                  value={email} 
                  onChange={e => setEmail(e.target.value)} 
                  placeholder="ramesh@apex.edu" 
                  className="form-input" 
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">Active Mobile Number</label>
                <input 
                  type="tel" 
                  required 
                  value={phone} 
                  onChange={e => setPhone(e.target.value)} 
                  placeholder="+91 99999 88888" 
                  className="form-input" 
                />
              </div>

              <div className="col-span-full space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">GPS Transit Route</label>
                <select value={busRoute} onChange={e => setBusRoute(e.target.value)} className="form-select">
                  <option>Route #1 (Green Park)</option>
                  <option>Route #4 (Vasant Kunj)</option>
                  <option>Route #12 (Dwarka)</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <h3 className="text-sm font-extrabold text-slate-800 dark:text-slate-100 uppercase tracking-wider">Family & Guardians Registry</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">Father's Name</label>
                <input 
                  type="text" 
                  value={fatherName} 
                  onChange={e => setFatherName(e.target.value)} 
                  placeholder="Mr. Father Name" 
                  className="form-input" 
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">Father's Occupation</label>
                <input 
                  type="text" 
                  value={fatherOccupation} 
                  onChange={e => setFatherOccupation(e.target.value)} 
                  placeholder="e.g. Architect" 
                  className="form-input" 
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">Mother's Name</label>
                <input 
                  type="text" 
                  value={motherName} 
                  onChange={e => setMotherName(e.target.value)} 
                  placeholder="Mrs. Mother Name" 
                  className="form-input" 
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">Mother's Occupation</label>
                <input 
                  type="text" 
                  value={motherOccupation} 
                  onChange={e => setMotherOccupation(e.target.value)} 
                  placeholder="e.g. Bank Director" 
                  className="form-input" 
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">Emergency Contact Phone</label>
                <input 
                  type="tel" 
                  value={fatherPhone} 
                  onChange={e => setFatherPhone(e.target.value)} 
                  placeholder="+91 98765 00000" 
                  className="form-input" 
                />
              </div>

              <div className="col-span-full space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">Residential Address</label>
                <textarea 
                  value={address} 
                  onChange={e => setAddress(e.target.value)} 
                  placeholder="Full street and apartment details..." 
                  rows={2} 
                  className="form-input resize-none"
                />
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <h3 className="text-sm font-extrabold text-slate-800 dark:text-slate-100 uppercase tracking-wider">Extra-curricular & Society Allocation</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">Academic Society House</label>
                <select 
                  value={house} 
                  onChange={e => setHouse(e.target.value as any)} 
                  className="form-select"
                >
                  <option value="Gold Phoenixes">Gold Phoenixes</option>
                  <option value="Red Gryphons">Red Gryphons</option>
                  <option value="Blue Krakens">Blue Krakens</option>
                  <option value="Green Hydras">Green Hydras</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">Extra-curricular Society Club</label>
                <select 
                  value={club} 
                  onChange={e => setClub(e.target.value as any)} 
                  className="form-select"
                >
                  <option value="Coding & AI Club">Coding & AI Club</option>
                  <option value="Robotics Society">Robotics Society</option>
                  <option value="Debate & Oratory">Debate & Oratory</option>
                  <option value="Drama & Arts">Drama & Arts</option>
                  <option value="Eco Warriors">Eco Warriors</option>
                </select>
              </div>

              <div className="col-span-full space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">Candidate Portfolio Summary Narrative</label>
                <textarea 
                  value={portfolioSummary} 
                  onChange={e => setPortfolioSummary(e.target.value)} 
                  placeholder="e.g. Highly motivated in computational coding and robotics research workshops..." 
                  rows={4} 
                  className="form-input resize-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* Form control buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
          {step > 1 ? (
            <button
              type="button"
              onClick={handlePrevStep}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs flex items-center space-x-1.5 transition cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          ) : (
            <div />
          )}

          {step < 3 ? (
            <button
              type="button"
              onClick={handleNextStep}
              className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold rounded-xl text-xs flex items-center space-x-1.5 transition shadow-sm shadow-indigo-600/10 cursor-pointer"
            >
              <span>Next Step</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="submit"
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-xl text-xs flex items-center space-x-2 transition shadow-md shadow-indigo-600/20 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Approve & Admit Student</span>
            </button>
          )}
        </div>
      </form>

      {/* Styled inline elements */}
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
        .form-input:focus {
          border-color: rgb(99, 102, 241);
          box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.15);
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
          color: rgb(226, 232, 240);
        }
      `}</style>
    </div>
  );
};

const ChevronIcon = () => (
  <svg className="w-3 h-3 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
  </svg>
);
