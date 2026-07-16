import { BaseEntity } from './BaseEntity.js';

export enum AttendanceStatus {
  PRESENT = 'PRESENT',
  ABSENT = 'ABSENT',
  LATE = 'LATE',
  HALF_DAY = 'HALF_DAY',
  EXCUSED = 'EXCUSED'
}

export enum AttendanceSource {
  MANUAL = 'MANUAL',
  BIOMETRIC = 'BIOMETRIC',
  RFID = 'RFID',
  FACE = 'FACE',
  GPS = 'GPS'
}

export interface Attendance extends BaseEntity {
  student_id: string;
  date: string;
  status: AttendanceStatus;
  source: AttendanceSource;
  remarks?: string;
  is_locked: boolean;
  approved_by?: string;
}

export interface AttendancePeriod extends BaseEntity {
  attendance_id: string;
  period_number: number;
  status: AttendanceStatus;
}

export interface LeaveRequest extends BaseEntity {
  student_id: string;
  start_date: string;
  end_date: string;
  reason: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  approved_by?: string;
}

export enum BehaviourType {
  POSITIVE = 'POSITIVE',
  NEGATIVE = 'NEGATIVE',
  NEUTRAL = 'NEUTRAL'
}

export interface BehaviourRecord extends BaseEntity {
  student_id: string;
  incident_date: Date;
  type: BehaviourType;
  title: string;
  description: string;
  score_impact: number;
  reported_by: string; // Employee ID
  is_principal_review_required: boolean;
  parent_notified: boolean;
}

export interface HealthRecord extends BaseEntity {
  student_id: string;
  blood_group?: string;
  medical_conditions?: string[];
  allergies?: string[];
  vaccinations?: Record<string, string>; // Vaccine name: Date
  emergency_alerts?: string[];
}

export interface MedicalVisit extends BaseEntity {
  student_id: string;
  visit_date: Date;
  symptoms: string;
  treatment: string;
  doctor_notes?: string;
  referred_to_hospital: boolean;
}

export interface StudentDocument extends BaseEntity {
  student_id: string;
  document_type: 'BIRTH_CERTIFICATE' | 'TC' | 'MIGRATION' | 'AADHAAR' | 'PASSPORT' | 'PHOTO' | 'CERTIFICATE' | 'OTHER';
  file_url: string;
  ocr_metadata?: Record<string, any>;
  verification_status: 'PENDING' | 'VERIFIED' | 'REJECTED';
  verified_by?: string;
}

export interface StudentClub extends BaseEntity {
  student_id: string;
  club_id: string;
  role: string;
  joined_date: Date;
}

export interface StudentHouse extends BaseEntity {
  student_id: string;
  house_id: string;
  allocated_date: Date;
}

export interface MentorAssignment extends BaseEntity {
  student_id: string;
  mentor_id: string; // Employee ID
  assigned_date: Date;
}
