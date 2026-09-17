import { NextFunction, Request, Response } from 'express';
import { RoleName } from '@prisma/client';
import { ForbiddenError, UnauthorizedError } from '../errors/AppError';

/**
 * Centralized role gate. All authorization decisions should route through
 * here (or requirePermission below) rather than being hand-rolled in
 * controllers/services — this is the single place to audit for correctness.
 */
export function requireRole(...allowed: RoleName[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) return next(new UnauthorizedError());
    const hasRole = req.user.roles.some((r) => allowed.includes(r));
    if (!hasRole) return next(new ForbiddenError());
    next();
  };
}

/**
 * Ownership/org-scope check for org-scoped resources (e.g. an
 * ORGANIZATION_ADMIN may only manage their own org's projects/responses).
 * SYSTEM_ADMIN bypasses scope checks.
 */
export function requireOrgAccess(getOrgId: (req: Request) => string | undefined) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) return next(new UnauthorizedError());
    if (req.user.roles.includes(RoleName.SYSTEM_ADMIN)) return next();

    const targetOrgId = getOrgId(req);
    if (!targetOrgId || !req.user.orgIds.includes(targetOrgId)) {
      return next(new ForbiddenError('Not a member of this organization'));
    }
    next();
  };
}
