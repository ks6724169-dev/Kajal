import { UnitOfWork } from '../database/unitOfWork.js';
import { 
  ParentRepository, 
  FamilyRepository, 
  GuardianRepository, 
  EmergencyContactRepository, 
  PickupAuthorizationRepository, 
  StudentParentRelationRepository, 
  FamilyAddressRepository, 
  HouseholdMemberRepository, 
  ParentNotificationPreferenceRepository,
  DigitalConsentRepository 
} from '../repositories/ParentRepository.js';
import { StudentRepository } from '../repositories/StudentRepository.js';
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
import { BaseNotificationProvider, notificationPlatform } from '../shared/notifications/NotificationPlatform.js';
import { dbManager } from '../database/dbClient.js';
import { QuerySpecification } from '../repositories/QuerySpecification.js';

// Setup Mock Notification Provider for robust platform operation
class MockNotificationProvider extends BaseNotificationProvider {
  async send(payload: any): Promise<boolean> {
    console.log('[NOTIFICATION PLATFORM SEND]:', payload);
    return true;
  }
}

try {
  notificationPlatform.registerProvider('email', new MockNotificationProvider());
  notificationPlatform.registerProvider('sms', new MockNotificationProvider());
} catch (e) {
  // Handled silently if already registered
}

export class ParentService {
  public async createParent(tenantId: string, data: Partial<Parent>): Promise<Parent> {
    const uow = new UnitOfWork(tenantId);
    try {
      await uow.begin();
      const parentRepo = uow.getRepository(ParentRepository);
      const prefRepo = uow.getRepository(ParentNotificationPreferenceRepository);

      // Create Parent
      const newParent = await parentRepo.insert({
        ...data,
        status: 'ACTIVE'
      });

      // Default Notification Preferences
      await prefRepo.insert({
        parent_id: newParent.id,
        channel: 'EMAIL',
        allowAcademicAlerts: true,
        allowAttendanceAlerts: true,
        allowFinanceAlerts: true,
        allowEmergencyAlerts: true,
        status: 'ACTIVE'
      });

      // Send Welcome Notification
      if (newParent.email) {
        await notificationPlatform.notify('email', {
          to: newParent.email,
          subject: 'Welcome to Galaxy ERP Parent Portal',
          body: `Dear ${newParent.firstName}, your parent account has been successfully registered.`
        });
      }

      await uow.commit();
      return newParent;
    } catch (error) {
      await uow.rollback();
      throw error;
    } finally {
      await uow.dispose();
    }
  }

  public async updateParent(tenantId: string, parentId: string, data: Partial<Parent>, currentVersion: number): Promise<Parent> {
    const uow = new UnitOfWork(tenantId);
    try {
      await uow.begin();
      const parentRepo = uow.getRepository(ParentRepository);
      const updated = await parentRepo.update(parentId, data, currentVersion);
      if (!updated) {
        throw new Error('Parent not found or version mismatch');
      }
      await uow.commit();
      return updated;
    } catch (error) {
      await uow.rollback();
      throw error;
    } finally {
      await uow.dispose();
    }
  }

  public async deactivateParent(tenantId: string, parentId: string, currentVersion: number): Promise<Parent> {
    const uow = new UnitOfWork(tenantId);
    try {
      await uow.begin();
      const parentRepo = uow.getRepository(ParentRepository);
      const updated = await parentRepo.update(parentId, { status: 'INACTIVE' }, currentVersion);
      if (!updated) {
        throw new Error('Parent not found or version mismatch');
      }
      await uow.commit();
      return updated;
    } catch (error) {
      await uow.rollback();
      throw error;
    } finally {
      await uow.dispose();
    }
  }

  public async registerFamily(tenantId: string, data: { name: string; address?: Partial<FamilyAddress> }): Promise<Family> {
    const uow = new UnitOfWork(tenantId);
    try {
      await uow.begin();
      const familyRepo = uow.getRepository(FamilyRepository);
      const addressRepo = uow.getRepository(FamilyAddressRepository);

      const family = await familyRepo.insert({
        name: data.name,
        status: 'ACTIVE'
      });

      if (data.address) {
        await addressRepo.insert({
          ...data.address,
          family_id: family.id,
          isPrimary: true,
          status: 'ACTIVE'
        } as Partial<FamilyAddress>);
      }

      await uow.commit();
      return family;
    } catch (error) {
      await uow.rollback();
      throw error;
    } finally {
      await uow.dispose();
    }
  }

  public async mergeFamilies(tenantId: string, sourceFamilyId: string, targetFamilyId: string): Promise<boolean> {
    const uow = new UnitOfWork(tenantId);
    try {
      await uow.begin();
      const familyRepo = uow.getRepository(FamilyRepository);
      const parentRepo = uow.getRepository(ParentRepository);
      const addressRepo = uow.getRepository(FamilyAddressRepository);
      const householdRepo = uow.getRepository(HouseholdMemberRepository);

      // Verify families exist
      const sourceFamily = await familyRepo.findOne(sourceFamilyId);
      const targetFamily = await familyRepo.findOne(targetFamilyId);
      if (!sourceFamily || !targetFamily) {
        throw new Error('Source or target family not found');
      }

      // Update Parents' family_id
      const pSpec = new QuerySpecification();
      pSpec.and('family_id', sourceFamilyId);
      const parents = await parentRepo.findMany(pSpec);
      for (const parent of parents) {
        await parentRepo.update(parent.id, { family_id: targetFamilyId }, parent.version);
      }

      // Update Students' family_id directly in DB (using current transaction-scoped client)
      const txClient = (parentRepo as any).getClient();
      await txClient.query(
        `UPDATE student_master SET family_id = $1, updated_at = NOW() WHERE family_id = $2 AND tenant_id = $3`,
        [targetFamilyId, sourceFamilyId, tenantId]
      );

      // Re-map Addresses and Household Members
      const addrSpec = new QuerySpecification();
      addrSpec.and('family_id', sourceFamilyId);
      const addresses = await addressRepo.findMany(addrSpec);
      for (const addr of addresses) {
        await addressRepo.update(addr.id, { family_id: targetFamilyId }, addr.version);
      }

      const houseSpec = new QuerySpecification();
      houseSpec.and('family_id', sourceFamilyId);
      const members = await householdRepo.findMany(houseSpec);
      for (const member of members) {
        await householdRepo.update(member.id, { family_id: targetFamilyId }, member.version);
      }

      // Soft Delete Source Family
      await familyRepo.softDelete(sourceFamilyId);

      await uow.commit();
      return true;
    } catch (error) {
      await uow.rollback();
      throw error;
    } finally {
      await uow.dispose();
    }
  }

  public async splitFamily(tenantId: string, familyId: string, memberIds: { parentIds: string[]; studentIds: string[] }, newFamilyName: string): Promise<Family> {
    const uow = new UnitOfWork(tenantId);
    try {
      await uow.begin();
      const familyRepo = uow.getRepository(FamilyRepository);
      const parentRepo = uow.getRepository(ParentRepository);

      // Verify original family exists
      const originalFamily = await familyRepo.findOne(familyId);
      if (!originalFamily) {
        throw new Error('Original family not found');
      }

      // Create New Family
      const newFamily = await familyRepo.insert({
        name: newFamilyName,
        status: 'ACTIVE'
      });

      // Move Parents
      for (const parentId of memberIds.parentIds) {
        const parent = await parentRepo.findOne(parentId);
        if (parent && parent.family_id === familyId) {
          await parentRepo.update(parent.id, { family_id: newFamily.id }, parent.version);
        }
      }

      // Move Students
      const txClient = (parentRepo as any).getClient();
      for (const studentId of memberIds.studentIds) {
        await txClient.query(
          `UPDATE student_master SET family_id = $1, updated_at = NOW() WHERE id = $2 AND family_id = $3 AND tenant_id = $4`,
          [newFamily.id, studentId, familyId, tenantId]
        );
      }

      await uow.commit();
      return newFamily;
    } catch (error) {
      await uow.rollback();
      throw error;
    } finally {
      await uow.dispose();
    }
  }

  public async linkParentToStudent(
    tenantId: string, 
    parentId: string, 
    studentId: string, 
    relationshipType: string, 
    options: { isPrimaryContact?: boolean; isBillingContact?: boolean; hasAcademicAccess?: boolean } = {}
  ): Promise<StudentParentRelation> {
    const uow = new UnitOfWork(tenantId);
    try {
      await uow.begin();
      const relationRepo = uow.getRepository(StudentParentRelationRepository);

      // Check if relationship already exists (deleted or active)
      const spec = new QuerySpecification();
      spec.and('parent_id', parentId);
      spec.and('student_id', studentId);
      const existing = await relationRepo.findMany(spec);
      
      if (existing.length > 0) {
        const relation = existing[0];
        const updated = await relationRepo.update(relation.id, {
          relationshipType,
          isPrimaryContact: options.isPrimaryContact ?? relation.isPrimaryContact,
          isBillingContact: options.isBillingContact ?? relation.isBillingContact,
          hasAcademicAccess: options.hasAcademicAccess ?? relation.hasAcademicAccess,
          status: 'ACTIVE'
        }, relation.version);
        await uow.commit();
        return updated!;
      }

      const relation = await relationRepo.insert({
        student_id: studentId,
        parent_id: parentId,
        relationshipType,
        isPrimaryContact: options.isPrimaryContact ?? false,
        isBillingContact: options.isBillingContact ?? false,
        hasAcademicAccess: options.hasAcademicAccess ?? true,
        status: 'ACTIVE'
      });

      await uow.commit();
      return relation;
    } catch (error) {
      await uow.rollback();
      throw error;
    } finally {
      await uow.dispose();
    }
  }

  public async removeParentMapping(tenantId: string, parentId: string, studentId: string): Promise<boolean> {
    const uow = new UnitOfWork(tenantId);
    try {
      await uow.begin();
      const relationRepo = uow.getRepository(StudentParentRelationRepository);

      const spec = new QuerySpecification();
      spec.and('parent_id', parentId);
      spec.and('student_id', studentId);
      const relations = await relationRepo.findMany(spec);

      if (relations.length === 0) {
        throw new Error('Relation mapping not found');
      }

      for (const relation of relations) {
        await relationRepo.softDelete(relation.id);
      }

      await uow.commit();
      return true;
    } catch (error) {
      await uow.rollback();
      throw error;
    } finally {
      await uow.dispose();
    }
  }

  public async verifyGuardian(tenantId: string, guardianId: string, verifierId: string, status: 'VERIFIED' | 'REJECTED'): Promise<Guardian> {
    const uow = new UnitOfWork(tenantId);
    try {
      await uow.begin();
      const guardianRepo = uow.getRepository(GuardianRepository);

      const guardian = await guardianRepo.findOne(guardianId);
      if (!guardian) {
        throw new Error('Guardian not found');
      }

      const updated = await guardianRepo.update(guardianId, {
        verificationStatus: status,
        verifiedBy: verifierId,
        verifiedAt: new Date()
      }, guardian.version);

      await uow.commit();
      return updated!;
    } catch (error) {
      await uow.rollback();
      throw error;
    } finally {
      await uow.dispose();
    }
  }

  public async authorizePickup(tenantId: string, data: Partial<PickupAuthorization>): Promise<PickupAuthorization> {
    const uow = new UnitOfWork(tenantId);
    try {
      await uow.begin();
      const pickupRepo = uow.getRepository(PickupAuthorizationRepository);

      const auth = await pickupRepo.insert({
        ...data,
        status: 'ACTIVE'
      });

      await uow.commit();
      return auth;
    } catch (error) {
      await uow.rollback();
      throw error;
    } finally {
      await uow.dispose();
    }
  }

  public async registerEmergencyContact(tenantId: string, data: Partial<EmergencyContact>): Promise<EmergencyContact> {
    const uow = new UnitOfWork(tenantId);
    try {
      await uow.begin();
      const contactRepo = uow.getRepository(EmergencyContactRepository);

      const contact = await contactRepo.insert({
        ...data,
        status: 'ACTIVE'
      });

      await uow.commit();
      return contact;
    } catch (error) {
      await uow.rollback();
      throw error;
    } finally {
      await uow.dispose();
    }
  }

  public async updateNotificationPreference(tenantId: string, parentId: string, channel: 'EMAIL' | 'SMS' | 'PUSH' | 'PORTAL', data: Partial<ParentNotificationPreference>): Promise<ParentNotificationPreference> {
    const uow = new UnitOfWork(tenantId);
    try {
      await uow.begin();
      const prefRepo = uow.getRepository(ParentNotificationPreferenceRepository);

      const spec = new QuerySpecification();
      spec.and('parent_id', parentId);
      spec.and('channel', channel);
      const preferences = await prefRepo.findMany(spec);

      if (preferences.length > 0) {
        const pref = preferences[0];
        const updated = await prefRepo.update(pref.id, data, pref.version);
        await uow.commit();
        return updated!;
      }

      const newPref = await prefRepo.insert({
        parent_id: parentId,
        channel,
        allowAcademicAlerts: data.allowAcademicAlerts ?? true,
        allowAttendanceAlerts: data.allowAttendanceAlerts ?? true,
        allowFinanceAlerts: data.allowFinanceAlerts ?? true,
        allowEmergencyAlerts: data.allowEmergencyAlerts ?? true,
        status: 'ACTIVE'
      });

      await uow.commit();
      return newPref;
    } catch (error) {
      await uow.rollback();
      throw error;
    } finally {
      await uow.dispose();
    }
  }

  public async updateDigitalConsent(tenantId: string, data: Partial<DigitalConsent>): Promise<DigitalConsent> {
    const uow = new UnitOfWork(tenantId);
    try {
      await uow.begin();
      const consentRepo = uow.getRepository(DigitalConsentRepository);

      const spec = new QuerySpecification();
      spec.and('student_id', data.student_id!);
      spec.and('parent_id', data.parent_id!);
      spec.and('consent_type', data.consentType!);
      const existing = await consentRepo.findMany(spec);

      if (existing.length > 0) {
        const consent = existing[0];
        const updated = await consentRepo.update(consent.id, {
          isGranted: data.isGranted,
          grantedAt: data.isGranted ? new Date() : undefined,
          revokedAt: !data.isGranted ? new Date() : undefined,
          ipAddress: data.ipAddress
        }, consent.version);
        await uow.commit();
        return updated!;
      }

      const consent = await consentRepo.insert({
        ...data,
        grantedAt: data.isGranted ? new Date() : undefined,
        revokedAt: !data.isGranted ? new Date() : undefined,
        status: 'ACTIVE'
      });

      await uow.commit();
      return consent;
    } catch (error) {
      await uow.rollback();
      throw error;
    } finally {
      await uow.dispose();
    }
  }

  public async activateParentPortal(tenantId: string, parentId: string): Promise<boolean> {
    const uow = new UnitOfWork(tenantId);
    try {
      await uow.begin();
      const parentRepo = uow.getRepository(ParentRepository);

      const parent = await parentRepo.findOne(parentId);
      if (!parent) {
        throw new Error('Parent not found');
      }

      // Activate parent portal status/credentials
      await parentRepo.update(parentId, { status: 'ACTIVE' }, parent.version);

      if (parent.email) {
        await notificationPlatform.notify('email', {
          to: parent.email,
          subject: 'Galaxy ERP Portal Activated',
          body: `Dear ${parent.firstName}, your parent portal has been activated. You can now login using your registered credentials.`
        });
      }

      await uow.commit();
      return true;
    } catch (error) {
      await uow.rollback();
      throw error;
    } finally {
      await uow.dispose();
    }
  }
}

export const parentService = new ParentService();
