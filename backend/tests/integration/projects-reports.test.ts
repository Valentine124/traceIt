import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import { buildApp } from '../../src/app';
import { prisma } from '../../src/database/prisma';
import { RoleName } from '@prisma/client';

const app = buildApp();

async function makeAdminToken(): Promise<string> {
  const email = `admin-test-${Date.now()}@example.com`;
  const { body } = await request(app)
    .post('/api/v1/auth/register')
    .send({ email, password: 'AdminPassword123!' });
  const adminRole = await prisma.role.upsert({
    where: { name: RoleName.SYSTEM_ADMIN },
    update: {},
    create: { name: RoleName.SYSTEM_ADMIN },
  });
  await prisma.userRole.create({ data: { userId: body.user.id, roleId: adminRole.id } });
  // Re-login to get a token that reflects the newly assigned role.
  const login = await request(app).post('/api/v1/auth/login').send({ email, password: 'AdminPassword123!' });
  return login.body.accessToken;
}

describe('Projects API', () => {
  let adminToken: string;

  beforeAll(async () => {
    adminToken = await makeAdminToken();
  });

  it('allows public unauthenticated project discovery', async () => {
    const res = await request(app).get('/api/v1/projects');
    expect(res.status).toBe(200);
    expect(res.body.pagination).toBeDefined();
  });

  it('rejects project creation without a token', async () => {
    const res = await request(app).post('/api/v1/projects').send({ name: 'x' });
    expect(res.status).toBe(401);
  });

  it('rejects project creation from a citizen (no admin role)', async () => {
    const email = `citizen-${Date.now()}@example.com`;
    const { body } = await request(app).post('/api/v1/auth/register').send({ email, password: 'Password123!' });
    const res = await request(app)
      .post('/api/v1/projects')
      .set('Authorization', `Bearer ${body.accessToken}`)
      .send({
        name: 'Should not be allowed',
        description: 'Citizens cannot create projects directly.',
        category: 'ROADS',
        country: 'Nigeria',
      });
    expect(res.status).toBe(403);
  });

  it('allows an admin to create and then fetch a project', async () => {
    const createRes = await request(app)
      .post('/api/v1/projects')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: 'Test Water Project',
        description: 'A test project created by the integration suite.',
        category: 'WATER',
        country: 'Nigeria',
        community: 'Testville',
      });
    expect(createRes.status).toBe(201);

    const getRes = await request(app).get(`/api/v1/projects/${createRes.body.id}`);
    expect(getRes.status).toBe(200);
    expect(getRes.body.name).toBe('Test Water Project');
  });

  it('rejects mass-assignment of unexpected fields (e.g. id, status override)', async () => {
    const res = await request(app)
      .post('/api/v1/projects')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        id: 'attacker-supplied-id',
        name: 'Mass Assignment Test',
        description: 'Testing that unexpected fields are stripped.',
        category: 'WATER',
        country: 'Nigeria',
        status: 'COMPLETED', // not settable at creation
      });
    expect(res.status).toBe(201);
    expect(res.body.id).not.toBe('attacker-supplied-id');
    expect(res.body.status).toBe('PLANNED'); // default, not the injected value
  });
});

describe('Reports API — anonymity guarantees', () => {
  it('creates an anonymous report with no identity row', async () => {
    const res = await request(app).post('/api/v1/reports').send({
      title: 'Anonymous test report',
      description: 'This report should have zero linkage to any identity.',
      visibility: 'ANONYMOUS',
    });
    expect(res.status).toBe(201);
    expect(res.body.trackingId).toBeDefined();

    const identity = await prisma.reportIdentity.findUnique({ where: { reportId: res.body.id } });
    expect(identity).toBeNull(); // structurally absent, not just hidden
  });

  it('allows public tracking by trackingId without auth', async () => {
    const create = await request(app).post('/api/v1/reports').send({
      title: 'Trackable report',
      description: 'Testing the public tracking endpoint.',
      visibility: 'ANONYMOUS',
    });
    const track = await request(app).get(`/api/v1/reports/track/${create.body.trackingId}`);
    expect(track.status).toBe(200);
    expect(track.body.status).toBe('RECEIVED');
  });

  it('rejects listing reports without verifier/admin role', async () => {
    const res = await request(app).get('/api/v1/reports');
    expect(res.status).toBe(401);
  });
});
