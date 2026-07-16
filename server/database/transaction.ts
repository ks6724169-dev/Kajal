import { PoolClient } from 'pg';
import { dbManager } from './dbClient.js';
import { logger } from '../telemetry/logger.js';
import { v4 as uuidv4 } from 'uuid';

export class TransactionManager {
  private client: PoolClient | null = null;
  public readonly transactionId: string;
  private isActive: boolean = false;

  constructor() {
    this.transactionId = uuidv4();
  }

  public async begin(isolationLevel?: 'READ COMMITTED' | 'REPEATABLE READ' | 'SERIALIZABLE'): Promise<void> {
    if (this.isActive) {
      throw new Error('Transaction is already active');
    }
    
    this.client = await dbManager.getWriteClient();
    try {
      if (isolationLevel) {
        await this.client.query(`BEGIN ISOLATION LEVEL ${isolationLevel}`);
      } else {
        await this.client.query('BEGIN');
      }
      this.isActive = true;
      logger.info(`Transaction ${this.transactionId} started`);
    } catch (error) {
      this.client.release();
      this.client = null;
      throw error;
    }
  }

  public async commit(): Promise<void> {
    if (!this.isActive || !this.client) {
      throw new Error('No active transaction to commit');
    }

    try {
      await this.client.query('COMMIT');
      logger.info(`Transaction ${this.transactionId} committed`);
    } finally {
      this.release();
    }
  }

  public async rollback(): Promise<void> {
    if (!this.isActive || !this.client) {
      logger.warn(`Attempted to rollback inactive transaction ${this.transactionId}`);
      return;
    }

    try {
      await this.client.query('ROLLBACK');
      logger.info(`Transaction ${this.transactionId} rolled back`);
    } finally {
      this.release();
    }
  }

  public async createSavepoint(name: string): Promise<void> {
    if (!this.isActive || !this.client) throw new Error('No active transaction');
    await this.client.query(`SAVEPOINT ${name}`);
  }

  public async rollbackToSavepoint(name: string): Promise<void> {
    if (!this.isActive || !this.client) throw new Error('No active transaction');
    await this.client.query(`ROLLBACK TO SAVEPOINT ${name}`);
  }

  public getClient(): PoolClient {
    if (!this.client) {
      throw new Error('Transaction client is not initialized');
    }
    return this.client;
  }

  private release(): void {
    if (this.client) {
      this.client.release();
      this.client = null;
    }
    this.isActive = false;
  }
}
