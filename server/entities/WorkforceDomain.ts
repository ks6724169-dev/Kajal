import { BaseEntity } from './BaseEntity.js';
import { Address } from '../shared/address/AddressEngine.js';

export enum EmploymentStatus {
  ACTIVE = 'ACTIVE',
  PROBATION = 'PROBATION',
  NOTICE = 'NOTICE',
  SUSPENDED = 'SUSPENDED',
  RETIRED = 'RETIRED',
  RESIGNED = 'RESIGNED',
  ALUMNI = 'ALUMNI'
}

export interface Employee extends BaseEntity {
  employeeId: string;
  employmentNumber: string;
  firstName: string;
  lastName: string;
  officialEmail: string;
  personalEmail?: string;
  phone: string;
  emergencyContacts?: Record<string, string>;
  bloodGroup?: string;
  dateOfBirth: Date;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  maritalStatus?: string;
  nationality?: string;
  religion?: string;
  address?: Address;
  photoUrl?: string;
  biometricId?: string;
  rfid?: string;
  faceRecognitionId?: string;
  digitalSignatureUrl?: string;
  fido2Registration?: any;
  employmentStatus: EmploymentStatus;
}

export interface Teacher extends BaseEntity {
  employee_id: string; // Ref Employee
  teacherNumber: string;
  qualifications: string[];
  experienceYears: number;
  skills: string[];
  subjects: string[];
  teachingLanguages: string[];
  boardCertifications: string[];
  achievements: string[];
  research: string[];
  awards: string[];
  professionalMembership: string[];
  aiTeachingProfile?: string;
  digitalPortfolioUrl?: string;
}

export interface EmployeeAttendance extends BaseEntity {
  employee_id: string;
  date: string;
  status: 'PRESENT' | 'ABSENT' | 'LATE' | 'HALF_DAY';
  source: 'MANUAL' | 'BIOMETRIC' | 'RFID' | 'FACE' | 'GPS';
  workHours?: number;
  overtimeHours?: number;
  shiftMapping?: string;
  isLocked: boolean;
  approvedBy?: string;
}

export interface EmployeeLeave extends BaseEntity {
  employee_id: string;
  leaveType: string;
  startDate: string;
  endDate: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  approvedBy?: string;
  reason: string;
}

export interface PerformanceReview extends BaseEntity {
  employee_id: string;
  reviewDate: Date;
  kpiScore: number;
  okrProgress: number;
  reviewer_id: string;
  comments: string;
  trainingRecommendation?: string;
  promotionRecommendation?: boolean;
}

export interface TrainingCourse extends BaseEntity {
  name: string;
  description: string;
  learningHours: number;
  certification?: string;
}

export interface EmployeeTraining extends BaseEntity {
  employee_id: string;
  course_id: string;
  status: 'ENROLLED' | 'IN_PROGRESS' | 'COMPLETED' | 'CERTIFIED';
  completionDate?: Date;
}

export interface EmployeeDocument extends BaseEntity {
  employee_id: string;
  documentType: 'IDENTITY' | 'QUALIFICATION' | 'EXPERIENCE' | 'JOINING_LETTER' | 'CONTRACT' | 'MEDICAL' | 'POLICE_VERIFICATION' | 'BACKGROUND_REPORT';
  fileUrl: string;
  ocrMetadata?: any;
  verificationStatus: 'PENDING' | 'VERIFIED' | 'REJECTED';
}

export interface DepartmentAllocation extends BaseEntity {
  employee_id: string;
  department_id: string;
  role: string;
  allocatedDate: Date;
}
