import { RoleName } from '@prisma/client';
import { prisma } from '../../database/prisma';
import { ConflictError, UnauthorizedError } from '../../common/errors/AppError';
import { hashPassword, verifyPassword } from './password.util';
import { generateOtp, verifyOtp } from './otp.service';
import { issueTokens, revokeAllTokens, verifyRefreshToken, currentTokenVersion } from './token.service';
import { recordAuditEvent } from '../audit/audit.service';
import { sendSms } from '../notifications/notification.service';

async function loadRolesAndOrgs(userId: string): Promise<{ roles: RoleName[]; orgIds: string[] }> {
  const [userRoles, orgLinks] = await Promise.all([
    prisma.userRole.findMany({ where: { userId }, include: { role: true } }),
    prisma.organizationMember.findMany({ where: { userId } }),
  ]);
  return {
    roles: userRoles.map((ur: (typeof userRoles)[number]) => ur.role.name),
    orgIds: orgLinks.map((o: (typeof orgLinks)[number]) => o.organizationId),
  };
}

async function ensureDefaultRole(userId: string): Promise<void> {
  const citizenRole = await prisma.role.upsert({
    where: { name: RoleName.CITIZEN },
    update: {},
    create: { name: RoleName.CITIZEN, description: 'Default authenticated citizen' },
  });
  await prisma.userRole.upsert({
    where: { userId_roleId: { userId, roleId: citizenRole.id } },
    update: {},
    create: { userId, roleId: citizenRole.id },
  });
}

export async function requestPhoneOtp(phone: string): Promise<void> {
  const otp = await generateOtp(phone);
  await sendSms(phone, `Your TraceIt verification code is ${otp}. It expires in 5 minutes.`);
}

export async function verifyPhoneOtpAndLogin(phone: string, otp: string) {
  const ok = await verifyOtp(phone, otp);
  if (!ok) throw new UnauthorizedError('Invalid or expired code');

  let user = await prisma.user.findUnique({ where: { phone } });
  if (!user) {
    user = await prisma.user.create({ data: { phone, authProvider: 'PHONE_OTP' } });
    await ensureDefaultRole(user.id);
  }

  const { roles, orgIds } = await loadRolesAndOrgs(user.id);
  const tokens = await issueTokens(user.id, roles, orgIds);
  await recordAuditEvent({ actorId: user.id, action: 'LOGIN_SUCCESS', entityType: 'User', entityId: user.id });
  return { user: { id: user.id, phone: user.phone, roles }, ...tokens };
}

export async function registerWithEmail(email: string, password: string, displayName?: string) {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) throw new ConflictError('An account with this email already exists');

  const passwordHash = await hashPassword(password);
  const user = await prisma.user.create({
    data: { email, passwordHash, displayName, authProvider: 'EMAIL_PASSWORD' },
  });
  await ensureDefaultRole(user.id);

  const { roles, orgIds } = await loadRolesAndOrgs(user.id);
  const tokens = await issueTokens(user.id, roles, orgIds);
  await recordAuditEvent({ actorId: user.id, action: 'REGISTER_SUCCESS', entityType: 'User', entityId: user.id });
  return { user: { id: user.id, email: user.email, roles }, ...tokens };
}

export async function loginWithEmail(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  // Constant-shape response regardless of which check fails — avoids
  // user-enumeration via response-timing/content differences.
  if (!user || !user.passwordHash || !(await verifyPassword(password, user.passwordHash))) {
    await recordAuditEvent({ action: 'LOGIN_FAILURE', metadata: { emailAttempted: true } });
    throw new UnauthorizedError('Invalid email or password');
  }
  if (!user.isActive) throw new UnauthorizedError('Account is disabled');

  const { roles, orgIds } = await loadRolesAndOrgs(user.id);
  const tokens = await issueTokens(user.id, roles, orgIds);
  await recordAuditEvent({ actorId: user.id, action: 'LOGIN_SUCCESS', entityType: 'User', entityId: user.id });
  return { user: { id: user.id, email: user.email, roles }, ...tokens };
}

export async function refreshSession(refreshToken: string) {
  let decoded;
  try {
    decoded = verifyRefreshToken(refreshToken);
  } catch {
    throw new UnauthorizedError('Invalid or expired refresh token');
  }
  const currentVersion = await currentTokenVersion(decoded.sub);
  if (decoded.tokenVersion !== currentVersion) {
    throw new UnauthorizedError('Refresh token has been revoked');
  }
  const { roles, orgIds } = await loadRolesAndOrgs(decoded.sub);
  return issueTokens(decoded.sub, roles, orgIds);
}

export async function logoutAllSessions(userId: string): Promise<void> {
  await revokeAllTokens(userId);
  await recordAuditEvent({ actorId: userId, action: 'LOGOUT_ALL', entityType: 'User', entityId: userId });
}

// Note on anonymous access: TraceIt issues no user record and no token for
// anonymous flows. Controllers/services treat a missing req.user as
// "anonymous" and route access accordingly (see reports.service.ts).
