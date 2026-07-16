export class CacheManager {
  // Mock Redis implementation
  public async get(key: string): Promise<any> {
    return null;
  }
  public async set(key: string, value: any, ttlSeconds?: number): Promise<void> {}
  public async delete(key: string): Promise<void> {}
}

export const cache = new CacheManager();
