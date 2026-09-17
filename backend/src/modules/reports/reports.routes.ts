import { Router } from 'express';
import { RoleName } from '@prisma/client';
import { validate } from '../../common/validation/validate';
import { requireAuth, optionalAuth } from '../../common/middleware/auth';
import { requireRole } from '../../common/middleware/rbac';
import { generalLimiter } from '../../common/middleware/rateLimit';
import * as controller from './reports.controller';
import {
  createReportSchema,
  updateReportStatusSchema,
  listReportsQuerySchema,
} from './reports.validation';

const router = Router();

// Anonymous submission is a first-class path — optionalAuth, not requireAuth.
router.post('/', generalLimiter, optionalAuth, validate({ body: createReportSchema }), controller.create);

// Public tracking by opaque trackingId — no auth, no listing, no enumeration
// (trackingId is a UUID, not a sequential id).
router.get('/track/:trackingId', generalLimiter, controller.track);

router.get(
  '/',
  requireAuth,
  requireRole(RoleName.VERIFIER, RoleName.ORGANIZATION_ADMIN, RoleName.SYSTEM_ADMIN),
  validate({ query: listReportsQuerySchema }),
  controller.list,
);

router.get(
  '/:id',
  requireAuth,
  requireRole(RoleName.VERIFIER, RoleName.ORGANIZATION_ADMIN, RoleName.SYSTEM_ADMIN),
  controller.getById,
);

router.post(
  '/:id/status',
  requireAuth,
  requireRole(RoleName.VERIFIER, RoleName.SYSTEM_ADMIN),
  validate({ body: updateReportStatusSchema }),
  controller.updateStatus,
);

export default router;
