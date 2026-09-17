import { Router } from 'express';
import { RoleName } from '@prisma/client';
import { validate } from '../../common/validation/validate';
import { requireAuth, optionalAuth } from '../../common/middleware/auth';
import { requireRole } from '../../common/middleware/rbac';
import * as controller from './projects.controller';
import {
  createProjectSchema,
  updateProjectSchema,
  updateProjectStatusSchema,
  listProjectsQuerySchema,
  projectIdParamSchema,
} from './projects.validation';

const router = Router();

// Discovery is public (spec: citizens discover public projects) — optionalAuth
// still populates req.user when present, for future personalization.
router.get('/', optionalAuth, validate({ query: listProjectsQuerySchema }), controller.list);
router.get('/:id', optionalAuth, validate({ params: projectIdParamSchema }), controller.getById);

router.post(
  '/',
  requireAuth,
  requireRole(RoleName.ORGANIZATION_ADMIN, RoleName.SYSTEM_ADMIN),
  validate({ body: createProjectSchema }),
  controller.create,
);

router.patch(
  '/:id',
  requireAuth,
  requireRole(RoleName.ORGANIZATION_ADMIN, RoleName.SYSTEM_ADMIN),
  validate({ params: projectIdParamSchema, body: updateProjectSchema }),
  controller.update,
);

router.post(
  '/:id/status',
  requireAuth,
  requireRole(RoleName.ORGANIZATION_ADMIN, RoleName.SYSTEM_ADMIN, RoleName.VERIFIER),
  validate({ params: projectIdParamSchema, body: updateProjectStatusSchema }),
  controller.updateStatus,
);

router.delete(
  '/:id',
  requireAuth,
  requireRole(RoleName.SYSTEM_ADMIN),
  validate({ params: projectIdParamSchema }),
  controller.remove,
);

export default router;
