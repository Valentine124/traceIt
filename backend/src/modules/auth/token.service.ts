import jwt from 'jsonwebtoken';
import { RoleName } from '@prisma/client';
import { env } from '../../config/env';
import { redis } from '../../database/redis';
import { AuthTokenPayload } from '../../common/middleware/auth';

export interface IssuedTokens {
  accessToken: string;
  refreshToken: string;
}

function tokenVersionKey(userId: string): string {
  return `tokenVersion:${userId}`;
}

async function getTokenVersion(userId: string): Promise<number> {
  const v = await redis.get(tokenVersionKey(userId));
  return v ? parseInt(v, 10) : 0;
}

export async function issueTokens(
  userId: string,
  roles: RoleName[],
  orgIds: string[],
): Promise<IssuedTokens> {
  const tokenVersion = await getTokenVersion(userId);
  const payload: AuthTokenPayload = { sub: userId, roles, orgIds, tokenVersion };

  const accessToken = jwt.sign(payload, env.JWT_ACCESS_SECRET, {
    expiresIn: env.JWT_ACCESS_TTL as jwt.SignOptions['expiresIn'],
  });
  const refreshToken = jwt.sign({ sub: userId, tokenVersion }, env.JWT_REFRESH_SECRET, {
    expiresIn: env.JWT_REFRESH_TTL as jwt.SignOptions['expiresIn'],
  });
  return { accessToken, refreshToken };
}

export function verifyRefreshToken(token: string): { sub: string; tokenVersion: number } {
  return jwt.verify(token, env.JWT_REFRESH_SECRET) as { sub: string; tokenVersion: number };
}

/** Revokes ALL outstanding access/refresh tokens for a user (logout-all, password change). */
export async function revokeAllTokens(userId: string): Promise<void> {
  await redis.incr(tokenVersionKey(userId));
}

export async function currentTokenVersion(userId: string): Promise<number> {
  return getTokenVersion(userId);
}
