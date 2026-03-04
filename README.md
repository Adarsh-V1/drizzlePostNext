# Lightseeker

Next.js + Hono + Drizzle starter with Better Auth, production safety checks, and CI quality gates.

## Prerequisites

- Node.js 20+
- npm 10+
- PostgreSQL database

## Setup

1. Copy env file and fill values:

```bash
cp .env.example .env
```

2. Install dependencies:

```bash
npm ci
```

3. Apply database migrations:

```bash
npm run db:migrate
```

4. Start development server:

```bash
npm run dev
```

## API Endpoints

- `GET /api/health` -> process health
- `GET /api/ready` -> database readiness
- `GET /api/users?limit=25` -> list users
- `POST /api/users` -> create user
- `GET /api/auth/*` and `POST /api/auth/*` -> Better Auth routes

## Quality Gates

Run before pushing:

```bash
npm run format:check
npm run lint
npm run typecheck
npm run test
npm run build
```

GitHub Actions CI runs the same gates on every push/PR.
