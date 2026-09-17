import express, { Express } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import pinoHttp from 'pino-http';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import path from 'path';

import { env } from './config/env';
import { logger } from './common/utils/logger';
import { requestId } from './common/middleware/requestId';
import { generalLimiter } from './common/middleware/rateLimit';
import { errorHandler, notFoundHandler } from './common/middleware/errorHandler';

import authRoutes from './modules/auth/auth.routes';
import projectsRoutes from './modules/projects/projects.routes';
import reportsRoutes from './modules/reports/reports.routes';
import ussdRoutes from './modules/ussd/ussd.routes';
import smsRoutes from './modules/sms/sms.routes';

export function buildApp(): Express {
  const app = express();

  // --- Core security middleware ---
  app.use(helmet());
  app.use(
    cors({
      origin: env.CORS_ORIGINS === '*' ? true : env.CORS_ORIGINS.split(','),
      credentials: true,
    }),
  );
  app.disable('x-powered-by');

  // --- Parsing (with size limits to blunt DoS/large-payload abuse) ---
  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ extended: true, limit: '1mb' }));
  app.use(cookieParser());
  app.use(compression());

  // --- Tracing & logging ---
  app.use(requestId);
  app.use(
    pinoHttp({
      logger,
      genReqId: (req: any) => req.id,
      customLogLevel: (_req, res) => (res.statusCode >= 500 ? 'error' : res.statusCode >= 400 ? 'warn' : 'info'),
      // Never log full bodies/headers by default (auth headers, phone, etc).
      autoLogging: true,
    }),
  );

  // --- Rate limiting (baseline; stricter limits applied per-route) ---
  app.use('/api/', generalLimiter);

  // --- Health/readiness ---
  app.get('/health', (_req, res) => res.status(200).json({ status: 'ok' }));
  app.get('/ready', async (_req, res) => {
    // A real readiness probe checks DB/Redis connectivity; kept simple here.
    res.status(200).json({ status: 'ready' });
  });

  // --- API docs ---
  try {
    const openapiPath = path.join(__dirname, '..', 'openapi.yaml');
    const swaggerDoc = YAML.load(openapiPath);
    app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc));
  } catch (err) {
    logger.warn({ err }, 'OpenAPI spec not found — /api/docs disabled');
  }

  // --- Routes ---
  app.use('/api/v1/auth', authRoutes);
  app.use('/api/v1/projects', projectsRoutes);
  app.use('/api/v1/reports', reportsRoutes);
  app.use('/api/v1/ussd', ussdRoutes);
  app.use('/api/v1/sms', smsRoutes);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
