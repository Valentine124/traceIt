# TraceIt Backend

AI-powered civic transparency and accountability platform for African communities.
Helps citizens discover public projects, compare official records against community
evidence, safely report issues (anonymously or with protected identity), and track
institutional responses — over Web, Mobile, USSD, and SMS.

> **Status: foundation build, in progress.** This is not yet the complete 30-module
> system described in the original spec. See "What's implemented" vs "Not yet built"
> below before treating anything as production-ready.

## Architecture

Modular monolith: `Controller → Service → Repository (Prisma)`, organized so each
module (`src/modules/*`) could later be extracted into its own service without a
rewrite. Controllers are thin — all business logic lives in services.

```
src/
├── config/         env loading & validation (fails fast on missing config)
├── common/         errors, middleware (auth, RBAC, rate limiting, validation), utils
├── modules/        one folder per domain: auth, projects, reports, ussd, sms, ...
├── database/       Prisma + Redis clients
├── jobs/           background job processors (BullMQ) — scaffolded, not yet populated
└── app.ts / server.ts
```

Key design decisions:
- **Anonymity is structural, not cosmetic.** Anonymous reports never write a
  `ReportIdentity` row at all — there's nothing to leak by construction.
- **RBAC is centralized** in `common/middleware/rbac.ts`. No scattered `if (user.role === ...)` checks.
- **Token revocation** via a Redis-backed `tokenVersion` counter — logout-all invalidates
  every outstanding token instantly, without a token blocklist growing unbounded.
- **USSD/SMS are thin transports.** They call the same `projects`/`reports` services
  the HTTP API uses — no duplicated business logic.
- **External services degrade to mocks locally** (SMS logs instead of sending, AI
  returns stubbed flagged responses) so development isn't blocked on credentials.

## What's implemented

- Auth: phone/OTP, email/password, refresh tokens, logout-all (revocation)
- RBAC: CITIZEN / VERIFIER / ORGANIZATION_ADMIN / SYSTEM_ADMIN, centralized checks
- Projects: full CRUD, search/filter/sort/pagination, status history
- Reports: anonymous/protected/public submission, public tracking by UUID, verifier review
- USSD: find project / report issue / track report, via Africa's Talking webhook shape
- SMS: idempotent inbound webhook, HELP/STATUS commands, provider abstraction + mock adapter
- Audit logging (append-only) wired into auth/project/report state changes
- Notification abstraction (BullMQ-queued, non-blocking)
- Prisma schema covering the full data model (users, orgs, RBAC, projects, sources,
  evidence, reports, verification, institution responses, notifications, USSD/SMS,
  AI interactions, translations, audit log)
- Security baseline: helmet, CORS, rate limiting (general/auth/OTP tiers), Zod
  input validation (mass-assignment defense), centralized error handling that
  never leaks stack traces in production, redacted structured logging
- Docker + Docker Compose (Postgres + Redis + backend)
- Integration tests for auth (including token revocation, no-enumeration on
  login failure) and for projects/reports (RBAC, mass-assignment, anonymity guarantee)

## Not yet built

- Evidence upload (object storage integration, MIME/malware-scan architecture, signed URLs)
- Full verification workflow endpoints (dedicated routes beyond the review array on Report)
- Institution response endpoints
- Civic Reality Check engine (the comparison/discrepancy-detection logic itself)
- AI/RAG module and provider abstraction
- Localization/translation delivery (schema exists; no runtime i18n yet)
- Full offline sync / idempotency-key support beyond what's in SMS webhook
- Structured metrics/observability beyond logs + health/ready endpoints

## Prerequisites

- Node.js 20+
- Docker & Docker Compose (recommended for local Postgres/Redis)
- npm

## Installation

```bash
git clone <this-repo>
cd traceit-backend
npm install
cp .env.example .env
# Edit .env — at minimum set JWT_ACCESS_SECRET and JWT_REFRESH_SECRET
# (openssl rand -base64 48). Every variable in .env.example documents
# why it's needed, where to get it, and what happens if it's left unset.
```

## Database setup

```bash
docker compose up -d postgres redis
npx prisma migrate dev --name init
npm run prisma:seed
```

Seed creates:
- `admin@traceit.dev` / `DevAdminPassword123!` (SYSTEM_ADMIN)
- `verifier@traceit.dev` / `DevVerifierPassword123!` (VERIFIER)
- A sample citizen (phone `+2348012345000`, use the OTP flow — mock OTPs are logged, not texted, unless Africa's Talking is configured)
- Three sample African civic projects, one official source, one sample report

## Running locally

```bash
npm run dev        # tsx watch, http://localhost:4000
```

- Health: `GET /health` · Readiness: `GET /ready`
- API docs: `GET /api/docs` (Swagger UI, served from `openapi.yaml`)

## Running tests

Tests hit a real Postgres + Redis (deliberately — RBAC and constraint behavior
are exactly what in-memory fakes get wrong):

```bash
docker compose up -d postgres redis
createdb traceit_test   # or point DATABASE_URL at a separate test DB
DATABASE_URL=postgresql://traceit:traceit_dev_password@localhost:5432/traceit_test npx prisma migrate deploy
npm test
```

**Unverified in this build environment:** the sandbox this backend was written in
blocks network access to `binaries.prisma.sh`, so `prisma generate` could not be
run here and the test suite has not actually been executed end-to-end. Every
`.ts` file has been type-checked against a fixture with the same shape as the
real generated client, but you should run `npx prisma generate && npm test`
yourself before trusting this is green.

## Docker

```bash
docker compose up --build
```

Builds the backend, runs migrations, and starts Postgres + Redis + the API on `:4000`.

## Deployment (Render/Railway/AWS)

1. Provision managed Postgres and Redis.
2. Set all required env vars (see `.env.example`) in your platform's secret manager —
   never commit `.env`.
3. Build with the provided multi-stage `Dockerfile` (production stage runs as non-root).
4. Run `npx prisma migrate deploy` as a release/pre-deploy step (not `migrate dev`).
5. Point your USSD/SMS provider's webhook URLs at `/api/v1/ussd` and `/api/v1/sms/inbound`.

## Security notes

- Never commit `.env`. Secrets are validated at boot (`config/env.ts`) — the app
  refuses to start with a short/missing JWT secret rather than silently using a weak one.
- Passwords are bcrypt-hashed (cost 12); OTPs are hashed before being stored in Redis
  and expire in 5 minutes with a capped attempt count.
- Login failures return an identical 401 for "wrong password" and "no such user" to
  avoid account enumeration.
- Anonymous report identity is architecturally absent, not filtered at query time.

## Troubleshooting

- **App won't start / "Invalid environment configuration"**: check the printed
  field errors — usually a missing `DATABASE_URL`/`REDIS_URL` or a JWT secret under 32 chars.
- **`prisma generate` fails to fetch engine binaries**: this happens if your
  network blocks `binaries.prisma.sh`. It is required — Prisma cannot run without it.
  Run it somewhere with normal internet access (this is a known limitation only of
  the sandbox this scaffold was authored in, not of the code itself).

---

## REQUIRED FROM ME

**Required for MVP (local dev):**
- `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET` — generate with `openssl rand -base64 48`
- A running Postgres + Redis (Docker Compose provides both)

**Required for production:**
- Managed `DATABASE_URL` / `REDIS_URL`
- Africa's Talking username + API key (USSD + live SMS)
- Object storage credentials (S3-compatible) — once the evidence module is built
- Domain + HTTPS termination (reverse proxy / platform-managed)

**Optional (degrade to mocks/no-ops if unset):**
- `AI_PROVIDER_API_KEY` — AI endpoints return stubbed, clearly-flagged responses without it
- `EMAIL_PROVIDER_API_KEY` — email notifications log instead of sending
- `SMS_WEBHOOK_SECRET` — inbound SMS webhook still works, but isn't signature-verified

Full explanation of every variable (why/where/cost/fallback) is in `.env.example`.
