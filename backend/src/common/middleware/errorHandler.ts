import { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';
import { AppError } from '../errors/AppError';
import { logger } from '../utils/logger';
import { env } from '../../config/env';

export function notFoundHandler(req: Request, res: Response): void {
  res.status(404).json({
    error: { code: 'NOT_FOUND', message: `Route ${req.method} ${req.path} not found` },
    requestId: req.id,
  });
}

// Intentionally 4-arg — Express identifies error middleware by arity.
export function errorHandler(
  err: unknown,
  req: Request,
  res: Response,
  _next: NextFunction,
): void {
  let statusCode = 500;
  let code = 'INTERNAL_ERROR';
  let message = 'An unexpected error occurred';
  let details: unknown;

  if (err instanceof ZodError) {
    statusCode = 422;
    code = 'VALIDATION_ERROR';
    message = 'Validation failed';
    details = err.flatten();
  } else if (err instanceof AppError) {
    statusCode = err.statusCode;
    code = err.code;
    message = err.message;
    details = err.details;
  } else if (err instanceof Error) {
    message = env.NODE_ENV === 'production' ? message : err.message;
  }

  // Never log secrets/PII: only structured metadata, never req.body wholesale.
  logger.error(
    {
      requestId: req.id,
      statusCode,
      code,
      path: req.path,
      method: req.method,
      // Stack only in non-production logs.
      stack: env.NODE_ENV !== 'production' && err instanceof Error ? err.stack : undefined,
    },
    message,
  );

  res.status(statusCode).json({
    error: {
      code,
      message,
      ...(details !== undefined ? { details } : {}),
    },
    requestId: req.id,
  });
}
