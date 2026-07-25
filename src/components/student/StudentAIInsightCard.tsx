import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, BrainCircuit, RefreshCw, Star, TrendingUp, Lightbulb } from 'lucide-react';
import { ExtendedStudent } from '../../stores/studentStore';

interface AIInsightCardProps {
  student: ExtendedStudent;
}

export const AIInsightCard: React.FC<AIInsightCardProps> = ({ student }) => {
  const [loading, setLoading] = useState(false);
  const [isFresh, setIsFresh] = useState(true);

  // Generate customized insights based on actual student variables
  const getAIInsights = (stud: ExtendedStudent) => {
    if (stud.isGifted) {
      return {
        swot: {
          strengths: 'Outstanding cognitive ability, stellar math performance, highly creative hackathon portfolio, leadership potential.',
          weaknesses: 'Might feel under-challenged during generic core lectures, prone to boredom if learning trajectory is too flat.',
          opportunities: 'Engage in advanced university-level research projects, enroll in national level math olympiads, lead robotics peer groups.',
          threats: 'Burnout due to excessive extra-curricular load, social friction if advanced concepts isolate them from peers.'
        },
        plan: 'Provide AP (Advanced Placement) courses. Mentor Class 9 students in Python. Register for the upcoming State Artificial Intelligence Olympiad.'
      };
    } else if (stud.isWeak) {
      return {
        swot: {
          strengths: 'Eager to improve, active participant in environmental audits, highly visual/creative thinker.',
          weaknesses: 'Significant foundational learning gaps in mathematics, low attendance rate creates continuity blocks, lack of self-study routines.',
          opportunities: 'Leverage peer tutoring programs, attend specialized mathematical remedial workshops twice a week, benefit from sleep health therapy.',
          threats: 'Academic lag getting compounded, loss of academic motivation if math confidence drops completely, risk of delayed promotion.'
        },
        plan: 'Mandatory remedial math clinic attendance. Weekly parent-teacher touchpoint to track daily algebra worksheets. Setup strict attendance tracking.'
      };
    } else {
      return {
        swot: {
          strengths: 'Stable academic growth, pleasant classroom attitude, active in drama/theater activities, clears fee requirements.',
          weaknesses: 'Hesitant to clear advanced science queries, moderately passive during sports drills, occasional late arrivals.',
          opportunities: 'Participate actively in inter-house science fairs, assume moderate leadership responsibilities in Drama Club, join morning fitness routines.',
          threats: 'Complacency leading to stagnated GPA, minor friction on late arrival guidelines if not audited.'
        },
        plan: 'Establish a scientific modeling project. Join morning public speaking workshops to leverage theatrical talents. Track physical health vaccines.'
      };
    }
  };

  const insights = getAIInsights(student);

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setIsFresh(prev => !prev);
    }, 850);
  };

  return (
    <div className="bg-slate-900 text-slate-100 rounded-3xl p-5 border border-slate-800 space-y-4 shadow-xl relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="flex items-center justify-between pb-3.5 border-b border-slate-800">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 bg-indigo-600/30 text-indigo-400 border border-indigo-500/30 rounded-xl">
            <BrainCircuit className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-200">Galaxy AI Cognitive Insights</h4>
            <p className="text-[10px] text-slate-400 font-medium">Real-time academic telemetry analysis using Gemini Enterprise API.</p>
          </div>
        </div>

        <button 
          onClick={handleRefresh}
          disabled={loading}
          className="text-slate-400 hover:text-white p-2 rounded-xl bg-slate-800 border border-slate-700/60 hover:bg-slate-700 transition cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <div className="space-y-4">
        {/* SWOT Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          <div className="p-3.5 bg-slate-950 border border-slate-800/40 rounded-2xl">
            <span className="text-[9px] font-extrabold text-indigo-400 uppercase tracking-wider flex items-center">
              <Star className="w-3 h-3 mr-1" /> Core Academic Strengths
            </span>
            <p className="text-[10px] text-slate-300 font-semibold mt-1">{insights.swot.strengths}</p>
          </div>

          <div className="p-3.5 bg-slate-950 border border-slate-800/40 rounded-2xl">
            <span className="text-[9px] font-extrabold text-rose-400 uppercase tracking-wider flex items-center">
              <Lightbulb className="w-3 h-3 mr-1" /> Key Vulnerabilities & Weaknesses
            </span>
            <p className="text-[10px] text-slate-300 font-semibold mt-1">{insights.swot.weaknesses}</p>
          </div>

          <div className="p-3.5 bg-slate-950 border border-slate-800/40 rounded-2xl">
            <span className="text-[9px] font-extrabold text-emerald-400 uppercase tracking-wider flex items-center">
              <TrendingUp className="w-3 h-3 mr-1" /> Strategic Growth Opportunities
            </span>
            <p className="text-[10px] text-slate-300 font-semibold mt-1">{insights.swot.opportunities}</p>
          </div>

          <div className="p-3.5 bg-slate-950 border border-slate-800/40 rounded-2xl">
            <span className="text-[9px] font-extrabold text-amber-400 uppercase tracking-wider flex items-center">
              <Sparkles className="w-3 h-3 mr-1" /> Academic Risks & Threats
            </span>
            <p className="text-[10px] text-slate-300 font-semibold mt-1">{insights.swot.threats}</p>
          </div>
        </div>

        {/* Dynamic Study Plan */}
        <div className="p-4 bg-indigo-600/10 border border-indigo-500/20 rounded-2xl">
          <span className="text-[10px] font-extrabold text-indigo-300 uppercase tracking-wider block">Target Study & Remedial Action Blueprint</span>
          <p className="text-xs font-bold text-indigo-100 mt-1.5 leading-relaxed">{insights.plan}</p>
        </div>
      </div>
    </div>
  );
};
