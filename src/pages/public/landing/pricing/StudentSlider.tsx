import React from 'react';

interface StudentSliderProps {
  value: number;
  tiers: number[];
  onChange: (value: number) => void;
}

export const StudentSlider: React.FC<StudentSliderProps> = ({ value, tiers, onChange }) => {
  return (
    <div className="w-full max-w-3xl mx-auto space-y-6">
      <div className="flex justify-between items-end mb-2">
        <div className="space-y-1">
          <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest">
            Student Capacity
          </h3>
          <p className="text-2xl font-black text-slate-900">
            {value.toLocaleString()} <span className="text-slate-400 text-lg">Students</span>
          </p>
        </div>
        <div className="text-right">
          <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
            Enterprise Ready
          </span>
        </div>
      </div>
      
      <div className="relative group py-4">
        <input
          type="range"
          min="0"
          max={tiers.length - 1}
          step="1"
          value={tiers.indexOf(value)}
          onChange={(e) => onChange(tiers[parseInt(e.target.value)])}
          className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600 focus:outline-none transition-all"
        />
        <div className="flex justify-between mt-4 px-1">
          {tiers.map((tier, idx) => (
            <div key={idx} className="flex flex-col items-center gap-2">
              <div className={`w-1.5 h-1.5 rounded-full transition-colors ${
                tier <= value ? 'bg-indigo-600' : 'bg-slate-200'
              }`} />
              <span className={`text-[10px] font-black tracking-tight transition-colors ${
                tier === value ? 'text-indigo-600' : 'text-slate-400'
              }`}>
                {tier >= 1000 ? `${tier/1000}k` : tier}
              </span>
            </div>
          ))}
        </div>
      </div>
      
      <style>{`
        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 24px;
          height: 24px;
          background: white;
          border: 4px solid #4f46e5;
          border-radius: 50%;
          cursor: pointer;
          box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
          transition: all 0.2s ease;
        }
        input[type="range"]:hover::-webkit-slider-thumb {
          transform: scale(1.1);
          box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1);
        }
      `}</style>
    </div>
  );
};
