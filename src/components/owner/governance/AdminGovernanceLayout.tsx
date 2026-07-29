import React, { useState, useEffect } from 'react';
import { Tenant } from '../../../types';
import { GovernanceHeaderSummary } from './GovernanceHeaderSummary';
import { GovernanceQuickActions } from './GovernanceQuickActions';
import { GovernanceWorkGroupResolver } from './GovernanceWorkGroupResolver';
import { Building2, Layers, Shield, GraduationCap, FileCheck } from 'lucide-react';

export interface WorkGroupItem {
  id: string;
  name: string;
  shortLabel: string;
  description: string;
  icon: React.ElementType;
}

export const GOVERNANCE_WORK_GROUPS: WorkGroupItem[] = [
  {
    id: 'identity-governance',
    name: 'Identity & Governance',
    shortLabel: 'Identity & Governance',
    description: 'Institution profile, legal registration, branding & official contacts',
    icon: Building2
  },
  {
    id: 'campus-hierarchy',
    name: 'Campus & Organizational Hierarchy',
    shortLabel: 'Campus & Hierarchy',
    description: 'Multi-campus overview, organizational structure & department units',
    icon: Layers
  },
  {
    id: 'leadership-roles',
    name: 'Leadership, Roles & Access',
    shortLabel: 'Leadership & Roles',
    description: 'Administration control, RBAC policies & access governance',
    icon: Shield
  },
  {
    id: 'academic-governance',
    name: 'Academic Governance',
    shortLabel: 'Academic Governance',
    description: 'Academic sessions, term calendars & institutional structure',
    icon: GraduationCap
  },
  {
    id: 'compliance-policy',
    name: 'Compliance, Audit & System Policy',
    shortLabel: 'Compliance & Audit',
    description: 'Compliance documents, system audit logs & governance reports',
    icon: FileCheck
  }
];

interface AdminGovernanceLayoutProps {
  tenant: Tenant;
  onNavigate: (path: string) => void;
  initialWorkArea?: string;
  currentCampus?: string;
}

export const AdminGovernanceLayout: React.FC<AdminGovernanceLayoutProps> = ({
  tenant,
  onNavigate,
  initialWorkArea = 'overview',
  currentCampus = 'All Campuses'
}) => {
  const [selectedCampus, setSelectedCampus] = useState<string>(currentCampus);

  // Map legacy workArea to Work Group ID
  const mapWorkAreaToGroup = (area: string): string => {
    switch (area) {
      case 'institution-profile':
      case 'organization-identity':
      case 'contacts-locations':
        return 'identity-governance';
      case 'campus-overview':
      case 'organization-structure':
      case 'departments':
        return 'campus-hierarchy';
      case 'administration-governance':
        return 'leadership-roles';
      case 'academic-organization':
        return 'academic-governance';
      case 'documents-compliance':
      case 'audit-history':
      case 'organization-reports':
        return 'compliance-policy';
      default:
        return 'identity-governance';
    }
  };

  const [activeWorkGroupId, setActiveWorkGroupId] = useState<string>(
    mapWorkAreaToGroup(initialWorkArea)
  );

  useEffect(() => {
    if (initialWorkArea && initialWorkArea !== 'overview') {
      setActiveWorkGroupId(mapWorkAreaToGroup(initialWorkArea));
    }
  }, [initialWorkArea]);

  const activeWorkGroup = GOVERNANCE_WORK_GROUPS.find(g => g.id === activeWorkGroupId) || GOVERNANCE_WORK_GROUPS[0];

  return (
    <div className="p-3 sm:p-6 lg:p-8 w-full max-w-[1600px] mx-auto space-y-4 sm:space-y-6 text-left animate-fade-in">
      {/* Governance Summary Header */}
      <GovernanceHeaderSummary
        tenant={tenant}
        currentCampus={selectedCampus}
        activeWorkGroupName={activeWorkGroup.name}
        onCampusChange={(c) => setSelectedCampus(c)}
      />

      {/* Governance Work Group Navigation Bar */}
      <div className="bg-slate-50/80 backdrop-blur-sm rounded-2xl border border-slate-100 p-1.5 sm:p-2 shadow-sm relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent pointer-events-none"></div>
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5 scroll-smooth relative z-10">
          {GOVERNANCE_WORK_GROUPS.map((group) => {
            const Icon = group.icon;
            const isActive = activeWorkGroupId === group.id;

            return (
              <button
                key={group.id}
                onClick={() => setActiveWorkGroupId(group.id)}
                title={group.description}
                className={`
                  flex items-center gap-2 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap select-none shrink-0
                  ${isActive 
                    ? 'bg-indigo-600 text-white shadow-xs shadow-indigo-600/20' 
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                  }
                `}
              >
                <Icon className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                <span>{group.shortLabel}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Governance Contextual Quick Actions */}
      <GovernanceQuickActions
        onNavigate={onNavigate}
        onSelectWorkGroup={(groupId) => setActiveWorkGroupId(groupId)}
      />

      {/* Work Group Active View Container */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-3.5 sm:p-6 shadow-2xs overflow-hidden">
        <GovernanceWorkGroupResolver
          workGroupId={activeWorkGroupId}
          tenant={tenant}
          onNavigate={onNavigate}
          subWorkArea={initialWorkArea}
          currentCampus={selectedCampus}
        />
      </div>
    </div>
  );
};
