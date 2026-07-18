import { dbManager } from '../database/dbClient.js';
import { UnitOfWork } from '../database/unitOfWork.js';
import { 
  FamilyRepository, 
  ParentRepository, 
  StudentParentRelationRepository,
  GuardianRepository,
  HouseholdMemberRepository,
  FamilyAddressRepository
} from '../repositories/ParentRepository.js';
import { StudentRepository } from '../repositories/StudentRepository.js';
import { QuerySpecification } from '../repositories/QuerySpecification.js';

export interface FamilyTreeMember {
  id: string;
  name: string;
  role: string;
  type: 'PARENT' | 'STUDENT' | 'GUARDIAN' | 'HOUSEHOLD_MEMBER';
  phone?: string;
  email?: string;
  isPrimary?: boolean;
  isBilling?: boolean;
  hasAcademicAccess?: boolean;
  custodyStatus?: string;
  verificationStatus?: string;
}

export interface FamilyTree {
  familyId: string;
  familyName: string;
  primaryContact?: FamilyTreeMember;
  billingContact?: FamilyTreeMember;
  members: FamilyTreeMember[];
  addresses: any[];
}

export class FamilyEngine {
  public async getFamilyTree(tenantId: string, familyId: string): Promise<FamilyTree | null> {
    const uow = new UnitOfWork(tenantId);
    try {
      await uow.begin();
      const familyRepo = uow.getRepository(FamilyRepository);
      const parentRepo = uow.getRepository(ParentRepository);
      const studentRepo = uow.getRepository(StudentRepository);
      const relationRepo = uow.getRepository(StudentParentRelationRepository);
      const guardianRepo = uow.getRepository(GuardianRepository);
      const householdRepo = uow.getRepository(HouseholdMemberRepository);
      const addressRepo = uow.getRepository(FamilyAddressRepository);

      const family = await familyRepo.findOne(familyId);
      if (!family) {
        return null;
      }

      const members: FamilyTreeMember[] = [];

      // 1. Fetch Parents in this family
      const pSpec = new QuerySpecification();
      pSpec.and('family_id', familyId);
      const parents = await parentRepo.findMany(pSpec);
      for (const parent of parents) {
        members.push({
          id: parent.id,
          name: `${parent.firstName} ${parent.lastName}`,
          role: parent.type,
          type: 'PARENT',
          phone: parent.phone,
          email: parent.email,
          isPrimary: parent.isEmergencyContact,
          isBilling: parent.isPickupAuthorized
        });
      }

      // 2. Fetch Students in this family
      const sSpec = new QuerySpecification();
      sSpec.and('family_id', familyId);
      const students = await studentRepo.findMany(sSpec);
      for (const student of students) {
        members.push({
          id: student.id,
          name: `${student.firstName} ${student.lastName}`,
          role: 'STUDENT',
          type: 'STUDENT'
        });
      }

      // 3. Fetch Guardians linked to these parents
      for (const parent of parents) {
        const gSpec = new QuerySpecification();
        gSpec.and('parent_id', parent.id);
        const guardians = await guardianRepo.findMany(gSpec);
        for (const guardian of guardians) {
          members.push({
            id: guardian.id,
            name: `${parent.firstName} ${parent.lastName}`,
            role: guardian.relationToStudent,
            type: 'GUARDIAN',
            custodyStatus: guardian.custodyStatus,
            verificationStatus: guardian.verificationStatus
          });
        }
      }

      // 4. Fetch Household Members
      const hSpec = new QuerySpecification();
      hSpec.and('family_id', familyId);
      const households = await householdRepo.findMany(hSpec);
      for (const house of households) {
        members.push({
          id: house.id,
          name: `${house.firstName} ${house.lastName}`,
          role: house.relationToHead,
          type: 'HOUSEHOLD_MEMBER'
        });
      }

      // 5. Fetch Family Addresses
      const addrSpec = new QuerySpecification();
      addrSpec.and('family_id', familyId);
      const addresses = await addressRepo.findMany(addrSpec);

      // Identify Primary and Billing contacts from relations
      let primaryContact: FamilyTreeMember | undefined;
      let billingContact: FamilyTreeMember | undefined;

      // Check relation mappings for students to find primary/billing
      for (const student of students) {
        const relSpec = new QuerySpecification();
        relSpec.and('student_id', student.id);
        const relations = await relationRepo.findMany(relSpec);
        for (const relation of relations) {
          const parentMember = members.find(m => m.id === relation.parent_id);
          if (parentMember) {
            parentMember.isPrimary = relation.isPrimaryContact;
            parentMember.isBilling = relation.isBillingContact;
            parentMember.hasAcademicAccess = relation.hasAcademicAccess;

            if (relation.isPrimaryContact && !primaryContact) {
              primaryContact = parentMember;
            }
            if (relation.isBillingContact && !billingContact) {
              billingContact = parentMember;
            }
          }
        }
      }

      await uow.commit();

      return {
        familyId: family.id,
        familyName: family.name,
        primaryContact,
        billingContact,
        members,
        addresses
      };
    } catch (error) {
      await uow.rollback();
      throw error;
    } finally {
      await uow.dispose();
    }
  }

  public async getCustodyRules(tenantId: string, studentId: string): Promise<any[]> {
    // Get all custody details and special flags for a student's active guardians
    const sql = `
      SELECT g.id as guardian_id, p.first_name, p.last_name, g.relation_to_student, g.is_legal_guardian, g.custody_status, g.verification_status
      FROM guardian_master g
      JOIN parent_master p ON g.parent_id = p.id
      JOIN student_parent_map m ON m.parent_id = p.id
      WHERE m.student_id = $1 AND g.tenant_id = $2 AND g.deleted_at IS NULL
    `;
    const res = await dbManager.query(sql, [studentId, tenantId]);
    return res.rows;
  }
}

export const familyEngine = new FamilyEngine();
