import { z, ZodSchema } from 'zod';
import { ValidationError } from '../../errors/AppError.js';

export class UniversalValidator {
  public static async validate<T>(schema: ZodSchema<T>, data: unknown): Promise<T> {
    try {
      return await schema.parseAsync(data);
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new ValidationError('Validation failed', error.issues);
      }
      throw error;
    }
  }
}
