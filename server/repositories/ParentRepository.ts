import { BaseRepository } from './BaseRepository.js';
import { 
  Parent, 
  Family, 
  Guardian, 
  EmergencyContact, 
  PickupAuthorization, 
  StudentParentRelation, 
  FamilyAddress, 
  HouseholdMember, 
  ParentNotificationPreference,
  DigitalConsent
} from '../entities/ParentDomain.js';

export class ParentRepository extends BaseRepository<Parent> {
  protected tableName = 'parent_master';
}

export class FamilyRepository extends BaseRepository<Family> {
  protected tableName = 'family_master';
}

export class GuardianRepository extends BaseRepository<Guardian> {
  protected tableName = 'guardian_master';
}

export class EmergencyContactRepository extends BaseRepository<EmergencyContact> {
  protected tableName = 'emergency_contact';
}

export class PickupAuthorizationRepository extends BaseRepository<PickupAuthorization> {
  protected tableName = 'pickup_authorization';
}

export class StudentParentRelationRepository extends BaseRepository<StudentParentRelation> {
  protected tableName = 'student_parent_map';
}

export class FamilyAddressRepository extends BaseRepository<FamilyAddress> {
  protected tableName = 'family_address';
}

export class HouseholdMemberRepository extends BaseRepository<HouseholdMember> {
  protected tableName = 'household_member';
}

export class ParentNotificationPreferenceRepository extends BaseRepository<ParentNotificationPreference> {
  protected tableName = 'notification_preference';
}

export class DigitalConsentRepository extends BaseRepository<DigitalConsent> {
  protected tableName = 'digital_consent';
}
