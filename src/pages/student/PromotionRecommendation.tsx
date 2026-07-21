import React from 'react';
import { useStudents } from '../../hooks/useStudents';
import { PromotionService } from '../../services/PromotionService';
import { CheckCircle2, XCircle, AlertTriangle, GraduationCap } from 'lucide-react';

export const PromotionRecommendation: React.FC = () => {
  const { students } = useStudents();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-black text-slate-800 dark:text-slate-100 tracking-tight">Auto-Promotion & Eligibility Auditor</h2>
        <p className="text-xs text-slate-400 font-medium">Verify terminal promotion conditions: minimum attendance Rate &gt; 75%, and cumulative GPA &gt; 2.0.</p>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl overflow-hidden shadow-2xs">
        <div className="p-4 bg-slate-50 dark:bg-slate-950/40 border-b border-slate-100 dark:border-slate-800 grid grid-cols-12 text-[10px] font-black text-slate-400 uppercase tracking-wider">
          <span className="col-span-4">Student Name</span>
          <span className="col-span-2 text-center">GPA / Attd Index</span>
          <span className="col-span-2 text-center">Status</span>
          <span className="col-span-4">System Eligibility Statement</span>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800/60">
          {students.map(s => {
            const evaluation = PromotionService.evaluatePromotion(s);
            return (
              <div key={s.id} className="p-4 grid grid-cols-12 items-center hover:bg-slate-50/40 dark:hover:bg-slate-950/20 transition">
                <div className="col-span-4 flex items-center space-x-3">
                  <img src={s.avatar} alt={s.name} referrerPolicy="no-referrer" className="w-8.5 h-8.5 rounded-full object-cover" />
                  <div>
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">{s.name}</span>
                    <span className="text-[9px] text-slate-400 block font-bold">{s.admissionNo} • {s.grade}</span>
                  </div>
                </div>

                <div className="col-span-2 text-center">
                  <span className="text-xs font-black text-slate-800 dark:text-slate-100 block">{s.gpa.toFixed(2)}</span>
                  <span className="text-[10px] font-bold text-slate-400 block">{s.attendanceRate}%</span>
                </div>

                <div className="col-span-2 text-center">
                  <span className={`text-[9px] font-black uppercase px-2.5 py-0.5 rounded-full ${
                    evaluation.status === 'recommended' ? 'bg-emerald-100 text-emerald-600' :
                    evaluation.status === 'under-review' ? 'bg-amber-100 text-amber-600' : 'bg-rose-100 text-rose-600'
                  }`}>
                    {evaluation.status}
                  </span>
                </div>

                <div className="col-span-4 text-xs font-medium text-slate-500 dark:text-slate-400">
                  <ul className="list-disc pl-4 space-y-0.5 text-[10px]">
                    {evaluation.reasons.map((r, idx) => (
                      <li key={idx}>{r}</li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
