import { useStudents } from './useStudents';
import { StudentAnalyticsService } from '../services/StudentAnalyticsService';

export const useStudentAnalytics = () => {
  const { students } = useStudents();
  return StudentAnalyticsService.getAnalytics(students);
};
