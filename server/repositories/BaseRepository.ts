import { BaseEntity } from '../entities/BaseEntity.js';
import { dbManager } from '../database/dbClient.js';
import { TransactionManager } from '../database/transaction.js';
import { QuerySpecification } from './QuerySpecification.js';
import { logger } from '../telemetry/logger.js';
import { v4 as uuidv4 } from 'uuid';

function camelToSnake(str: string): string {
  return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
}

function snakeToCamel(str: string): string {
  return str.replace(/(_\w)/g, m => m[1].toUpperCase());
}

function mapRowKeys<T>(row: any): T {
  if (!row) return row;
  const mapped = { ...row };
  for (const [key, value] of Object.entries(row)) {
    const camelKey = snakeToCamel(key);
    if (camelKey !== key) {
      mapped[camelKey] = value;
    }
  }
  return mapped as T;
}

export abstract class BaseRepository<T extends BaseEntity> {
  protected abstract tableName: string;

  constructor(
    protected readonly tenantId: string,
    protected readonly txManager?: TransactionManager
  ) {}

  protected getClient() {
    return (this.txManager && this.txManager.hasActiveTransaction) ? this.txManager.getClient() : dbManager;
  }

  protected enforceTenant(spec: QuerySpecification): QuerySpecification {
    spec.and('tenant_id', this.tenantId);
    return spec;
  }

  public async findOne(id: string): Promise<T | null> {
    const spec = new QuerySpecification();
    spec.and('id', id);
    this.enforceTenant(spec);
    spec.isNull('deleted_at');

    const { query, params } = spec.toSql();
    const sql = `SELECT * FROM ${this.tableName} WHERE ${query} LIMIT 1`;
    
    const client = this.getClient();
    const result = await client.query(sql, params);
    
    return result.rows.length ? mapRowKeys<T>(result.rows[0]) : null;
  }

  public async findMany(spec?: QuerySpecification, limit: number = 100, offset: number = 0): Promise<T[]> {
    const querySpec = spec || new QuerySpecification();
    this.enforceTenant(querySpec);
    querySpec.isNull('deleted_at');

    const { query, params } = querySpec.toSql();
    const sql = `SELECT * FROM ${this.tableName} WHERE ${query} LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    
    const client = this.getClient();
    const result = await client.query(sql, [...params, limit, offset]);
    
    return result.rows.map(row => mapRowKeys<T>(row));
  }

  public async insert(entity: Partial<T>): Promise<T> {
    const snakeEntity: any = {};
    for (const [k, v] of Object.entries(entity)) {
      snakeEntity[camelToSnake(k)] = v;
    }

    const data = {
      ...snakeEntity,
      id: entity.id || uuidv4(),
      tenant_id: this.tenantId,
      created_at: new Date(),
      updated_at: new Date(),
      version: 1,
    };

    const keys = Object.keys(data);
    const values = Object.values(data);
    const placeholders = keys.map((_, i) => `$${i + 1}`).join(', ');

    const sql = `INSERT INTO ${this.tableName} (${keys.join(', ')}) VALUES (${placeholders}) RETURNING *`;
    
    const client = this.getClient();
    const result = await client.query(sql, values);
    
    return mapRowKeys<T>(result.rows[0]);
  }

  public async update(id: string, data: Partial<T>, currentVersion: number): Promise<T | null> {
    const updates = [];
    const values = [];
    let paramIndex = 1;

    const snakeData: any = {};
    for (const [k, v] of Object.entries(data)) {
      snakeData[camelToSnake(k)] = v;
    }

    for (const [key, value] of Object.entries(snakeData)) {
      if (key !== 'id' && key !== 'tenant_id' && key !== 'version') {
        updates.push(`${key} = $${paramIndex++}`);
        values.push(value);
      }
    }

    updates.push(`version = version + 1`);
    updates.push(`updated_at = $${paramIndex++}`);
    values.push(new Date());

    const sql = `
      UPDATE ${this.tableName} 
      SET ${updates.join(', ')} 
      WHERE id = $${paramIndex++} AND tenant_id = $${paramIndex++} AND version = $${paramIndex++} AND deleted_at IS NULL
      RETURNING *
    `;
    
    values.push(id, this.tenantId, currentVersion);

    const client = this.getClient();
    const result = await client.query(sql, values);

    if (result.rows.length === 0) {
      throw new Error('Optimistic Locking Error: Record not found, modified, or deleted');
    }

    return mapRowKeys<T>(result.rows[0]);
  }

  public async softDelete(id: string, deletedBy?: string): Promise<boolean> {
    const sql = `
      UPDATE ${this.tableName}
      SET deleted_at = $1, deleted_by = $2, updated_at = $1
      WHERE id = $3 AND tenant_id = $4 AND deleted_at IS NULL
    `;
    const client = this.getClient();
    const result = await client.query(sql, [new Date(), deletedBy || null, id, this.tenantId]);
    
    return result.rowCount !== null && result.rowCount > 0;
  }
}
