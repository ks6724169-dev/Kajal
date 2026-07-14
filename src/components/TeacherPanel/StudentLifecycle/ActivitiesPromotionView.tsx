import React from 'react';
import { Star, Home, BookOpen, CheckCircle2 } from 'lucide-react';
import { initialStudents } from './studentData';

export const ActivitiesPromotionView: React.FC = () => {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900">Activities, House, Club & Promotion Recommendations</h2>
        <p className="text-xs text-slate-500 mt-0.5">Co-curricular activities, house points, club memberships, and end-of-term promotion review</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
              <Home className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900">House Management</h3>
              <p className="text-xs text-slate-500">Ruby, Sapphire, Emerald, Topaz</p>
            </div>
          </div>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between p-3 bg-slate-50 rounded-2xl"><span className="font-bold text-slate-800">Ruby House</span><span className="font-bold text-indigo-600">1,420 pts</span></div>
            <div className="flex justify-between p-3 bg-slate-50 rounded-2xl"><span className="font-bold text-slate-800">Sapphire House</span><span className="font-bold text-indigo-600">1,550 pts</span></div>
            <div className="flex justify-between p-3 bg-slate-50 rounded-2xl"><span className="font-bold text-slate-800">Emerald House</span><span className="font-bold text-indigo-600">1,380 pts</span></div>
            <div className="flex justify-between p-3 bg-slate-50 rounded-2xl"><span className="font-bold text-slate-800">Topaz House</span><span className="font-bold text-indigo-600">1,490 pts</span></div>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900">Club Memberships</h3>
              <p className="text-xs text-slate-500">Science, Coding, Literary, Arts</p>
            </div>
          </div>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between p-3 bg-slate-50 rounded-2xl"><span className="font-bold text-slate-800">Coding Club</span><span className="font-bold text-purple-600">38 Members</span></div>
            <div className="flex justify-between p-3 bg-slate-50 rounded-2xl"><span className="font-bold text-slate-800">Science Club</span><span className="font-bold text-purple-600">42 Members</span></div>
            <div className="flex justify-between p-3 bg-slate-50 rounded-2xl"><span className="font-bold text-slate-800">Literary Club</span><span className="font-bold text-purple-600">30 Members</span></div>
            <div className="flex justify-between p-3 bg-slate-50 rounded-2xl"><span className="font-bold text-slate-800">Sports & Arts</span><span className="font-bold text-purple-600">35 Members</span></div>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900">Promotion Review</h3>
              <p className="text-xs text-slate-500">End-of-term recommendations</p>
            </div>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            137 students are fully eligible for promotion to the next academic grade based on continuous attendance and academic assessment.
          </p>
          <button onClick={() => alert('Batch promotion recommendations generated and submitted successfully!')} className="w-full py-2.5 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 transition">
            Process Batch Promotion
          </button>
        </div>
      </div>
    </div>
  );
};
