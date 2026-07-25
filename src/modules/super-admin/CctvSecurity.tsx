import React from 'react';
import { ComingSoonModule } from '../../components/common/ComingSoonModule';

export const CctvSecurity: React.FC = () => {
  return (
    <div className="p-6">
      <ComingSoonModule 
        title="CCTV Security & Gate Pass Surveillance"
        subtitle="RTSP camera feeds, AI perimeter intrusion detection, visitor digital badges, and security logs are undergoing live hardware API integration. Demo data has been purged."
        category="Campus Security"
        features={[
          "Live RTSP / ONVIF Camera Streaming",
          "AI Motion & Intrusion Alerts",
          "Digital Visitor Gate Pass & QR Code",
          "Emergency Panic Alert System",
          "Security Incident Logging"
        ]}
      />
    </div>
  );
};
