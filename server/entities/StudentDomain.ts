import { BaseEntity } from './BaseEntity.js';
import { Address } from '../shared/address/AddressEngine.js';

export enum StudentStatus {
  ENQUIRY = 'ENQUIRY',
  APPLIED = 'APPLIED',
  VERIFIED = 'VERIFIED',
  ADMITTED = 'ADMITTED',
  ACTIVE = 'ACTIVE',
  TRANSFERRED = 'TRANSFERRED',
  SUSPENDED = 'SUSPENDED',
  GRADUATED = 'GRADUATED',
  ALUMNI = 'ALUMNI',
  DROPPED = 'DROPPED'
}

export interface Parent extends BaseEntity {
  family_id?: string;
  type: 'FATHER' | 'MOTHER' | 'GUARDIAN';
  firstName: string;
  lastName: string;
  email?: string;
  phone: string;
  occupation?: string;
  isEmergencyContact: boolean;
  isPickupAuthorized: boolean;
}

export interface Family extends BaseEntity {
  name: string;
  householdAddress?: Address;
}

export interface Student extends BaseEntity {
  family_id?: string;
  firstName: string;
  lastName: string;
  studentId: string;
  admissionNumber: string;
  rollNumber?: string;
  academicNumber?: string;
  boardRegistration?: string;
  aadhaar?: string;
  passport?: string;
  bloodGroup?: string;
  religion?: string;
  category?: string;
  nationality?: string;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  dateOfBirth: Date;
  photoUrl?: string;
  biometricId?: string;
  rfid?: string;
  faceRecognitionId?: string;
  academicStatus: StudentStatus;
}
