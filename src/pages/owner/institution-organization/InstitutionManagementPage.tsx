import React from 'react';
import { Tenant } from '../../../types';
import { AdminGovernanceLayout } from '../../../components/owner/governance/AdminGovernanceLayout';
import { InstitutionGovernanceOverviewPage } from './InstitutionGovernanceOverviewPage';

interface InstitutionManagementPageProps {
  tenant: Tenant;
  activePath?: string;
  onNavigate: (path: string) => void;
}

export const InstitutionManagementPage: React.FC<InstitutionManagementPageProps> = ({ tenant, activePath = '', onNavigate }) => {
  const segments = activePath.split('/').filter(Boolean);
  const currentArea = segments.length > 2 ? segments[2] : '';

  if (!currentArea || currentArea === 'overview') {
    return <InstitutionGovernanceOverviewPage tenant={tenant} onNavigate={onNavigate} />;
  }

  return (
    <AdminGovernanceLayout
      tenant={tenant}
      onNavigate={onNavigate}
      initialWorkArea={currentArea}
    />
  );
};
