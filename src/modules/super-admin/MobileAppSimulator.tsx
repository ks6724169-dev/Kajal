import React from 'react';
import { ComingSoonModule } from '../../components/common/ComingSoonModule';

export const MobileAppSimulator: React.FC = () => {
  return (
    <div className="p-6">
      <ComingSoonModule 
        title="Mobile App Suite (Parent, Teacher & Student Apps)"
        subtitle="iOS & Android push notification engine, homework submission, fee payment gateway, and live chat are undergoing backend API integration. Demo data has been purged."
        category="Mobile Ecosystem"
        features={[
          "Parent Mobile App Gateway",
          "Teacher Pocket Grading & Attendance",
          "Real-time Push Notifications",
          "Digital Homework & Assignment Uploads",
          "In-App Bus GPS Tracking"
        ]}
      />
    </div>
  );
};
