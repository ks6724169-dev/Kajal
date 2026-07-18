import { BaseEntity } from './BaseEntity.js';
import { Address } from '../shared/address/AddressEngine.js';

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

export interface Guardian extends BaseEntity {
  parent_id: string;
  relationToStudent: string;
  isLegalGuardian: boolean;
  custodyStatus?: string;
  verificationStatus: 'PENDING' | 'VERIFIED' | 'REJECTED';
  verifiedBy?: string;
  verifiedAt?: Date;
}

export interface EmergencyContact extends BaseEntity {
  student_id?: string;
  parent_id?: string;
  name: string;
  relationship: string;
  phone: string;
  alternatePhone?: string;
  priority: number;
}

export interface PickupAuthorization extends BaseEntity {
  student_id?: string;
  parent_id?: string;
  authorizedName: string;
  relationship: string;
  phone: string;
  photoUrl?: string;
  idCardNumber?: string;
  validFrom: Date;
  validTo: Date;
}

export interface StudentParentRelation extends BaseEntity {
  student_id: string;
  parent_id: string;
  relationshipType: string;
  isPrimaryContact: boolean;
  isBillingContact: boolean;
  hasAcademicAccess: boolean;
}

export interface FamilyAddress extends BaseEntity {
  family_id: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  isPrimary: boolean;
}

export interface HouseholdMember extends BaseEntity {
  family_id: string;
  firstName: string;
  lastName: string;
  relationToHead: string;
  dateOfBirth?: Date;
  gender?: string;
}

export interface ParentNotificationPreference extends BaseEntity {
  parent_id: string;
  channel: 'EMAIL' | 'SMS' | 'PUSH' | 'PORTAL';
  allowAcademicAlerts: boolean;
  allowAttendanceAlerts: boolean;
  allowFinanceAlerts: boolean;
  allowEmergencyAlerts: boolean;
}

export interface DigitalConsent extends BaseEntity {
  student_id: string;
  parent_id: string;
  consentType: string;
  isGranted: boolean;
  grantedAt?: Date;
  revokedAt?: Date;
  ipAddress?: string;
}
