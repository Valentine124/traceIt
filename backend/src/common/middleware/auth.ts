import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../../config/env';
import { UnauthorizedError } from '../errors/AppError';
import { RoleName } from '@prisma/client';
import { redis } from '../../database/redis';

export interface AuthTokenPayload {
  sub: string; // user id
  roles: RoleName[];
  orgIds: string[];
  tokenVersion: number; // bumped on logout-all / password change to revoke old tokens
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: AuthTokenPayload;
    }
  }
}

function extractToken(req: Request): string | null {
  const header = req.header('authorization');
  if (header?.startsWith('Bearer ')) return header.slice(7);
  return null;
}

/** Populates req.user if a valid token is present; does not require one. */
export function optionalAuth(req: Request, _res: Response, next: NextFunction): void {
  const token = extractToken(req);
  if (!token) return next();
  try {
    req.user = jwt.verify(token, env.JWT_ACCESS_SECRET) as AuthTokenPayload;
  } catch {
    // Invalid/expired token on an optional-auth route: proceed as anonymous
    // rather than failing the request.
  }
  next();
}

/** Rejects the request unless a valid, non-revoked access token is present. */
export async function requireAuth(req: Request, _res: Response, next: NextFunction): Promise<void> {
  const token = extractToken(req);
  if (!token) return next(new UnauthorizedError());
  try {
    const payload = jwt.verify(token, env.JWT_ACCESS_SECRET) as AuthTokenPayload;
    // Check revocation: logout-all / password-change bumps this counter in
    // Redis, instantly invalidating every previously issued token.
    const currentVersion = await redis.get(`tokenVersion:${payload.sub}`);
    const expected = currentVersion ? parseInt(currentVersion, 10) : 0;
    if (payload.tokenVersion !== expected) {
      return next(new UnauthorizedError('Token has been revoked'));
    }
    req.user = payload;
    next();
  } catch {
    next(new UnauthorizedError('Invalid or expired token'));
  }
}
