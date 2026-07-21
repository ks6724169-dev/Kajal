import { BaseRepository } from './BaseRepository.js';
import { SchoolRegistration } from '../entities/SchoolRegistration.js';
import { QuerySpecification } from './QuerySpecification.js';

export class SchoolRegistrationRepository extends BaseRepository<SchoolRegistration> {
  protected tableName = 'school_registrations';

  // Override insert because registration_id might not have tenant_id yet (it's pre-tenant)
  public async insert(entity: Partial<SchoolRegistration>): Promise<SchoolRegistration> {
    const keys = [];
    const values = [];
    let i = 1;

    for (const [key, value] of Object.entries(entity)) {
      keys.push(this.camelToSnake(key));
      values.push(value);
    }

    // Default audit fields if not provided
    if (!entity.created_at) { keys.push('created_at'); values.push(new Date()); }
    if (!entity.updated_at) { keys.push('updated_at'); values.push(new Date()); }
    if (!entity.version) { keys.push('version'); values.push(1); }

    const sql = `INSERT INTO ${this.tableName} (${keys.join(', ')}) VALUES (${keys.map(() => `$${i++}`).join(', ')}) RETURNING *`;
    
    const client = this.getClient();
    const result = await client.query(sql, values);
    
    return this.mapRowKeys<SchoolRegistration>(result.rows[0]);
  }

  // Override update to not require tenant_id for this specific process
  public async updateByRegistrationId(registrationId: string, data: Partial<SchoolRegistration>): Promise<SchoolRegistration | null> {
    const updates = [];
    const values = [];
    let paramIndex = 1;

    for (const [key, value] of Object.entries(data)) {
      const snakeKey = this.camelToSnake(key);
      if (key !== 'registration_id' && key !== 'id' && snakeKey !== 'updated_at' && snakeKey !== 'version') {
        updates.push(`${snakeKey} = $${paramIndex++}`);
        values.push(value);
      }
    }

    updates.push(`updated_at = $${paramIndex++}`);
    values.push(new Date());

    updates.push(`version = version + 1`);

    const sql = `
      UPDATE ${this.tableName} 
      SET ${updates.join(', ')} 
      WHERE registration_id = $${paramIndex++} AND deleted_at IS NULL
      RETURNING *
    `;
    
    values.push(registrationId);

    const client = this.getClient();
    const result = await client.query(sql, values);

    return result.rows.length ? this.mapRowKeys<SchoolRegistration>(result.rows[0]) : null;
  }

  public async findByRegistrationId(registrationId: string): Promise<SchoolRegistration | null> {
    const sql = `SELECT * FROM ${this.tableName} WHERE registration_id = $1 AND deleted_at IS NULL LIMIT 1`;
    const client = this.getClient();
    const result = await client.query(sql, [registrationId]);
    return result.rows.length ? this.mapRowKeys<SchoolRegistration>(result.rows[0]) : null;
  }

  public async findByName(name: string): Promise<SchoolRegistration | null> {
    const sql = `SELECT * FROM ${this.tableName} WHERE (school_name = $1 OR institution_name = $1) AND deleted_at IS NULL LIMIT 1`;
    const client = this.getClient();
    const result = await client.query(sql, [name]);
    return result.rows.length ? this.mapRowKeys<SchoolRegistration>(result.rows[0]) : null;
  }

  public async existsByName(name: string): Promise<boolean> {
    const sql = `SELECT 1 FROM ${this.tableName} WHERE (school_name = $1 OR institution_name = $1) AND deleted_at IS NULL LIMIT 1`;
    const client = this.getClient();
    const result = await client.query(sql, [name]);
    return result.rows.length > 0;
  }

  private camelToSnake(str: string): string {
    return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
  }

  private snakeToCamel(str: string): string {
    return str.replace(/(_\w)/g, m => m[1].toUpperCase());
  }

  private mapRowKeys<T>(row: any): T {
    if (!row) return row;
    const mapped: any = { ...row };
    for (const [key, value] of Object.entries(row)) {
      const camelKey = this.snakeToCamel(key);
      if (camelKey !== key) {
        mapped[camelKey] = value;
      }
    }
    return mapped as T;
  }
}
