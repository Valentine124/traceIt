import { buildApp } from './app';
import { env } from './config/env';
import { logger } from './common/utils/logger';
import { prisma } from './database/prisma';
import { redis } from './database/redis';

const app = buildApp();

const server = app.listen(env.PORT, () => {
  logger.info(`TraceIt backend listening on port ${env.PORT} [${env.NODE_ENV}]`);
});

async function shutdown(signal: string): Promise<void> {
  logger.info(`Received ${signal}, shutting down gracefully...`);
  server.close(async () => {
    await prisma.$disconnect();
    redis.disconnect();
    process.exit(0);
  });
  // Force-exit if graceful shutdown hangs.
  setTimeout(() => process.exit(1), 10_000).unref();
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
process.on('unhandledRejection', (reason) => {
  logger.error({ reason }, 'Unhandled promise rejection');
});
