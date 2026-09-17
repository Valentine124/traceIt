import 'dotenv/config';
import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'staging', 'production']).default('development'),
  PORT: z.coerce.number().default(4000),
  LOG_LEVEL: z.string().default('info'),

  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
  REDIS_URL: z.string().min(1, 'REDIS_URL is required'),

  JWT_ACCESS_SECRET: z.string().min(32, 'JWT_ACCESS_SECRET must be at least 32 chars'),
  JWT_REFRESH_SECRET: z.string().min(32, 'JWT_REFRESH_SECRET must be at least 32 chars'),
  JWT_ACCESS_TTL: z.string().default('15m'),
  JWT_REFRESH_TTL: z.string().default('30d'),

  CORS_ORIGINS: z.string().default('*'),

  // External services — all optional locally; app degrades to mock adapters.
  AI_PROVIDER_API_KEY: z.string().optional(),
  AI_PROVIDER_BASE_URL: z.string().optional(),

  OBJECT_STORAGE_ENDPOINT: z.string().optional(),
  OBJECT_STORAGE_BUCKET: z.string().optional(),
  OBJECT_STORAGE_ACCESS_KEY: z.string().optional(),
  OBJECT_STORAGE_SECRET_KEY: z.string().optional(),

  AFRICAS_TALKING_USERNAME: z.string().optional(),
  AFRICAS_TALKING_API_KEY: z.string().optional(),
  AFRICAS_TALKING_SHORTCODE: z.string().optional(),

  EMAIL_PROVIDER_API_KEY: z.string().optional(),
  EMAIL_FROM_ADDRESS: z.string().optional(),

  SMS_WEBHOOK_SECRET: z.string().optional(),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  // Fail fast and loud — never start the server with invalid config.
  console.error('Invalid environment configuration:', parsed.error.flatten().fieldErrors);
  process.exit(1);
}

export const env = parsed.data;

export const externalServiceAvailability = {
  aiProvider: Boolean(env.AI_PROVIDER_API_KEY),
  objectStorage: Boolean(env.OBJECT_STORAGE_ENDPOINT && env.OBJECT_STORAGE_ACCESS_KEY),
  africasTalking: Boolean(env.AFRICAS_TALKING_USERNAME && env.AFRICAS_TALKING_API_KEY),
  emailProvider: Boolean(env.EMAIL_PROVIDER_API_KEY),
};
