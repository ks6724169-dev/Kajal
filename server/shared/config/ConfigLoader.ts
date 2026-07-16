export class ConfigLoader {
  private cache: Map<string, any> = new Map();

  public get(key: string, defaultValue?: any): any {
    if (this.cache.has(key)) {
      return this.cache.get(key);
    }
    const value = process.env[key] || defaultValue;
    this.cache.set(key, value);
    return value;
  }

  public getBoolean(key: string, defaultValue: boolean = false): boolean {
    const value = this.get(key);
    if (value === undefined) return defaultValue;
    return value === 'true' || value === true;
  }

  public getNumber(key: string, defaultValue: number = 0): number {
    const value = this.get(key);
    if (value === undefined) return defaultValue;
    return Number(value);
  }
}

export const configLoader = new ConfigLoader();
