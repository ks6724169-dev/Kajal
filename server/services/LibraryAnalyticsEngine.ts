import { dbManager } from '../database/dbClient.js';

export class LibraryAnalyticsEngine {
  public async getLibraryDashboardMetrics(tenantId: string): Promise<any> {
    const totalBooksRes = await dbManager.query(`SELECT COUNT(*) FROM library_book WHERE tenant_id = $1 AND status = 'ACTIVE'`, [tenantId]);
    const totalCopiesRes = await dbManager.query(`SELECT COUNT(*) FROM library_copy WHERE tenant_id = $1 AND status = 'ACTIVE'`, [tenantId]);
    const issuedCopiesRes = await dbManager.query(`SELECT COUNT(*) FROM library_issue WHERE tenant_id = $1 AND is_returned = FALSE AND status = 'ACTIVE'`, [tenantId]);
    
    return {
      totalBooks: parseInt(totalBooksRes.rows[0].count),
      totalCopies: parseInt(totalCopiesRes.rows[0].count),
      issuedCopies: parseInt(issuedCopiesRes.rows[0].count)
    };
  }
}

export const libraryAnalyticsEngine = new LibraryAnalyticsEngine();
