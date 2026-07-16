import { SupabaseClient } from '@supabase/supabase-js';

export abstract class BaseRepository<T extends { id: string }> {
  protected constructor(
    protected readonly supabase: SupabaseClient,
    protected readonly tableName: string
  ) {}

  async findById(id: string): Promise<T | null> {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error(`Error finding ${this.tableName} by id:`, error);
      return null;
    }

    return data as T;
  }

  async findAll(): Promise<T[]> {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select('*')
      .eq('is_deleted', false);

    if (error) {
      console.error(`Error finding all from ${this.tableName}:`, error);
      return [];
    }

    return data as T[];
  }

  async create(payload: Partial<T>): Promise<T | null> {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .insert([payload as any])
      .select()
      .single();

    if (error) {
      console.error(`Error creating ${this.tableName}:`, error);
      return null;
    }

    return data as T;
  }

  async update(id: string, payload: Partial<T>): Promise<T | null> {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .update(payload as any)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error(`Error updating ${this.tableName}:`, error);
      return null;
    }

    return data as T;
  }

  async softDelete(id: string, deletedBy?: string): Promise<boolean> {
    const { error } = await this.supabase
      .from(this.tableName)
      .update({
        is_deleted: true,
        deleted_at: new Date().toISOString(),
        deleted_by: deletedBy || null,
      })
      .eq('id', id);

    if (error) {
      console.error(`Error soft deleting ${this.tableName}:`, error);
      return false;
    }

    return true;
  }

  async hardDelete(id: string): Promise<boolean> {
    const { error } = await this.supabase
      .from(this.tableName)
      .delete()
      .eq('id', id);

    if (error) {
      console.error(`Error hard deleting ${this.tableName}:`, error);
      return false;
    }

    return true;
  }
}
