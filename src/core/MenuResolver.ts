import { Role } from '../types';

export interface MenuAction {
  id: string;
  title: string;
  hindiTitle: string;
  action: string; // Event or tab name to trigger
  icon: string;
  color: string;
}

export class MenuResolver {
  private static CONTEXTUAL_ACTIONS: Record<Role, MenuAction[]> = {
    super_admin: [
      { id: 'add-tenant', title: 'Provision District', hindiTitle: 'जिला प्रावधान', action: 'provision_tenant', icon: 'PlusCircle', color: 'text-indigo-600' },
      { id: 'platform-logs', title: 'Hardware Diagnostics', hindiTitle: 'हार्डवेयर निदान', action: 'view_logs', icon: 'Activity', color: 'text-rose-600' },
      { id: 'ai-prompt', title: 'Tweak AI Settings', hindiTitle: 'एआई सेटिंग्स बदलें', action: 'ai_settings', icon: 'Cpu', color: 'text-purple-600' }
    ],
    organization_owner: [
      { id: 'audit-finance', title: 'Fiscal Audit', hindiTitle: 'वित्तीय लेखापरीक्षा', action: 'audit_finance', icon: 'FileCheck', color: 'text-amber-600' },
      { id: 'campus-sync', title: 'Sync Campuses', hindiTitle: 'कैंपस सिंक करें', action: 'sync_campuses', icon: 'RefreshCw', color: 'text-blue-600' }
    ],
    school_admin: [
      { id: 'admit-student', title: 'Admit Student', hindiTitle: 'छात्र प्रवेश', action: 'admit_student', icon: 'UserPlus', color: 'text-emerald-600' },
      { id: 'collect-fee', title: 'Collect Fee Invoice', hindiTitle: 'शुल्क चालान जमा करें', action: 'collect_fee', icon: 'Receipt', color: 'text-amber-600' },
      { id: 'bus-telemetry', title: 'Track School Buses', hindiTitle: 'बसों को ट्रैक करें', action: 'track_bus', icon: 'MapPin', color: 'text-orange-600' }
    ],
    principal: [
      { id: 'evaluate-teacher', title: 'Evaluate Teachers', hindiTitle: 'शिक्षकों का मूल्यांकन', action: 'evaluate_teachers', icon: 'Award', color: 'text-emerald-600' },
      { id: 'student-timeline', title: 'View Behaviors', hindiTitle: 'व्यवहार ट्रैक करें', action: 'student_behaviour', icon: 'Heart', color: 'text-rose-600' },
      { id: 'ai-insights', title: 'Generate Academic Insights', hindiTitle: 'एआई अकादमिक अंतर्दृष्टि', action: 'ai_academic_insights', icon: 'Sparkles', color: 'text-violet-600' }
    ],
    vice_principal: [
      { id: 'schedule-classes', title: 'Timetable Builder', hindiTitle: 'समय सारणी निर्माता', action: 'schedule_classes', icon: 'Calendar', color: 'text-blue-600' },
      { id: 'discipline-folder', title: 'Disciplinary Action', hindiTitle: 'अनुशासनात्मक कार्रवाई', action: 'discipline_action', icon: 'ShieldAlert', color: 'text-rose-600' }
    ],
    teacher: [
      { id: 'mark-attendance', title: 'Take Attendance', hindiTitle: 'उपस्थिति दर्ज करें', action: 'take_attendance', icon: 'CheckSquare', color: 'text-indigo-600' },
      { id: 'enter-grades', title: 'Grade Assessments', hindiTitle: 'मूल्यांकन ग्रेड दर्ज करें', action: 'grade_assessments', icon: 'Edit3', color: 'text-violet-600' },
      { id: 'log-behavior', title: 'Log behavior', hindiTitle: 'व्यवहार रिकॉर्ड करें', action: 'log_behavior', icon: 'ThumbsUp', color: 'text-emerald-600' }
    ],
    class_teacher: [
      { id: 'counseling-notes', title: 'Add Counseling Notes', hindiTitle: 'परामर्श नोट्स जोड़ें', action: 'add_counseling', icon: 'MessageCircle', color: 'text-violet-600' },
      { id: 'parent-meeting', title: 'Schedule Parent Meeting', hindiTitle: 'अभिभावक बैठक शेड्यूल करें', action: 'parent_meeting', icon: 'Users', color: 'text-teal-600' }
    ],
    accountant: [
      { id: 'invoice-gen', title: 'Generate Tuition Invoice', hindiTitle: 'शिक्षण चालान उत्पन्न करें', action: 'generate_invoice', icon: 'PlusCircle', color: 'text-amber-600' },
      { id: 'remind-fee', title: 'Send Reminders', hindiTitle: 'अनुस्मारक भेजें', action: 'send_fee_reminders', icon: 'Bell', color: 'text-rose-600' }
    ],
    hr: [
      { id: 'disburse-pay', title: 'Disburse Salaries', hindiTitle: 'वेतन वितरित करें', action: 'disburse_salaries', icon: 'DollarSign', color: 'text-emerald-600' },
      { id: 'staff-onboard', title: 'Onboard Employee', hindiTitle: 'कर्मचारी ऑनबोर्ड', action: 'onboard_employee', icon: 'UserPlus', color: 'text-teal-600' }
    ],
    receptionist: [
      { id: 'create-pass', title: 'Issue Visitor Pass', hindiTitle: 'विजिटर पास जारी करें', action: 'issue_visitor_pass', icon: 'FileText', color: 'text-indigo-600' },
      { id: 'log-call', title: 'Log Phone Enquiry', hindiTitle: 'फोन पूछताछ दर्ज करें', action: 'log_phone_enquiry', icon: 'Phone', color: 'text-blue-600' }
    ],
    transport_manager: [
      { id: 'sos-alert', title: 'Trigger Transit SOS', hindiTitle: 'पारगमन एसओएस ट्रिगर', action: 'transit_sos', icon: 'AlertTriangle', color: 'text-rose-600 animate-pulse' },
      { id: 'route-audit', title: 'Audit Bus route', hindiTitle: 'बस मार्ग लेखापरीक्षा', action: 'audit_bus_route', icon: 'Shield', color: 'text-orange-600' }
    ],
    hostel_manager: [
      { id: 'mess-menu', title: 'Update Mess Menu', hindiTitle: 'मेस मेनू अपडेट करें', action: 'update_mess_menu', icon: 'Coffee', color: 'text-orange-600' },
      { id: 'room-inspection', title: 'Room Inspection Logs', hindiTitle: 'कमरा निरीक्षण लॉग', action: 'room_inspection', icon: 'ClipboardList', color: 'text-teal-600' }
    ],
    librarian: [
      { id: 'issue-book', title: 'Issue Book (Barcode)', hindiTitle: 'पुस्तक जारी करें', action: 'issue_book', icon: 'BookOpen', color: 'text-cyan-600' },
      { id: 'receive-book', title: 'Receive Book', hindiTitle: 'पुस्तक वापस प्राप्त करें', action: 'receive_book', icon: 'CheckCircle', color: 'text-emerald-600' }
    ],
    student: [
      { id: 'submit-assignment', title: 'Submit Homework', hindiTitle: 'गृहकार्य जमा करें', action: 'submit_homework', icon: 'UploadCloud', color: 'text-indigo-600' },
      { id: 'view-syllabus', title: 'Curriculum Progress', hindiTitle: 'पाठ्यक्रम प्रगति', action: 'view_curriculum', icon: 'Bookmark', color: 'text-violet-600' }
    ],
    parent: [
      { id: 'pay-fees', title: 'Pay Tuition Fees', hindiTitle: 'शिक्षण शुल्क का भुगतान', action: 'pay_fees_online', icon: 'CreditCard', color: 'text-emerald-600' },
      { id: 'track-bus-parent', title: 'Track Child Bus Route', hindiTitle: 'बस मार्ग ट्रैक करें', action: 'track_child_bus', icon: 'MapPin', color: 'text-orange-600' }
    ],
    driver: [
      { id: 'start-trip', title: 'Start Transit Trip', hindiTitle: 'पारगमन यात्रा शुरू करें', action: 'start_transit_trip', icon: 'Play', color: 'text-emerald-600' },
      { id: 'safety-check', title: 'Safety Log Checklist', hindiTitle: 'सुरक्षा चेकलिस्ट', action: 'safety_checklist', icon: 'ShieldCheck', color: 'text-orange-600' }
    ],
    guest: [
      { id: 'sandbox-help', title: 'Sandbox Guide', hindiTitle: 'सैंडबॉक्स गाइड', action: 'sandbox_guide', icon: 'HelpCircle', color: 'text-slate-600' }
    ],
    exam_controller: [
      { id: 'upload-bank', title: 'Publish Question Bank', hindiTitle: 'प्रश्न बैंक प्रकाशित करें', action: 'publish_question_bank', icon: 'UploadCloud', color: 'text-indigo-600' },
      { id: 'certify-results', title: 'Certify Result Sheets', hindiTitle: 'परिणाम पत्र प्रमाणित करें', action: 'certify_results', icon: 'CheckSquare', color: 'text-cyan-600' }
    ],
    inventory_manager: [
      { id: 'add-asset', title: 'Audit Assets (SKU)', hindiTitle: 'परिसंपत्तियों का ऑडिट', action: 'audit_assets', icon: 'Clipboard', color: 'text-sky-600' },
      { id: 'reorder-item', title: 'Place Purchase Requisition', hindiTitle: 'खरीद मांग पत्र रखें', action: 'purchase_requisition', icon: 'ShoppingBag', color: 'text-indigo-600' }
    ]
  };

  static getActionsForRole(role: Role): MenuAction[] {
    return this.CONTEXTUAL_ACTIONS[role] || this.CONTEXTUAL_ACTIONS.guest;
  }
}
