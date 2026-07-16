import React from 'react';
import { AuthProvider } from '../core/AuthContext';

interface EnterpriseShellProps {
  children: React.ReactNode;
}

export const EnterpriseShell: React.FC<EnterpriseShellProps> = ({ children }) => {
  return (
    <AuthProvider>
      <div className="enterprise-shell min-h-screen bg-slate-100 flex flex-col font-sans text-slate-900">
        {/* Core providers and context wrappers can go here */}
        {children}
      </div>
    </AuthProvider>
  );
};
