import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Calendar, Clock, Globe, Video, Users, CheckCircle2, ChevronRight, VideoIcon } from 'lucide-react';

export const DemoBooking: React.FC = () => {
  const [step, setStep] = useState(1);
  const [booking, setBooking] = useState({
    date: '',
    time: '',
    language: 'English',
    meetingType: 'Online',
    platform: 'Google Meet'
  });

  const dates = [
    { day: 'Mon', date: '22' }, { day: 'Tue', date: '23' }, { day: 'Wed', date: '24' },
    { day: 'Thu', date: '25' }, { day: 'Fri', date: '26' }, { day: 'Sat', date: '27' }
  ];

  const times = ['10:00 AM', '11:30 AM', '02:00 PM', '03:30 PM', '05:00 PM'];

  return (
    <div className="bg-slate-900 rounded-[3rem] p-8 md:p-16 relative overflow-hidden text-white">
      <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/20 rounded-full blur-[100px] -mr-48 -mt-48" />
      
      <div className="grid lg:grid-cols-2 gap-16 relative z-10">
        <div className="space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-indigo-400">
            <VideoIcon className="w-4 h-4" />
            <span className="text-[10px] font-black uppercase tracking-widest">Live Experience</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight leading-tight">
            See Galaxy ERP <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
              in Action.
            </span>
          </h2>
          <p className="text-slate-400 text-lg font-medium leading-relaxed max-w-md">
            Schedule a personalized walkthrough with our product experts and see how Galaxy AI can transform your institution.
          </p>
          
          <div className="space-y-4 pt-8">
            {[
              'Personalized Solution Walkthrough',
              'AI Integration Strategies',
              'Pricing & ROI Discussion',
              'Implementation Roadmap'
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-indigo-500" />
                <span className="font-bold text-slate-300">{item}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-[2.5rem] p-8 text-slate-900 shadow-2xl">
          {step === 1 ? (
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-black tracking-tight">Select Date & Time</h3>
                <span className="text-xs font-bold text-slate-400">Step 1 of 2</span>
              </div>

              <div className="space-y-4">
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <Calendar className="w-4 h-4" /> Available Dates
                </p>
                <div className="grid grid-cols-6 gap-2">
                  {dates.map((d, idx) => (
                    <button
                      key={idx}
                      onClick={() => setBooking({...booking, date: d.date})}
                      className={`flex flex-col items-center py-4 rounded-2xl transition-all border ${
                        booking.date === d.date 
                        ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg' 
                        : 'bg-slate-50 border-slate-100 text-slate-600 hover:border-indigo-200'
                      }`}
                    >
                      <span className="text-[10px] font-bold uppercase">{d.day}</span>
                      <span className="text-lg font-black">{d.date}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <Clock className="w-4 h-4" /> Select Time Slot
                </p>
                <div className="flex flex-wrap gap-2">
                  {times.map((t, idx) => (
                    <button
                      key={idx}
                      onClick={() => setBooking({...booking, time: t})}
                      className={`px-5 py-3 rounded-xl font-bold text-sm transition-all border ${
                        booking.time === t 
                        ? 'bg-slate-900 border-slate-900 text-white' 
                        : 'bg-slate-50 border-slate-100 text-slate-600 hover:border-slate-200'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <button 
                onClick={() => setStep(2)}
                disabled={!booking.date || !booking.time}
                className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-2 shadow-xl shadow-indigo-500/20 disabled:opacity-50"
              >
                Next Step <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-black tracking-tight">Meeting Details</h3>
                <span className="text-xs font-bold text-slate-400">Step 2 of 2</span>
              </div>

              <div className="space-y-6">
                <div className="space-y-4">
                  <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Preferred Language</p>
                  <div className="flex gap-2">
                    {['English', 'Hindi', 'Regional'].map(l => (
                      <button 
                        key={l} onClick={() => setBooking({...booking, language: l})}
                        className={`flex-1 py-3 rounded-xl font-bold text-sm border transition-all ${
                          booking.language === l ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-slate-50 text-slate-600 border-slate-100'
                        }`}
                      >
                        {l}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Platform</p>
                  <div className="grid grid-cols-2 gap-3">
                    {['Google Meet', 'Zoom', 'MS Teams', 'Offline Visit'].map(p => (
                      <button 
                        key={p} onClick={() => setBooking({...booking, platform: p})}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm border transition-all ${
                          booking.platform === p ? 'bg-slate-900 text-white border-slate-900' : 'bg-slate-50 text-slate-600 border-slate-100'
                        }`}
                      >
                        <Video className="w-4 h-4" />
                        {p}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <button 
                  onClick={() => setStep(1)}
                  className="px-6 py-5 bg-slate-100 text-slate-900 rounded-2xl font-black text-sm uppercase tracking-widest"
                >
                  Back
                </button>
                <button 
                  className="flex-1 py-5 bg-indigo-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-indigo-500/20"
                >
                  Confirm Booking
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
