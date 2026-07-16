export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public readonly errorCode: string;

  constructor(message: string, statusCode: number, errorCode: string = 'UNKNOWN_ERROR', isOperational: boolean = true) {
    super(message);
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.isOperational = isOperational;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  public readonly details: any;
  constructor(message: string, details?: any) {
    super(message, 400, 'VALIDATION_ERROR');
    this.details = details;
  }
}

export class SecurityError extends AppError {
  constructor(message: string) {
    super(message, 403, 'SECURITY_ERROR');
  }
}

export class BusinessError extends AppError {
  constructor(message: string) {
    super(message, 422, 'BUSINESS_ERROR');
  }
}

export class DatabaseError extends AppError {
  constructor(message: string) {
    super(message, 500, 'DATABASE_ERROR');
  }
}

export class IntegrationError extends AppError {
  constructor(message: string) {
    super(message, 502, 'INTEGRATION_ERROR');
  }
}
