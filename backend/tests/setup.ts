import { beforeAll, afterAll } from 'vitest';
import { prisma } from '../src/database/prisma';
import { redis } from '../src/database/redis';

// These tests hit a real Postgres + Redis (see README "Running tests").
// This is a deliberate choice: RBAC, unique constraints, and transaction
// behavior are exactly the things that fake/in-memory doubles get wrong.
beforeAll(async () => {
  await prisma.$connect();
});

afterAll(async () => {
  await prisma.$disconnect();
  redis.disconnect();
});
