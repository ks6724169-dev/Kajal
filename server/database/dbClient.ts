import { Pool, PoolClient } from 'pg';
import { logger } from '../telemetry/logger.js';

export class DatabaseManager {
  private static instance: DatabaseManager;
  private writePool: Pool;
  private readPool: Pool;

  private constructor() {
    // Write pool connects to the primary database
    this.writePool = new Pool({
      connectionString: process.env.DATABASE_URL,
      max: 20,
      idleTimeoutMillis: 30000,
    });

    // Read pool connects to the read replica (or falls back to primary)
    this.readPool = new Pool({
      connectionString: process.env.READ_REPLICA_URL || process.env.DATABASE_URL,
      max: 50,
      idleTimeoutMillis: 30000,
    });

    this.writePool.on('error', (err) => {
      logger.error('Unexpected error on idle write client', err);
    });

    this.readPool.on('error', (err) => {
      logger.error('Unexpected error on idle read client', err);
    });
  }

  public static getInstance(): DatabaseManager {
    if (!DatabaseManager.instance) {
      DatabaseManager.instance = new DatabaseManager();
    }
    return DatabaseManager.instance;
  }

  public async getWriteClient(): Promise<PoolClient> {
    return await this.writePool.connect();
  }

  public async getReadClient(): Promise<PoolClient> {
    return await this.readPool.connect();
  }

  public async query(text: string, params?: any[], useReplica: boolean = false) {
    const start = Date.now();
    const pool = useReplica ? this.readPool : this.writePool;
    try {
      const res = await pool.query(text, params);
      const duration = Date.now() - start;
      if (duration > 1000) {
        logger.warn('Slow query detected', { text, duration, rows: res.rowCount });
      }
      return res;
    } catch (error) {
      logger.error('Query execution error', { text, error });
      throw error;
    }
  }

  public async healthCheck(): Promise<{ write: boolean; read: boolean }> {
    try {
      await this.writePool.query('SELECT 1');
      await this.readPool.query('SELECT 1');
      return { write: true, read: true };
    } catch (error) {
      return { write: false, read: false };
    }
  }
}

export const dbManager = DatabaseManager.getInstance();
