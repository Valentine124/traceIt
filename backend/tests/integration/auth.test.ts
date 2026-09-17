import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import { buildApp } from '../../src/app';
import { prisma } from '../../src/database/prisma';

const app = buildApp();

describe('Auth API', () => {
  const testEmail = `test-${Date.now()}@example.com`;
  const testPassword = 'CorrectHorseBatteryStaple9!';

  beforeEach(async () => {
    await prisma.user.deleteMany({ where: { email: { startsWith: 'test-' } } });
  });

  it('registers a new user with email/password', async () => {
    const res = await request(app)
      .post('/api/v1/auth/register')
      .send({ email: testEmail, password: testPassword, displayName: 'Test User' });

    expect(res.status).toBe(201);
    expect(res.body.user.email).toBe(testEmail);
    expect(res.body.accessToken).toBeDefined();
    expect(res.body.refreshToken).toBeDefined();
    // Password must never be echoed back.
    expect(JSON.stringify(res.body)).not.toContain(testPassword);
  });

  it('rejects duplicate registration with a 409', async () => {
    await request(app).post('/api/v1/auth/register').send({ email: testEmail, password: testPassword });
    const res = await request(app).post('/api/v1/auth/register').send({ email: testEmail, password: testPassword });
    expect(res.status).toBe(409);
  });

  it('rejects weak passwords with a 422 validation error', async () => {
    const res = await request(app)
      .post('/api/v1/auth/register')
      .send({ email: `weak-${Date.now()}@example.com`, password: '123' });
    expect(res.status).toBe(422);
  });

  it('logs in with correct credentials', async () => {
    await request(app).post('/api/v1/auth/register').send({ email: testEmail, password: testPassword });
    const res = await request(app).post('/api/v1/auth/login').send({ email: testEmail, password: testPassword });
    expect(res.status).toBe(200);
    expect(res.body.accessToken).toBeDefined();
  });

  it('rejects login with wrong password with a 401, not a 404/500', async () => {
    await request(app).post('/api/v1/auth/register').send({ email: testEmail, password: testPassword });
    const res = await request(app).post('/api/v1/auth/login').send({ email: testEmail, password: 'WrongPassword1!' });
    expect(res.status).toBe(401);
  });

  it('rejects login for a nonexistent user with the same 401 shape (no enumeration)', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'nobody-does-not-exist@example.com', password: testPassword });
    expect(res.status).toBe(401);
    expect(res.body.error.message).toBe('Invalid email or password');
  });

  it('rejects protected routes with no token', async () => {
    const res = await request(app).post('/api/v1/auth/logout-all');
    expect(res.status).toBe(401);
  });

  it('revokes tokens on logout-all', async () => {
    const { body } = await request(app)
      .post('/api/v1/auth/register')
      .send({ email: testEmail, password: testPassword });
    const accessToken = body.accessToken as string;

    const logoutRes = await request(app)
      .post('/api/v1/auth/logout-all')
      .set('Authorization', `Bearer ${accessToken}`);
    expect(logoutRes.status).toBe(204);

    // The same (now-revoked) access token must be rejected afterward.
    const reuseRes = await request(app)
      .post('/api/v1/auth/logout-all')
      .set('Authorization', `Bearer ${accessToken}`);
    expect(reuseRes.status).toBe(401);
  });
});
