import React from 'react';
import { ComingSoonModule } from '../../components/common/ComingSoonModule';

export const ExaminationPortal: React.FC = () => {
  return (
    <div className="p-6">
      <ComingSoonModule 
        title="Examination, Grading & Report Cards Portal"
        subtitle="CBSE/ICSE/State marksheets, automated GPA calculation, report card generation, and online hall tickets are undergoing live database integration. Demo data has been purged."
        category="Academic Management"
        features={[
          "Live Marksheets & Grading Schemes",
          "Automated GPA & Rank Calculation",
          "One-Click PDF Report Card Generator",
          "Online Exam Hall Ticket Issuance",
          "Parent Grade Portal Sync"
        ]}
      />
    </div>
  );
};
