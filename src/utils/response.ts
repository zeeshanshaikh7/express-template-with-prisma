import { Response } from 'express';
import { HttpError } from 'http-errors';

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  errors?: unknown;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
  };
}

export const sendSuccess = <T>(
  res: Response,
  data: T,
  message = 'Success',
  statusCode = 200,
  meta?: ApiResponse['meta']
): Response => {
  const payload: ApiResponse<T> = { success: true, message, data };
  if (meta) payload.meta = meta;
  return res.status(statusCode).json(payload);
};

export const sendCreated = <T>(
  res: Response,
  data: T,
  message = 'Created successfully'
): Response => sendSuccess(res, data, message, 201);

export const sendError = (
  res: Response,
  error: HttpError,
  errors?: unknown
): Response => {
  const payload: ApiResponse = {
    success: false,
    message: error.message,
  };

  if (errors) payload.errors = errors;

  return res.status(error.statusCode).json(payload);
};
