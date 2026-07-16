export interface BaseResponseDTO<T> {
  success: boolean;
  message: string;
  data?: T;
  meta?: {
    pagination?: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
    [key: string]: any;
  };
  errors?: any[];
  correlationId: string;
  timestamp: string;
  version: string;
}
