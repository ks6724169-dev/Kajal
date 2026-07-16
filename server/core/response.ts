import { Response } from 'express';

export const sendSuccess = (res: Response, data: any, statusCode = 200, meta?: any) => {
  res.status(statusCode).json({
    success: true,
    data,
    meta,
  });
};

export const sendPaginated = (res: Response, data: any[], page: number, limit: number, total: number) => {
  res.status(200).json({
    success: true,
    data,
    meta: {
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    }
  });
};
