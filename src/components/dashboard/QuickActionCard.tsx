import React from 'react';
import { 
  Sparkles, 
  Users, 
  QrCode, 
  CreditCard, 
  BookOpen, 
  ShieldAlert, 
  Settings, 
  Clock, 
  Bus, 
  FileCheck, 
  Inbox, 
  MapPin, 
  Send 
} from 'lucide-react';
import { Role } from '../../types';

interface ActionItem {
  label: string;
  desc: string;
  icon: React.ReactNode;
  color: string;
  actionId: string;
}

interface QuickActionCardProps {
  role: Role;
  onAction: (actionId: string) => void;
}

export const QuickActionCard: React.FC<QuickActionCardProps> = ({ role, onAction }) => {
  const getActions = (): ActionItem[] => {
    switch (role) {
      case 'super_admin':
      case 'organization_owner':
      case 'school_admin':
        return [
          { label: 'Launch AI Campus Suite', desc: 'Execute deep campus analytics', icon: <Sparkles className="w-4 h-4" />, color: 'from-violet-600 to-indigo-600', actionId: 'ai_hub' },
          { label: 'Admit New Student', desc: 'Register student securely', icon: <Users className="w-4 h-4" />, color: 'from-blue-500 to-indigo-500', actionId: 'students' },
          { label: 'Generate Fee Invoice', desc: 'Generate digital fee slips & UPI QRs', icon: <CreditCard className="w-4 h-4" />, color: 'from-emerald-500 to-teal-500', actionId: 'fees' },
          { label: 'Live GPS Bus Transit', desc: 'Track transit fleet route timings', icon: <Bus className="w-4 h-4" />, color: 'from-pink-500 to-rose-500', actionId: 'transport' },
        ];
      case 'principal':
        return [
          { label: 'Attendance Audit', desc: 'Scan Face ID exception reports', icon: <QrCode className="w-4 h-4" />, color: 'from-indigo-500 to-purple-500', actionId: 'attendance' },
          { label: 'Active GPS Fleet', desc: 'Review delay routes live', icon: <MapPin className="w-4 h-4" />, color: 'from-rose-500 to-orange-500', actionId: 'transport' },
          { label: 'Launch AI Copilot', desc: 'Ask Gemini for campus decisions', icon: <Sparkles className="w-4 h-4" />, color: 'from-emerald-500 to-emerald-600', actionId: 'ai_hub' },
          { label: 'Security CCTV Feeds', desc: 'Review campus surveillance live', icon: <ShieldAlert className="w-4 h-4" />, color: 'from-slate-700 to-slate-900', actionId: 'cctv' },
        ];
      case 'teacher':
        return [
          { label: 'Face Attendance Scan', desc: 'Start Class QR/Face attendance', icon: <QrCode className="w-4 h-4" />, color: 'from-indigo-500 to-indigo-600', actionId: 'attendance' },
          { label: 'Review OMR Exams', desc: 'Scan and auto-grade papers', icon: <FileCheck className="w-4 h-4" />, color: 'from-violet-500 to-purple-500', actionId: 'exams' },
          { label: 'AI Lesson Planner', desc: 'Draft interactive lectures in 5s', icon: <Sparkles className="w-4 h-4" />, color: 'from-emerald-500 to-teal-500', actionId: 'ai_hub' },
          { label: 'Students Directory', desc: 'Inspect academic profiles', icon: <Users className="w-4 h-4" />, color: 'from-blue-500 to-sky-500', actionId: 'students' },
        ];
      case 'student':
        return [
          { label: 'Check Timetable', desc: 'See today\'s interactive timetable', icon: <Clock className="w-4 h-4" />, color: 'from-violet-500 to-indigo-500', actionId: 'dashboard' },
          { label: 'My Exams / OMR', desc: 'Check latest OMR scan scores', icon: <FileCheck className="w-4 h-4" />, color: 'from-pink-500 to-rose-500', actionId: 'exams' },
          { label: 'Search Library Books', desc: 'Reserve catalog titles online', icon: <BookOpen className="w-4 h-4" />, color: 'from-teal-500 to-emerald-500', actionId: 'library' },
          { label: 'AI Tutor Desk', desc: 'Ask study questions to Gemini', icon: <Sparkles className="w-4 h-4" />, color: 'from-amber-500 to-orange-500', actionId: 'ai_hub' },
        ];
      case 'parent':
        return [
          { label: 'UPI QR Fee Payment', desc: 'Pay term dues instantly', icon: <CreditCard className="w-4 h-4" />, color: 'from-emerald-500 to-teal-500', actionId: 'fees' },
          { label: 'Track Bus Transit', desc: 'Monitor safety routes in real-time', icon: <Bus className="w-4 h-4" />, color: 'from-rose-500 to-pink-500', actionId: 'transport' },
          { label: 'Academic Performance', desc: 'Review marks & class updates', icon: <FileCheck className="w-4 h-4" />, color: 'from-blue-500 to-indigo-500', actionId: 'exams' },
          { label: 'Request Leave Slip', desc: 'Submit digital absent report', icon: <Send className="w-4 h-4" />, color: 'from-violet-500 to-purple-500', actionId: 'dashboard' },
        ];
      case 'librarian':
        return [
          { label: 'Issue New Book', desc: 'Scan library barcode slip', icon: <BookOpen className="w-4 h-4" />, color: 'from-indigo-500 to-indigo-600', actionId: 'library' },
          { label: 'Return Book Scan', desc: 'Verify book condition & log dues', icon: <Clock className="w-4 h-4" />, color: 'from-emerald-500 to-teal-500', actionId: 'library' },
          { label: 'Update Catalog ISBN', desc: 'Search global registry databases', icon: <Settings className="w-4 h-4" />, color: 'from-slate-700 to-slate-800', actionId: 'library' },
          { label: 'AI Book Suggestion', desc: 'Optimize inventory based on usage', icon: <Sparkles className="w-4 h-4" />, color: 'from-amber-500 to-amber-600', actionId: 'ai_hub' },
        ];
      case 'accountant':
        return [
          { label: 'UPI QR Invoice Generator', desc: 'Send customized due reminders', icon: <CreditCard className="w-4 h-4" />, color: 'from-emerald-500 to-teal-500', actionId: 'fees' },
          { label: 'Process Payroll Slip', desc: 'Disburse monthly employee dues', icon: <Clock className="w-4 h-4" />, color: 'from-violet-500 to-indigo-500', actionId: 'hrms' },
          { label: 'Generate Reconciliation', desc: 'Audit daily UPI accounts', icon: <FileCheck className="w-4 h-4" />, color: 'from-blue-500 to-sky-500', actionId: 'fees' },
          { label: 'AI Cash flow Insights', desc: 'Forecast budget cycles automatically', icon: <Sparkles className="w-4 h-4" />, color: 'from-amber-500 to-rose-500', actionId: 'ai_hub' },
        ];
      default:
        return [
          { label: 'View Dashboard', desc: 'General operations hub', icon: <Inbox className="w-4 h-4" />, color: 'from-indigo-500 to-indigo-600', actionId: 'dashboard' },
          { label: 'SaaS Settings', desc: 'Configure academic parameters', icon: <Settings className="w-4 h-4" />, color: 'from-slate-700 to-slate-800', actionId: 'settings' },
        ];
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
      {getActions().map((action, i) => (
        <button
          key={i}
          onClick={() => onAction(action.actionId)}
          className="flex items-start text-left p-3.5 rounded-xl border border-slate-100 dark:border-slate-800/40 bg-slate-50/50 dark:bg-slate-900/40 hover:bg-white dark:hover:bg-slate-800/80 hover:border-slate-200 dark:hover:border-slate-700/60 hover:shadow-sm transition duration-150 group"
        >
          <div className={`p-2.5 rounded-xl bg-gradient-to-tr ${action.color} text-white shadow-md shadow-slate-200 dark:shadow-none mr-3.5 flex items-center justify-center shrink-0`}>
            {action.icon}
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-xs font-bold text-slate-800 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors flex items-center gap-1.5">
              {action.label}
            </div>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium leading-tight mt-0.5 truncate">{action.desc}</p>
          </div>
        </button>
      ))}
    </div>
  );
};
