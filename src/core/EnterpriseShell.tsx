import React from 'react';
import { AuthProvider } from '../core/AuthContext';
import { StoreProvider } from '../stores/StoreContext';

interface EnterpriseShellProps {
  children: React.ReactNode;
}

export const EnterpriseShell: React.FC<EnterpriseShellProps> = ({ children }) => {
  return (
    <AuthProvider>
      <StoreProvider>
        <div className="enterprise-shell min-h-screen bg-slate-100 flex flex-col font-sans text-slate-900">
          {/* Core providers and context wrappers can go here */}
          {children}
        </div>
      </StoreProvider>
    </AuthProvider>
  );
};
