export class AuthenticationError extends Error {
  public code: string;
  public field?: string;

  constructor(message: string, code: string = 'AUTH_ERROR', field?: string) {
    super(message);
    this.name = 'AuthenticationError';
    this.code = code;
    this.field = field;
  }
}

export const formatAuthError = (err: unknown): string => {
  if (err instanceof AuthenticationError) {
    return err.message;
  }
  if (err && typeof err === 'object' && 'message' in err) {
    return String((err as any).message);
  }
  return 'An unexpected error occurred during authentication. Please try again.';
};
