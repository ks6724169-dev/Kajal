import React from 'react';
import { ComingSoonModule } from '../../components/common/ComingSoonModule';

export const FeeManagement: React.FC = () => {
  return (
    <div className="p-6">
      <ComingSoonModule 
        title="Fee Management & UPI Collection Gateway"
        subtitle="Real-time fee ledgers, automated WhatsApp reminders, and UPI QR payments are undergoing live Supabase integration. Demo data has been purged."
        category="Financial Operations"
        features={[
          "Live Student Fee Ledger Sync",
          "Automated WhatsApp Payment Receipts",
          "Instant UPI QR Code Generation",
          "Accounting & Voucher Posting",
          "Tax & Exemption Audits"
        ]}
      />
    </div>
  );
};
