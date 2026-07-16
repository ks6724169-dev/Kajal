import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';

export class TokenPlatform {
  private readonly secret = process.env.JWT_SECRET || 'fallback_secret';

  public generateJwt(payload: object, expiresIn: string = '1h'): string {
    return jwt.sign(payload, this.secret, { expiresIn: expiresIn as any });
  }

  public verifyJwt<T>(token: string): T {
    return jwt.verify(token, this.secret) as T;
  }

  public generateRefreshToken(): string {
    return uuidv4();
  }
}
export const tokenPlatform = new TokenPlatform();
