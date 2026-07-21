import React, { useState } from 'react';
import { Sparkles, ArrowRight, AlertTriangle, Lightbulb, TrendingUp, CheckSquare, RefreshCw, Send } from 'lucide-react';
import { Role } from '../../types';

interface AIInsightCardProps {
  role: Role;
}

export const AIInsightCard: React.FC<AIInsightCardProps> = ({ role }) => {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [reply, setReply] = useState<string | null>(null);

  const presetsByRole: Record<Role, { title: string; text: string }[]> = {
    super_admin: [
      { title: 'Analyze Fee Cycles', text: 'Analyze the current UPI fee collection trend for Grade 12. Are there late payments?' },
      { title: 'Forecast Overheads', text: 'Estimate monthly overheads and SaaS system resource utilization peaks.' }
    ],
    organization_owner: [
      { title: 'Analyze Fee Cycles', text: 'Analyze the current UPI fee collection trend for Grade 12. Are there late payments?' },
      { title: 'Forecast Overheads', text: 'Estimate monthly overheads and SaaS system resource utilization peaks.' }
    ],
    school_admin: [
      { title: 'Optimize Transit', text: 'Can we optimize transit route #4 based on traffic delay profiles?' },
      { title: 'Teacher Attendance', text: 'Generate teacher coverage schedules for upcoming leave approvals.' }
    ],
    principal: [
      { title: 'Absenteeism Alerts', text: 'Draft risk reports for classes with attendance rates lower than 92%.' },
      { title: 'Grievance Review', text: 'Summarize unresolved student grievance logs with proposed solutions.' }
    ],
    teacher: [
      { title: 'Calculus Quiz ideas', text: 'Generate 5 high-order multiple choice questions on Calculus derivatives.' },
      { title: 'Student Progress Summary', text: 'Write a performance encouragement note for students struggling in Algebra.' }
    ],
    student: [
      { title: 'Study Plan (Math)', text: 'Create a 5-day study plan to cover multivariate calculus and OMR practice.' },
      { title: 'Review Mistakes', text: 'Give advice on typical errors in computer programming and loops.' }
    ],
    parent: [
      { title: 'Progress Insights', text: 'Explain my child\'s GPA trajectory and how to support Grade A+ improvements.' },
      { title: 'Transit Safety Map', text: 'How do school buses ensure safe driving practices and timing audits?' }
    ],
    librarian: [
      { title: 'Library Inventory', text: 'Suggest top high-demand tech and history books to source next term.' }
    ],
    accountant: [
      { title: 'UPI Defaulters List', text: 'Generate professional follow-up templates for pending fee reminders.' }
    ],
    hr: [
      { title: 'Recruit Screening', text: 'Draft resume evaluation checklists for secondary math teacher candidates.' }
    ],
    hostel_manager: [
      { title: 'Mess Meal Budgeting', text: 'Suggest standard healthy weekly mess recipes within current budgets.' }
    ],
    transport_manager: [
      { title: 'Fuel Consumption', text: 'Outline predictive maintenance checklists for active school transit buses.' }
    ],
    vice_principal: [
      { title: 'Syllabus Alignment', text: 'Generate checklist to align biology syllabus benchmarks across sections.' }
    ],
    class_teacher: [
      { title: 'Pastoral Care Review', text: 'Identify focus points for student counseling plans based on recent comments.' }
    ],
    receptionist: [
      { title: 'Visitor Log Analysis', text: 'Analyze peak gate ingress times to optimize security guard distributions.' }
    ],
    exam_controller: [
      { title: 'Marks Validation', text: 'Draft marks verification guidelines for Grade 10 results integrity.' }
    ],
    inventory_manager: [
      { title: 'SKU Stock Level', text: 'Identify reorder points for lab chemistry stocks and furniture assets.' }
    ],
    guest: [
      { title: 'Sandbox Features', text: 'Suggest standard features to test in the Galaxy Educational Sandbox.' }
    ],
    driver: [
      { title: 'Route Safety Alert', text: 'Summarize speed regulation checklists for safe school runs.' }
    ]
  };

  const currentPresets = presetsByRole[role] || presetsByRole.super_admin;

  const handleSendPrompt = async (textToSend: string) => {
    if (!textToSend.trim() || loading) return;
    setLoading(true);
    setReply(null);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: textToSend, persona: 'Principal Assistant' })
      });
      const data = await res.json();
      if (data.reply) {
        setReply(data.reply);
      } else {
        setReply("Something went wrong with the AI Workspace engine.");
      }
    } catch (e) {
      setReply("Network unavailable. Reverting to Offline simulated advice: Complete student OMR evaluation and UPI fee cycle optimization.");
    } finally {
      setLoading(false);
    }
  };

  // Pre-configured static summaries for different roles
  const getDailySummary = () => {
    switch (role) {
      case 'super_admin':
      case 'organization_owner':
        return {
          status: 'Optimal System Performance',
          insights: [
            { type: 'alert', text: 'UPI fee reconciliation complete for current phase. Target collection exceeded by 4.2%.', icon: <TrendingUp className="w-3.5 h-3.5 text-emerald-500" /> },
            { type: 'warning', text: 'Regional Ingress Node 02 reached 87% workload. Autoscale is monitoring.', icon: <AlertTriangle className="w-3.5 h-3.5 text-amber-500" /> }
          ]
        };
      case 'principal':
        return {
          status: '97.4% Attendance Audited Today',
          insights: [
            { type: 'alert', text: 'Class 11-B attendance fell by 4.5% this morning. Early notifications sent.', icon: <AlertTriangle className="w-3.5 h-3.5 text-rose-500" /> },
            { type: 'info', text: 'SLA active on all 3 transport delay logs. Fleet operating optimally.', icon: <Lightbulb className="w-3.5 h-3.5 text-indigo-500" /> }
          ]
        };
      case 'teacher':
        return {
          status: 'Next Period: Grade 10-B Math (Room 204)',
          insights: [
            { type: 'alert', text: '42 Homework tasks are awaiting grading. AI lesson guides are prepared.', icon: <CheckSquare className="w-3.5 h-3.5 text-amber-500" /> },
            { type: 'info', text: 'Mid-term question papers draft complete. High confidence level.', icon: <Lightbulb className="w-3.5 h-3.5 text-emerald-500" /> }
          ]
        };
      default:
        return {
          status: 'Galaxy AI Workspace Online',
          insights: [
            { type: 'info', text: 'All academic modules are fully synced with multi-tenant SaaS. Secure protocols active.', icon: <Lightbulb className="w-3.5 h-3.5 text-indigo-500" /> }
          ]
        };
    };
  };

  const summary = getDailySummary();

  return (
    <div className="space-y-4 w-full">
      {/* Daily AI Status and Recommendations */}
      <div className="p-3 bg-slate-50 dark:bg-slate-950/40 rounded-xl border border-slate-100 dark:border-slate-800/40">
        <div className="flex items-center space-x-1.5 mb-2">
          <Sparkles className="w-4 h-4 text-indigo-500 animate-pulse" />
          <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Daily Copilot Summary</span>
        </div>
        <div className="text-xs font-extrabold text-slate-800 dark:text-slate-100 flex items-center justify-between">
          <span>{summary.status}</span>
          <span className="text-[9px] font-bold text-indigo-500 dark:text-indigo-400 uppercase tracking-wider bg-indigo-500/10 px-2 py-0.5 rounded-full border border-indigo-500/20">Active Engine</span>
        </div>
        <div className="mt-2.5 space-y-1.5">
          {summary.insights.map((ins, idx) => (
            <div key={idx} className="flex items-start space-x-2 text-[11px] text-slate-500 dark:text-slate-400 font-medium">
              <span className="mt-0.5 shrink-0">{ins.icon}</span>
              <span className="leading-tight">{ins.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Preset Suggested Actions */}
      <div>
        <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-2">Suggested AI Actions</span>
        <div className="flex flex-wrap gap-1.5">
          {currentPresets.map((pr, idx) => (
            <button
              key={idx}
              onClick={() => {
                setPrompt(pr.text);
                handleSendPrompt(pr.text);
              }}
              disabled={loading}
              className="text-[10px] font-bold bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 px-2.5 py-1.5 rounded-lg transition text-left shadow-2xs hover:border-slate-300 dark:hover:border-slate-700 flex items-center gap-1 max-w-full"
            >
              <span>{pr.title}</span>
              <ArrowRight className="w-3 h-3 text-slate-400 group-hover:translate-x-0.5 transition" />
            </button>
          ))}
        </div>
      </div>

      {/* Chat Prompt Input */}
      <div className="pt-2 border-t border-slate-100 dark:border-slate-800/40">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">AI Quick Prompt</span>
          <span className="text-[9px] text-slate-400 font-mono">Using Gemini 3.5 Flash</span>
        </div>
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            handleSendPrompt(prompt);
          }}
          className="relative flex items-center bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2"
        >
          <input
            type="text"
            placeholder="Ask AI anything about this module..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            disabled={loading}
            className="w-full bg-transparent text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 outline-none pr-8 font-medium"
          />
          <button
            type="submit"
            disabled={loading || !prompt.trim()}
            className="absolute right-2.5 p-1 rounded-md bg-indigo-500 text-white disabled:bg-slate-200 dark:disabled:bg-slate-800 disabled:text-slate-400 hover:bg-indigo-600 transition"
          >
            {loading ? (
              <RefreshCw className="w-3 h-3 animate-spin" />
            ) : (
              <Send className="w-3 h-3" />
            )}
          </button>
        </form>

        {/* AI Answer Reply Block */}
        {reply && (
          <div className="mt-3 p-3 bg-indigo-500/5 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-950/40 rounded-xl text-slate-700 dark:text-slate-300 text-xs leading-relaxed max-h-40 overflow-y-auto selection:bg-indigo-500 selection:text-white font-medium">
            <div className="flex items-center space-x-1 mb-1.5 text-[10px] text-indigo-600 dark:text-indigo-400 font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Workspace Assistant</span>
            </div>
            {reply}
          </div>
        )}
      </div>
    </div>
  );
};
