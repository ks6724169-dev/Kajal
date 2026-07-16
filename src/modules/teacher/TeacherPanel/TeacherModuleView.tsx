import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, 
  User, 
  Info, 
  FileBadge, 
  Briefcase, 
  FileSignature, 
  Calendar, 
  Bell, 
  ListTodo, 
  CalendarDays, 
  Zap, 
  Folder, 
  Star, 
  Bot, 
  LogOut,
  Sparkles,
  TrendingUp,
  Activity,
  CheckCircle2,
  AlertTriangle,
  GraduationCap
} from 'lucide-react';
import { teacherModules } from './modulesData';
import { SubModuleRenderer } from './SubModuleRenderer';

interface TeacherModuleViewProps {
  moduleId: string;
  onBack: () => void;
  onLogout: () => void;
  initialSubModule?: string | null;
}

const subModuleIcons: Record<string, any> = {
  profile: User,
  teacher_info: Info,
  qualifications: FileBadge,
  experience: Briefcase,
  digital_signature: FileSignature,
  calendar: Calendar,
  notifications: Bell,
  tasks: ListTodo,
  timetable: CalendarDays,
  quick_actions: Zap,
  documents: Folder,
  favorites: Star,
  ai_workspace: Bot,
  logout: LogOut,
};

const moduleTabMappings: Record<string, { id: string; name: string }[]> = {
  workspace: [
    { id: 'profile', name: 'My Profile' },
    { id: 'teacher_info', name: 'Teacher Info' },
    { id: 'qualifications', name: 'Qualifications' },
    { id: 'experience', name: 'Experience' },
    { id: 'digital_signature', name: 'Digital Signature' },
    { id: 'calendar', name: 'Calendar' },
    { id: 'notifications', name: 'Notifications' },
    { id: 'tasks', name: 'Tasks' },
    { id: 'timetable', name: 'Timetable' },
    { id: 'documents', name: 'Documents' },
    { id: 'favorites', name: 'Favorites' },
    { id: 'ai_workspace', name: 'AI Workspace' },
  ],
  academic: [
    { id: 'lesson_planning', name: 'Lesson Plan' },
    { id: 'unit_plan', name: 'Unit Plan' },
    { id: 'annual_planner', name: 'Annual Planner' },
    { id: 'homework', name: 'Homework' },
    { id: 'assignments', name: 'Assignments' },
    { id: 'question_bank', name: 'Question Bank' },
    { id: 'study_material', name: 'Study Material' },
    { id: 'practical_management', name: 'Practical' },
    { id: 'resource_library', name: 'Resources' },
    { id: 'ai_workspace', name: 'AI Ready' },
    { id: 'class_management', name: 'Class Manager' },
    { id: 'section_management', name: 'Sections' },
    { id: 'subject_management', name: 'Subjects' },
    { id: 'syllabus_tracker', name: 'Syllabus Tracker' },
    { id: 'projects', name: 'Projects' },
    { id: 'online_classes', name: 'Live Classes' },
    { id: 'recorded_classes', name: 'Recorded Classes' },
  ],
  student_lifecycle: [
    { id: 'student_lifecycle', name: 'Overview' },
    { id: 'student_list', name: 'Student List' },
    { id: 'attendance', name: 'Attendance' },
    { id: 'behaviour', name: 'Behaviour' },
    { id: 'health_records', name: 'Health' },
    { id: 'student_documents', name: 'Documents' },
    { id: 'parent_details', name: 'Parents' },
    { id: 'activities', name: 'Activities' },
    { id: 'student_portfolio', name: 'Portfolio' },
    { id: 'learning_progress', name: 'Timeline' },
  ],
  examination: [
    { id: 'exam_schedule', name: 'Exam Schedule' },
    { id: 'unit_tests', name: 'Unit Tests' },
    { id: 'quiz', name: 'Quiz' },
    { id: 'marks_entry', name: 'Marks Entry' },
    { id: 'grade_book', name: 'Grade Book' },
    { id: 'online_exams', name: 'Online Exams' },
    { id: 'ai_evaluation', name: 'AI Evaluation' },
    { id: 'result_analysis', name: 'Results Analysis' },
  ],
  communication: [
    { id: 'student_chat', name: 'Student Chat' },
    { id: 'parent_chat', name: 'Parent Chat' },
    { id: 'teacher_chat', name: 'Teacher Chat' },
    { id: 'announcements', name: 'Announcements' },
    { id: 'notice_board', name: 'Notice Board' },
    { id: 'video_meetings', name: 'Meetings & PTM' },
    { id: 'discussion_forum', name: 'Forums & Polls' },
  ],
  productivity: [
    { id: 'leave_management', name: 'Leave Management' },
    { id: 'daily_diary', name: 'Daily Diary' },
    { id: 'task_management', name: 'Tasks & To-Do' },
    { id: 'period_swap', name: 'Period Swap & Substitutes' },
    { id: 'document_manager', name: 'Docs & AI Assistant' },
  ],
  reports: [
    { id: 'class_analytics', name: 'Class Analytics' },
    { id: 'homework_reports', name: 'Academic Reports' },
    { id: 'ai_insights', name: 'AI Insights' },
  ],
  settings: [
    { id: 'profile_settings', name: 'General Settings' },
    { id: 'password', name: 'Security & 2FA' },
    { id: 'api_integration', name: 'Integrations' },
    { id: 'audit_logs', name: 'Audit Logs' },
  ],
};

const getModuleMetrics = (moduleId: string) => {
  switch (moduleId) {
    case 'workspace':
      return [
        { label: 'Sarah Johnson', value: 'Senior Educator', change: 'ID: TCH-9021', type: 'info' },
        { label: 'Pending Tasks', value: '12 Active', change: '3 Due Today', type: 'warning' },
        { label: 'Next Session', value: '09:00 AM', change: 'Math Grade 10-A', type: 'success' },
      ];
    case 'academic':
      return [
        { label: 'Classes Assigned', value: '14 Active', change: '3 Grades Coached', type: 'info' },
        { label: 'Average Syllabus Completion', value: '94.2%', change: 'On Track', type: 'success' },
        { label: 'Classes Scheduled Today', value: '5 Sessions', change: 'Next: 10:30 AM', type: 'success' },
      ];
    case 'student_lifecycle':
      return [
        { label: 'Total Students', value: '145 Enrolled', change: 'Active across sections', type: 'info' },
        { label: 'Attendance Today', value: '97.2%', change: 'Avg Present', type: 'success' },
        { label: 'Attention Alerts', value: '8 Students', change: 'Remedial assigned', type: 'danger' },
      ];
    case 'examination':
      return [
        { label: 'Upcoming Tests', value: '2 Exams', change: 'Schedules Released', type: 'info' },
        { label: 'Grade Entries Done', value: '150 Records', change: '100% verified', type: 'success' },
        { label: 'AI Evaluation Status', value: 'Active', change: 'Rubrics synced', type: 'success' },
      ];
    case 'communication':
      return [
        { label: 'Unread Messages', value: '8 Items', change: 'From Parents & Staff', type: 'warning' },
        { label: 'PTM Status', value: '1 Active Meeting', change: 'Today at 2:00 PM', type: 'info' },
        { label: 'Announcement Boards', value: 'Synced', change: 'All alerts delivered', type: 'success' },
      ];
    case 'productivity':
      return [
        { label: 'Annual Leave Balance', value: '14 Days Left', change: '1 Request Pending', type: 'info' },
        { label: 'Active Reminders', value: '4 Set', change: 'Substitutes notified', type: 'warning' },
        { label: 'Daily Work Logs', value: '100%', change: 'Updated successfully', type: 'success' },
      ];
    case 'reports':
      return [
        { label: 'Reports Available', value: '2 New', change: 'PDF & Excel ready', type: 'success' },
        { label: 'Average Term Score', value: 'A+ Rating', change: 'Based on feedback', type: 'success' },
        { label: 'AI Insights Portal', value: 'Online', change: 'Weekly prediction generated', type: 'info' },
      ];
    case 'settings':
      return [
        { label: 'Security State', value: '2FA Enabled', change: 'Last login 2 hrs ago', type: 'success' },
        { label: 'Workspace Link', value: 'Google Active', change: 'Microsoft 365 connected', type: 'info' },
        { label: 'System Backup', value: 'Completed', change: 'Automatic cloud sync on', type: 'success' },
      ];
    default:
      return [];
  }
};

export const TeacherModuleView: React.FC<TeacherModuleViewProps> = ({ 
  moduleId, 
  onBack, 
  onLogout, 
  initialSubModule = null 
}) => {
  const moduleData = teacherModules.find(m => m.id === moduleId);
  
  // Resolve mapping tabs
  const tabs = moduleTabMappings[moduleId] || [];
  
  // Default active submodule: initialSubModule if provided and matches, else first tab
  const [activeSubModule, setActiveSubModule] = useState<string>(() => {
    if (initialSubModule && tabs.some(t => t.id === initialSubModule)) {
      return initialSubModule;
    }
    return tabs[0]?.id || '';
  });

  // Sync state if initialSubModule changes
  useEffect(() => {
    if (initialSubModule && tabs.some(t => t.id === initialSubModule)) {
      setActiveSubModule(initialSubModule);
    }
  }, [initialSubModule, tabs]);

  if (!moduleData) return null;
  const Icon = moduleData.icon;
  const metrics = getModuleMetrics(moduleId);
  const activeTabName = tabs.find(t => t.id === activeSubModule)?.name || 'Workspace';

  return (
    <div className="flex-1 flex flex-col w-full h-full bg-slate-50 overflow-hidden">
      
      {/* Workspace Banner & KPIs (Linear & Microsoft 365 inspired) */}
      <div className="bg-white border-b border-slate-200 px-6 py-6 sm:px-8 flex-shrink-0">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          
          {/* Title and Icon */}
          <div className="flex items-start gap-4">
            <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${moduleData.color} flex items-center justify-center text-white shadow-md flex-shrink-0 mt-1`}>
              <Icon className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-slate-900 tracking-tight leading-none">
                  {moduleData.title}
                </h1>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-100 uppercase tracking-wider">
                  Live Sync
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1 max-w-xl leading-relaxed">
                {moduleData.description}
              </p>
            </div>
          </div>

          {/* Quick Metrics / Status Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full lg:w-auto">
            {metrics.map((metric, index) => (
              <div 
                key={index}
                className="bg-slate-50/50 border border-slate-100 rounded-2xl px-4 py-3 min-w-[160px] flex flex-col justify-between shadow-sm"
              >
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  {metric.label}
                </span>
                <span className="text-sm font-black text-slate-800 mt-1">
                  {metric.value}
                </span>
                <span className={`text-[9px] font-semibold mt-1 ${
                  metric.type === 'success' ? 'text-emerald-600' :
                  metric.type === 'warning' ? 'text-amber-600' :
                  metric.type === 'danger' ? 'text-rose-600' :
                  'text-indigo-600'
                }`}>
                  {metric.change}
                </span>
              </div>
            ))}
          </div>

        </div>
      </div>

      {/* Sticky Tabbed Navigation Menu bar */}
      <div className="bg-white border-b border-slate-200 px-6 sticky top-0 z-40 flex-shrink-0 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center overflow-x-auto scrollbar-none gap-2">
          {tabs.map((tab) => {
            const isActive = activeSubModule === tab.id;
            const TabIcon = subModuleIcons[tab.id] || Folder;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSubModule(tab.id)}
                className={`relative py-3.5 px-4 text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 ${
                  isActive 
                    ? 'text-indigo-600' 
                    : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <TabIcon className={`w-3.5 h-3.5 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
                <span>{tab.name}</span>
                {isActive && (
                  <motion.div 
                    layoutId="activeTabUnderline"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 rounded-full"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Interactive Workspace Viewport */}
      <div className="flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSubModule}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.22, ease: "easeInOut" }}
            className="w-full h-full p-4 sm:p-6 max-w-7xl mx-auto"
          >
            <SubModuleRenderer 
              subModuleId={activeSubModule} 
              subModuleName={activeTabName}
              onBack={onBack} 
              onSelectSubModule={(subId) => setActiveSubModule(subId)}
              hideHeader={true}
            />
          </motion.div>
        </AnimatePresence>
      </div>

    </div>
  );
};
