import { HealthRecord } from '../stores/studentStore';

export class HealthService {
  static async getHealthRecord(studentId: string): Promise<HealthRecord | null> {
    const saved = localStorage.getItem('galaxy_extended_students');
    if (!saved) return null;
    const students = JSON.parse(saved);
    const stud = students.find((s: any) => s.id === studentId);
    return stud ? stud.healthRecord : null;
  }
}
