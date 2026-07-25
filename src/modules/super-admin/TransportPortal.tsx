import React from 'react';
import { ComingSoonModule } from '../../components/common/ComingSoonModule';

export const TransportPortal: React.FC = () => {
  return (
    <div className="p-6">
      <ComingSoonModule 
        title="Live GPS School Bus & Fleet Tracking"
        subtitle="Real-time GPS bus telemetry, driver phone contacts, speed monitoring, and parent ETA alerts are undergoing live database integration. Demo data has been purged."
        category="Transport Operations"
        features={[
          "Live GPS Fleet Mapping",
          "Automated Parent ETA Alerts",
          "Student Onboard RFID / Scan Tracking",
          "Speed & Maintenance Telemetry",
          "Driver & Route Management"
        ]}
      />
    </div>
  );
};
