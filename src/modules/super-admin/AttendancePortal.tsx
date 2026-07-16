import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Camera, 
  Scan, 
  CheckCircle2, 
  UserCheck, 
  AlertCircle,
  RefreshCw
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const AttendancePortal: React.FC = () => {
  const [scanning, setScanning] = useState(false);
  const [detectedStudent, setDetectedStudent] = useState<any>(null);

  const handleStartFaceScan = () => {
    setScanning(true);
    setDetectedStudent(null);
    setTimeout(() => {
      setScanning(false);
      setDetectedStudent({
        name: 'Aarav Sharma',
        admissionNo: 'APEX2026001',
        grade: 'Grade 12-A',
        time: new Date().toLocaleTimeString(),
        confidence: '99.4%'
      });
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
    }, 2000);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Face Recognition & Biometric Attendance Gateway</h1>
        <p className="text-xs text-slate-500">AI-powered facial recognition gate scanner for automated student & staff attendance marking.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Camera Scanner Simulation */}
        <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 text-white shadow-xl lg:col-span-2 flex flex-col items-center justify-center min-h-[420px] relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(#312e81_1px,transparent_1px)] [background-size:16px_16px] opacity-30"></div>

          {!scanning && !detectedStudent && (
            <div className="text-center space-y-4 relative z-10">
              <div className="w-20 h-20 rounded-full bg-indigo-600/20 border-2 border-indigo-500/50 flex items-center justify-center mx-auto text-indigo-400">
                <Camera className="w-10 h-10 animate-pulse" />
              </div>
              <h2 className="text-lg font-bold">Face Recognition Gate #1 Ready</h2>
              <p className="text-xs text-slate-400 max-w-sm">Position student face in front of the camera gate to instantly record attendance.</p>
              <button
                onClick={handleStartFaceScan}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-3 rounded-xl text-xs shadow-lg shadow-indigo-600/30 transition flex items-center space-x-2 mx-auto"
              >
                <Scan className="w-4 h-4" />
                <span>Simulate Face Scan & Detect</span>
              </button>
            </div>
          )}

          {scanning && (
            <div className="text-center space-y-4 relative z-10">
              <div className="w-24 h-24 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin mx-auto flex items-center justify-center">
                <RefreshCw className="w-8 h-8 text-indigo-400 animate-spin" />
              </div>
              <h2 className="text-lg font-bold">Scanning Biometric Features...</h2>
              <p className="text-xs text-indigo-300">Matching with Galaxy Neural SIS Database</p>
            </div>
          )}

          {detectedStudent && !scanning && (
            <div className="text-center space-y-4 relative z-10 bg-slate-900/90 border border-emerald-500/50 rounded-3xl p-6 backdrop-blur-md max-w-md w-full shadow-2xl">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500 text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <div>
                <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-300 px-3 py-1 rounded-full uppercase">
                  Attendance Marked • {detectedStudent.confidence} Match
                </span>
                <h3 className="text-xl font-black mt-2 text-white">{detectedStudent.name}</h3>
                <p className="text-xs text-slate-300">{detectedStudent.admissionNo} • {detectedStudent.grade}</p>
                <p className="text-[11px] text-slate-400 mt-1">Recorded at {detectedStudent.time}</p>
              </div>
              <button
                onClick={() => setDetectedStudent(null)}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 rounded-xl text-xs transition"
              >
                Scan Next Student
              </button>
            </div>
          )}
        </div>

        {/* Live Attendance Summary */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 mb-1">Today Attendance Summary</h2>
            <p className="text-xs text-slate-500">Live gate entry statistics across all campuses</p>

            <div className="mt-6 space-y-4">
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex items-center justify-between">
                <div>
                  <div className="text-xs text-slate-500">Total Present</div>
                  <div className="text-2xl font-black text-slate-900 mt-0.5">2,410</div>
                </div>
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                  96.8%
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex items-center justify-between">
                <div>
                  <div className="text-xs text-slate-500">Late Arrivals</div>
                  <div className="text-2xl font-black text-amber-600 mt-0.5">42</div>
                </div>
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                  1.6%
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex items-center justify-between">
                <div>
                  <div className="text-xs text-slate-500">Absent / On Leave</div>
                  <div className="text-2xl font-black text-rose-600 mt-0.5">88</div>
                </div>
                <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center font-bold">
                  3.4%
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 text-center">
            <span className="text-[11px] text-slate-400 font-mono">Biometric API Sync: Active (0.04ms latency)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
