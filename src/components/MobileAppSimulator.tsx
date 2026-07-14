import React, { useState } from 'react';
import { Smartphone, User, Bell, Navigation, Calendar, CreditCard } from 'lucide-react';

export const MobileAppSimulator: React.FC = () => {
  const [appRole, setAppRole] = useState<'student' | 'parent' | 'teacher' | 'driver'>('student');

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Multi-App Mobile Suite Simulator</h1>
        <p className="text-xs text-slate-500">Preview dedicated native mobile apps designed for Students, Parents, Teachers, and Bus Drivers.</p>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setAppRole('student')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${appRole === 'student' ? 'bg-indigo-600 text-white' : 'bg-white border border-slate-200 text-slate-700'}`}
        >
          🎓 Student App
        </button>
        <button
          onClick={() => setAppRole('parent')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${appRole === 'parent' ? 'bg-indigo-600 text-white' : 'bg-white border border-slate-200 text-slate-700'}`}
        >
          👨‍👩‍👦 Parent App
        </button>
        <button
          onClick={() => setAppRole('teacher')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${appRole === 'teacher' ? 'bg-indigo-600 text-white' : 'bg-white border border-slate-200 text-slate-700'}`}
        >
          👨‍🏫 Teacher App
        </button>
        <button
          onClick={() => setAppRole('driver')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${appRole === 'driver' ? 'bg-indigo-600 text-white' : 'bg-white border border-slate-200 text-slate-700'}`}
        >
          🚌 Driver App
        </button>
      </div>

      {/* Phone Frame Simulator */}
      <div className="flex justify-center py-6">
        <div className="w-[320px] h-[640px] bg-slate-950 border-8 border-slate-800 rounded-[48px] shadow-2xl overflow-hidden flex flex-col text-white relative">
          {/* Notch */}
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-5 bg-slate-800 rounded-b-2xl"></div>

          {/* Phone Header */}
          <div className="pt-8 px-5 pb-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
            <span className="font-bold text-xs uppercase text-indigo-400">Galaxy {appRole} App</span>
            <span className="text-[10px] text-emerald-400 font-mono">9:41 AM</span>
          </div>

          {/* App Body */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 text-xs">
            {appRole === 'student' && (
              <>
                <div className="bg-indigo-600/20 border border-indigo-500/30 p-4 rounded-2xl">
                  <div className="text-[10px] text-indigo-300">Welcome back</div>
                  <div className="text-base font-bold">Aarav Sharma</div>
                  <div className="text-[11px] text-slate-300 mt-1">Grade 12-A • GPA 3.8</div>
                </div>
                <div className="bg-slate-900 border border-slate-800 p-3 rounded-2xl space-y-2">
                  <div className="font-bold text-slate-300">Today Schedule</div>
                  <div className="p-2 bg-slate-800/80 rounded-xl flex items-center justify-between">
                    <span>Advanced Mathematics</span>
                    <span className="text-emerald-400">09:00 AM</span>
                  </div>
                </div>
              </>
            )}

            {appRole === 'parent' && (
              <>
                <div className="bg-emerald-600/20 border border-emerald-500/30 p-4 rounded-2xl">
                  <div className="text-[10px] text-emerald-300">Parent Portal Dashboard</div>
                  <div className="text-base font-bold">Child: Aarav Sharma</div>
                </div>
                <div className="bg-slate-900 border border-slate-800 p-3 rounded-2xl space-y-2">
                  <div className="font-bold text-slate-300">Bus Live Tracking</div>
                  <div className="text-[11px] text-indigo-300">Bus #4 is 12 mins away from your stop.</div>
                </div>
              </>
            )}

            {appRole === 'teacher' && (
              <>
                <div className="bg-violet-600/20 border border-violet-500/30 p-4 rounded-2xl">
                  <div className="text-[10px] text-violet-300">Faculty Portal</div>
                  <div className="text-base font-bold">Dr. Alok Mukherjee</div>
                </div>
                <div className="bg-slate-900 border border-slate-800 p-3 rounded-2xl space-y-2">
                  <div className="font-bold text-slate-300">Pending Actions</div>
                  <div className="p-2 bg-slate-800/80 rounded-xl flex items-center justify-between">
                    <span>Mark Grade 12 Attendance</span>
                    <span className="text-emerald-400">Pending</span>
                  </div>
                </div>
              </>
            )}

            {appRole === 'driver' && (
              <>
                <div className="bg-amber-600/20 border border-amber-500/30 p-4 rounded-2xl">
                  <div className="text-[10px] text-amber-300">Bus Transit App</div>
                  <div className="text-base font-bold">Route #4 (South Ext)</div>
                </div>
                <div className="bg-slate-900 border border-slate-800 p-3 rounded-2xl space-y-2">
                  <div className="font-bold text-slate-300">Next Stop</div>
                  <div className="text-xs text-indigo-300 font-semibold">Moolchand Flyover (Sector 12)</div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
