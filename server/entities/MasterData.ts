import { BaseEntity } from './BaseEntity.js';
import { Address } from '../shared/address/AddressEngine.js';

export interface Organization extends BaseEntity {
  name: string;
  code: string;
  registrationNumber: string;
  taxId?: string;
  address: Address;
  contactEmail: string;
  contactPhone: string;
  website?: string;
}

export interface Campus extends BaseEntity {
  organization_id: string; // Ref Organization
  name: string;
  code: string;
  type: 'MAIN' | 'BRANCH' | 'SATELLITE';
  address: Address;
  capacity: number;
}

export interface Department extends BaseEntity {
  campus_id: string;
  name: string;
  code: string;
  head_id?: string; // Ref Employee
}

export interface MasterReference extends BaseEntity {
  type: 'COUNTRY' | 'STATE' | 'DISTRICT' | 'CITY' | 'LANGUAGE' | 'CURRENCY' | 'TIMEZONE' | 'EDUCATION_BOARD' | 'CATEGORY' | 'RELIGION' | 'NATIONALITY';
  code: string;
  name: string;
  parentId?: string; // For State -> Country relation
  metadata?: Record<string, any>;
}

export interface AcademicSession extends BaseEntity {
  name: string;
  startDate: Date;
  endDate: Date;
  isCurrent: boolean;
}

export interface ClassEntity extends BaseEntity {
  name: string;
  code: string;
  gradeLevel: number;
}

export interface Subject extends BaseEntity {
  name: string;
  code: string;
  type: 'CORE' | 'ELECTIVE' | 'LAB';
  credits: number;
}

export interface Resource extends BaseEntity {
  campus_id: string;
  type: 'CLASSROOM' | 'LABORATORY' | 'LIBRARY' | 'HOSTEL' | 'PLAYGROUND' | 'AUDITORIUM' | 'TRANSPORT_YARD';
  name: string;
  code: string;
  capacity: number;
  metadata?: Record<string, any>;
}
