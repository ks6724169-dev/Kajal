import React from 'react';
import { ArrowLeft, Search, Filter, Download, Plus, Save, Printer, Upload, Edit, Trash2, User, School, Layers, BookOpen, Folder, FileText, HelpCircle, Video, Tv, Film } from 'lucide-react';
import { ProfileView } from './DashboardWorkspace/ProfileView';
import { AIWorkspaceView } from './DashboardWorkspace/AIWorkspaceView';
import { GalaxyAIChat } from './GalaxyAIChat';
import { TeacherInfoView } from './DashboardWorkspace/TeacherInfoView';
import { DigitalSignatureView } from './DashboardWorkspace/DigitalSignatureView';
import { QuickActionsView } from './DashboardWorkspace/QuickActionsView';
import { NotificationsView } from './DashboardWorkspace/NotificationsView';
import { TasksView } from './DashboardWorkspace/TasksView';
import { TimetableView } from './DashboardWorkspace/TimetableView';
import { FavoritesView } from './DashboardWorkspace/FavoritesView';
import { QualificationsView } from './DashboardWorkspace/QualificationsView';
import { ExperienceView } from './DashboardWorkspace/ExperienceView';
import { DocumentsView } from './DashboardWorkspace/DocumentsView';
import { CalendarView } from './DashboardWorkspace/CalendarView';

import { ClassManagementView } from './AcademicWorkspace/ClassManagementView';
import { SubjectManagementView } from './AcademicWorkspace/SubjectManagementView';
import { LessonPlanningView } from './AcademicWorkspace/LessonPlanningView';
import { HomeworkView } from './AcademicWorkspace/HomeworkView';
import { AssignmentsView } from './AcademicWorkspace/AssignmentsView';
import { SyllabusTrackerView } from './AcademicWorkspace/SyllabusTrackerView';
import { SectionManagementView } from './AcademicWorkspace/SectionManagementView';
import { CurriculumMappingView } from './AcademicWorkspace/CurriculumMappingView';
import { ProjectManagementView } from './AcademicWorkspace/ProjectManagementView';
import { StudyMaterialView } from './AcademicWorkspace/StudyMaterialView';
import { QuestionBankView } from './AcademicWorkspace/QuestionBankView';
import { EBookLibraryView } from './AcademicWorkspace/EBookLibraryView';
import { VideoLibraryView } from './AcademicWorkspace/VideoLibraryView';
import { OnlineClassesView } from './AcademicWorkspace/OnlineClassesView';
import { RecordedClassesView } from './AcademicWorkspace/RecordedClassesView';
import { PracticalLabView } from './AcademicWorkspace/PracticalLabView';
import { ClassroomResourcesView } from './AcademicWorkspace/ClassroomResourcesView';
import { StudentLifecycleDashboard } from './StudentLifecycle/StudentLifecycleDashboard';
import { StudentListView } from './StudentLifecycle/StudentListView';
import { AttendanceView } from './StudentLifecycle/AttendanceView';
import { BehaviourDisciplineView } from './StudentLifecycle/BehaviourDisciplineView';
import { HealthRecordsView } from './StudentLifecycle/HealthRecordsView';
import { PortfolioProgressView } from './StudentLifecycle/PortfolioProgressView';
import { ParentDocumentsView } from './StudentLifecycle/ParentDocumentsView';
import { ActivitiesPromotionView } from './StudentLifecycle/ActivitiesPromotionView';

interface SubModuleRendererProps {
  subModuleId: string;
  subModuleName: string;
  onBack: () => void;
  onSelectSubModule?: (subId: string) => void;
}

export const SubModuleRenderer: React.FC<SubModuleRendererProps> = ({ subModuleId, subModuleName, onBack, onSelectSubModule }) => {
  const [isActionMenuOpen, setIsActionMenuOpen] = React.useState(false);

  const headerTitle = subModuleId === 'ai_homework_generator'
    ? 'AI Galaxy Teacher Help'
    : ['class_management', 'section_management', 'subject_management'].includes(subModuleId)
    ? 'Class Management'
    : subModuleName;

  return (
    <div className="bg-slate-50 min-h-screen pb-24">
      {/* Top Navigation */}
      <div className="bg-white border-b border-slate-200 px-6 py-4 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold text-slate-900">{headerTitle}</h1>
          </div>
          <button 
            onClick={onBack}
            className="flex items-center gap-2 px-4 py-2 border border-slate-200 text-slate-700 bg-white rounded-lg hover:bg-slate-50 hover:text-indigo-600 transition shadow-sm font-semibold text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        {/* Page Toolbar (Common for most pages) */}
        {subModuleId !== 'quick_actions' && subModuleId !== 'ai_workspace' && subModuleId !== 'ai_homework_generator' && (
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div className="relative w-full sm:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder={`Search in ${subModuleName}...`} 
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm shadow-sm"
              />
            </div>
            {['class_management', 'section_management', 'subject_management', 'homework', 'projects', 'assignments', 'curriculum', 'lesson_planning', 'syllabus_tracker', 'study_material', 'ebook_library', 'question_bank', 'online_classes', 'recorded_classes', 'video_library'].includes(subModuleId) && (
              <div className="relative">
                <button 
                  onClick={() => setIsActionMenuOpen(!isActionMenuOpen)}
                  className="px-4 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition shadow-sm flex items-center gap-2"
                  title="Action Options"
                >
                  <span className="text-base font-black px-1 bg-white/20 rounded">€</span>
                  <span>Options</span>
                </button>

                {isActionMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 py-2 animate-in fade-in zoom-in-95 duration-150">
                    <div className="px-3 py-1.5 border-b border-slate-100 mb-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      Quick Navigation
                    </div>
                    {['class_management', 'section_management', 'subject_management'].includes(subModuleId) ? (
                      <>
                        <button 
                          onClick={() => { setIsActionMenuOpen(false); onSelectSubModule?.('class_management'); }}
                          className={`w-full text-left px-4 py-2.5 text-sm font-medium flex items-center gap-3 transition ${subModuleId === 'class_management' ? 'bg-indigo-50 text-indigo-700 font-bold' : 'text-slate-700 hover:bg-slate-50'}`}
                        >
                          <School className="w-4 h-4 text-indigo-600" />
                          Class Management
                        </button>
                        <button 
                          onClick={() => { setIsActionMenuOpen(false); onSelectSubModule?.('section_management'); }}
                          className={`w-full text-left px-4 py-2.5 text-sm font-medium flex items-center gap-3 transition ${subModuleId === 'section_management' ? 'bg-indigo-50 text-indigo-700 font-bold' : 'text-slate-700 hover:bg-slate-50'}`}
                        >
                          <Layers className="w-4 h-4 text-indigo-600" />
                          Section Management
                        </button>
                        <button 
                          onClick={() => { setIsActionMenuOpen(false); onSelectSubModule?.('subject_management'); }}
                          className={`w-full text-left px-4 py-2.5 text-sm font-medium flex items-center gap-3 transition ${subModuleId === 'subject_management' ? 'bg-indigo-50 text-indigo-700 font-bold' : 'text-slate-700 hover:bg-slate-50'}`}
                        >
                          <BookOpen className="w-4 h-4 text-indigo-600" />
                          Subject Management
                        </button>
                      </>
                    ) : ['curriculum', 'lesson_planning', 'syllabus_tracker'].includes(subModuleId) ? (
                      <>
                        <button 
                          onClick={() => { setIsActionMenuOpen(false); onSelectSubModule?.('curriculum'); }}
                          className={`w-full text-left px-4 py-2.5 text-sm font-medium flex items-center gap-3 transition ${subModuleId === 'curriculum' ? 'bg-indigo-50 text-indigo-700 font-bold' : 'text-slate-700 hover:bg-slate-50'}`}
                        >
                          <BookOpen className="w-4 h-4 text-indigo-600" />
                          Curriculum
                        </button>
                        <button 
                          onClick={() => { setIsActionMenuOpen(false); onSelectSubModule?.('lesson_planning'); }}
                          className={`w-full text-left px-4 py-2.5 text-sm font-medium flex items-center gap-3 transition ${subModuleId === 'lesson_planning' ? 'bg-indigo-50 text-indigo-700 font-bold' : 'text-slate-700 hover:bg-slate-50'}`}
                        >
                          <FileText className="w-4 h-4 text-indigo-600" />
                          Lesson Planning
                        </button>
                        <button 
                          onClick={() => { setIsActionMenuOpen(false); onSelectSubModule?.('syllabus_tracker'); }}
                          className={`w-full text-left px-4 py-2.5 text-sm font-medium flex items-center gap-3 transition ${subModuleId === 'syllabus_tracker' ? 'bg-indigo-50 text-indigo-700 font-bold' : 'text-slate-700 hover:bg-slate-50'}`}
                        >
                          <Layers className="w-4 h-4 text-indigo-600" />
                          Syllabus Tracker
                        </button>
                      </>
                    ) : ['study_material', 'ebook_library', 'question_bank'].includes(subModuleId) ? (
                      <>
                        <button 
                          onClick={() => { setIsActionMenuOpen(false); onSelectSubModule?.('study_material'); }}
                          className={`w-full text-left px-4 py-2.5 text-sm font-medium flex items-center gap-3 transition ${subModuleId === 'study_material' ? 'bg-indigo-50 text-indigo-700 font-bold' : 'text-slate-700 hover:bg-slate-50'}`}
                        >
                          <BookOpen className="w-4 h-4 text-indigo-600" />
                          Study Material
                        </button>
                        <button 
                          onClick={() => { setIsActionMenuOpen(false); onSelectSubModule?.('ebook_library'); }}
                          className={`w-full text-left px-4 py-2.5 text-sm font-medium flex items-center gap-3 transition ${subModuleId === 'ebook_library' ? 'bg-indigo-50 text-indigo-700 font-bold' : 'text-slate-700 hover:bg-slate-50'}`}
                        >
                          <FileText className="w-4 h-4 text-indigo-600" />
                          eBooks
                        </button>
                        <button 
                          onClick={() => { setIsActionMenuOpen(false); onSelectSubModule?.('question_bank'); }}
                          className={`w-full text-left px-4 py-2.5 text-sm font-medium flex items-center gap-3 transition ${subModuleId === 'question_bank' ? 'bg-indigo-50 text-indigo-700 font-bold' : 'text-slate-700 hover:bg-slate-50'}`}
                        >
                          <HelpCircle className="w-4 h-4 text-indigo-600" />
                          Question Bank
                        </button>
                      </>
                    ) : ['online_classes', 'recorded_classes', 'video_library'].includes(subModuleId) ? (
                      <>
                        <button 
                          onClick={() => { setIsActionMenuOpen(false); onSelectSubModule?.('online_classes'); }}
                          className={`w-full text-left px-4 py-2.5 text-sm font-medium flex items-center gap-3 transition ${subModuleId === 'online_classes' ? 'bg-indigo-50 text-indigo-700 font-bold' : 'text-slate-700 hover:bg-slate-50'}`}
                        >
                          <Video className="w-4 h-4 text-indigo-600" />
                          Online Classes
                        </button>
                        <button 
                          onClick={() => { setIsActionMenuOpen(false); onSelectSubModule?.('recorded_classes'); }}
                          className={`w-full text-left px-4 py-2.5 text-sm font-medium flex items-center gap-3 transition ${subModuleId === 'recorded_classes' ? 'bg-indigo-50 text-indigo-700 font-bold' : 'text-slate-700 hover:bg-slate-50'}`}
                        >
                          <Tv className="w-4 h-4 text-indigo-600" />
                          Recorded Classes
                        </button>
                        <button 
                          onClick={() => { setIsActionMenuOpen(false); onSelectSubModule?.('video_library'); }}
                          className={`w-full text-left px-4 py-2.5 text-sm font-medium flex items-center gap-3 transition ${subModuleId === 'video_library' ? 'bg-indigo-50 text-indigo-700 font-bold' : 'text-slate-700 hover:bg-slate-50'}`}
                        >
                          <Film className="w-4 h-4 text-indigo-600" />
                          Video Library
                        </button>
                      </>
                    ) : (
                      <>
                        <button 
                          onClick={() => { setIsActionMenuOpen(false); onSelectSubModule?.('homework'); }}
                          className={`w-full text-left px-4 py-2.5 text-sm font-medium flex items-center gap-3 transition ${subModuleId === 'homework' ? 'bg-indigo-50 text-indigo-700 font-bold' : 'text-slate-700 hover:bg-slate-50'}`}
                        >
                          <BookOpen className="w-4 h-4 text-indigo-600" />
                          Homework
                        </button>
                        <button 
                          onClick={() => { setIsActionMenuOpen(false); onSelectSubModule?.('projects'); }}
                          className={`w-full text-left px-4 py-2.5 text-sm font-medium flex items-center gap-3 transition ${subModuleId === 'projects' ? 'bg-indigo-50 text-indigo-700 font-bold' : 'text-slate-700 hover:bg-slate-50'}`}
                        >
                          <Folder className="w-4 h-4 text-indigo-600" />
                          Project
                        </button>
                        <button 
                          onClick={() => { setIsActionMenuOpen(false); onSelectSubModule?.('assignments'); }}
                          className={`w-full text-left px-4 py-2.5 text-sm font-medium flex items-center gap-3 transition ${subModuleId === 'assignments' ? 'bg-indigo-50 text-indigo-700 font-bold' : 'text-slate-700 hover:bg-slate-50'}`}
                        >
                          <FileText className="w-4 h-4 text-indigo-600" />
                          Assignment
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Dynamic Content based on subModuleId */}
        <div className={`bg-white border border-slate-200 rounded-3xl ${['quick_actions', 'ai_workspace', 'ai_homework_generator'].includes(subModuleId) ? 'p-0 border-0 bg-transparent' : 'p-6 sm:p-8'} shadow-sm min-h-[500px]`}>
          
          {subModuleId === 'profile' && <ProfileView />}
          {subModuleId === 'teacher_info' && <TeacherInfoView />}
          {subModuleId === 'digital_signature' && <DigitalSignatureView />}
          {subModuleId === 'quick_actions' && <QuickActionsView />}
          {subModuleId === 'ai_workspace' && <GalaxyAIChat onBack={onBack} />}
          {subModuleId === 'notifications' && <NotificationsView />}
          {subModuleId === 'tasks' && <TasksView />}
          {subModuleId === 'timetable' && <TimetableView />}
          {subModuleId === 'favorites' && <FavoritesView />}
          {subModuleId === 'qualifications' && <QualificationsView />}
          {subModuleId === 'experience' && <ExperienceView />}
          {subModuleId === 'documents' && <DocumentsView />}
          {subModuleId === 'calendar' && <CalendarView />}

          {subModuleId === 'class_management' && <ClassManagementView />}
          {subModuleId === 'subject_management' && <SubjectManagementView />}
          {subModuleId === 'section_management' && <SectionManagementView />}
          {subModuleId === 'lesson_planning' && <LessonPlanningView />}
          {subModuleId === 'homework' && <HomeworkView />}
          {subModuleId === 'assignments' && <AssignmentsView />}
          {subModuleId === 'syllabus_tracker' && <SyllabusTrackerView />}
          {(subModuleId === 'curriculum' || subModuleId === 'curriculum_mapping') && <CurriculumMappingView />}
          {subModuleId === 'projects' && <ProjectManagementView />}
          {subModuleId === 'study_material' && <StudyMaterialView />}
          {subModuleId === 'question_bank' && <QuestionBankView />}
          {subModuleId === 'ebook_library' && <EBookLibraryView />}
          {subModuleId === 'video_library' && <VideoLibraryView />}
          {subModuleId === 'online_classes' && <OnlineClassesView />}
          {subModuleId === 'recorded_classes' && <RecordedClassesView />}
          {subModuleId === 'practical_lab' || subModuleId === 'practical_management' && <PracticalLabView />}
          {subModuleId === 'ai_homework_generator' && <GalaxyAIChat onBack={onBack} />}
          {subModuleId === 'classroom_resources' && <ClassroomResourcesView />}

          {subModuleId === 'student_lifecycle' && <StudentLifecycleDashboard onSelectSubModule={(subId) => onSelectSubModule?.(subId)} />}
          {subModuleId === 'student_list' && <StudentListView />}
          {(subModuleId === 'attendance' || subModuleId === 'period_attendance') && <AttendanceView />}
          {(subModuleId === 'behaviour' || subModuleId === 'discipline' || subModuleId === 'counselling') && <BehaviourDisciplineView />}
          {subModuleId === 'health_records' && <HealthRecordsView />}
          {(subModuleId === 'student_portfolio' || subModuleId === 'learning_progress' || subModuleId === 'weak_student_detection' || subModuleId === 'gifted_student_tracking') && <PortfolioProgressView />}
          {(subModuleId === 'parent_details' || subModuleId === 'student_documents') && <ParentDocumentsView />}
          {(subModuleId === 'activities' || subModuleId === 'promotion_recommendation' || subModuleId === 'house_management' || subModuleId === 'club_management') && <ActivitiesPromotionView />}

          {subModuleId !== 'profile' && subModuleId !== 'ai_workspace' && subModuleId !== 'ai_homework_generator' && subModuleId !== 'teacher_info' && subModuleId !== 'digital_signature' && subModuleId !== 'quick_actions' && subModuleId !== 'notifications' && subModuleId !== 'tasks' && subModuleId !== 'timetable' && subModuleId !== 'favorites' && subModuleId !== 'qualifications' && subModuleId !== 'experience' && subModuleId !== 'documents' && subModuleId !== 'calendar' && subModuleId !== 'class_management' && subModuleId !== 'subject_management' && subModuleId !== 'section_management' && subModuleId !== 'lesson_planning' && subModuleId !== 'homework' && subModuleId !== 'assignments' && subModuleId !== 'syllabus_tracker' && subModuleId !== 'curriculum' && subModuleId !== 'curriculum_mapping' && subModuleId !== 'projects' && subModuleId !== 'study_material' && subModuleId !== 'question_bank' && subModuleId !== 'ebook_library' && subModuleId !== 'video_library' && subModuleId !== 'online_classes' && subModuleId !== 'recorded_classes' && subModuleId !== 'practical_lab' && subModuleId !== 'practical_management' && subModuleId !== 'classroom_resources' && subModuleId !== 'student_lifecycle' && subModuleId !== 'student_list' && subModuleId !== 'attendance' && subModuleId !== 'period_attendance' && subModuleId !== 'behaviour' && subModuleId !== 'discipline' && subModuleId !== 'counselling' && subModuleId !== 'health_records' && subModuleId !== 'student_portfolio' && subModuleId !== 'learning_progress' && subModuleId !== 'weak_student_detection' && subModuleId !== 'gifted_student_tracking' && subModuleId !== 'parent_details' && subModuleId !== 'student_documents' && subModuleId !== 'activities' && subModuleId !== 'promotion_recommendation' && subModuleId !== 'house_management' && subModuleId !== 'club_management' && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mb-6">
                <Search className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">{subModuleName} Workspace</h3>
              <p className="text-slate-500 max-w-md mx-auto mb-8">
                This is the dedicated workspace for {subModuleName}. All tables, forms, and features for this module are rendered here completely independently.
              </p>
              <div className="flex gap-3">
                <button className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 transition shadow-sm">
                  Create First Entry
                </button>
                <button className="px-6 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl text-sm font-semibold hover:bg-slate-50 transition shadow-sm">
                  Import Data
                </button>
              </div>
            </div>
          )}
          
        </div>
      </div>
    </div>
  );
};
