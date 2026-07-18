import { describe, it, expect, beforeAll } from 'vitest';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { dbManager } from '../database/dbClient.js';
import { parentService } from '../services/ParentService.js';
import { familyEngine } from '../services/FamilyEngine.js';
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

const tenantId = '123e4567-e89b-12d3-a456-426614174999';

describe('Enterprise Parent, Family, Guardian & Household Platform (EPFGHP) Domain & Service Suite', () => {
  beforeAll(async () => {
    // 1. Ensure the tenant exists in tenant_registry
    const tenantRes = await dbManager.query('SELECT id FROM tenant_registry WHERE id = $1', [tenantId]);
    if (tenantRes.rows.length === 0) {
      await dbManager.query(`
        INSERT INTO tenant_registry (id, tenant_code, tenant_name, domain_name, status, subscription_tier)
        VALUES ($1, $2, $3, $4, $5, $6)
      `, [tenantId, 'PTENANT1', 'Parent Test Tenant', 'parent-tenant.com', 'active', 'enterprise']);
    }

    // 2. Read and apply Parent platform migrations to make sure tables are initialized
    const migrationPath = path.join(process.cwd(), 'server', 'database', 'migrations', '005_parent_family.sql');
    const sql = fs.readFileSync(migrationPath, 'utf8');
    
    // Set database app.current_tenant for RLS setup during migration check
    await dbManager.query(`SET app.current_tenant = '${tenantId}'`);
    await dbManager.query(sql);
  });

  it('1. should perform Parent CRUD operations successfully with Optimistic Locking', async () => {
    // A. Create Parent (which also sets up default notification preferences)
    const parentEmail = `parent.${uuidv4()}@gmail.com`;
    const newParent = await parentService.createParent(tenantId, {
      firstName: 'Alok',
      lastName: 'Sharma',
      type: 'FATHER',
      email: parentEmail,
      phone: '9876543210',
      occupation: 'Software Engineer',
      isEmergencyContact: true,
      isPickupAuthorized: true
    });

    expect(newParent.id).toBeDefined();
    expect(newParent.firstName).toBe('Alok');
    expect(newParent.version).toBe(1);

    // Verify Notification Preference was created on createParent
    const uow = new UnitOfWork(tenantId);
    const prefRepo = uow.getRepository(ParentNotificationPreferenceRepository);
    const preferences = await prefRepo.findMany();
    const myPref = preferences.find(p => p.parent_id === newParent.id);
    expect(myPref).toBeDefined();
    expect(myPref?.channel).toBe('EMAIL');

    // B. Read Parent
    const parentRepo = uow.getRepository(ParentRepository);
    const fetchedParent = await parentRepo.findOne(newParent.id);
    expect(fetchedParent).not.toBeNull();
    expect(fetchedParent?.email).toBe(parentEmail);

    // C. Update Parent (Optimistic Locking Check)
    const updatedParent = await parentService.updateParent(tenantId, newParent.id, {
      occupation: 'Senior Tech Lead'
    }, newParent.version);

    expect(updatedParent).not.toBeNull();
    expect(updatedParent?.occupation).toBe('Senior Tech Lead');
    expect(updatedParent?.version).toBe(2);

    // Verify Optimistic Locking throws error on stale version update
    await expect(
      parentService.updateParent(tenantId, newParent.id, { occupation: 'Stale Update' }, 1)
    ).rejects.toThrow('Optimistic Locking Error');

    // D. Deactivate Parent
    const deactivatedParent = await parentService.deactivateParent(tenantId, newParent.id, updatedParent!.version);
    expect(deactivatedParent?.status).toBe('INACTIVE');
    expect(deactivatedParent?.version).toBe(3);

    // Clean dispose
    await uow.dispose();
  });

  it('2. should manage Family registrations, mergers, and splits', async () => {
    // A. Register Families
    const familyA = await parentService.registerFamily(tenantId, {
      name: 'Sharma Family A',
      address: {
        addressLine1: 'Flat 101, Block C, Silver Springs',
        city: 'Indore',
        state: 'MP',
        country: 'India',
        postalCode: '452020'
      }
    });

    const familyB = await parentService.registerFamily(tenantId, {
      name: 'Sharma Family B',
      address: {
        addressLine1: 'Villa 5, Palm Meadows',
        city: 'Indore',
        state: 'MP',
        country: 'India',
        postalCode: '452020'
      }
    });

    expect(familyA.id).toBeDefined();
    expect(familyB.id).toBeDefined();

    // Setup parents in Family A and Family B
    const parentA = await parentService.createParent(tenantId, {
      family_id: familyA.id,
      firstName: 'Amit',
      lastName: 'Sharma',
      type: 'FATHER',
      phone: '9900112233'
    });

    const parentB = await parentService.createParent(tenantId, {
      family_id: familyB.id,
      firstName: 'Sunita',
      lastName: 'Sharma',
      type: 'MOTHER',
      phone: '9900112244'
    });

    // Setup mock students under both families
    const studentAId = uuidv4();
    const studentBId = uuidv4();

    await dbManager.query(`
      INSERT INTO student_master (id, tenant_id, family_id, student_id, admission_number, first_name, last_name, gender, date_of_birth, academic_status, status)
      VALUES 
      ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11),
      ($12, $2, $13, $14, $15, $16, $17, $8, $9, $10, $11)
    `, [
      studentAId, tenantId, familyA.id, `STU-${uuidv4()}`, `ADM-${uuidv4()}`, 'Aarav', 'Sharma', 'MALE', new Date('2014-06-15'), 'ADMITTED', 'ACTIVE',
      studentBId, familyB.id, `STU-${uuidv4()}`, `ADM-${uuidv4()}`, 'Aanya', 'Sharma'
    ]);

    // B. Merge Families (B merged into A)
    const mergeSuccess = await parentService.mergeFamilies(tenantId, familyB.id, familyA.id);
    expect(mergeSuccess).toBe(true);

    // Verify parentB family_id was updated to familyA.id
    const uow = new UnitOfWork(tenantId);
    const parentRepo = uow.getRepository(ParentRepository);
    const fetchedParentB = await parentRepo.findOne(parentB.id);
    expect(fetchedParentB?.family_id).toBe(familyA.id);

    // Verify studentB family_id was updated to familyA.id
    const studentRes = await dbManager.query('SELECT family_id FROM student_master WHERE id = $1', [studentBId]);
    expect(studentRes.rows[0].family_id).toBe(familyA.id);

    // C. Split Family (Split studentB and parentB into a new Family C)
    const familyC = await parentService.splitFamily(tenantId, familyA.id, {
      parentIds: [parentB.id],
      studentIds: [studentBId]
    }, 'Sharma Family C');

    expect(familyC.id).toBeDefined();
    expect(familyC.name).toBe('Sharma Family C');

    // Verify split update took effect
    const updatedParentB = await parentRepo.findOne(parentB.id);
    expect(updatedParentB?.family_id).toBe(familyC.id);

    const updatedStudentRes = await dbManager.query('SELECT family_id FROM student_master WHERE id = $1', [studentBId]);
    expect(updatedStudentRes.rows[0].family_id).toBe(familyC.id);

    await uow.dispose();
  });

  it('3. should map student parent relations and fetch Family Trees', async () => {
    const family = await parentService.registerFamily(tenantId, { name: 'Verma Family' });
    const parent = await parentService.createParent(tenantId, {
      family_id: family.id,
      firstName: 'Vikram',
      lastName: 'Verma',
      type: 'FATHER',
      phone: '8877665544'
    });

    const studentId = uuidv4();
    await dbManager.query(`
      INSERT INTO student_master (id, tenant_id, family_id, student_id, admission_number, first_name, last_name, gender, date_of_birth, academic_status, status)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
    `, [studentId, tenantId, family.id, `STU-${uuidv4()}`, `ADM-${uuidv4()}`, 'Ishaan', 'Verma', 'MALE', new Date('2016-01-20'), 'ADMITTED', 'ACTIVE']);

    // A. Link Parent to Student
    const relation = await parentService.linkParentToStudent(tenantId, parent.id, studentId, 'FATHER', {
      isPrimaryContact: true,
      isBillingContact: true,
      hasAcademicAccess: true
    });

    expect(relation.id).toBeDefined();
    expect(relation.isPrimaryContact).toBe(true);

    // B. Fetch Family Tree
    const tree = await familyEngine.getFamilyTree(tenantId, family.id);
    expect(tree).not.toBeNull();
    expect(tree?.familyName).toBe('Verma Family');
    expect(tree?.primaryContact?.name).toBe('Vikram Verma');
    expect(tree?.members.some(m => m.type === 'STUDENT' && m.name.includes('Ishaan'))).toBe(true);

    // C. Unlink Parent from Student
    const unlinkSuccess = await parentService.removeParentMapping(tenantId, parent.id, studentId);
    expect(unlinkSuccess).toBe(true);
  });

  it('4. should process Guardian Verifications, Pickup Authorizations, and Digital Consents', async () => {
    const parent = await parentService.createParent(tenantId, {
      firstName: 'Karan',
      lastName: 'Johar',
      type: 'GUARDIAN',
      phone: '9900887766'
    });

    const studentId = uuidv4();
    await dbManager.query(`
      INSERT INTO student_master (id, tenant_id, student_id, admission_number, first_name, last_name, gender, date_of_birth, academic_status, status)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
    `, [studentId, tenantId, `STU-${uuidv4()}`, `ADM-${uuidv4()}`, 'Yash', 'Johar', 'MALE', new Date('2015-08-12'), 'ADMITTED', 'ACTIVE']);

    // A. Create Guardian
    const uow = new UnitOfWork(tenantId);
    const guardianRepo = uow.getRepository(GuardianRepository);
    const guardian = await guardianRepo.insert({
      parent_id: parent.id,
      relationToStudent: 'UNCLE',
      isLegalGuardian: false,
      custodyStatus: 'JOINT',
      verificationStatus: 'PENDING',
      status: 'ACTIVE'
    });

    expect(guardian.id).toBeDefined();
    expect(guardian.verificationStatus).toBe('PENDING');

    // B. Verify Guardian
    const verifierId = uuidv4();
    const verifiedGuardian = await parentService.verifyGuardian(tenantId, guardian.id, verifierId, 'VERIFIED');
    expect(verifiedGuardian.verificationStatus).toBe('VERIFIED');
    expect(verifiedGuardian.verifiedBy).toBe(verifierId);

    // C. Authorize Pickup
    const pickup = await parentService.authorizePickup(tenantId, {
      student_id: studentId,
      parent_id: parent.id,
      authorizedName: 'Ramesh Driver',
      relationship: 'DRIVER',
      phone: '9988776655',
      validFrom: new Date(),
      validTo: new Date(Date.now() + 86400000 * 30) // 30 days valid
    });

    expect(pickup.id).toBeDefined();
    expect(pickup.authorizedName).toBe('Ramesh Driver');

    // D. Register Emergency Contact
    const contact = await parentService.registerEmergencyContact(tenantId, {
      student_id: studentId,
      parent_id: parent.id,
      name: 'Suresh Uncle',
      relationship: 'UNCLE',
      phone: '9911223344',
      priority: 1
    });

    expect(contact.id).toBeDefined();
    expect(contact.priority).toBe(1);

    // E. Update Digital Consent
    const consent = await parentService.updateDigitalConsent(tenantId, {
      student_id: studentId,
      parent_id: parent.id,
      consentType: 'FIELD_TRIP_OCT_2026',
      isGranted: true,
      ipAddress: '192.168.1.1'
    });

    expect(consent.id).toBeDefined();
    expect(consent.isGranted).toBe(true);

    await uow.dispose();
  });
});
