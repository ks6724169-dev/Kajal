import React, { useState } from 'react';
import { INITIAL_EXAMS } from '../../constants/mockData';
import { ExamRecord } from '../../types';
import { 
  FileSpreadsheet, 
  CheckCircle2, 
  Upload, 
  Sparkles, 
  Award, 
  Loader2 
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const ExaminationPortal: React.FC = () => {
  const [exams, setExams] = useState<ExamRecord[]>(INITIAL_EXAMS);
  const [scanningOmr, setScanningOmr] = useState(false);
  const [omrResult, setOmrResult] = useState<any>(null);

  const handleSimulateOmrScan = () => {
    setScanningOmr(true);
    setOmrResult(null);
    setTimeout(() => {
      setScanningOmr(false);
      setOmrResult({
        student: 'Aarav Sharma (APEX2026001)',
        subject: 'Advanced Mathematics',
        score: '94 / 100',
        accuracy: '94.0%',
        grade: 'A+'
      });
      confetti({ particleCount: 90, spread: 70, origin: { y: 0.6 } });
    }, 2000);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Examinations, Report Cards & OMR Evaluation</h1>
        <p className="text-xs text-slate-500">Automated OMR sheet optical scanning, semester marksheets, gradebook analytics, and AI report cards.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Exams Table */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm lg:col-span-2 space-y-4">
          <h2 className="text-base font-bold text-slate-900">Upcoming & Recent Examinations</h2>
          <div className="divide-y divide-slate-100">
            {exams.map(ex => (
              <div key={ex.id} className="py-3.5 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sm text-slate-900">{ex.examName}</h3>
                  <p className="text-xs text-slate-500">{ex.subject} • {ex.grade} • {ex.date}</p>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-indigo-600">Avg: {ex.averageScore}%</div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    ex.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' :
                    ex.status === 'Evaluating' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'
                  }`}>
                    {ex.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* OMR Scanner Simulator */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <FileSpreadsheet className="w-5 h-5 text-indigo-600" />
              <h2 className="text-base font-bold text-slate-900">OMR Sheet Scanner</h2>
            </div>
            <p className="text-xs text-slate-500">Upload or scan OMR answer bubble sheets for instant optical grading.</p>

            <div className="mt-6 border-2 border-dashed border-slate-200 rounded-2xl p-6 text-center bg-slate-50">
              {!scanningOmr && !omrResult && (
                <div className="space-y-3">
                  <Upload className="w-8 h-8 text-indigo-500 mx-auto" />
                  <div className="text-xs font-semibold text-slate-700">Drop OMR Sheet PDF or Image</div>
                  <button
                    onClick={handleSimulateOmrScan}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-2 rounded-xl text-xs shadow-md shadow-indigo-600/35 transition"
                  >
                    Simulate OMR Scan & Grade
                  </button>
                </div>
              )}

              {scanningOmr && (
                <div className="py-8 space-y-3">
                  <Loader2 className="w-8 h-8 text-indigo-600 animate-spin mx-auto" />
                  <div className="text-xs font-bold text-slate-800">Optically Scanning OMR Bubbles...</div>
                </div>
              )}

              {omrResult && !scanningOmr && (
                <div className="space-y-3 text-left bg-emerald-50 border border-emerald-200 p-4 rounded-xl">
                  <div className="flex items-center space-x-1 text-emerald-800 font-bold text-xs">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>OMR Evaluated Successfully</span>
                  </div>
                  <div className="text-xs text-slate-700 space-y-1">
                    <div><strong>Student:</strong> {omrResult.student}</div>
                    <div><strong>Score:</strong> <span className="text-emerald-700 font-bold">{omrResult.score}</span></div>
                    <div><strong>Accuracy:</strong> {omrResult.accuracy}</div>
                    <div><strong>Grade Awarded:</strong> <span className="font-bold">{omrResult.grade}</span></div>
                  </div>
                  <button
                    onClick={() => setOmrResult(null)}
                    className="w-full bg-slate-900 text-white py-1.5 rounded-lg text-xs font-semibold"
                  >
                    Scan Another OMR
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
