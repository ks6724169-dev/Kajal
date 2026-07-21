import { BehaviourLog, DisciplineRecord } from '../stores/studentStore';

export class BehaviourService {
  static async getBehaviourLogs(studentId: string): Promise<BehaviourLog[]> {
    const saved = localStorage.getItem('galaxy_extended_students');
    if (!saved) return [];
    const students = JSON.parse(saved);
    const stud = students.find((s: any) => s.id === studentId);
    return stud ? stud.behaviourLogs : [];
  }

  static async getDisciplineRecords(studentId: string): Promise<DisciplineRecord[]> {
    const saved = localStorage.getItem('galaxy_extended_students');
    if (!saved) return [];
    const students = JSON.parse(saved);
    const stud = students.find((s: any) => s.id === studentId);
    return stud ? stud.disciplineRecords : [];
  }
}
