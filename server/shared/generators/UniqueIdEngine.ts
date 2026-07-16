import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto';

export class UniqueIdEngine {
  /**
   * Generates a unique collision-free enterprise code based on tenant, type, and timestamp.
   * e.g., STU-T1-20260716-1A2B
   */
  public generateCode(tenantId: string, prefix: string): string {
    const timestamp = new Date().toISOString().replace(/[-:T.]/g, '').slice(0, 8); // YYYYMMDD
    const randomHash = crypto.randomBytes(2).toString('hex').toUpperCase(); // 4 chars
    const shortTenant = tenantId.substring(0, 4).toUpperCase();
    return `${prefix}-${shortTenant}-${timestamp}-${randomHash}`;
  }

  public generateStudentId(tenantId: string): string {
    return this.generateCode(tenantId, 'STU');
  }

  public generateTeacherId(tenantId: string): string {
    return this.generateCode(tenantId, 'TCH');
  }

  public generateEmployeeId(tenantId: string): string {
    return this.generateCode(tenantId, 'EMP');
  }

  public generateCampusId(tenantId: string): string {
    return this.generateCode(tenantId, 'CMP');
  }

  public generateOrganizationId(tenantId: string): string {
    return this.generateCode(tenantId, 'ORG');
  }

  public generateSubjectCode(tenantId: string): string {
    return this.generateCode(tenantId, 'SUB');
  }
}

export const uniqueIdEngine = new UniqueIdEngine();
