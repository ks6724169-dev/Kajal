import React, { useState } from 'react';
import { OwnerHeader } from '../../components/owner/OwnerHeader';
import { WelcomeArea } from '../../components/owner/WelcomeArea';
import { ExecutiveKPICards } from '../../components/owner/ExecutiveKPICards';
import { ExecutiveAnalytics } from '../../components/owner/ExecutiveAnalytics';
import { AIExecutiveBrief } from '../../components/owner/AIExecutiveBrief';
import { AlertCenter } from '../../components/owner/AlertCenter';
import { QuickActionCenter } from '../../components/owner/QuickActionCenter';
import { useAuth } from '../../hooks/useAuth';
import { Tenant } from '../../types';
import { RouteResolver } from '../../core/RouteResolver';
import { ArrowLeft, Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import { useOwnerDashboard } from '../../hooks/useOwnerDashboard';
import { InstitutionManagementPage } from './InstitutionManagementPage';

interface OwnerDashboardPageProps {
  tenant: Tenant;
  activePath: string;
  onNavigate: (path: string) => void;
}

export const OwnerDashboardPage: React.FC<OwnerDashboardPageProps> = ({ tenant, activePath, onNavigate }) => {
  const { user } = useAuth();
  const [currentCampus, setCurrentCampus] = useState('All Campuses');
  const { stats, campuses, loading, error } = useOwnerDashboard(currentCampus, tenant?.id);

  const isModule01 = activePath === 'module_institution' || 
                     activePath === '/owner/institution-organization' || 
                     activePath.startsWith('/owner/institution-organization');

  if (isModule01) {
    return <InstitutionManagementPage tenant={tenant} activePath={activePath} onNavigate={onNavigate} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex flex-col">
      <OwnerHeader 
        tenantName={tenant?.name || 'Galaxy International School'}
        tenantType={tenant?.type || 'K-12 School'}
        currentCampus={currentCampus}
        onCampusChange={setCurrentCampus}
        onNavigate={onNavigate}
        campuses={campuses}
      />

      <main className="flex-1 overflow-y-auto custom-scrollbar flex flex-col">
        {activePath === 'dashboard' ? (
          <div className="p-4 md:p-6 lg:p-8 space-y-6 max-w-[1600px] mx-auto w-full animate-fade-in">
            {/* Top Control Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <WelcomeArea 
                ownerName={user?.name || 'Executive'}
                tenantName={tenant?.name || 'Galaxy International School'}
                academicSession={tenant?.academicYear || '2026-27'}
              />
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 text-slate-500">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-600 mb-4" />
                <p>Loading {currentCampus} data...</p>
              </div>
            ) : error ? (
              <div className="bg-red-50 text-red-600 p-6 rounded-xl border border-red-100 flex flex-col items-center justify-center text-center">
                <AlertCircle className="w-8 h-8 mb-2" />
                <h3 className="font-bold">Database Connection Error</h3>
                <p className="text-sm mt-1">{error}</p>
                <button 
                  onClick={() => window.location.reload()}
                  className="mt-4 flex items-center gap-2 px-4 py-2 bg-white text-red-600 rounded-lg shadow-sm font-semibold hover:bg-red-50 transition cursor-pointer"
                >
                  <RefreshCw className="w-4 h-4" /> Retry Connection
                </button>
              </div>
            ) : (
              <>
                {/* Executive KPIs */}
                <section>
                  <ExecutiveKPICards onNavigate={onNavigate} stats={stats} currentCampus={currentCampus} />
                </section>

                {/* Intelligence & Analytics Row */}
                <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2">
                    <ExecutiveAnalytics stats={stats} currentCampus={currentCampus} />
                  </div>
                  <div className="lg:col-span-1 h-full">
                    <AIExecutiveBrief onNavigate={onNavigate} stats={stats} />
                  </div>
                </section>

                {/* Operations & Alerts Row */}
                <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-1 h-full">
                    <QuickActionCenter onNavigate={onNavigate} />
                  </div>
                  <div className="lg:col-span-1 h-full">
                    <AlertCenter onNavigate={onNavigate} stats={stats} />
                  </div>
                  <div className="lg:col-span-1 h-full">
                     <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 h-full flex flex-col">
                       <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-4">
                         <span className="text-xl">📅</span> Today's Operations
                       </h3>
                       <div className="flex-1 space-y-4">
                         <div className="flex items-center justify-between">
                           <span className="text-sm text-slate-600">Avg Attendance</span>
                           <span className="text-sm font-bold text-slate-900">{stats?.avgAttendance || 0}%</span>
                         </div>
                         <div className="flex items-center justify-between">
                           <span className="text-sm text-slate-600">Active Staff</span>
                           <span className="text-sm font-bold text-slate-900">{stats?.activeStaff || 0}</span>
                         </div>
                         <div className="flex items-center justify-between">
                           <span className="text-sm text-slate-600">Total Students</span>
                           <span className="text-sm font-bold text-slate-900">{stats?.totalStudents || 0}</span>
                         </div>
                         <div className="flex items-center justify-between">
                           <span className="text-sm text-slate-600">Fees Collected</span>
                           <span className="text-sm font-bold text-green-600">₹{(stats?.feesCollected || 0).toLocaleString()}</span>
                         </div>
                         <div className="flex items-center justify-between">
                           <span className="text-sm text-slate-600">Active Routes</span>
                           <span className="text-sm font-bold text-slate-900">{stats?.activeRoutes || 0}</span>
                         </div>
                         <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                            <span className="text-xs font-bold text-slate-500 uppercase">Overall Health</span>
                            <div className="flex items-center gap-2">
                              <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden">
                                <div className="h-full bg-green-500 w-[89%]"></div>
                              </div>
                              <span className="text-xs font-bold text-green-600">89%</span>
                            </div>
                         </div>
                       </div>
                     </div>
                  </div>
                </section>

              </>
            )}
          </div>
        ) : (
          <div className="p-4 md:p-6 lg:p-8 flex-1 max-w-[1600px] mx-auto w-full animate-fade-in">
             <div className="mb-4">
                <button 
                  onClick={() => onNavigate('dashboard')}
                  className="flex items-center gap-2 px-3 py-1.5 text-sm font-semibold text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" /> Back to Executive Dashboard
                </button>
             </div>
             <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden min-h-[600px]">
                {RouteResolver.renderRoute(activePath, tenant, onNavigate)}
             </div>
          </div>
        )}
      </main>
    </div>
  );
};
