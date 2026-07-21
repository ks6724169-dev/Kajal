import { DailyAttendanceRecord, PeriodAttendanceRecord } from '../stores/attendanceStore';

export class AttendanceService {
  static async getDailyAttendance(): Promise<DailyAttendanceRecord[]> {
    const saved = localStorage.getItem('galaxy_attendance_daily');
    if (saved) return JSON.parse(saved);
    return [];
  }

  static async getPeriodAttendance(): Promise<PeriodAttendanceRecord[]> {
    const saved = localStorage.getItem('galaxy_attendance_period');
    if (saved) return JSON.parse(saved);
    return [];
  }
}
