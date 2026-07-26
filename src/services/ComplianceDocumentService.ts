import { supabase } from './supabase';
import { AuditLogger } from './AuditLogger';

export interface ComplianceDoc {
  id: string;
  tenant_id: string;
  organization_id?: string;
  campus_id?: string;
  name: string;
  type: 'LEGAL' | 'REGULATORY' | 'COMPLIANCE';
  category: string;
  file_url: string;
  file_name?: string;
  file_type?: string;
  file_size?: string;
  issue_date: string;
  expiry_date: string;
  issueDate?: string;
  expiryDate?: string;
  status: 'ACTIVE' | 'EXPIRING_SOON' | 'EXPIRED';
  version: string;
  issuer: string;
  uploaded_by?: string;
  uploaded_at?: string;
}

const STORAGE_BUCKET = 'institution-documents';

const INITIAL_SEED_DOCUMENTS: ComplianceDoc[] = [
  {
    id: 'doc-1',
    tenant_id: 'apex_k12',
    name: 'Institutional Registration Certificate',
    type: 'LEGAL',
    category: 'Registration',
    file_url: 'https://placeholder.supabase.co/storage/v1/object/public/institution-documents/registration_cert.pdf',
    file_name: 'registration_cert.pdf',
    file_type: 'application/pdf',
    file_size: '2.4 MB',
    issue_date: '2010-06-15',
    expiry_date: '2030-06-15',
    issueDate: '2010-06-15',
    expiryDate: '2030-06-15',
    status: 'ACTIVE',
    version: 'v2.0',
    issuer: 'State Education Dept'
  },
  {
    id: 'doc-2',
    tenant_id: 'apex_k12',
    name: 'Academic Board Affiliation Letter',
    type: 'REGULATORY',
    category: 'Affiliation',
    file_url: 'https://placeholder.supabase.co/storage/v1/object/public/institution-documents/affiliation_letter.pdf',
    file_name: 'affiliation_letter.pdf',
    file_type: 'application/pdf',
    file_size: '1.8 MB',
    issue_date: '2025-04-01',
    expiry_date: '2026-03-31',
    issueDate: '2025-04-01',
    expiryDate: '2026-03-31',
    status: 'EXPIRING_SOON',
    version: 'v1.1',
    issuer: 'Central Board of Education'
  },
  {
    id: 'doc-3',
    tenant_id: 'apex_k12',
    name: 'Campus Fire & Safety NOC',
    type: 'COMPLIANCE',
    category: 'Safety',
    file_url: 'https://placeholder.supabase.co/storage/v1/object/public/institution-documents/fire_safety_noc.pdf',
    file_name: 'fire_safety_noc.pdf',
    file_type: 'application/pdf',
    file_size: '1.2 MB',
    issue_date: '2024-01-10',
    expiry_date: '2025-01-10',
    issueDate: '2024-01-10',
    expiryDate: '2025-01-10',
    status: 'EXPIRED',
    version: 'v1.0',
    issuer: 'Municipal Fire Service'
  }
];

function toValidUuid(val: string): string {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (uuidRegex.test(val)) return val;
  return '00000000-0000-4000-a000-000000000001';
}

export class ComplianceDocumentService {
  private static getLocalStorageKey(tenantId: string): string {
    return `galaxy_compliance_docs_${tenantId}`;
  }

  private static getLocalDocs(tenantId: string): ComplianceDoc[] {
    try {
      const stored = localStorage.getItem(this.getLocalStorageKey(tenantId));
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('Error reading local documents:', e);
    }
    return [];
  }

  private static saveLocalDocs(tenantId: string, docs: ComplianceDoc[]) {
    try {
      localStorage.setItem(this.getLocalStorageKey(tenantId), JSON.stringify(docs));
    } catch (e) {
      console.error('Error saving local documents:', e);
    }
  }

  /**
   * Calculates real-time compliance status based on current date vs expiry_date
   */
  public static calculateStatus(expiryDate: string): 'ACTIVE' | 'EXPIRING_SOON' | 'EXPIRED' {
    if (!expiryDate) return 'ACTIVE';
    const expiry = new Date(expiryDate).getTime();
    const now = new Date().getTime();
    const thirtyDaysInMs = 30 * 24 * 60 * 60 * 1000;

    if (expiry < now) {
      return 'EXPIRED';
    } else if (expiry - now < thirtyDaysInMs) {
      return 'EXPIRING_SOON';
    }
    return 'ACTIVE';
  }

  /**
   * Format file size nicely
   */
  public static formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  }

  /**
   * Generates a short-lived Signed URL for secure private document access
   */
  public static async getSignedDocumentUrl(
    filePathOrUrl: string,
    expiresInSeconds: number = 3600
  ): Promise<string> {
    if (!filePathOrUrl) return '';

    // Data URLs or Blob URLs return immediately
    if (filePathOrUrl.startsWith('data:') || filePathOrUrl.startsWith('blob:')) {
      return filePathOrUrl;
    }

    try {
      let storagePath = filePathOrUrl;
      if (filePathOrUrl.includes('/storage/v1/object/')) {
        const parts = filePathOrUrl.split('/institution-documents/');
        if (parts.length > 1) {
          storagePath = decodeURIComponent(parts[1].split('?')[0]);
        }
      } else if (filePathOrUrl.startsWith('institution-documents/')) {
        storagePath = filePathOrUrl.replace('institution-documents/', '');
      }

      const { data, error } = await supabase.storage
        .from(STORAGE_BUCKET)
        .createSignedUrl(storagePath, expiresInSeconds);

      if (!error && data?.signedUrl) {
        return data.signedUrl;
      }
    } catch (err) {
      console.warn('Error generating signed URL:', err);
    }

    return filePathOrUrl;
  }

  /**
   * Log document view event in Audit Trail
   */
  public static logDocumentViewed(docId: string, docName: string, tenantId: string, userId?: string) {
    AuditLogger.log({
      eventType: 'DOCUMENT_VIEWED',
      details: `Compliance document '${docName}' was viewed`,
      tenantId,
      userId,
      metadata: { docId }
    });
  }

  /**
   * Log document download event in Audit Trail
   */
  public static logDocumentDownloaded(docId: string, docName: string, tenantId: string, userId?: string) {
    AuditLogger.log({
      eventType: 'DOCUMENT_DOWNLOADED',
      details: `Compliance document '${docName}' was downloaded`,
      tenantId,
      userId,
      metadata: { docId }
    });
  }

  /**
   * Upload file to Private Supabase Storage with file type/size validation and local fallback
   */
  public static async uploadFileToStorage(
    file: File,
    tenantId: string
  ): Promise<{ fileUrl: string; filePath: string }> {
    // 1. Validation
    const validExtensions = ['pdf', 'doc', 'docx', 'png', 'jpg', 'jpeg'];
    const ext = file.name.split('.').pop()?.toLowerCase() || '';

    if (!validExtensions.includes(ext)) {
      throw new Error('Unsupported file format. Allowed formats: PDF, DOC/DOCX, PNG, JPG/JPEG.');
    }

    if (file.size > 25 * 1024 * 1024) { // 25 MB
      throw new Error('File exceeds maximum size limit of 25MB.');
    }

    const timestamp = Date.now();
    const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const filePath = `${tenantId}/${timestamp}_${sanitizedFileName}`;

    try {
      // 2. Attempt upload to Private Supabase Storage
      const { data, error } = await supabase.storage
        .from(STORAGE_BUCKET)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (!error && data) {
        // Generate initial signed URL for immediate reference
        const signedUrl = await this.getSignedDocumentUrl(filePath);
        return { fileUrl: signedUrl || filePath, filePath };
      }
    } catch (err) {
      console.warn('Supabase storage upload fallback triggered:', err);
    }

    // 3. Fallback: Convert file to Base64 Data URL for persistent offline preview/download
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        resolve({ fileUrl: result, filePath });
      };
      reader.onerror = (e) => reject(e);
      reader.readAsDataURL(file);
    });
  }

  /**
   * Fetch all compliance documents for tenant
   */
  public static async getDocuments(tenantId: string, campusId?: string): Promise<ComplianceDoc[]> {
    let remoteDocs: ComplianceDoc[] = [];

    try {
      let query = supabase
        .from('institution_documents')
        .select('*')
        .eq('tenant_id', tenantId)
        .is('deleted_at', null)
        .order('uploaded_at', { ascending: false });

      if (campusId && campusId !== 'All Campuses') {
        query = query.eq('campus_id', campusId);
      }

      const { data, error } = await query;

      if (!error && data) {
        remoteDocs = data.map(d => ({
          id: d.id,
          tenant_id: d.tenant_id,
          organization_id: d.organization_id,
          campus_id: d.campus_id,
          name: d.name,
          type: (d.document_type || 'LEGAL').toUpperCase() as any,
          category: d.category || 'Compliance',
          file_url: d.file_url,
          file_name: d.file_name,
          file_type: d.file_type,
          file_size: d.file_size,
          issue_date: d.issue_date ? d.issue_date.split('T')[0] : new Date().toISOString().split('T')[0],
          expiry_date: d.expiry_date ? d.expiry_date.split('T')[0] : '2030-12-31',
          issueDate: d.issue_date ? d.issue_date.split('T')[0] : new Date().toISOString().split('T')[0],
          expiryDate: d.expiry_date ? d.expiry_date.split('T')[0] : '2030-12-31',
          status: this.calculateStatus(d.expiry_date),
          version: d.version || 'v1.0',
          issuer: d.issuer || 'Statutory Authority',
          uploaded_by: d.uploaded_by,
          uploaded_at: d.uploaded_at
        }));
      }
    } catch (e) {
      console.warn('Remote fetch failed, relying on local store:', e);
    }

    // Combine remote docs + local stored docs + seed defaults
    const localDocs = this.getLocalDocs(tenantId);
    const combinedMap = new Map<string, ComplianceDoc>();

    // Add seed docs first
    INITIAL_SEED_DOCUMENTS.forEach(d => combinedMap.set(d.id, d));
    // Override with remote
    remoteDocs.forEach(d => combinedMap.set(d.id, d));
    // Override with local
    localDocs.forEach(d => combinedMap.set(d.id, d));

    let finalDocs = Array.from(combinedMap.values());

    // Apply campus filtering if specified
    if (campusId && campusId !== 'All Campuses') {
      finalDocs = finalDocs.filter(d => !d.campus_id || d.campus_id === campusId || d.campus_id === 'All Campuses');
    }

    // Re-evaluate statuses dynamically
    return finalDocs.map(d => ({
      ...d,
      status: this.calculateStatus(d.expiry_date || d.expiryDate || '')
    }));
  }

  /**
   * Create document record in Database & Local Store
   */
  public static async createDocument(
    params: {
      tenantId: string;
      campusId?: string;
      name: string;
      type: 'LEGAL' | 'REGULATORY' | 'COMPLIANCE';
      category: string;
      fileUrl: string;
      fileName: string;
      fileType: string;
      fileSize: string;
      issueDate: string;
      expiryDate: string;
      issuer: string;
      uploadedBy: string;
    }
  ): Promise<ComplianceDoc> {
    const docId = `doc-${Date.now()}`;
    const newDoc: ComplianceDoc = {
      id: docId,
      tenant_id: params.tenantId,
      campus_id: params.campusId || 'All Campuses',
      name: params.name,
      type: params.type,
      category: params.category,
      file_url: params.fileUrl,
      file_name: params.fileName,
      file_type: params.fileType,
      file_size: params.fileSize,
      issue_date: params.issueDate,
      expiry_date: params.expiryDate,
      issueDate: params.issueDate,
      expiryDate: params.expiryDate,
      status: this.calculateStatus(params.expiryDate),
      version: 'v1.0',
      issuer: params.issuer,
      uploaded_by: params.uploadedBy,
      uploaded_at: new Date().toISOString()
    };

    // 1. Persist to Supabase DB if possible
    try {
      const validDbTenantId = toValidUuid(params.tenantId);
      await supabase.from('institution_documents').insert([{
        tenant_id: validDbTenantId,
        organization_id: validDbTenantId,
        campus_id: params.campusId || 'All Campuses',
        name: params.name,
        document_type: params.type,
        category: params.category,
        file_url: params.fileUrl,
        file_name: params.fileName,
        file_type: params.fileType,
        file_size: params.fileSize,
        issue_date: params.issueDate,
        expiry_date: params.expiryDate,
        issuer: params.issuer,
        status: newDoc.status,
        version: 'v1.0'
      }]);
    } catch (e) {
      console.warn('Supabase DB insert fallback:', e);
    }

    // 2. Save in Local Store for instant client reflection & offline persistence
    const currentLocal = this.getLocalDocs(params.tenantId);
    this.saveLocalDocs(params.tenantId, [newDoc, ...currentLocal]);

    // 3. Log Audit Record
    AuditLogger.log({
      eventType: 'DOCUMENT_UPLOADED',
      details: `Compliance document '${params.name}' uploaded from ${params.issuer}`,
      tenantId: params.tenantId,
      userId: params.uploadedBy,
      metadata: { docId, fileName: params.fileName, expiryDate: params.expiryDate }
    });

    return newDoc;
  }

  /**
   * Renew document (update expiry and increment version)
   */
  public static async renewDocument(
    docId: string,
    docName: string,
    tenantId: string,
    newExpiryDate: string
  ): Promise<void> {
    const nextVersion = 'v2.0';

    // 1. Update remote DB
    try {
      await supabase
        .from('institution_documents')
        .update({
          expiry_date: newExpiryDate,
          status: 'ACTIVE',
          version: nextVersion,
          updated_at: new Date().toISOString()
        })
        .eq('id', docId)
        .eq('tenant_id', tenantId);
    } catch (e) {
      console.warn('Supabase update fallback:', e);
    }

    // 2. Update Local Store
    const localDocs = this.getLocalDocs(tenantId);
    const existingIndex = localDocs.findIndex(d => d.id === docId);

    if (existingIndex >= 0) {
      localDocs[existingIndex] = {
        ...localDocs[existingIndex],
        expiry_date: newExpiryDate,
        expiryDate: newExpiryDate,
        status: 'ACTIVE',
        version: nextVersion
      };
      this.saveLocalDocs(tenantId, localDocs);
    } else {
      // Find from seeds and save updated version to local store
      const seedDoc = INITIAL_SEED_DOCUMENTS.find(d => d.id === docId);
      if (seedDoc) {
        const updated = {
          ...seedDoc,
          expiry_date: newExpiryDate,
          expiryDate: newExpiryDate,
          status: 'ACTIVE' as const,
          version: nextVersion
        };
        this.saveLocalDocs(tenantId, [updated, ...localDocs]);
      }
    }

    // 3. Audit Log
    AuditLogger.log({
      eventType: 'DOCUMENT_RENEWED',
      details: `Compliance document '${docName}' renewed until ${newExpiryDate}`,
      tenantId,
      metadata: { docId, newExpiryDate }
    });
  }
}
