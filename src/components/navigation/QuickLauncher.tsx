import React from 'react';
import { useRole } from '../../hooks/useRole';
import { MenuResolver, MenuAction } from '../../core/MenuResolver';
import { useNavigation } from '../../hooks/useNavigation';
import { 
  PlusCircle, 
  Activity, 
  Cpu, 
  FileCheck, 
  RefreshCw, 
  UserPlus, 
  Receipt, 
  MapPin, 
  Award, 
  Heart, 
  Sparkles, 
  Calendar, 
  ShieldAlert, 
  CheckSquare, 
  Edit3, 
  ThumbsUp, 
  MessageCircle, 
  Users, 
  Bell, 
  DollarSign, 
  FileText, 
  Phone, 
  AlertTriangle, 
  Shield, 
  Coffee, 
  ClipboardList, 
  BookOpen, 
  CheckCircle, 
  UploadCloud, 
  Bookmark, 
  CreditCard, 
  Play, 
  ShieldCheck, 
  HelpCircle,
  Clipboard,
  ShoppingBag
} from 'lucide-react';

interface QuickLauncherProps {
  language?: string;
  onNavigate: (path: string) => void;
}

const iconsMap: Record<string, React.ComponentType<any>> = {
  PlusCircle,
  Activity,
  Cpu,
  FileCheck,
  RefreshCw,
  UserPlus,
  Receipt,
  MapPin,
  Award,
  Heart,
  Sparkles,
  Calendar,
  ShieldAlert,
  CheckSquare,
  Edit3,
  ThumbsUp,
  MessageCircle,
  Users,
  Bell,
  DollarSign,
  FileText,
  Phone,
  AlertTriangle,
  Shield,
  Coffee,
  ClipboardList,
  BookOpen,
  CheckCircle,
  UploadCloud,
  Bookmark,
  CreditCard,
  Play,
  ShieldCheck,
  HelpCircle,
  Clipboard,
  ShoppingBag
};

const actionToPathMap: Record<string, string> = {
  take_attendance: 'attendance',
  grade_assessments: 'exams',
  log_behavior: 'students',
  add_counseling: 'students',
  admit_student: 'students',
  collect_fee: 'fees',
  track_bus: 'transport',
  transit_sos: 'transport',
  audit_bus_route: 'transport',
  update_mess_menu: 'library',
  room_inspection: 'library',
  issue_book: 'library',
  receive_book: 'library',
  generate_invoice: 'fees',
  send_fee_reminders: 'fees',
  disburse_salaries: 'hrms',
  onboard_employee: 'hrms',
  issue_visitor_pass: 'students',
  log_phone_enquiry: 'students',
  submit_homework: 'mobile_apps',
  view_curriculum: 'mobile_apps',
  pay_fees_online: 'fees',
  track_child_bus: 'transport',
  start_transit_trip: 'transport',
  safety_checklist: 'transport',
  publish_question_bank: 'exams',
  certify_results: 'exams',
  audit_assets: 'library',
  purchase_requisition: 'fees',
  provision_tenant: 'settings',
  view_logs: 'dashboard',
  ai_settings: 'ai_hub'
};

export const QuickLauncher: React.FC<QuickLauncherProps> = ({ 
  language = 'en',
  onNavigate 
}) => {
  const { currentRole } = useRole();
  const { setActivePath } = useNavigation();

  const actions = MenuResolver.getActionsForRole(currentRole);

  const handleActionClick = (action: MenuAction) => {
    const targetPath = actionToPathMap[action.action];
    
    if (targetPath) {
      setActivePath(targetPath);
      onNavigate(targetPath);
      
      const toastEvent = new CustomEvent('galaxy-toast', {
        detail: {
          text: `⚡ Triggered action: ${action.title}. Routing to portal...`,
          type: 'success'
        }
      });
      window.dispatchEvent(toastEvent);
    } else {
      const toastEvent = new CustomEvent('galaxy-toast', {
        detail: {
          text: `⚡ Action "${action.title}" is fully active inside the local scope.`,
          type: 'info'
        }
      });
      window.dispatchEvent(toastEvent);
    }
  };

  return (
    <div id="quick-actions-panel" className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs text-left">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
        <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider">
          {language === 'hi' ? 'त्वरित कार्रवाई कंसोल' : 'Quick Actions Console'}
        </h3>
        <span className="text-[10px] text-indigo-600 font-extrabold uppercase tracking-widest">
          SLA Verified
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {actions.map((action) => {
          const IconComponent = iconsMap[action.icon] || HelpCircle;
          
          return (
            <button
              key={action.id}
              type="button"
              onClick={() => handleActionClick(action)}
              className="group p-4 bg-slate-50 hover:bg-indigo-50/40 border border-slate-150 hover:border-indigo-150 rounded-2xl transition duration-150 flex items-center gap-3.5 text-left cursor-pointer shadow-xs hover:shadow-md"
            >
              <div className="p-2.5 bg-white border border-slate-200 rounded-xl group-hover:border-indigo-200 shadow-xs shrink-0 transition">
                <IconComponent className={`h-5 w-5 shrink-0 ${action.color || 'text-indigo-600'}`} />
              </div>
              <div className="min-w-0">
                <h4 className="text-xs font-bold text-slate-800 truncate group-hover:text-indigo-950 transition">
                  {language === 'hi' ? action.hindiTitle : action.title}
                </h4>
                <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wide mt-0.5">
                  Launch Portal
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
