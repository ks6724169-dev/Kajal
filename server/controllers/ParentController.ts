import { Request, Response, NextFunction } from 'express';
import { parentService } from '../services/ParentService.js';
import { familyEngine } from '../services/FamilyEngine.js';
import { sendSuccess } from '../core/response.js';
import { ValidationError } from '../errors/AppError.js';
import { NotFoundError } from '../shared/errors/EnterpriseErrors.js';
import { 
  CreateParentSchema, 
  UpdateParentSchema, 
  GuardianSchema, 
  PickupAuthorizationSchema, 
  EmergencyContactSchema, 
  FamilySchema, 
  FamilyAddressSchema, 
  HouseholdMemberSchema, 
  ParentNotificationPreferenceSchema, 
  DigitalConsentSchema 
} from '../validators/ParentValidator.js';
import { UnitOfWork } from '../database/unitOfWork.js';
import { ParentRepository, FamilyRepository, StudentParentRelationRepository, GuardianRepository } from '../repositories/ParentRepository.js';
import { QuerySpecification } from '../repositories/QuerySpecification.js';

export class ParentController {
  private getTenantId(req: Request): string {
    const tenantId = req.headers['x-tenant-id'] as string;
    if (!tenantId) {
      throw new ValidationError('Tenant ID (x-tenant-id) is required in headers');
    }
    return tenantId;
  }

  // --- Parent Endpoints ---
  public async createParent(req: Request, res: Response, next: NextFunction) {
    try {
      const tenantId = this.getTenantId(req);
      const parsed = CreateParentSchema.safeParse(req.body);
      if (!parsed.success) {
        throw new ValidationError('Validation failed', parsed.error.format());
      }
      const parent = await parentService.createParent(tenantId, parsed.data);
      sendSuccess(res, parent, 201);
    } catch (error) {
      next(error);
    }
  }

  public async getParent(req: Request, res: Response, next: NextFunction) {
    try {
      const tenantId = this.getTenantId(req);
      const parentId = req.params.id;
      const uow = new UnitOfWork(tenantId);
      const repo = uow.getRepository(ParentRepository);
      const parent = await repo.findOne(parentId);
      if (!parent) {
        throw new NotFoundError('Parent not found');
      }
      sendSuccess(res, parent);
    } catch (error) {
      next(error);
    }
  }

  public async updateParent(req: Request, res: Response, next: NextFunction) {
    try {
      const tenantId = this.getTenantId(req);
      const parentId = req.params.id;
      const { version, ...updateData } = req.body;
      if (version === undefined) {
        throw new ValidationError('Version is required for optimistic locking');
      }
      const parsed = UpdateParentSchema.safeParse(updateData);
      if (!parsed.success) {
        throw new ValidationError('Validation failed', parsed.error.format());
      }
      const parent = await parentService.updateParent(tenantId, parentId, parsed.data, version);
      sendSuccess(res, parent);
    } catch (error) {
      next(error);
    }
  }

  public async deleteParent(req: Request, res: Response, next: NextFunction) {
    try {
      const tenantId = this.getTenantId(req);
      const parentId = req.params.id;
      const uow = new UnitOfWork(tenantId);
      const repo = uow.getRepository(ParentRepository);
      const parent = await repo.findOne(parentId);
      if (!parent) {
        throw new NotFoundError('Parent not found');
      }
      const deleted = await repo.softDelete(parentId);
      sendSuccess(res, { success: deleted });
    } catch (error) {
      next(error);
    }
  }

  // --- Family Endpoints ---
  public async registerFamily(req: Request, res: Response, next: NextFunction) {
    try {
      const tenantId = this.getTenantId(req);
      const parsed = FamilySchema.safeParse(req.body);
      if (!parsed.success) {
        throw new ValidationError('Validation failed', parsed.error.format());
      }
      const family = await parentService.registerFamily(tenantId, parsed.data);
      sendSuccess(res, family, 201);
    } catch (error) {
      next(error);
    }
  }

  public async mergeFamilies(req: Request, res: Response, next: NextFunction) {
    try {
      const tenantId = this.getTenantId(req);
      const { sourceFamilyId, targetFamilyId } = req.body;
      if (!sourceFamilyId || !targetFamilyId) {
        throw new ValidationError('sourceFamilyId and targetFamilyId are required');
      }
      const success = await parentService.mergeFamilies(tenantId, sourceFamilyId, targetFamilyId);
      sendSuccess(res, { success });
    } catch (error) {
      next(error);
    }
  }

  public async splitFamily(req: Request, res: Response, next: NextFunction) {
    try {
      const tenantId = this.getTenantId(req);
      const { familyId, parentIds, studentIds, newFamilyName } = req.body;
      if (!familyId || !newFamilyName || (!parentIds && !studentIds)) {
        throw new ValidationError('familyId, newFamilyName, and member IDs are required');
      }
      const family = await parentService.splitFamily(tenantId, familyId, {
        parentIds: parentIds || [],
        studentIds: studentIds || []
      }, newFamilyName);
      sendSuccess(res, family);
    } catch (error) {
      next(error);
    }
  }

  public async getFamilyTree(req: Request, res: Response, next: NextFunction) {
    try {
      const tenantId = this.getTenantId(req);
      const familyId = req.params.id;
      const tree = await familyEngine.getFamilyTree(tenantId, familyId);
      if (!tree) {
        throw new NotFoundError('Family not found');
      }
      sendSuccess(res, tree);
    } catch (error) {
      next(error);
    }
  }

  // --- Linking & Relational Endpoints ---
  public async linkParentToStudent(req: Request, res: Response, next: NextFunction) {
    try {
      const tenantId = this.getTenantId(req);
      const { parentId, studentId, relationshipType, isPrimaryContact, isBillingContact, hasAcademicAccess } = req.body;
      if (!parentId || !studentId || !relationshipType) {
        throw new ValidationError('parentId, studentId, and relationshipType are required');
      }
      const relation = await parentService.linkParentToStudent(tenantId, parentId, studentId, relationshipType, {
        isPrimaryContact,
        isBillingContact,
        hasAcademicAccess
      });
      sendSuccess(res, relation, 201);
    } catch (error) {
      next(error);
    }
  }

  public async removeParentMapping(req: Request, res: Response, next: NextFunction) {
    try {
      const tenantId = this.getTenantId(req);
      const { parentId, studentId } = req.body;
      if (!parentId || !studentId) {
        throw new ValidationError('parentId and studentId are required');
      }
      const success = await parentService.removeParentMapping(tenantId, parentId, studentId);
      sendSuccess(res, { success });
    } catch (error) {
      next(error);
    }
  }

  // --- Guardians, Emergency Contacts, and Pickup Authorizations ---
  public async createGuardian(req: Request, res: Response, next: NextFunction) {
    try {
      const tenantId = this.getTenantId(req);
      const parsed = GuardianSchema.safeParse(req.body);
      if (!parsed.success) {
        throw new ValidationError('Validation failed', parsed.error.format());
      }
      const uow = new UnitOfWork(tenantId);
      const repo = uow.getRepository(GuardianRepository);
      const guardian = await repo.insert({
        ...parsed.data,
        status: 'ACTIVE'
      });
      sendSuccess(res, guardian, 201);
    } catch (error) {
      next(error);
    }
  }

  public async verifyGuardian(req: Request, res: Response, next: NextFunction) {
    try {
      const tenantId = this.getTenantId(req);
      const guardianId = req.params.id;
      const { verifierId, status } = req.body;
      if (!verifierId || !status || (status !== 'VERIFIED' && status !== 'REJECTED')) {
        throw new ValidationError('verifierId and valid verification status are required');
      }
      const guardian = await parentService.verifyGuardian(tenantId, guardianId, verifierId, status);
      sendSuccess(res, guardian);
    } catch (error) {
      next(error);
    }
  }

  public async registerEmergencyContact(req: Request, res: Response, next: NextFunction) {
    try {
      const tenantId = this.getTenantId(req);
      const parsed = EmergencyContactSchema.safeParse(req.body);
      if (!parsed.success) {
        throw new ValidationError('Validation failed', parsed.error.format());
      }
      const contact = await parentService.registerEmergencyContact(tenantId, parsed.data);
      sendSuccess(res, contact, 201);
    } catch (error) {
      next(error);
    }
  }

  public async authorizePickup(req: Request, res: Response, next: NextFunction) {
    try {
      const tenantId = this.getTenantId(req);
      const parsed = PickupAuthorizationSchema.safeParse(req.body);
      if (!parsed.success) {
        throw new ValidationError('Validation failed', parsed.error.format());
      }
      const auth = await parentService.authorizePickup(tenantId, parsed.data);
      sendSuccess(res, auth, 201);
    } catch (error) {
      next(error);
    }
  }

  // --- Consents & Preferences ---
  public async updateNotificationPreference(req: Request, res: Response, next: NextFunction) {
    try {
      const tenantId = this.getTenantId(req);
      const parentId = req.params.parentId;
      const { channel, ...prefData } = req.body;
      if (!channel) {
        throw new ValidationError('channel is required');
      }
      const pref = await parentService.updateNotificationPreference(tenantId, parentId, channel, prefData);
      sendSuccess(res, pref);
    } catch (error) {
      next(error);
    }
  }

  public async updateDigitalConsent(req: Request, res: Response, next: NextFunction) {
    try {
      const tenantId = this.getTenantId(req);
      const parsed = DigitalConsentSchema.safeParse(req.body);
      if (!parsed.success) {
        throw new ValidationError('Validation failed', parsed.error.format());
      }
      const consent = await parentService.updateDigitalConsent(tenantId, parsed.data);
      sendSuccess(res, consent);
    } catch (error) {
      next(error);
    }
  }

  // --- Activate Portal ---
  public async activateParentPortal(req: Request, res: Response, next: NextFunction) {
    try {
      const tenantId = this.getTenantId(req);
      const parentId = req.params.id;
      const success = await parentService.activateParentPortal(tenantId, parentId);
      sendSuccess(res, { success });
    } catch (error) {
      next(error);
    }
  }
}

export const parentController = new ParentController();
