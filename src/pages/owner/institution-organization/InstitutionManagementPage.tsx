import React from 'react';
import { Tenant } from '../../../types';
import { ModuleLayout } from './ModuleLayout';
import { OverviewPage } from './OverviewPage';
import { InstitutionProfilePage } from './InstitutionProfilePage';
import { CampusOverviewPage } from './CampusOverviewPage';
import { OrganizationStructurePage } from './OrganizationStructurePage';
import { DepartmentsPage } from './DepartmentsPage';
import { AcademicStructurePage } from './AcademicStructurePage';
import { AdministrationPage } from './AdministrationPage';
import { AuditHistoryPage } from './AuditHistoryPage';
import { ContactsLocationsPage } from './ContactsLocationsPage';
import { DocumentsCompliancePage } from './DocumentsCompliancePage';
import { OrganizationIdentityPage } from './OrganizationIdentityPage';
import { OrganizationReportsPage } from './OrganizationReportsPage';

interface InstitutionManagementPageProps {
  tenant: Tenant;
  activePath?: string;
  onNavigate: (path: string) => void;
}

export const InstitutionManagementPage: React.FC<InstitutionManagementPageProps> = ({ 
  tenant, 
  activePath = '', 
  onNavigate 
}) => {
  // Resolve the current work area from the path
  const resolveWorkArea = () => {
    const path = activePath;
    const segments = path.split('/').filter(Boolean);
    
    // Default to overview if no specific work area is found
    if (segments.length <= 2) return 'overview';
    
    // The work area is usually the 3rd segment in /owner/institution-organization/:workArea
    return segments[2] || 'overview';
  };

  const currentWorkArea = resolveWorkArea();

  const renderContent = () => {
    switch (currentWorkArea) {
      case 'overview':
        return <OverviewPage tenant={tenant} onNavigate={onNavigate} />;
      case 'institution-profile':
        return <InstitutionProfilePage tenant={tenant} onNavigate={onNavigate} />;
      case 'campus-overview':
        return <CampusOverviewPage tenant={tenant} onNavigate={onNavigate} />;
      case 'organization-structure':
        return <OrganizationStructurePage tenant={tenant} onNavigate={onNavigate} />;
      case 'departments':
        return <DepartmentsPage tenant={tenant} onNavigate={onNavigate} />;
      case 'academic-organization':
        return <AcademicStructurePage tenant={tenant} onNavigate={onNavigate} />;
      case 'administration-governance':
        return <AdministrationPage tenant={tenant} onNavigate={onNavigate} />;
      case 'contacts-locations':
        return <ContactsLocationsPage tenant={tenant} onNavigate={onNavigate} />;
      case 'documents-compliance':
        return <DocumentsCompliancePage tenant={tenant} onNavigate={onNavigate} />;
      case 'organization-identity':
        return <OrganizationIdentityPage tenant={tenant} onNavigate={onNavigate} />;
      case 'organization-reports':
        return <OrganizationReportsPage tenant={tenant} onNavigate={onNavigate} />;
      case 'audit-history':
        return <AuditHistoryPage tenant={tenant} onNavigate={onNavigate} />;
      
      // Placeholder for remaining technical areas
      case 'organization-settings':
        return (
          <div className="flex flex-col items-center justify-center py-40 text-slate-400 bg-white rounded-[40px] border border-dashed border-slate-200 shadow-sm animate-in fade-in zoom-in-95 duration-500">
             <div className="w-24 h-24 rounded-3xl bg-slate-50 flex items-center justify-center mb-8 relative">
                <div className="w-12 h-12 border-4 border-indigo-600/10 border-t-indigo-600 rounded-full animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                   <div className="w-2 h-2 rounded-full bg-indigo-600" />
                </div>
             </div>
             <h3 className="text-2xl font-black text-slate-900 tracking-tight mb-3">Work Area Provisioning</h3>
             <p className="text-sm font-medium max-w-sm text-center px-8 text-slate-500 leading-relaxed">
                This workspace is being configured with enterprise-grade security protocols and localized data governance.
             </p>
             <button 
               onClick={() => onNavigate('/owner/institution-organization/overview')}
               className="mt-10 px-8 py-3 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-slate-800 transition-all shadow-xl shadow-slate-200"
             >
               Return to Overview
             </button>
          </div>
        );

      default:
        return <OverviewPage tenant={tenant} onNavigate={onNavigate} />;
    }
  };

  const getPageMeta = () => {
    const titles: Record<string, string> = {
      'overview': 'Module Overview',
      'institution-profile': 'Institution Identity',
      'campus-overview': 'Campus Overview',
      'organization-structure': 'Organization Structure',
      'departments': 'Departments',
      'academic-organization': 'Academic Organization',
      'administration-governance': 'Administration & Governance',
      'contacts-locations': 'Contacts & Locations',
      'documents-compliance': 'Documents & Compliance',
      'organization-settings': 'Organization Settings',
      'audit-history': 'Audit & History',
      'organization-identity': 'Organization Identity',
      'organization-reports': 'Organization Reports'
    };

    return {
      title: titles[currentWorkArea] || 'Institution Management',
      breadcrumbs: [
        { label: 'Management', path: '/owner/dashboard' },
        { label: 'Institution & Org', path: '/owner/institution-organization/overview' },
        { label: titles[currentWorkArea] || 'Workspace' }
      ]
    };
  };

  const meta = getPageMeta();

  return (
    <ModuleLayout 
      activeTab={currentWorkArea} 
      onNavigate={onNavigate}
      pageTitle={meta.title}
      breadcrumbs={meta.breadcrumbs}
    >
      {renderContent()}
    </ModuleLayout>
  );
};
