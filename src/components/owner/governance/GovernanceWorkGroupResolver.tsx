import React, { useState, useEffect } from 'react';
import { Tenant } from '../../../types';
import { InstitutionProfilePage } from '../../../pages/owner/institution-organization/InstitutionProfilePage';
import { OrganizationIdentityPage } from '../../../pages/owner/institution-organization/OrganizationIdentityPage';
import { ContactsLocationsPage } from '../../../pages/owner/institution-organization/ContactsLocationsPage';
import { CampusOverviewPage } from '../../../pages/owner/institution-organization/CampusOverviewPage';
import { OrganizationStructurePage } from '../../../pages/owner/institution-organization/OrganizationStructurePage';
import { DepartmentsPage } from '../../../pages/owner/institution-organization/DepartmentsPage';
import { AdministrationPage } from '../../../pages/owner/institution-organization/AdministrationPage';
import { AcademicStructurePage } from '../../../pages/owner/institution-organization/AcademicStructurePage';
import { DocumentsCompliancePage } from '../../../pages/owner/institution-organization/DocumentsCompliancePage';
import { AuditHistoryPage } from '../../../pages/owner/institution-organization/AuditHistoryPage';
import { OrganizationReportsPage } from '../../../pages/owner/institution-organization/OrganizationReportsPage';

interface GovernanceWorkGroupResolverProps {
  workGroupId: string;
  tenant: Tenant;
  onNavigate: (path: string) => void;
  subWorkArea?: string;
  currentCampus?: string;
}

export const GovernanceWorkGroupResolver: React.FC<GovernanceWorkGroupResolverProps> = ({
  workGroupId,
  tenant,
  onNavigate,
  subWorkArea,
  currentCampus = 'All Campuses'
}) => {
  const [activeSubTab, setActiveSubTab] = useState<string>('');

  useEffect(() => {
    if (subWorkArea) {
      setActiveSubTab(subWorkArea);
    } else {
      // Default sub-tabs per Work Group
      switch (workGroupId) {
        case 'identity-governance':
          setActiveSubTab('institution-profile');
          break;
        case 'campus-hierarchy':
          setActiveSubTab('campus-overview');
          break;
        case 'leadership-roles':
          setActiveSubTab('administration-governance');
          break;
        case 'academic-governance':
          setActiveSubTab('academic-organization');
          break;
        case 'compliance-policy':
          setActiveSubTab('documents-compliance');
          break;
        default:
          setActiveSubTab('institution-profile');
      }
    }
  }, [workGroupId, subWorkArea]);

  switch (workGroupId) {
    case 'identity-governance':
      return (
        <div className="space-y-4 sm:space-y-6 text-left">
          {/* Sub-tab pills */}
          <div className="flex items-center gap-1.5 sm:gap-2 border-b border-slate-200 pb-2.5 sm:pb-3 overflow-x-auto no-scrollbar scroll-smooth">
            <button
              onClick={() => setActiveSubTab('institution-profile')}
              className={`px-3 py-1.5 sm:px-3.5 sm:py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                activeSubTab === 'institution-profile'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
              }`}
            >
              Institution Profile
            </button>
            <button
              onClick={() => setActiveSubTab('organization-identity')}
              className={`px-3 py-1.5 sm:px-3.5 sm:py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                activeSubTab === 'organization-identity'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
              }`}
            >
              Identity & Credentials
            </button>
            <button
              onClick={() => setActiveSubTab('contacts-locations')}
              className={`px-3 py-1.5 sm:px-3.5 sm:py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                activeSubTab === 'contacts-locations'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
              }`}
            >
              Contacts & Official Locations
            </button>
          </div>

          <div>
            {activeSubTab === 'organization-identity' ? (
              <OrganizationIdentityPage tenant={tenant} onNavigate={onNavigate} />
            ) : activeSubTab === 'contacts-locations' ? (
              <ContactsLocationsPage tenant={tenant} onNavigate={onNavigate} />
            ) : (
              <InstitutionProfilePage tenant={tenant} onNavigate={onNavigate} />
            )}
          </div>
        </div>
      );

    case 'campus-hierarchy':
      return (
        <div className="space-y-4 sm:space-y-6 text-left">
          <div className="flex items-center gap-1.5 sm:gap-2 border-b border-slate-200 pb-2.5 sm:pb-3 overflow-x-auto no-scrollbar scroll-smooth">
            <button
              onClick={() => setActiveSubTab('campus-overview')}
              className={`px-3 py-1.5 sm:px-3.5 sm:py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                activeSubTab === 'campus-overview'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
              }`}
            >
              Campus Overview
            </button>
            <button
              onClick={() => setActiveSubTab('organization-structure')}
              className={`px-3 py-1.5 sm:px-3.5 sm:py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                activeSubTab === 'organization-structure'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
              }`}
            >
              Organization Hierarchy
            </button>
            <button
              onClick={() => setActiveSubTab('departments')}
              className={`px-3 py-1.5 sm:px-3.5 sm:py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                activeSubTab === 'departments'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
              }`}
            >
              Departments & Units
            </button>
          </div>

          <div>
            {activeSubTab === 'organization-structure' ? (
              <OrganizationStructurePage tenant={tenant} onNavigate={onNavigate} />
            ) : activeSubTab === 'departments' ? (
              <DepartmentsPage tenant={tenant} onNavigate={onNavigate} />
            ) : (
              <CampusOverviewPage tenant={tenant} onNavigate={onNavigate} />
            )}
          </div>
        </div>
      );

    case 'leadership-roles':
      return (
        <div className="text-left">
          <AdministrationPage tenant={tenant} onNavigate={onNavigate} />
        </div>
      );

    case 'academic-governance':
      return (
        <div className="text-left">
          <AcademicStructurePage tenant={tenant} onNavigate={onNavigate} />
        </div>
      );

    case 'compliance-policy':
      return (
        <div className="space-y-4 sm:space-y-6 text-left">
          <div className="flex items-center gap-1.5 sm:gap-2 border-b border-slate-200 pb-2.5 sm:pb-3 overflow-x-auto no-scrollbar scroll-smooth">
            <button
              onClick={() => setActiveSubTab('documents-compliance')}
              className={`px-3 py-1.5 sm:px-3.5 sm:py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                activeSubTab === 'documents-compliance'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
              }`}
            >
              Compliance Documents
            </button>
            <button
              onClick={() => setActiveSubTab('audit-history')}
              className={`px-3 py-1.5 sm:px-3.5 sm:py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                activeSubTab === 'audit-history'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
              }`}
            >
              Audit Trail & Logs
            </button>
            <button
              onClick={() => setActiveSubTab('organization-reports')}
              className={`px-3 py-1.5 sm:px-3.5 sm:py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                activeSubTab === 'organization-reports'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
              }`}
            >
              Governance Reports
            </button>
          </div>

          <div>
            {activeSubTab === 'audit-history' ? (
              <AuditHistoryPage tenant={tenant} onNavigate={onNavigate} />
            ) : activeSubTab === 'organization-reports' ? (
              <OrganizationReportsPage tenant={tenant} onNavigate={onNavigate} />
            ) : (
              <DocumentsCompliancePage tenant={tenant} onNavigate={onNavigate} currentCampus={currentCampus} />
            )}
          </div>
        </div>
      );

    default:
      return <InstitutionProfilePage tenant={tenant} onNavigate={onNavigate} />;
  }
};
