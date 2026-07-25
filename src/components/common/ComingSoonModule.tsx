import React from 'react';
import { Clock, ShieldCheck, Database, Sparkles, ArrowLeft, Layers, CheckCircle2 } from 'lucide-react';

interface ComingSoonModuleProps {
  title: string;
  subtitle?: string;
  category?: string;
  features?: string[];
  onBack?: () => void;
}

export const ComingSoonModule: React.FC<ComingSoonModuleProps> = ({
  title,
  subtitle = "Module under active database integration. Demo data has been purged.",
  category = "Enterprise Module",
  features = [
    "Live Supabase Database Sync",
    "Multi-Campus Data Partitioning",
    "Role-Based Access Control (RBAC)",
    "Real-time Telemetry & Audit Logs",
    "Automated PDF & WhatsApp Reports"
  ],
  onBack
}) => {
  return (
    <div className="p-6 max-w-5xl mx-auto my-auto space-y-6 animate-fade-in">
      {onBack && (
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-indigo-600 transition cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Executive Dashboard</span>
        </button>
      )}

      {/* Main Glass Card */}
      <div className="bg-white border border-slate-200 rounded-3xl p-8 md:p-12 shadow-sm text-center relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-indigo-50/50 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 max-w-2xl mx-auto space-y-6">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-xs font-extrabold uppercase tracking-wider">
            <Clock className="w-3.5 h-3.5 animate-spin" />
            <span>Coming Soon • Live Data Integration</span>
          </div>

          {/* Title */}
          <div>
            <span className="text-[10px] font-black uppercase text-indigo-600 tracking-widest block mb-1">
              {category}
            </span>
            <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
              {title}
            </h1>
            <p className="text-sm text-slate-500 mt-2 leading-relaxed">
              {subtitle}
            </p>
          </div>

          {/* Status Indicator */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex items-center justify-between text-left">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
                <Database className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900">Database Connection</div>
                <div className="text-[11px] text-slate-500">Purged all hardcoded mock & demo records.</div>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700">
              Clean Environment
            </span>
          </div>

          {/* Features Roadmap */}
          <div className="text-left bg-slate-50/50 border border-slate-200/80 rounded-2xl p-5 space-y-3">
            <div className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
              <span>Upcoming Core Capabilities</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-slate-600">
              {features.map((feat, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Action Footer */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            {onBack && (
              <button
                onClick={onBack}
                className="w-full sm:w-auto px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition cursor-pointer"
              >
                Return to Owner Dashboard
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
