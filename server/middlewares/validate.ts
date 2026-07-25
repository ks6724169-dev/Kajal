import { Request, Response, NextFunction } from 'express';
import { z, ZodSchema, ZodError } from 'zod';
import { ValidationError } from '../errors/AppError.js';

export const validateRequest = (schema: ZodSchema) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Check if schema expects a wrapper object with 'body'
      const isNested = schema instanceof z.ZodObject && 'body' in schema.shape;
      
      if (isNested) {
        await schema.parseAsync({
          body: req.body,
          query: req.query,
          params: req.params,
          headers: req.headers,
        });
      } else {
        const parsed = await schema.parseAsync(req.body);
        req.body = parsed;
      }
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        next(new ValidationError('Validation failed', error.issues));
      } else {
        next(error);
      }
    }
  };
};
