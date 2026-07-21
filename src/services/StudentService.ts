import { ExtendedStudent, INITIAL_EXTENDED_STUDENTS } from '../stores/studentStore';

export class StudentService {
  static async getStudents(): Promise<ExtendedStudent[]> {
    const saved = localStorage.getItem('galaxy_extended_students');
    return saved ? JSON.parse(saved) : INITIAL_EXTENDED_STUDENTS;
  }

  static async getStudentById(id: string): Promise<ExtendedStudent | null> {
    const students = await this.getStudents();
    return students.find(s => s.id === id) || null;
  }

  static async saveStudents(students: ExtendedStudent[]): Promise<void> {
    localStorage.setItem('galaxy_extended_students', JSON.stringify(students));
  }
}
