import { dbManager } from '../database/dbClient.js';

export class KnowledgeSearchEngine {
  public async smartSearch(tenantId: string, query: string): Promise<any> {
    const formattedQuery = query.split(' ').map(word => word + ':*').join(' & ');
    
    // Search Books
    const booksQuery = `
      SELECT id, title, description, 'BOOK' as entity_type 
      FROM library_book 
      WHERE tenant_id = $1 AND search_vector @@ to_tsquery('english', $2) AND status = 'ACTIVE'
      LIMIT 10
    `;
    
    // Search Digital Resources
    const resourcesQuery = `
      SELECT id, title, description, 'DIGITAL_RESOURCE' as entity_type 
      FROM digital_resource 
      WHERE tenant_id = $1 AND search_vector @@ to_tsquery('english', $2) AND status = 'ACTIVE'
      LIMIT 10
    `;
    
    const [booksRes, resourcesRes] = await Promise.all([
      dbManager.query(booksQuery, [tenantId, formattedQuery]),
      dbManager.query(resourcesQuery, [tenantId, formattedQuery])
    ]);
    
    return {
      books: booksRes.rows,
      digitalResources: resourcesRes.rows
    };
  }
}

export const knowledgeSearchEngine = new KnowledgeSearchEngine();
