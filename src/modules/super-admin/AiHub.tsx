import React from 'react';
import { ComingSoonModule } from '../../components/common/ComingSoonModule';

export const AiHub: React.FC = () => {
  return (
    <div className="p-6">
      <ComingSoonModule 
        title="Galaxy AI Campus Suite (Gemini Engine)"
        subtitle="Generative AI for principals, teachers, and student tutors is undergoing live backend API integration. Demo data has been purged."
        category="AI & Analytics"
        features={[
          "Principal Strategy Advisor",
          "AI Curriculum & Lesson Planning",
          "Automated Conflict-Free Timetables",
          "Gemini Question Paper Generator",
          "Student Socratic AI Tutor"
        ]}
      />
    </div>
  );
};
