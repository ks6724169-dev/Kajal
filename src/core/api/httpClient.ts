import { env } from '../config/env';

export type ApiErrorPayload = {
  error: string;
  status: number;
  details?: unknown;
};

export class ApiError extends Error {
  status: number;
  details?: unknown;

  constructor(payload: ApiErrorPayload) {
    super(payload.error);
    this.name = 'ApiError';
    this.status = payload.status;
    this.details = payload.details;
  }
}

type RequestOptions = RequestInit & {
  tenantId?: string;
  requestId?: string;
};

const buildUrl = (path: string) => {
  if (/^https?:\/\//.test(path)) return path;
  const base = env.apiBaseUrl.replace(/\/$/, '');
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${base}${normalizedPath}`;
};

export const apiRequest = async <TResponse>(path: string, options: RequestOptions = {}): Promise<TResponse> => {
  const headers = new Headers(options.headers);
  headers.set('Accept', 'application/json');

  if (options.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  if (options.tenantId) headers.set('x-tenant-id', options.tenantId);
  if (options.requestId) headers.set('x-request-id', options.requestId);

  const response = await fetch(buildUrl(path), {
    ...options,
    headers
  });

  const contentType = response.headers.get('content-type') ?? '';
  const payload = contentType.includes('application/json') ? await response.json() : await response.text();

  if (!response.ok) {
    throw new ApiError({
      error: typeof payload === 'object' && payload && 'error' in payload ? String(payload.error) : response.statusText,
      status: response.status,
      details: payload
    });
  }

  return payload as TResponse;
};

export const api = {
  get: <TResponse>(path: string, options?: RequestOptions) => apiRequest<TResponse>(path, { ...options, method: 'GET' }),
  post: <TResponse, TBody = unknown>(path: string, body: TBody, options?: RequestOptions) =>
    apiRequest<TResponse>(path, { ...options, method: 'POST', body: JSON.stringify(body) }),
  put: <TResponse, TBody = unknown>(path: string, body: TBody, options?: RequestOptions) =>
    apiRequest<TResponse>(path, { ...options, method: 'PUT', body: JSON.stringify(body) }),
  delete: <TResponse>(path: string, options?: RequestOptions) => apiRequest<TResponse>(path, { ...options, method: 'DELETE' })
};
