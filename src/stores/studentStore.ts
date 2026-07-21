import { useState, useEffect } from 'react';

export interface BehaviourLog {
  id: string;
  category: 'positive' | 'negative';
  title: string;
  points: number;
  description: string;
  date: string;
  reportedBy: string;
}

export interface DisciplineRecord {
  id: string;
  severity: 'low' | 'medium' | 'high';
  incident: string;
  actionTaken: string;
  date: string;
  status: 'resolved' | 'pending' | 'under-review';
  reportedBy: string;
}

export interface CounsellingLog {
  id: string;
  sessionType: string;
  notes: string;
  recommendations: string;
  date: string;
  counsellor: string;
  followUpDate?: string;
}

export interface HealthRecord {
  height: string;
  weight: string;
  bloodGroup: string;
  allergies: string[];
  medicalConditions: string[];
  lastCheckupDate: string;
  vaccinations: { name: string; date: string; status: 'completed' | 'pending' }[];
}

export interface StudentDocument {
  id: string;
  name: string;
  category: 'Admission Form' | 'Transfer Certificate' | 'Report Card' | 'Medical Cert' | 'ID Proof';
  fileUrl: string;
  uploadedAt: string;
  size: string;
}

export interface ParentInfo {
  fatherName: string;
  fatherOccupation: string;
  fatherPhone: string;
  motherName: string;
  motherOccupation: string;
  motherPhone: string;
  emergencyContact: string;
  address: string;
}

export interface ExtendedStudent {
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
  
  // Enterprise Extensions
  house: 'Red Gryphons' | 'Blue Krakens' | 'Green Hydras' | 'Gold Phoenixes';
  club: 'Coding & AI Club' | 'Robotics Society' | 'Debate & Oratory' | 'Drama & Arts' | 'Eco Warriors';
  behaviourScore: number; // starts at 100
  behaviourLogs: BehaviourLog[];
  disciplineRecords: DisciplineRecord[];
  counsellingLogs: CounsellingLog[];
  healthRecord: HealthRecord;
  documents: StudentDocument[];
  parentInfo: ParentInfo;
  timeline: { id: string; event: string; description: string; date: string; type: 'academic' | 'activity' | 'discipline' | 'health' }[];
  isWeak: boolean;
  isGifted: boolean;
  promotionStatus: 'recommended' | 'under-review' | 'deferred';
  portfolioSummary: string;
}

// Complete enterprise mock data
export const INITIAL_EXTENDED_STUDENTS: ExtendedStudent[] = [
  {
    id: 's_1',
    admissionNo: 'APEX2026101',
    name: 'Aarav Sharma',
    grade: 'Grade 11',
    section: 'A',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150',
    parentName: 'Mr. Devendra Sharma',
    phone: '+91 98765 43210',
    email: 'aarav.sharma@apex.edu',
    feeStatus: 'paid',
    feeDueAmount: 0,
    attendanceRate: 94.2,
    gpa: 3.85,
    busRoute: 'Route #4 (Vasant Kunj)',
    house: 'Gold Phoenixes',
    club: 'Coding & AI Club',
    behaviourScore: 105,
    behaviourLogs: [
      { id: 'b_1', category: 'positive', title: 'Excellent Coding Mentorship', points: 5, description: 'Mentored Class 9 students during the introductory Python workshop.', date: '2026-07-10', reportedBy: 'Dr. Rajesh Sharma' },
      { id: 'b_2', category: 'positive', title: 'Active Class Participation', points: 2, description: 'Participated outstandingly in Multivariate Calculus sessions.', date: '2026-07-14', reportedBy: 'Mrs. Aditi Sen' }
    ],
    disciplineRecords: [],
    counsellingLogs: [
      { id: 'c_1', sessionType: 'Career Advisory', notes: 'Expressed strong interest in Computer Science and Applied Mathematics. Discussed ivy league admission requirements.', recommendations: 'Recommend enrolling in Advanced Placement courses.', date: '2026-06-18', counsellor: 'Ms. Sunita Roy' }
    ],
    healthRecord: {
      height: '172 cm',
      weight: '64 kg',
      bloodGroup: 'O+',
      allergies: ['Peanuts'],
      medicalConditions: [],
      lastCheckupDate: '2026-04-12',
      vaccinations: [
        { name: 'Tdap booster', date: '2025-05-10', status: 'completed' },
        { name: 'Meningococcal', date: '2025-11-20', status: 'completed' }
      ]
    },
    documents: [
      { id: 'doc_1', name: 'Original Admission Form.pdf', category: 'Admission Form', fileUrl: '#', uploadedAt: '2025-04-10', size: '2.4 MB' },
      { id: 'doc_2', name: 'Grade 10 Marksheet.pdf', category: 'Report Card', fileUrl: '#', uploadedAt: '2025-04-10', size: '1.8 MB' }
    ],
    parentInfo: {
      fatherName: 'Mr. Devendra Sharma',
      fatherOccupation: 'Software Architect',
      fatherPhone: '+91 98765 43210',
      motherName: 'Mrs. Neela Sharma',
      motherOccupation: 'Pediatrician',
      motherPhone: '+91 98765 43211',
      emergencyContact: 'Mr. Devendra Sharma (+91 98765 43210)',
      address: 'Pocket C-8, Sector D, Vasant Kunj, New Delhi'
    },
    timeline: [
      { id: 't_1', event: 'Enrolled in Galaxy Academy', description: 'Formally admitted into Grade 11-A', date: '2025-04-10', type: 'academic' },
      { id: 't_2', event: 'First Place in Inter-School Hackathon', description: 'Represented Galaxy Academy and won Gold', date: '2026-05-15', type: 'activity' },
      { id: 't_3', event: 'Annual Physical Fitness Audit', description: 'Passed fitness tests with outstanding stamina index', date: '2026-06-11', type: 'health' }
    ],
    isWeak: false,
    isGifted: true,
    promotionStatus: 'recommended',
    portfolioSummary: 'Highly proactive student, excels in technological challenges, algorithms, mathematics, and peer mentoring.'
  },
  {
    id: 's_2',
    admissionNo: 'APEX2026102',
    name: 'Ishaan Verma',
    grade: 'Grade 11',
    section: 'B',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150',
    parentName: 'Mr. Rajeev Verma',
    phone: '+91 98101 23456',
    email: 'ishaan.verma@apex.edu',
    feeStatus: 'pending',
    feeDueAmount: 35000,
    attendanceRate: 74.5,
    gpa: 2.10,
    busRoute: 'Route #12 (Dwarka)',
    house: 'Blue Krakens',
    club: 'Eco Warriors',
    behaviourScore: 82,
    behaviourLogs: [
      { id: 'b_3', category: 'negative', title: 'Unexcused Classroom Absence', points: -5, description: 'Found in cafeteria during Physics class hours without permission.', date: '2026-07-08', reportedBy: 'Mr. Rakesh Kapoor' },
      { id: 'b_4', category: 'negative', title: 'Disruptive Behaviour in Lab', points: -3, description: 'Threw laboratory paper towels across the room.', date: '2026-07-12', reportedBy: 'Mrs. Aditi Sen' }
    ],
    disciplineRecords: [
      { id: 'd_1', severity: 'medium', incident: 'Skipping Physics session and ignoring teacher instructions.', actionTaken: 'Parent teacher meet scheduled and official warning issued.', date: '2026-07-09', status: 'pending', reportedBy: 'Mr. Rakesh Kapoor' }
    ],
    counsellingLogs: [
      { id: 'c_2', sessionType: 'Behaviour Correction', notes: 'Student expressed fatigue and lack of focus. Admitted to playing video games late into the night. Discussed sleep hygiene.', recommendations: 'Mandatory follow up on attendance, limit device screen-time.', date: '2026-07-11', counsellor: 'Ms. Sunita Roy', followUpDate: '2026-07-25' }
    ],
    healthRecord: {
      height: '168 cm',
      weight: '58 kg',
      bloodGroup: 'AB-',
      allergies: ['Dust', 'Pollen'],
      medicalConditions: ['Mild Asthma'],
      lastCheckupDate: '2026-03-20',
      vaccinations: [
        { name: 'Tdap booster', date: '2024-11-15', status: 'completed' },
        { name: 'Flu Shot', date: '2025-10-05', status: 'completed' }
      ]
    },
    documents: [
      { id: 'doc_3', name: 'Transfer Certificate_Ishaan.pdf', category: 'Transfer Certificate', fileUrl: '#', uploadedAt: '2025-06-12', size: '1.2 MB' },
      { id: 'doc_4', name: 'Medical Clearance Certificate.pdf', category: 'Medical Cert', fileUrl: '#', uploadedAt: '2025-06-12', size: '950 KB' }
    ],
    parentInfo: {
      fatherName: 'Mr. Rajeev Verma',
      fatherOccupation: 'Business Owner',
      fatherPhone: '+91 98101 23456',
      motherName: 'Mrs. Vandana Verma',
      motherOccupation: 'Fashion Designer',
      motherPhone: '+91 98101 23457',
      emergencyContact: 'Mr. Rajeev Verma (+91 98101 23456)',
      address: 'Flat 402, Sector 12, Dwarka, New Delhi'
    },
    timeline: [
      { id: 't_4', event: 'Admitted with Transfer Credit', description: 'Transferred from Delhi Public School', date: '2025-06-12', type: 'academic' },
      { id: 't_5', event: 'Disciplinary Incident Record', description: 'Skipped sessions and received warning card', date: '2026-07-09', type: 'discipline' }
    ],
    isWeak: true,
    isGifted: false,
    promotionStatus: 'under-review',
    portfolioSummary: 'Requires consistent monitoring. Has immense potential but distracted by gaming and attendance slippage.'
  },
  {
    id: 's_3',
    admissionNo: 'APEX2026103',
    name: 'Priya Iyer',
    grade: 'Grade 12',
    section: 'A',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150',
    parentName: 'Mrs. Meenakshi Iyer',
    phone: '+91 99555 12345',
    email: 'priya.iyer@apex.edu',
    feeStatus: 'paid',
    feeDueAmount: 0,
    attendanceRate: 98.4,
    gpa: 3.98,
    busRoute: 'Route #4 (Vasant Kunj)',
    house: 'Red Gryphons',
    club: 'Debate & Oratory',
    behaviourScore: 110,
    behaviourLogs: [
      { id: 'b_5', category: 'positive', title: 'National Level Oratorical Triumph', points: 10, description: 'Won first runner-up at the National Youth Mock Parliament competition.', date: '2026-06-25', reportedBy: 'Mr. Alok Tripathi' }
    ],
    disciplineRecords: [],
    counsellingLogs: [],
    healthRecord: {
      height: '165 cm',
      weight: '52 kg',
      bloodGroup: 'B+',
      allergies: [],
      medicalConditions: [],
      lastCheckupDate: '2026-05-18',
      vaccinations: [
        { name: 'HPV Vaccine', date: '2025-02-12', status: 'completed' }
      ]
    },
    documents: [
      { id: 'doc_5', name: 'National Parliament Certificate.pdf', category: 'ID Proof', fileUrl: '#', uploadedAt: '2026-06-28', size: '3.1 MB' }
    ],
    parentInfo: {
      fatherName: 'Mr. Raman Iyer',
      fatherOccupation: 'Executive Director (RBI)',
      fatherPhone: '+91 99555 12344',
      motherName: 'Mrs. Meenakshi Iyer',
      motherOccupation: 'Professor of Literature',
      motherPhone: '+91 99555 12345',
      emergencyContact: 'Mrs. Meenakshi Iyer (+91 99555 12345)',
      address: 'RBI Enclave, Sector 5, Dwarka, New Delhi'
    },
    timeline: [
      { id: 't_6', event: 'Appointed House Prefect', description: 'Elected leader for Red Gryphons', date: '2026-04-15', type: 'activity' },
      { id: 't_7', event: 'Youth Parliament Award', description: 'Acclaimed National Orator of the Year', date: '2026-06-25', type: 'activity' }
    ],
    isWeak: false,
    isGifted: true,
    promotionStatus: 'recommended',
    portfolioSummary: 'Brilliant student, outstanding linguistic skills, public speaking capability, and consistent topper in academic grade charts.'
  },
  {
    id: 's_4',
    admissionNo: 'APEX2026104',
    name: 'Kabir Mehta',
    grade: 'Grade 10',
    section: 'A',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    parentName: 'Mr. Anil Mehta',
    phone: '+91 98989 98989',
    email: 'kabir.mehta@apex.edu',
    feeStatus: 'overdue',
    feeDueAmount: 48000,
    attendanceRate: 88.5,
    gpa: 2.75,
    busRoute: 'Route #1 (Green Park)',
    house: 'Green Hydras',
    club: 'Drama & Arts',
    behaviourScore: 98,
    behaviourLogs: [
      { id: 'b_6', category: 'positive', title: 'Art Exhibition Design', points: 3, description: 'Helped design the visual brochures for the annual theater festival.', date: '2026-07-02', reportedBy: 'Ms. Clara D\'Souza' }
    ],
    disciplineRecords: [],
    counsellingLogs: [],
    healthRecord: {
      height: '160 cm',
      weight: '50 kg',
      bloodGroup: 'A-',
      allergies: ['Penicillin'],
      medicalConditions: [],
      lastCheckupDate: '2026-02-15',
      vaccinations: []
    },
    documents: [],
    parentInfo: {
      fatherName: 'Mr. Anil Mehta',
      fatherOccupation: 'Real Estate Developer',
      fatherPhone: '+91 98989 98989',
      motherName: 'Mrs. Ritu Mehta',
      motherOccupation: 'Homemaker',
      motherPhone: '+91 98989 98988',
      emergencyContact: 'Mr. Anil Mehta (+91 98989 98989)',
      address: '22, Green Park Main, New Delhi'
    },
    timeline: [
      { id: 't_8', event: 'Art Festival Anchor', description: 'Coordinated secondary visual design sets', date: '2026-07-04', type: 'activity' }
    ],
    isWeak: false,
    isGifted: false,
    promotionStatus: 'recommended',
    portfolioSummary: 'Highly artistic, moderate in sciences and math, requires slight nudge in homework submissions and due fee clearances.'
  },
  {
    id: 's_5',
    admissionNo: 'APEX2026105',
    name: 'Ananya Goel',
    grade: 'Grade 9',
    section: 'C',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    parentName: 'Mr. Sanjay Goel',
    phone: '+91 98111 88888',
    email: 'ananya.goel@apex.edu',
    feeStatus: 'paid',
    feeDueAmount: 0,
    attendanceRate: 91.0,
    gpa: 2.30,
    busRoute: 'Route #12 (Dwarka)',
    house: 'Blue Krakens',
    club: 'Eco Warriors',
    behaviourScore: 95,
    behaviourLogs: [],
    disciplineRecords: [],
    counsellingLogs: [
      { id: 'c_3', sessionType: 'Academic Counselling', notes: 'Identified gaps in basic algebraic fundamentals and graphing. Student is motivated but lacks study structure.', recommendations: 'Recommend attending remedial math worksheets twice a week.', date: '2026-07-05', counsellor: 'Ms. Sunita Roy' }
    ],
    healthRecord: {
      height: '154 cm',
      weight: '44 kg',
      bloodGroup: 'O-',
      allergies: [],
      medicalConditions: [],
      lastCheckupDate: '2026-01-10',
      vaccinations: []
    },
    documents: [],
    parentInfo: {
      fatherName: 'Mr. Sanjay Goel',
      fatherOccupation: 'Chartered Accountant',
      fatherPhone: '+91 98111 88888',
      motherName: 'Mrs. Deepa Goel',
      motherOccupation: 'Bank Manager',
      motherPhone: '+91 98111 88887',
      emergencyContact: 'Mr. Sanjay Goel (+91 98111 88888)',
      address: 'H-35, Sector 10, Dwarka, New Delhi'
    },
    timeline: [
      { id: 't_9', event: 'Remedial Course Enrollment', description: 'Enrolled in Special Math Support sessions', date: '2026-07-06', type: 'academic' }
    ],
    isWeak: true,
    isGifted: false,
    promotionStatus: 'recommended',
    portfolioSummary: 'Shows active interest in environmental workshops, working slowly to improve math algebra scores.'
  }
];

// Custom local hook mimicking state storage
export const useStudentStore = () => {
  const [students, setStudents] = useState<ExtendedStudent[]>(() => {
    const saved = localStorage.getItem('galaxy_extended_students');
    return saved ? JSON.parse(saved) : INITIAL_EXTENDED_STUDENTS;
  });

  const [selectedStudentId, setSelectedStudentId] = useState<string>(() => {
    return localStorage.getItem('galaxy_selected_student_id') || 's_1';
  });

  useEffect(() => {
    localStorage.setItem('galaxy_extended_students', JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem('galaxy_selected_student_id', selectedStudentId);
  }, [selectedStudentId]);

  const addStudent = (newStud: Omit<ExtendedStudent, 'id' | 'admissionNo' | 'behaviourScore' | 'behaviourLogs' | 'disciplineRecords' | 'counsellingLogs' | 'healthRecord' | 'documents' | 'timeline'>) => {
    const fresh: ExtendedStudent = {
      ...newStud,
      id: `s_${Date.now()}`,
      admissionNo: `APEX2026${Math.floor(100 + Math.random() * 899)}`,
      behaviourScore: 100,
      behaviourLogs: [],
      disciplineRecords: [],
      counsellingLogs: [],
      healthRecord: {
        height: '165 cm',
        weight: '55 kg',
        bloodGroup: 'B+',
        allergies: [],
        medicalConditions: [],
        lastCheckupDate: new Date().toISOString().split('T')[0],
        vaccinations: []
      },
      documents: [],
      timeline: [
        { id: `t_${Date.now()}`, event: 'Enrolled Online via SIS', description: 'Admitted into current academic cycle', date: new Date().toISOString().split('T')[0], type: 'academic' }
      ]
    };
    setStudents(prev => [fresh, ...prev]);
    return fresh;
  };

  const updateStudent = (id: string, updated: Partial<ExtendedStudent>) => {
    setStudents(prev => prev.map(s => s.id === id ? { ...s, ...updated } : s));
  };

  const addBehaviourLog = (studId: string, log: Omit<BehaviourLog, 'id' | 'date'>) => {
    setStudents(prev => prev.map(s => {
      if (s.id !== studId) return s;
      const newLog: BehaviourLog = {
        ...log,
        id: `b_${Date.now()}`,
        date: new Date().toISOString().split('T')[0]
      };
      const scoreMod = log.points;
      return {
        ...s,
        behaviourScore: s.behaviourScore + scoreMod,
        behaviourLogs: [newLog, ...s.behaviourLogs],
        timeline: [
          { id: `t_${Date.now()}`, event: `Behaviour updated: ${log.title}`, description: log.description, date: new Date().toISOString().split('T')[0], type: 'discipline' },
          ...s.timeline
        ]
      };
    }));
  };

  const addDisciplineRecord = (studId: string, record: Omit<DisciplineRecord, 'id' | 'date'>) => {
    setStudents(prev => prev.map(s => {
      if (s.id !== studId) return s;
      const newRec: DisciplineRecord = {
        ...record,
        id: `d_${Date.now()}`,
        date: new Date().toISOString().split('T')[0]
      };
      return {
        ...s,
        disciplineRecords: [newRec, ...s.disciplineRecords],
        timeline: [
          { id: `t_${Date.now()}`, event: `Disciplinary Incident: ${record.incident}`, description: record.actionTaken, date: new Date().toISOString().split('T')[0], type: 'discipline' },
          ...s.timeline
        ]
      };
    }));
  };

  const addCounsellingLog = (studId: string, log: Omit<CounsellingLog, 'id' | 'date'>) => {
    setStudents(prev => prev.map(s => {
      if (s.id !== studId) return s;
      const newLog: CounsellingLog = {
        ...log,
        id: `cl_${Date.now()}`,
        date: new Date().toISOString().split('T')[0]
      };
      return {
        ...s,
        counsellingLogs: [newLog, ...s.counsellingLogs],
        timeline: [
          { id: `t_${Date.now()}`, event: `Counselling Session (${log.sessionType})`, description: log.notes, date: new Date().toISOString().split('T')[0], type: 'academic' },
          ...s.timeline
        ]
      };
    }));
  };

  return {
    students,
    selectedStudentId,
    setSelectedStudentId,
    addStudent,
    updateStudent,
    addBehaviourLog,
    addDisciplineRecord,
    addCounsellingLog
  };
};
