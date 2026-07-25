import React from 'react';
import { ComingSoonModule } from '../../components/common/ComingSoonModule';

export const AttendancePortal: React.FC = () => {
  return (
    <div className="p-6">
      <ComingSoonModule 
        title="Face Recognition & Biometric Attendance Gateway"
        subtitle="AI facial recognition gate scanner and biometric hardware telemetry are undergoing live database integration. Demo data has been purged."
        category="Safety & Attendance"
        features={[
          "Biometric Gate Hardware Sync",
          "AI Face Recognition Telemetry",
          "Automated Absence Alerts to Parents",
          "Period & Subject Attendance Tracking",
          "Staff Biometric Clock-in/Clock-out"
        ]}
      />
    </div>
  );
};
