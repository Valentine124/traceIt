import { z } from 'zod';

// E.164-ish phone validation; refine further per-country if needed.
const phoneSchema = z.string().regex(/^\+[1-9]\d{7,14}$/, 'Phone must be in E.164 format, e.g. +2348012345678');

export const requestOtpSchema = z.object({
  phone: phoneSchema,
});

export const verifyOtpSchema = z.object({
  phone: phoneSchema,
  otp: z.string().length(6),
});

export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(10).max(128),
  displayName: z.string().min(1).max(120).optional(),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const refreshSchema = z.object({
  refreshToken: z.string().min(1),
});
