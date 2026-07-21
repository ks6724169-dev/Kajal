import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calculator, TrendingUp, Clock, Zap, Target } from 'lucide-react';

export const ROICalculator: React.FC = () => {
  const [students, setStudents] = useState(500);
  const [avgFee, setAvgFee] = useState(2500);
  const [teachers, setTeachers] = useState(25);
  const [staff, setStaff] = useState(10);
  
  const [roi, setRoi] = useState({
    monthlySavings: 0,
    yearlySavings: 0,
    timeSaved: 0,
    productivityGain: 0
  });

  useEffect(() => {
    // Mock ROI calculation logic
    const adminCostPerStaff = 15000;
    const timePerStudentManual = 2; // hours/month
    const timeSavedPercentage = 0.4; // 40% efficiency gain
    
    const monthlySavings = Math.round((staff * adminCostPerStaff * 0.25) + (students * 50)); 
    const yearlySavings = monthlySavings * 12;
    const timeSaved = Math.round(students * timePerStudentManual * timeSavedPercentage);
    const productivityGain = 35; // Fixed 35% gain for mock

    setRoi({
      monthlySavings,
      yearlySavings,
      timeSaved,
      productivityGain
    });
  }, [students, avgFee, teachers, staff]);

  return (
    <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl overflow-hidden">
      <div className="grid lg:grid-cols-2">
        {/* Inputs */}
        <div className="p-8 lg:p-12 bg-slate-50 border-r border-slate-100">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white">
              <Calculator className="w-5 h-5" />
            </div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">ROI Calculator</h2>
          </div>
          
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="flex justify-between text-sm font-bold text-slate-600">
                <span>Number of Students</span>
                <span className="text-indigo-600">{students}</span>
              </div>
              <input 
                type="range" min="100" max="5000" step="100" value={students}
                onChange={(e) => setStudents(parseInt(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
            </div>

            <div className="space-y-4">
              <div className="flex justify-between text-sm font-bold text-slate-600">
                <span>Avg. Monthly Fee (₹)</span>
                <span className="text-indigo-600">₹{avgFee}</span>
              </div>
              <input 
                type="range" min="500" max="15000" step="500" value={avgFee}
                onChange={(e) => setAvgFee(parseInt(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Teachers</label>
                <input 
                  type="number" value={teachers} onChange={(e) => setTeachers(parseInt(e.target.value))}
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl font-bold text-slate-900 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Admin Staff</label>
                <input 
                  type="number" value={staff} onChange={(e) => setStaff(parseInt(e.target.value))}
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl font-bold text-slate-900 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="p-8 lg:p-12 relative overflow-hidden flex flex-col justify-center">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full blur-[100px] -mr-32 -mt-32 opacity-50" />
          
          <div className="grid grid-cols-2 gap-8 relative z-10">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-emerald-600 mb-2">
                <TrendingUp className="w-4 h-4" />
                <span className="text-[10px] font-black uppercase tracking-widest">Monthly Savings</span>
              </div>
              <div className="text-3xl font-black text-slate-900">
                ₹{roi.monthlySavings.toLocaleString()}
              </div>
              <p className="text-xs text-slate-500 font-medium">Estimated cash saved</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-indigo-600 mb-2">
                <Target className="w-4 h-4" />
                <span className="text-[10px] font-black uppercase tracking-widest">Yearly ROI</span>
              </div>
              <div className="text-3xl font-black text-slate-900">
                ₹{roi.yearlySavings.toLocaleString()}
              </div>
              <p className="text-xs text-slate-500 font-medium">Annual financial impact</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-orange-500 mb-2">
                <Clock className="w-4 h-4" />
                <span className="text-[10px] font-black uppercase tracking-widest">Time Saved</span>
              </div>
              <div className="text-3xl font-black text-slate-900">
                {roi.timeSaved}h
              </div>
              <p className="text-xs text-slate-500 font-medium">Monthly staff hours</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-purple-600 mb-2">
                <Zap className="w-4 h-4" />
                <span className="text-[10px] font-black uppercase tracking-widest">AI Efficiency</span>
              </div>
              <div className="text-3xl font-black text-slate-900">
                +{roi.productivityGain}%
              </div>
              <p className="text-xs text-slate-500 font-medium">Productivity increase</p>
            </div>
          </div>

          <div className="mt-12 p-6 bg-slate-900 rounded-2xl relative z-10 group overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/20 to-purple-600/20 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative flex items-center justify-between">
              <div>
                <p className="text-indigo-300 text-xs font-black uppercase tracking-widest mb-1">Total Potential Benefit</p>
                <h4 className="text-white font-bold text-lg">Modernize Your Institution Today</h4>
              </div>
              <button className="px-5 py-2 bg-white text-slate-950 rounded-xl font-black text-xs hover:scale-105 transition-transform">
                Get Started
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
