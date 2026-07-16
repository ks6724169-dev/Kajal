import { Request, Response, NextFunction } from 'express';
import { AppError, ValidationError } from './AppError.js';
import { logger } from '../telemetry/logger.js';

export const globalErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  // Log the error
  logger.error(err.message, { stack: err.stack, path: req.path, method: req.method, ip: req.ip });

  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      error: {
        code: err.errorCode,
        message: err.message,
        details: err instanceof ValidationError ? err.details : undefined,
      },
      correlation_id: req.headers['x-correlation-id'] || 'unknown',
    });
    return;
  }

  // Unhandled errors
  res.status(500).json({
    success: false,
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: 'An unexpected error occurred',
    },
    correlation_id: req.headers['x-correlation-id'] || 'unknown',
  });
};
