import { useAttendanceStore } from '../stores/attendanceStore';

export const useAttendance = () => {
  return useAttendanceStore();
};
