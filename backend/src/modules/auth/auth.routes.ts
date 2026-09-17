import { Router } from 'express';
import { validate } from '../../common/validation/validate';
import { authLimiter, otpLimiter } from '../../common/middleware/rateLimit';
import { requireAuth } from '../../common/middleware/auth';
import * as controller from './auth.controller';
import {
  requestOtpSchema,
  verifyOtpSchema,
  registerSchema,
  loginSchema,
  refreshSchema,
} from './auth.validation';

const router = Router();

router.post('/otp/request', otpLimiter, validate({ body: requestOtpSchema }), controller.requestOtp);
router.post('/otp/verify', authLimiter, validate({ body: verifyOtpSchema }), controller.verifyOtp);
router.post('/register', authLimiter, validate({ body: registerSchema }), controller.register);
router.post('/login', authLimiter, validate({ body: loginSchema }), controller.login);
router.post('/refresh', authLimiter, validate({ body: refreshSchema }), controller.refresh);
router.post('/logout-all', requireAuth, controller.logoutAll);

export default router;
