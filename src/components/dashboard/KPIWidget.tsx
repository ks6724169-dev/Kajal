import React from 'react';
import { StatCard } from './StatCard';
import { Role } from '../../types';
import { 
  Users, 
  BookOpen, 
  CheckSquare, 
  Clock, 
  CreditCard, 
  GraduationCap, 
  MapPin, 
  FileCheck, 
  UserPlus, 
  ShieldAlert, 
  Activity, 
  Sparkles,
  Percent,
  Calendar,
  Layers,
  Heart
} from 'lucide-react';

interface KPIWidgetProps {
  role: Role;
  onNavigate?: (tab: string) => void;
}

export const KPIWidget: React.FC<KPIWidgetProps> = ({ role, onNavigate }) => {
  // Return different KPIs based on the role
  switch (role) {
    case 'super_admin':
    case 'organization_owner':
    case 'school_admin':
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
          <StatCard
            id="admin-kpi-1"
            title="Total Students Enrolled"
            value="2,540"
            icon={<Users className="w-5 h-5" />}
            trend={{ value: 12.4, isPositive: true, label: 'this academic year' }}
            color="indigo"
          />
          <StatCard
            id="admin-kpi-2"
            title="SaaS Revenue Collected"
            value="₹72.4L"
            icon={<CreditCard className="w-5 h-5" />}
            trend={{ value: 8.2, isPositive: true, label: 'vs monthly target' }}
            color="emerald"
          />
          <StatCard
            id="admin-kpi-3"
            title="Today's Attendance Rate"
            value="96.2%"
            icon={<CheckSquare className="w-5 h-5" />}
            trend={{ value: 1.1, isPositive: true, label: 'vs yesterday' }}
            color="violet"
          />
          <StatCard
            id="admin-kpi-4"
            title="Transit Active Fleet"
            value="14 / 14"
            icon={<MapPin className="w-5 h-5" />}
            trend={{ value: 100, isPositive: true, label: 'buses online' }}
            color="pink"
          />
        </div>
      );

    case 'principal':
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
          <StatCard
            id="pr-kpi-1"
            title="Overall Attendance Today"
            value="97.4%"
            icon={<Activity className="w-5 h-5" />}
            trend={{ value: 0.8, isPositive: true }}
            color="indigo"
          />
          <StatCard
            id="pr-kpi-2"
            title="Faculty Engagement"
            value="98.1%"
            icon={<Users className="w-5 h-5" />}
            trend={{ value: 2.1, isPositive: true }}
            color="violet"
          />
          <StatCard
            id="pr-kpi-3"
            title="Parent Satisfaction Score"
            value="4.8 / 5.0"
            icon={<Sparkles className="w-5 h-5" />}
            trend={{ value: 4.5, isPositive: true, label: 'from annual survey' }}
            color="pink"
          />
          <StatCard
            id="pr-kpi-4"
            title="Pending Grievances"
            value="2 Active"
            icon={<ShieldAlert className="w-5 h-5" />}
            trend={{ value: 50, isPositive: false, label: 'resolved in last 48h' }}
            color="rose"
          />
        </div>
      );

    case 'teacher':
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
          <StatCard
            id="tr-kpi-1"
            title="Classes Scheduled Today"
            value="5 Periods"
            icon={<Calendar className="w-5 h-5" />}
            color="violet"
          />
          <StatCard
            id="tr-kpi-2"
            title="Class Average Attendance"
            value="94.8%"
            icon={<CheckSquare className="w-5 h-5" />}
            trend={{ value: 0.3, isPositive: false }}
            color="indigo"
          />
          <StatCard
            id="tr-kpi-3"
            title="Assignments to Grade"
            value="42 Pending"
            icon={<FileCheck className="w-5 h-5" />}
            trend={{ value: 12, isPositive: true, label: 'submitted today' }}
            color="amber"
          />
          <StatCard
            id="tr-kpi-4"
            title="AI Teaching Assistant Copilot"
            value="Online"
            icon={<Sparkles className="w-5 h-5" />}
            color="emerald"
          />
        </div>
      );

    case 'student':
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
          <StatCard
            id="st-kpi-1"
            title="My Attendance Rate"
            value="96.5%"
            icon={<CheckSquare className="w-5 h-5" />}
            trend={{ value: 2.5, isPositive: true, label: 'above threshold' }}
            color="emerald"
          />
          <StatCard
            id="st-kpi-2"
            title="Current GPA (CGPA)"
            value="9.2 / 10"
            icon={<GraduationCap className="w-5 h-5" />}
            trend={{ value: 5.1, isPositive: true, label: 'since last term' }}
            color="indigo"
          />
          <StatCard
            id="st-kpi-3"
            title="Homework & Tasks Due"
            value="3 Tasks"
            icon={<Clock className="w-5 h-5" />}
            color="amber"
          />
          <StatCard
            id="st-kpi-4"
            title="Library Borrowed Books"
            value="2 Books"
            icon={<BookOpen className="w-5 h-5" />}
            color="violet"
          />
        </div>
      );

    case 'parent':
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
          <StatCard
            id="pt-kpi-1"
            title="Child's Daily Attendance"
            value="Present (98%)"
            icon={<CheckSquare className="w-5 h-5" />}
            color="emerald"
          />
          <StatCard
            id="pt-kpi-2"
            title="Pending School Fees"
            value="₹12,500"
            icon={<CreditCard className="w-5 h-5" />}
            color="rose"
          />
          <StatCard
            id="pt-kpi-3"
            title="Latest Exam Performance"
            value="92% Grade A+"
            icon={<GraduationCap className="w-5 h-5" />}
            trend={{ value: 1.5, isPositive: true }}
            color="indigo"
          />
          <StatCard
            id="pt-kpi-4"
            title="Bus Location Tracking"
            value="Sector 5 (On Time)"
            icon={<MapPin className="w-5 h-5" />}
            color="violet"
          />
        </div>
      );

    case 'librarian':
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
          <StatCard
            id="lib-kpi-1"
            title="Total Catalog Books"
            value="18,450"
            icon={<BookOpen className="w-5 h-5" />}
            trend={{ value: 2.5, isPositive: true }}
            color="indigo"
          />
          <StatCard
            id="lib-kpi-2"
            title="Books Checked Out"
            value="340 Active"
            icon={<Clock className="w-5 h-5" />}
            color="violet"
          />
          <StatCard
            id="lib-kpi-3"
            title="Overdue Returns Today"
            value="18"
            icon={<ShieldAlert className="w-5 h-5" />}
            color="rose"
          />
          <StatCard
            id="lib-kpi-4"
            title="Library Fine Collection"
            value="₹1,240"
            icon={<CreditCard className="w-5 h-5" />}
            color="emerald"
          />
        </div>
      );

    case 'accountant':
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
          <StatCard
            id="acc-kpi-1"
            title="Monthly Fees Received"
            value="₹64.2L"
            icon={<CreditCard className="w-5 h-5" />}
            trend={{ value: 92.5, isPositive: true, label: 'collected vs invoice total' }}
            color="emerald"
          />
          <StatCard
            id="acc-kpi-2"
            title="Pending Due Fees"
            value="₹8.1L"
            icon={<ShieldAlert className="w-5 h-5" />}
            color="rose"
          />
          <StatCard
            id="acc-kpi-3"
            title="Processed Payroll"
            value="₹14.8L"
            icon={<Users className="w-5 h-5" />}
            trend={{ value: 100, isPositive: true, label: 'staff paid' }}
            color="indigo"
          />
          <StatCard
            id="acc-kpi-4"
            title="Active Online Transactions"
            value="342 UPI"
            icon={<Activity className="w-5 h-5" />}
            color="violet"
          />
        </div>
      );

    case 'hr':
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
          <StatCard
            id="hr-kpi-1"
            title="Total Employee headcount"
            value="184"
            icon={<Users className="w-5 h-5" />}
            trend={{ value: 4.2, isPositive: true }}
            color="indigo"
          />
          <StatCard
            id="hr-kpi-2"
            title="Average Staff Rating"
            value="4.6"
            icon={<Sparkles className="w-5 h-5" />}
            color="violet"
          />
          <StatCard
            id="hr-kpi-3"
            title="Pending Leaves Requested"
            value="6"
            icon={<Clock className="w-5 h-5" />}
            color="amber"
          />
          <StatCard
            id="hr-kpi-4"
            title="Recruitment Vacancies"
            value="4 Active"
            icon={<UserPlus className="w-5 h-5" />}
            color="emerald"
          />
        </div>
      );

    default:
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
          <StatCard
            id="gen-kpi-1"
            title="Institute General Attendance"
            value="95.5%"
            icon={<CheckSquare className="w-5 h-5" />}
            color="indigo"
          />
          <StatCard
            id="gen-kpi-2"
            title="Active System Sessions"
            value="1,240"
            icon={<Activity className="w-5 h-5" />}
            color="violet"
          />
          <StatCard
            id="gen-kpi-3"
            title="Active Notifications"
            value="12"
            icon={<ShieldAlert className="w-5 h-5" />}
            color="amber"
          />
          <StatCard
            id="gen-kpi-4"
            title="ERP System Uptime"
            value="99.99%"
            icon={<Sparkles className="w-5 h-5" />}
            color="emerald"
          />
        </div>
      );
  }
};
