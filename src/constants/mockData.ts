import { Tenant, Student, Teacher, FeeRecord, BusRoute, ExamRecord, LibraryBook } from '../types';

export const TENANTS: Tenant[] = [
  {
    id: 'apex_k12',
    name: 'Apex International K-12 School',
    type: 'k12',
    logo: '🎓',
    currency: '₹',
    academicYear: '2026-2027',
    themeColor: 'indigo',
    city: 'Mumbai',
    state: 'Maharashtra',
    schoolCode: 'apex'
  },
  {
    id: 'galaxy_tech',
    name: 'Galaxy Institute of Technology & Sciences',
    type: 'college',
    logo: '🚀',
    currency: '₹',
    academicYear: '2026-2027',
    themeColor: 'violet',
    city: 'Pune',
    state: 'Maharashtra',
    schoolCode: 'galaxy'
  },
  {
    id: 'st_xaviers',
    name: 'St. Xavier Public Academy',
    type: 'school',
    logo: '🏛️',
    currency: '₹',
    academicYear: '2026-2027',
    themeColor: 'blue',
    city: 'New Delhi',
    state: 'Delhi',
    schoolCode: 'xavier'
  }
];

export const INITIAL_STUDENTS: Student[] = [
  {
    id: 's1',
    admissionNo: 'APEX2026001',
    name: 'Aarav Sharma',
    grade: 'Grade 12-A',
    section: 'A',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150',
    parentName: 'Rajesh Sharma',
    phone: '+91 98765 43210',
    email: 'aarav.s@apex.edu',
    feeStatus: 'paid',
    feeDueAmount: 0,
    attendanceRate: 96.5,
    gpa: 3.8,
    busRoute: 'Route #4 (South Extension)'
  },
  {
    id: 's2',
    admissionNo: 'APEX2026002',
    name: 'Ananya Verma',
    grade: 'Grade 11-B',
    section: 'B',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    parentName: 'Sunita Verma',
    phone: '+91 98765 43211',
    email: 'ananya.v@apex.edu',
    feeStatus: 'pending',
    feeDueAmount: 14500,
    attendanceRate: 92.0,
    gpa: 3.6,
    busRoute: 'Route #2 (Civil Lines)'
  },
  {
    id: 's3',
    admissionNo: 'APEX2026003',
    name: 'Kabir Patel',
    grade: 'B.Tech CSE - 2nd Year',
    section: 'Alpha',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    parentName: 'Manoj Patel',
    phone: '+91 98765 43212',
    email: 'kabir.p@galaxytech.edu',
    feeStatus: 'paid',
    feeDueAmount: 0,
    attendanceRate: 88.4,
    gpa: 3.4,
    busRoute: 'College Shuttle #1'
  },
  {
    id: 's4',
    admissionNo: 'APEX2026004',
    name: 'Diya Sen',
    grade: 'Grade 10-A',
    section: 'A',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150',
    parentName: 'Amit Sen',
    phone: '+91 98765 43213',
    email: 'diya.s@apex.edu',
    feeStatus: 'overdue',
    feeDueAmount: 22000,
    attendanceRate: 94.1,
    gpa: 3.9,
    busRoute: 'Route #1 (Green Park)'
  },
  {
    id: 's5',
    admissionNo: 'APEX2026005',
    name: 'Rohan Mehra',
    grade: 'B.Tech AI & Data Science',
    section: 'Beta',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    parentName: 'Vikram Mehra',
    phone: '+91 98765 43214',
    email: 'rohan.m@galaxytech.edu',
    feeStatus: 'paid',
    feeDueAmount: 0,
    attendanceRate: 91.2,
    gpa: 3.7,
    busRoute: 'College Shuttle #2'
  }
];

export const INITIAL_TEACHERS: Teacher[] = [
  {
    id: 't1',
    employeeId: 'EMP101',
    name: 'Dr. Alok Mukherjee',
    subject: 'Advanced Mathematics & AI',
    department: 'Science & Computing',
    email: 'alok.m@galaxy.edu',
    phone: '+91 99112 23344',
    classesAssigned: ['Grade 12-A', 'B.Tech CSE'],
    salary: 95000,
    attendanceToday: 'present'
  },
  {
    id: 't2',
    employeeId: 'EMP102',
    name: 'Prof. Neha Singhal',
    subject: 'Quantum Physics & Electronics',
    department: 'Physics',
    email: 'neha.s@galaxy.edu',
    phone: '+91 99223 34455',
    classesAssigned: ['Grade 11-B', 'B.Tech ECE'],
    salary: 88000,
    attendanceToday: 'present'
  },
  {
    id: 't3',
    employeeId: 'EMP103',
    name: 'Dr. Rakesh Rane',
    subject: 'Data Structures & Machine Learning',
    department: 'Computer Science',
    email: 'rakesh.r@galaxy.edu',
    phone: '+91 99334 45566',
    classesAssigned: ['B.Tech CSE - 2nd Year'],
    salary: 110000,
    attendanceToday: 'present'
  },
  {
    id: 't4',
    employeeId: 'EMP104',
    name: 'Ms. Priya Swaminathan',
    subject: 'Literature & Creative Writing',
    department: 'Humanities',
    email: 'priya.s@galaxy.edu',
    phone: '+91 99445 56677',
    classesAssigned: ['Grade 10-A', 'Grade 12-A'],
    salary: 75000,
    attendanceToday: 'leave'
  }
];

export const INITIAL_FEES: FeeRecord[] = [
  {
    id: 'f1',
    studentId: 's1',
    studentName: 'Aarav Sharma',
    grade: 'Grade 12-A',
    category: 'Tuition',
    amount: 45000,
    dueDate: '2026-04-10',
    status: 'Paid',
    paidDate: '2026-04-05',
    transactionRef: 'UPI/412589632145'
  },
  {
    id: 'f2',
    studentId: 's2',
    studentName: 'Ananya Verma',
    grade: 'Grade 11-B',
    category: 'Tuition',
    amount: 45000,
    dueDate: '2026-05-15',
    status: 'Pending'
  },
  {
    id: 'f3',
    studentId: 's3',
    studentName: 'Kabir Patel',
    grade: 'B.Tech CSE',
    category: 'Lab',
    amount: 18000,
    dueDate: '2026-04-01',
    status: 'Paid',
    paidDate: '2026-03-28',
    transactionRef: 'UPI/889654123014'
  },
  {
    id: 'f4',
    studentId: 's4',
    studentName: 'Diya Sen',
    grade: 'Grade 10-A',
    category: 'Transport',
    amount: 22000,
    dueDate: '2026-03-15',
    status: 'Overdue'
  }
];

export const INITIAL_BUSES: BusRoute[] = [
  {
    busId: 'b1',
    busNo: 'DL-01-FC-4092',
    routeTitle: 'Route #4 (South Extension -> Campus)',
    driverName: 'Harish Kumar',
    driverPhone: '+91 98111 22334',
    currentLocation: 'Moolchand Flyover (Sector 12)',
    speed: 38,
    lat: 28.5700,
    lng: 77.2200,
    studentsCount: 34,
    status: 'On Time'
  },
  {
    busId: 'b2',
    busNo: 'DL-04-AB-8812',
    routeTitle: 'Route #2 (Civil Lines -> Campus)',
    driverName: 'Suresh Yadav',
    driverPhone: '+91 98222 33445',
    currentLocation: 'Ring Road Crossing (Gate 3)',
    speed: 25,
    lat: 28.6100,
    lng: 77.2000,
    studentsCount: 42,
    status: 'On Time'
  },
  {
    busId: 'b3',
    busNo: 'UP-16-ZZ-9910',
    routeTitle: 'College Shuttle #1 (Metro Station Express)',
    driverName: 'Rajinder Singh',
    driverPhone: '+91 98333 44556',
    currentLocation: 'Tech Hub Interchange',
    speed: 45,
    lat: 28.5355,
    lng: 77.3910,
    studentsCount: 50,
    status: 'On Time'
  }
];

export const INITIAL_EXAMS: ExamRecord[] = [
  {
    id: 'ex1',
    examName: 'Mid-Term Semester Assessment 2026',
    subject: 'Advanced Mathematics',
    grade: 'Grade 12',
    date: '2026-07-20',
    totalMarks: 100,
    averageScore: 78.4,
    status: 'Upcoming'
  },
  {
    id: 'ex2',
    examName: 'AI & Data Structures Finals',
    subject: 'Computer Science',
    grade: 'B.Tech 2nd Year',
    date: '2026-07-15',
    totalMarks: 100,
    averageScore: 84.2,
    status: 'Completed'
  },
  {
    id: 'ex3',
    examName: 'Quantum Mechanics Quiz',
    subject: 'Physics',
    grade: 'Grade 11',
    date: '2026-07-10',
    totalMarks: 50,
    averageScore: 39.1,
    status: 'Evaluating'
  }
];

export const INITIAL_BOOKS: LibraryBook[] = [
  {
    id: 'bk1',
    isbn: '978-0134685991',
    title: 'Artificial Intelligence: A Modern Approach (4th Ed.)',
    author: 'Stuart Russell & Peter Norvig',
    category: 'Computer Science',
    totalCopies: 15,
    availableCopies: 4
  },
  {
    id: 'bk2',
    isbn: '978-0321751042',
    title: 'University Physics with Modern Physics',
    author: 'Young & Freedman',
    category: 'Physics',
    totalCopies: 25,
    availableCopies: 12
  },
  {
    id: 'bk3',
    isbn: '978-1119033325',
    title: 'Advanced Engineering Mathematics',
    author: 'Erwin Kreyszig',
    category: 'Mathematics',
    totalCopies: 30,
    availableCopies: 19
  }
];
