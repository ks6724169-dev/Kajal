export type Role = 'super_admin' | 'principal' | 'teacher' | 'student' | 'parent' | 'driver';

export type Tenant = {
  id: string;
  name: string;
  type: 'school' | 'college' | 'university' | 'k12';
  logo: string;
  currency: string;
  academicYear: string;
  themeColor: string;
};

export type Student = {
  id: string;
  admissionNo: string;
  name: string;
  grade: string;
  section: string;
  avatar: string;
  parentName: string;
  phone: string;
  email: string;
  feeStatus: 'paid' | 'pending' | 'overdue';
  feeDueAmount: number;
  attendanceRate: number;
  gpa: number;
  busRoute: string;
};

export type Teacher = {
  id: string;
  employeeId: string;
  name: string;
  subject: string;
  department: string;
  email: string;
  phone: string;
  classesAssigned: string[];
  salary: number;
  attendanceToday: 'present' | 'absent' | 'leave';
};

export type FeeRecord = {
  id: string;
  studentId: string;
  studentName: string;
  grade: string;
  category: 'Tuition' | 'Transport' | 'Hostel' | 'Library' | 'Lab';
  amount: number;
  dueDate: string;
  status: 'Paid' | 'Pending' | 'Overdue';
  paidDate?: string;
  transactionRef?: string;
};

export type BusRoute = {
  busId: string;
  busNo: string;
  routeTitle: string;
  driverName: string;
  driverPhone: string;
  currentLocation: string;
  speed: number;
  lat: number;
  lng: number;
  studentsCount: number;
  status: 'On Time' | 'Delayed' | 'Arrived';
};

export type ExamRecord = {
  id: string;
  examName: string;
  subject: string;
  grade: string;
  date: string;
  totalMarks: number;
  averageScore: number;
  status: 'Completed' | 'Upcoming' | 'Evaluating';
};

export type LibraryBook = {
  id: string;
  isbn: string;
  title: string;
  author: string;
  category: string;
  totalCopies: number;
  availableCopies: number;
};

export type AiChatMessage = {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
};
