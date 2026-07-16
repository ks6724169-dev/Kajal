import React from 'react';
import { useTenant } from './TenantContext';

interface TenantSwitcherProps {
  organizations: { id: string, name: string }[];
  schools: { id: string, name: string, organization_id: string }[];
}

export const TenantSwitcher: React.FC<TenantSwitcherProps> = ({ organizations, schools }) => {
  const { switchTenant, organization, school } = useTenant();

  return (
    <div className="flex gap-4">
      <select 
        className="bg-white border rounded px-3 py-2 text-sm text-slate-700"
        value={organization?.id || ''} 
        onChange={(e) => switchTenant(e.target.value)}
      >
        <option value="" disabled>Select Organization</option>
        {organizations.map(org => (
          <option key={org.id} value={org.id}>{org.name}</option>
        ))}
      </select>

      <select 
        className="bg-white border rounded px-3 py-2 text-sm text-slate-700"
        value={school?.id || ''} 
        onChange={(e) => {
          if (organization) {
            switchTenant(organization.id, e.target.value);
          }
        }}
        disabled={!organization}
      >
        <option value="" disabled>Select School</option>
        {schools.filter(s => s.organization_id === organization?.id).map(s => (
          <option key={s.id} value={s.id}>{s.name}</option>
        ))}
      </select>
    </div>
  );
};
