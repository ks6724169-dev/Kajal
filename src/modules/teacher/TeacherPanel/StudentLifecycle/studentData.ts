export interface StudentRecord {
  id: string;
  rollNumber: string;
  admissionNumber: string;
  name: string;
  class: string;
  section: string;
  gender: 'Male' | 'Female' | 'Other';
  category: 'General' | 'OBC' | 'SC' | 'ST';
  bloodGroup: string;
  status: 'Active' | 'Inactive' | 'Suspended' | 'Alumni';
  attendancePercentage: number;
  behaviourStatus: 'Excellent' | 'Good' | 'Needs Attention' | 'Critical';
  healthStatus: 'Fit' | 'Medical Condition' | 'Allergy';
  academicStanding: 'Gifted' | 'Above Average' | 'Average' | 'Weak';
  parentName: string;
  parentPhone: string;
  parentEmail: string;
  address: string;
  house: 'Ruby' | 'Sapphire' | 'Emerald' | 'Topaz';
  club: 'Science Club' | 'Coding Club' | 'Literary Club' | 'Sports Club' | 'Arts Club';
  photo: string;
  medicalNotes?: string;
  counsellingNotes?: string;
}

export const initialStudents: StudentRecord[] = [
  {
    id: 'st-1',
    rollNumber: '101',
    admissionNumber: 'ADM-2023-001',
    name: 'Aarav Sharma',
    class: 'Grade 10',
    section: 'A',
    gender: 'Male',
    category: 'General',
    bloodGroup: 'B+',
    status: 'Active',
    attendancePercentage: 96,
    behaviourStatus: 'Excellent',
    healthStatus: 'Fit',
    academicStanding: 'Gifted',
    parentName: 'Rajesh Sharma',
    parentPhone: '+91 98765 43210',
    parentEmail: 'rajesh.sharma@example.com',
    address: '42, Park Avenue, New Delhi',
    house: 'Sapphire',
    club: 'Coding Club',
    photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    medicalNotes: 'No allergies.',
    counsellingNotes: 'Highly motivated in STEM subjects.'
  },
  {
    id: 'st-2',
    rollNumber: '102',
    admissionNumber: 'ADM-2023-002',
    name: 'Ananya Patel',
    class: 'Grade 10',
    section: 'A',
    gender: 'Female',
    category: 'General',
    bloodGroup: 'O+',
    status: 'Active',
    attendancePercentage: 92,
    behaviourStatus: 'Good',
    healthStatus: 'Fit',
    academicStanding: 'Above Average',
    parentName: 'Sanjay Patel',
    parentPhone: '+91 98765 43211',
    parentEmail: 'sanjay.patel@example.com',
    address: '15, MG Road, Mumbai',
    house: 'Ruby',
    club: 'Science Club',
    photo: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150',
    medicalNotes: 'Mild asthma during winters.',
    counsellingNotes: 'Doing exceptionally well in Biology.'
  },
  {
    id: 'st-3',
    rollNumber: '103',
    admissionNumber: 'ADM-2023-003',
    name: 'Rohan Gupta',
    class: 'Grade 10',
    section: 'B',
    gender: 'Male',
    category: 'OBC',
    bloodGroup: 'A+',
    status: 'Active',
    attendancePercentage: 78,
    behaviourStatus: 'Needs Attention',
    healthStatus: 'Fit',
    academicStanding: 'Weak',
    parentName: 'Vikram Gupta',
    parentPhone: '+91 98765 43212',
    parentEmail: 'vikram.gupta@example.com',
    address: '88, Civil Lines, Jaipur',
    house: 'Emerald',
    club: 'Sports Club',
    photo: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150',
    medicalNotes: 'None.',
    counsellingNotes: 'Requires remedial classes in Mathematics and Physics.'
  },
  {
    id: 'st-4',
    rollNumber: '104',
    admissionNumber: 'ADM-2023-004',
    name: 'Priya Iyer',
    class: 'Grade 10',
    section: 'A',
    gender: 'Female',
    category: 'General',
    bloodGroup: 'AB+',
    status: 'Active',
    attendancePercentage: 98,
    behaviourStatus: 'Excellent',
    healthStatus: 'Fit',
    academicStanding: 'Gifted',
    parentName: 'Venkat Iyer',
    parentPhone: '+91 98765 43213',
    parentEmail: 'venkat.iyer@example.com',
    address: '12, Anna Salai, Chennai',
    house: 'Topaz',
    club: 'Literary Club',
    photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    medicalNotes: 'None.',
    counsellingNotes: 'School debate captain.'
  },
  {
    id: 'st-5',
    rollNumber: '105',
    admissionNumber: 'ADM-2023-005',
    name: 'Kabir Khan',
    class: 'Grade 9',
    section: 'A',
    gender: 'Male',
    category: 'General',
    bloodGroup: 'B-',
    status: 'Active',
    attendancePercentage: 88,
    behaviourStatus: 'Good',
    healthStatus: 'Medical Condition',
    academicStanding: 'Average',
    parentName: 'Zainab Khan',
    parentPhone: '+91 98765 43214',
    parentEmail: 'zainab.khan@example.com',
    address: '76, Residency Road, Bengaluru',
    house: 'Ruby',
    club: 'Arts Club',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    medicalNotes: 'Allergic to peanuts.',
    counsellingNotes: 'Creative in painting and graphic arts.'
  },
  {
    id: 'st-6',
    rollNumber: '106',
    admissionNumber: 'ADM-2023-006',
    name: 'Sneha Verma',
    class: 'Grade 9',
    section: 'B',
    gender: 'Female',
    category: 'SC',
    bloodGroup: 'O-',
    status: 'Active',
    attendancePercentage: 94,
    behaviourStatus: 'Excellent',
    healthStatus: 'Fit',
    academicStanding: 'Above Average',
    parentName: 'Alok Verma',
    parentPhone: '+91 98765 43215',
    parentEmail: 'alok.verma@example.com',
    address: '33, Mall Road, Kanpur',
    house: 'Sapphire',
    club: 'Science Club',
    photo: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150',
    medicalNotes: 'None.',
    counsellingNotes: 'Consistent academic performer.'
  },
  {
    id: 'st-7',
    rollNumber: '107',
    admissionNumber: 'ADM-2023-007',
    name: 'Tanmay Das',
    class: 'Grade 8',
    section: 'A',
    gender: 'Male',
    category: 'General',
    bloodGroup: 'A-',
    status: 'Active',
    attendancePercentage: 82,
    behaviourStatus: 'Needs Attention',
    healthStatus: 'Fit',
    academicStanding: 'Weak',
    parentName: 'Subir Das',
    parentPhone: '+91 98765 43216',
    parentEmail: 'subir.das@example.com',
    address: '50, Park Street, Kolkata',
    house: 'Emerald',
    club: 'Sports Club',
    photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    medicalNotes: 'None.',
    counsellingNotes: 'Easily distracted during lectures.'
  },
  {
    id: 'st-8',
    rollNumber: '108',
    admissionNumber: 'ADM-2023-008',
    name: 'Meera Nair',
    class: 'Grade 8',
    section: 'B',
    gender: 'Female',
    category: 'General',
    bloodGroup: 'B+',
    status: 'Active',
    attendancePercentage: 99,
    behaviourStatus: 'Excellent',
    healthStatus: 'Fit',
    academicStanding: 'Gifted',
    parentName: 'Ramesh Nair',
    parentPhone: '+91 98765 43217',
    parentEmail: 'ramesh.nair@example.com',
    address: '19, MG Road, Kochi',
    house: 'Topaz',
    club: 'Literary Club',
    photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
    medicalNotes: 'None.',
    counsellingNotes: 'Exceptionally talented in Mathematics and Chess.'
  }
];
