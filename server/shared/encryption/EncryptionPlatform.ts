import crypto from 'crypto';

export class EncryptionPlatform {
  private readonly algorithm = 'aes-256-gcm';
  private readonly secretKey: string;
  
  constructor(secretKey: string) {
    if (secretKey.length !== 32) {
      this.secretKey = secretKey.padEnd(32, '0').slice(0, 32);
    } else {
      this.secretKey = secretKey;
    }
  }

  public encrypt(text: string): { ciphertext: string; iv: string; authTag: string } {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(this.algorithm, Buffer.from(this.secretKey), iv);
    let ciphertext = cipher.update(text, 'utf8', 'hex');
    ciphertext += cipher.final('hex');
    const authTag = cipher.getAuthTag().toString('hex');
    
    return { ciphertext, iv: iv.toString('hex'), authTag };
  }

  public decrypt(ciphertext: string, iv: string, authTag: string): string {
    const decipher = crypto.createDecipheriv(this.algorithm, Buffer.from(this.secretKey), Buffer.from(iv, 'hex'));
    decipher.setAuthTag(Buffer.from(authTag, 'hex'));
    let cleartext = decipher.update(ciphertext, 'hex', 'utf8');
    cleartext += decipher.final('utf8');
    return cleartext;
  }
}
export const encryptionPlatform = new EncryptionPlatform(process.env.ENCRYPTION_KEY || 'default-secret-key-32-chars-long!');
