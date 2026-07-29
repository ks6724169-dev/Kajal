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
import { ArrowLeft, Loader2, AlertCircle, RefreshCw, Settings, Building2, Search, Shield, Bell, User, HelpCircle } from 'lucide-react';
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

  const safeActivePath = activePath || '';
  const isModule01 = safeActivePath === 'module_institution' || 
                     safeActivePath === '/owner/institution-organization' || 
                     safeActivePath.startsWith('/owner/institution-organization');

  if (isModule01) {
    return <InstitutionManagementPage tenant={tenant} activePath={safeActivePath} onNavigate={onNavigate} />;
  }

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 flex flex-col relative overflow-hidden">
      {/* Premium Background Elements matching Landing Page */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none -z-10">
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[80%] h-[80%] bg-gradient-to-b from-indigo-50/50 to-transparent rounded-full blur-[120px]"></div>
      </div>
      <OwnerHeader 
        tenantName={tenant?.name || 'Galaxy International School'}
        tenantType={tenant?.type || 'K-12 School'}
        currentCampus={currentCampus}
        onCampusChange={setCurrentCampus}
        onNavigate={onNavigate}
        campuses={campuses}
      />

      <main className="flex-1 overflow-y-auto custom-scrollbar flex flex-col">
        {activePath === 'dashboard' || activePath === '' ? (
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



              </>
            )}
          </div>
        ) : (
          <div className="w-full flex-1 animate-fade-in">
            {RouteResolver.renderRoute(activePath, tenant, onNavigate)}
          </div>
        )}
      </main>
    </div>
  );
};
