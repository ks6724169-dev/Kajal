import { UnitOfWork } from '../database/unitOfWork.js';
import { ExtendedOrganizationRepository, ExtendedCampusRepository } from '../repositories/MasterDataRepository.js';
import { Organization, Campus } from '../entities/MasterData.js';
import { uniqueIdEngine } from '../shared/generators/UniqueIdEngine.js';
import { dbManager } from '../database/dbClient.js';
import { QuerySpecification } from '../repositories/QuerySpecification.js';
import { v4 as uuidv4, validate as isUuid } from 'uuid';

export function resolveTenantUuid(tenantId: string): string {
  if (!tenantId) {
    return '123e4567-e89b-12d3-a456-426614174000';
  }
  if (isUuid(tenantId)) {
    return tenantId;
  }
  return '123e4567-e89b-12d3-a456-426614174000';
}

export class OrganizationService {
  public async getOrganizationDetails(tenantId: string): Promise<any> {
    const resolvedTenantId = resolveTenantUuid(tenantId);
    const uow = new UnitOfWork(resolvedTenantId);
    try {
      await uow.begin();
      const orgRepo = uow.getRepository(ExtendedOrganizationRepository);
      const campusRepo = uow.getRepository(ExtendedCampusRepository);
      
      const spec = new QuerySpecification();
      const orgs = await orgRepo.findMany(spec);
      const organization = orgs[0] || null;
      
      let branding = null;
      let documents: any[] = [];
      let campuses: any[] = [];
      
      if (organization) {
        const brandingRes = await dbManager.query(
          "SELECT * FROM organization_branding WHERE organization_id = $1 AND tenant_id = $2::uuid LIMIT 1",
          [organization.id, resolvedTenantId]
        );
        branding = brandingRes.rows[0] || null;
        
        const docsRes = await dbManager.query(
          "SELECT * FROM institution_documents WHERE organization_id = $1 AND tenant_id = $2::uuid AND deleted_at IS NULL",
          [organization.id, resolvedTenantId]
        );
        documents = docsRes.rows;

        const campusSpec = new QuerySpecification().and('organization_id', organization.id);
        campuses = await campusRepo.findMany(campusSpec);
      }
      
      return {
        organization,
        branding,
        documents,
        campuses
      };
    } catch (error) {
      throw error;
    } finally {
      await uow.dispose();
    }
  }

  public async createOrganization(tenantId: string, data: Partial<Organization>): Promise<Organization> {
    const resolvedTenantId = resolveTenantUuid(tenantId);
    const uow = new UnitOfWork(resolvedTenantId);
    try {
      await uow.begin();
      const orgRepo = uow.getRepository(ExtendedOrganizationRepository);
      
      data.code = data.code || uniqueIdEngine.generateOrganizationId(resolvedTenantId);
      const newOrg = await orgRepo.insert(data as Organization);
      
      await uow.commit();
      return newOrg;
    } catch (error) {
      await uow.rollback();
      throw error;
    } finally {
      await uow.dispose();
    }
  }

  public async updateOrganizationDetails(tenantId: string, orgId: string, orgData: any, brandingData: any): Promise<any> {
    const resolvedTenantId = resolveTenantUuid(tenantId);
    const uow = new UnitOfWork(resolvedTenantId);
    try {
      await uow.begin();
      const orgRepo = uow.getRepository(ExtendedOrganizationRepository);
      
      const org = await orgRepo.findOne(orgId);
      if (!org) throw new Error('Organization not found');
      
      const updatedOrg = await orgRepo.update(orgId, {
        ...org,
        ...orgData,
        updated_at: new Date()
      }, org.version);
      
      const brandingRes = await dbManager.query(
        "SELECT id FROM organization_branding WHERE organization_id = $1 LIMIT 1",
        [orgId]
      );
      
      let updatedBranding;
      if (brandingRes.rows.length > 0) {
        const updateQuery = `
          UPDATE organization_branding
          SET logo_url = $1, primary_color = $2, secondary_color = $3, theme_mode = $4, font_family = $5, updated_at = NOW(), version = version + 1
          WHERE organization_id = $6 RETURNING *
        `;
        const updateRes = await dbManager.query(updateQuery, [
          brandingData.logo_url,
          brandingData.primary_color,
          brandingData.secondary_color,
          brandingData.theme_mode,
          brandingData.font_family,
          orgId
        ]);
        updatedBranding = updateRes.rows[0];
      } else {
        const insertQuery = `
          INSERT INTO organization_branding (id, tenant_id, organization_id, logo_url, primary_color, secondary_color, theme_mode, font_family)
          VALUES ($1, $2::uuid, $3::uuid, $4, $5, $6, $7, $8) RETURNING *
        `;
        const brandingId = uuidv4();
        const insertRes = await dbManager.query(insertQuery, [
          brandingId,
          resolvedTenantId,
          orgId,
          brandingData.logo_url,
          brandingData.primary_color || '#4f46e5',
          brandingData.secondary_color || '#0f172a',
          brandingData.theme_mode || 'light',
          brandingData.font_family || 'Plus Jakarta Sans'
        ]);
        updatedBranding = insertRes.rows[0];
      }
      
      await uow.commit();
      return {
        organization: updatedOrg,
        branding: updatedBranding
      };
    } catch (error) {
      await uow.rollback();
      throw error;
    } finally {
      await uow.dispose();
    }
  }

  public async createCampus(tenantId: string, orgId: string, data: Partial<Campus>): Promise<Campus> {
    const resolvedTenantId = resolveTenantUuid(tenantId);
    const uow = new UnitOfWork(resolvedTenantId);
    try {
      await uow.begin();
      const campusRepo = uow.getRepository(ExtendedCampusRepository);
      
      data.organization_id = orgId;
      data.code = data.code || uniqueIdEngine.generateCampusId(resolvedTenantId);
      
      const newCampus = await campusRepo.insert(data as Campus);
      
      await uow.commit();
      return newCampus;
    } catch (error) {
      await uow.rollback();
      throw error;
    } finally {
      await uow.dispose();
    }
  }

  public async addDocument(tenantId: string, orgId: string, doc: any): Promise<any> {
    const resolvedTenantId = resolveTenantUuid(tenantId);
    const docId = uuidv4();
    const query = `
      INSERT INTO institution_documents (id, tenant_id, organization_id, name, document_type, file_url, file_size, expiry_date)
      VALUES ($1, $2::uuid, $3::uuid, $4, $5, $6, $7, $8) RETURNING *
    `;
    const res = await dbManager.query(query, [
      docId,
      resolvedTenantId,
      orgId,
      doc.name,
      doc.document_type,
      doc.file_url,
      doc.file_size,
      doc.expiry_date ? new Date(doc.expiry_date) : null
    ]);
    return res.rows[0];
  }

  public async deleteDocument(tenantId: string, docId: string): Promise<any> {
    const resolvedTenantId = resolveTenantUuid(tenantId);
    const query = `
      UPDATE institution_documents
      SET deleted_at = NOW(), status = 'DELETED'
      WHERE id = $1 AND tenant_id = $2::uuid RETURNING *
    `;
    const res = await dbManager.query(query, [docId, resolvedTenantId]);
    return res.rows[0];
  }

  public async getOrganizationUsers(tenantId: string): Promise<any[]> {
    const resolvedTenantId = resolveTenantUuid(tenantId);
    const query = `
      SELECT id, username AS name, email, user_type AS role, status, created_at
      FROM universal_user
      WHERE tenant_id = $1::uuid
      ORDER BY created_at DESC
    `;
    const res = await dbManager.query(query, [resolvedTenantId]);
    return res.rows;
  }

  public async getAuditEvents(tenantId: string): Promise<any[]> {
    const resolvedTenantId = resolveTenantUuid(tenantId);
    try {
      const query = `
        SELECT id, action_type as event_type, metadata::text as details, event_timestamp as created_at
        FROM core_audit.audit_event_log
        WHERE tenant_id = $1::uuid
        ORDER BY event_timestamp DESC LIMIT 50
      `;
      const res = await dbManager.query(query, [resolvedTenantId]);
      return res.rows;
    } catch (e) {
      try {
        const query2 = `
          SELECT id, operation as event_type, new_data::text as details, created_at
          FROM cdc_log
          WHERE tenant_id = $1::uuid
          ORDER BY created_at DESC LIMIT 50
        `;
        const res2 = await dbManager.query(query2, [resolvedTenantId]);
        return res2.rows;
      } catch (err) {
        return [];
      }
    }
  }
}

export const organizationService = new OrganizationService();
