import crypto from 'crypto';
import { redis } from '../../database/redis';
import { BadRequestError, RateLimitError } from '../../common/errors/AppError';

const OTP_TTL_SECONDS = 5 * 60;
const MAX_ATTEMPTS = 5;

function otpKey(phone: string): string {
  return `otp:${phone}`;
}
function attemptsKey(phone: string): string {
  return `otp:attempts:${phone}`;
}

function hashOtp(otp: string): string {
  return crypto.createHash('sha256').update(otp).digest('hex');
}

/** Generates and stores a hashed OTP. Returns the plaintext OTP for the SMS provider to send. */
export async function generateOtp(phone: string): Promise<string> {
  const otp = crypto.randomInt(100000, 999999).toString();
  await redis.set(otpKey(phone), hashOtp(otp), 'EX', OTP_TTL_SECONDS);
  await redis.del(attemptsKey(phone));
  // Never log the plaintext OTP.
  return otp;
}

export async function verifyOtp(phone: string, submitted: string): Promise<boolean> {
  const attempts = await redis.incr(attemptsKey(phone));
  if (attempts === 1) await redis.expire(attemptsKey(phone), OTP_TTL_SECONDS);
  if (attempts > MAX_ATTEMPTS) {
    throw new RateLimitError('Too many OTP attempts — request a new code');
  }

  const stored = await redis.get(otpKey(phone));
  if (!stored) throw new BadRequestError('OTP expired or not requested');

  const matches = stored === hashOtp(submitted);
  if (matches) {
    await redis.del(otpKey(phone));
    await redis.del(attemptsKey(phone));
  }
  return matches;
}
