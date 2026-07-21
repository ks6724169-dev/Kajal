import { useStudentStore } from '../stores/studentStore';

export const useStudents = () => {
  return useStudentStore();
};
