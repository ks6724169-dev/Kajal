import React from 'react';
import { Tenant } from '../../../types';
import { AdminGovernanceLayout } from '../../../components/owner/governance/AdminGovernanceLayout';

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
    
    return segments[2] || 'overview';
  };

  const currentWorkArea = resolveWorkArea();

  return (
    <AdminGovernanceLayout
      tenant={tenant}
      onNavigate={onNavigate}
      initialWorkArea={currentWorkArea}
    />
  );
};

