import bcrypt from 'bcrypt';

export class HashPlatform {
  private readonly saltRounds = 10;

  public async hash(plainText: string): Promise<string> {
    return await bcrypt.hash(plainText, this.saltRounds);
  }

  public async compare(plainText: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(plainText, hash);
  }
}
export const hashPlatform = new HashPlatform();
