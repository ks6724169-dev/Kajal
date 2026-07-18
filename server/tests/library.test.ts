import { describe, it, expect, beforeAll } from 'vitest';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { dbManager } from '../database/dbClient.js';
import { libraryService } from '../services/LibraryService.js';
import { digitalKnowledgeEngine } from '../services/DigitalKnowledgeEngine.js';
import { aiKnowledgeEngine } from '../services/AIKnowledgeEngine.js';
import { libraryAnalyticsEngine } from '../services/LibraryAnalyticsEngine.js';
import { UnitOfWork } from '../database/unitOfWork.js';
import { 
  LibraryBookRepository,
  BookCopyRepository,
  LibraryMemberRepository,
  DigitalResourceRepository
} from '../repositories/LibraryRepository.js';

const tenantId = '123e4567-e89b-12d3-a456-426614174999';

describe('Enterprise Library & Digital Knowledge Management Platform', () => {
  let memberId = uuidv4();
  let bookId = uuidv4();
  let copyId = uuidv4();

  beforeAll(async () => {
    const tenantRes = await dbManager.query('SELECT id FROM tenant_registry WHERE id = $1', [tenantId]);
    if (tenantRes.rows.length === 0) {
      await dbManager.query(`
        INSERT INTO tenant_registry (id, tenant_code, tenant_name, domain_name, status, subscription_tier)
        VALUES ($1, $2, $3, $4, $5, $6)
      `, [tenantId, 'ETENANT1', 'AI Test Tenant', 'ai-tenant.com', 'active', 'enterprise']);
    }

    await dbManager.query(`SET app.current_tenant = '${tenantId}'`);

    const migrationPath = path.join(process.cwd(), 'server', 'database', 'migrations', '010_library_platform.sql');
    const sql = fs.readFileSync(migrationPath, 'utf8');
    await dbManager.query(sql);
    
    // Seed a member and a book copy for tests
    const uow = new UnitOfWork(tenantId);
    try {
        await uow.begin();
        const memberRepo = uow.getRepository(LibraryMemberRepository);
        await memberRepo.insert({
           id: memberId,
           userId: uuidv4(),
           memberType: 'STUDENT',
           status: 'ACTIVE'
        });
        
        const bookRepo = uow.getRepository(LibraryBookRepository);
        const book = await bookRepo.insert({
            id: bookId,
            title: 'Test Physical Book',
            status: 'ACTIVE'
        });
        
        const copyRepo = uow.getRepository(BookCopyRepository);
        await copyRepo.insert({
            id: copyId,
            bookId: book.id!,
            barcode: 'BC123',
            isAvailable: true,
            status: 'ACTIVE'
        });
        
        await uow.commit();
    } finally {
        await uow.dispose();
    }
  });

  it('1. should register a new book', async () => {
    const book = await libraryService.registerBook(tenantId, { title: 'New Book', isbn: '123-456' });
    expect(book.id).toBeDefined();
    expect(book.title).toBe('New Book');
  });

  it('2. should issue a book', async () => {
    const issue = await libraryService.issueBook(tenantId, memberId, copyId, new Date('2026-12-31'));
    expect(issue.id).toBeDefined();
    expect(issue.isReturned).toBe(false);
  });

  it('3. should return a book with fine', async () => {
    const uow = new UnitOfWork(tenantId);
    let issueId = '';
    try {
       await uow.begin();
       const issueRes = await dbManager.query(`SELECT id FROM library_issue WHERE copy_id = $1`, [copyId]);
       issueId = issueRes.rows[0].id;
       await uow.commit();
    } finally {
       await uow.dispose();
    }
    const ret = await libraryService.returnBook(tenantId, issueId, 'GOOD', 10.50);
    expect(ret.id).toBeDefined();
    expect(ret.fineAmount).toBe(10.50);
  });

  it('4. should upload a digital resource (EBOOK)', async () => {
    const resource = await digitalKnowledgeEngine.uploadDigitalResource(tenantId, {
      title: 'Digital Physics',
      resourceType: 'EBOOK',
      fileUrl: 'http://example.com/physics.pdf'
    }, {
      isbn: '999-888',
      format: 'PDF'
    });
    
    expect(resource.id).toBeDefined();
    expect(resource.resourceType).toBe('EBOOK');
  });

  it('5. should get library dashboard metrics', async () => {
    const metrics = await libraryAnalyticsEngine.getLibraryDashboardMetrics(tenantId);
    expect(metrics.totalBooks).toBeGreaterThanOrEqual(2);
    expect(metrics.totalCopies).toBeGreaterThanOrEqual(1);
  });

  it('6. should generate AI book recommendation', async () => {
    const recommendation = await aiKnowledgeEngine.getBookRecommendation(tenantId, memberId);
    expect(recommendation.id).toBeDefined();
    expect(recommendation.recommendedBooks).toBeDefined();
  });
});
