import React from 'react';
import { Role, Tenant } from '../../types';
import { DashboardCard } from '../../components/dashboard/DashboardCard';
import { KPIWidget } from '../../components/dashboard/KPIWidget';
import { ChartWidget } from '../../components/dashboard/ChartWidget';
import { QuickActionCard } from '../../components/dashboard/QuickActionCard';
import { CalendarWidget } from '../../components/dashboard/CalendarWidget';
import { ActivityTimeline } from '../../components/dashboard/ActivityTimeline';
import { NotificationWidget } from '../../components/dashboard/NotificationWidget';
import { AIInsightCard } from '../../components/dashboard/AIInsightCard';
import { WeatherWidget } from '../../components/dashboard/WeatherWidget';
import { FavoriteCard } from '../../components/dashboard/FavoriteCard';
import { 
  BarChart2, 
  TrendingUp, 
  PieChart, 
  Sparkles, 
  Activity, 
  Bell, 
  CloudSun, 
  Star, 
  Zap, 
  Calendar,
  Grid
} from 'lucide-react';

interface DashboardGridProps {
  role: Role;
  tenant: Tenant;
  visibleWidgets: string[];
  setVisibleWidgets: (widgets: string[]) => void;
  density: 'comfortable' | 'compact';
  onNavigate: (tabId: string) => void;
}

export const DashboardGrid: React.FC<DashboardGridProps> = ({
  role,
  tenant,
  visibleWidgets,
  setVisibleWidgets,
  density,
  onNavigate
}) => {
  const isCompact = density === 'compact';

  const handleRemoveWidget = (id: string) => {
    setVisibleWidgets(visibleWidgets.filter(w => w !== id));
  };

  return (
    <div className={`space-y-4 md:space-y-6`}>
      {/* 1. KPI Metrics Widgets (Full-width top row) */}
      {visibleWidgets.includes('kpi') && (
        <div className="w-full">
          <KPIWidget role={role} onNavigate={onNavigate} />
        </div>
      )}

      {/* 2. Responsive Multi-Column Bento Grid Areas */}
      <div className={`grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-5 ${isCompact ? 'gap-3 md:gap-3.5' : ''}`}>
        
        {/* LEFT COLUMN: Main Charts and Operations (Col-span 8) */}
        <div className="col-span-1 lg:col-span-8 space-y-4 md:space-y-5">
          
          {/* Quick Actions Card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-2xl p-4 shadow-xs">
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest block mb-3">Institutional Quick Shortcuts</span>
            <QuickActionCard role={role} onAction={onNavigate} />
          </div>

          {/* Revenue Chart Widget */}
          {visibleWidgets.includes('revenue') && (
            <DashboardCard
              id="revenue"
              title="Institution Revenue Cycle Tracking"
              icon={<TrendingUp className="w-4 h-4" />}
              onRemove={() => handleRemoveWidget('revenue')}
            >
              <ChartWidget type="revenue" height={isCompact ? 180 : 220} />
            </DashboardCard>
          )}

          {/* Grid of secondary charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Attendance Rate Chart Widget */}
            {visibleWidgets.includes('attendance') && (
              <DashboardCard
                id="attendance"
                title="Weekly Attendance Average"
                icon={<BarChart2 className="w-4 h-4" />}
                onRemove={() => handleRemoveWidget('attendance')}
              >
                <ChartWidget type="attendance" height={isCompact ? 160 : 200} />
              </DashboardCard>
            )}

            {/* Distribution/Performance Chart Widget */}
            {visibleWidgets.includes('distribution') && (role === 'super_admin' || role === 'school_admin' || role === 'principal') && (
              <DashboardCard
                id="distribution"
                title="Class Grade Enrolled Breakdown"
                icon={<PieChart className="w-4 h-4" />}
                onRemove={() => handleRemoveWidget('distribution')}
              >
                <ChartWidget type="distribution" height={isCompact ? 160 : 200} />
              </DashboardCard>
            )}

            {visibleWidgets.includes('performance') && (role === 'student' || role === 'parent' || role === 'teacher') && (
              <DashboardCard
                id="performance"
                title="Curriculum Performance Evaluation"
                icon={<TrendingUp className="w-4 h-4" />}
                onRemove={() => handleRemoveWidget('performance')}
              >
                <ChartWidget type="performance" height={isCompact ? 160 : 200} />
              </DashboardCard>
            )}
          </div>

          {/* Activity Logs Audit Timeline */}
          {visibleWidgets.includes('recent_activity') && (
            <DashboardCard
              id="recent_activity"
              title="Real-time System Audit Trails"
              icon={<Activity className="w-4 h-4" />}
              onRemove={() => handleRemoveWidget('recent_activity')}
            >
              <ActivityTimeline />
            </DashboardCard>
          )}
        </div>

        {/* RIGHT COLUMN: AI Copilots, Weather, Timetables, Alerts (Col-span 4) */}
        <div className="col-span-1 lg:col-span-4 space-y-4 md:space-y-5">
          
          {/* AI Platform Intelligence Copilot Card */}
          {visibleWidgets.includes('ai_insights') && (
            <DashboardCard
              id="ai_insights"
              title="Galaxy AI Campus Copilot"
              icon={<Sparkles className="w-4 h-4" />}
              onRemove={() => handleRemoveWidget('ai_insights')}
              className="border-indigo-200 dark:border-indigo-950/40 shadow-sm"
            >
              <AIInsightCard role={role} />
            </DashboardCard>
          )}

          {/* Real-time Notifications & Alerts */}
          {visibleWidgets.includes('notifications') && (
            <DashboardCard
              id="notifications"
              title="Live Campus Notification Center"
              icon={<Bell className="w-4 h-4" />}
              onRemove={() => handleRemoveWidget('notifications')}
            >
              <NotificationWidget />
            </DashboardCard>
          )}

          {/* Calendar, Schedules & Deadlines */}
          {visibleWidgets.includes('timetable') && (
            <DashboardCard
              id="timetable"
              title="Interactive Schedules"
              icon={<Calendar className="w-4 h-4" />}
              onRemove={() => handleRemoveWidget('timetable')}
            >
              <CalendarWidget role={role} />
            </DashboardCard>
          )}

          {/* Bookmarked Favorites */}
          {visibleWidgets.includes('favorites') && (
            <DashboardCard
              id="favorites"
              title="My Bookmarked Modules"
              icon={<Star className="w-4 h-4" />}
              onRemove={() => handleRemoveWidget('favorites')}
            >
              <FavoriteCard onNavigate={onNavigate} />
            </DashboardCard>
          )}

          {/* Local Weather & Ingress Advisories */}
          {visibleWidgets.includes('weather') && (
            <DashboardCard
              id="weather"
              title="Dynamic Climate Advisory"
              icon={<CloudSun className="w-4 h-4" />}
              onRemove={() => handleRemoveWidget('weather')}
            >
              <WeatherWidget tenant={tenant} />
            </DashboardCard>
          )}
        </div>

      </div>
    </div>
  );
};
