import { ExtendedStudent } from '../stores/studentStore';

export class StudentAnalyticsService {
  static getAnalytics(students: ExtendedStudent[]) {
    const total = students.length;
    const avgGPA = total > 0 ? (students.reduce((acc, s) => acc + s.gpa, 0) / total).toFixed(2) : '0.0';
    const avgAttendance = total > 0 ? (students.reduce((acc, s) => acc + s.attendanceRate, 0) / total).toFixed(1) : '0.0';
    
    const weakStudents = students.filter(s => s.isWeak);
    const giftedStudents = students.filter(s => s.isGifted);
    const promotionReady = students.filter(s => s.promotionStatus === 'recommended');

    const houseStats = students.reduce((acc, s) => {
      acc[s.house] = (acc[s.house] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const clubStats = students.reduce((acc, s) => {
      acc[s.club] = (acc[s.club] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      total,
      avgGPA,
      avgAttendance,
      weakCount: weakStudents.length,
      giftedCount: giftedStudents.length,
      promotionReadyCount: promotionReady.length,
      houseStats,
      clubStats
    };
  }
}
