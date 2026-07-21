import { ExtendedStudent } from '../stores/studentStore';

export class PromotionService {
  static evaluatePromotion(student: ExtendedStudent): { 
    status: 'recommended' | 'under-review' | 'deferred'; 
    reasons: string[]; 
    gpaScore: number;
    attendanceScore: number;
    behaviorScore: number;
  } {
    const reasons: string[] = [];
    const gpaScore = student.gpa;
    const attendanceScore = student.attendanceRate;
    const behaviorScore = student.behaviourScore;

    if (gpaScore < 2.0) {
      reasons.push('GPA is below passing average (2.0)');
    }
    if (attendanceScore < 75.0) {
      reasons.push('Attendance is below the statutory requirement (75%)');
    }
    if (behaviorScore < 85) {
      reasons.push('Unresolved disciplinary logs or low classroom behaviour index');
    }

    let status: 'recommended' | 'under-review' | 'deferred' = 'recommended';
    if (gpaScore < 1.5 || attendanceScore < 60) {
      status = 'deferred';
    } else if (reasons.length > 0) {
      status = 'under-review';
    }

    return {
      status,
      reasons: reasons.length > 0 ? reasons : ['Meets all academic, attendance, and moral standards of the institution.'],
      gpaScore,
      attendanceScore,
      behaviorScore
    };
  }
}
