import pino from 'pino';
import { env } from '../../config/env';

// Redaction is a hard requirement (spec §18/§23): never log passwords, OTPs,
// tokens, API keys, or full request bodies for sensitive routes.
export const logger = pino({
  level: env.LOG_LEVEL ?? 'info',
  redact: {
    paths: [
      'req.headers.authorization',
      'req.headers.cookie',
      '*.password',
      '*.passwordHash',
      '*.otp',
      '*.token',
      '*.accessToken',
      '*.refreshToken',
      '*.apiKey',
      '*.contactPhone',
      '*.contactEmail',
    ],
    censor: '[REDACTED]',
  },
  transport:
    env.NODE_ENV === 'development'
      ? { target: 'pino-pretty', options: { colorize: true } }
      : undefined,
});
