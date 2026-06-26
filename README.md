# School ERP — Node.js REST API

Express + TypeScript + Prisma + PostgreSQL backend for the School ERP System.

## Stack

| Layer | Choice |
|---|---|
| Runtime | Node.js 22+ |
| Framework | Express |
| Language | TypeScript |
| ORM | Prisma |
| Database | PostgreSQL 15+ |
| Auth | JWT (access + refresh) + OTP |
| Validation | Zod |
| Security | Helmet, CORS, express-rate-limit |

---

## Project Structure

```
school-erp/
├── prisma/
│   └── schema.prisma          # All DB models (auth + core schemas)
├── src/
│   ├── config/
│   │   ├── env.ts             # Validated env variables (Zod)
│   │   └── prisma.ts          # Prisma client singleton
│   ├── controllers/
│   │   └── auth.controller.ts
│   ├── middlewares/
│   │   ├── authenticate.ts    # JWT Bearer token verification
│   │   ├── authorize.ts       # Role-based access control
│   │   ├── validate.ts        # Zod request validation
│   │   └── errorHandler.ts    # Global error + 404 handler
│   ├── routes/
│   │   ├── index.ts           # Central route registry
│   │   └── auth.routes.ts
│   ├── services/
│   │   └── auth.service.ts    # Business logic (login, OTP, refresh, logout)
│   ├── utils/
│   │   ├── jwt.ts             # Token sign/verify/hash helpers
│   │   ├── otp.ts             # OTP generate/hash/verify helpers
│   │   └── response.ts        # Standardized API response helpers
│   ├── validators/
│   │   └── auth.validator.ts  # Zod schemas for auth endpoints
│   ├── app.ts                 # Express app factory
│   └── index.ts               # Server entry point
├── .env                       # Local secrets (git-ignored)
├── .env.example               # Safe template to commit
├── tsconfig.json
└── package.json
```

---

## Getting Started

### 1. Install dependencies
```bash
npm install
```

### 2. Configure environment
```bash
cp .env.example .env
# Edit .env — set DATABASE_URL and JWT secrets
```

### 3. Set up the database

Create the PostgreSQL database and the required schemas:
```sql
CREATE DATABASE school_erp;
\c school_erp
CREATE SCHEMA auth;
CREATE SCHEMA core;
CREATE SCHEMA academics;
CREATE SCHEMA hr;
CREATE SCHEMA attendance;
CREATE SCHEMA finance;
CREATE SCHEMA transport;
CREATE SCHEMA communication;
CREATE SCHEMA audit;
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
```

### 4. Generate Prisma client & run migrations
```bash
npm run prisma:generate
npm run prisma:migrate    # creates tables from schema.prisma
# or for quick dev iteration:
npm run prisma:push
```

### 5. Start development server
```bash
npm run dev
```

---

## API Endpoints

### Auth
| Method | Path | Description | Auth required |
|---|---|---|---|
| POST | `/api/auth/login` | Username + password login | No |
| POST | `/api/auth/otp/request` | Send OTP to phone | No |
| POST | `/api/auth/otp/verify` | Verify OTP → get tokens | No |
| POST | `/api/auth/refresh` | Rotate refresh token | No |
| POST | `/api/auth/logout` | Invalidate session | No |
| GET | `/api/auth/me` | Current user info | Yes |

### Health
| Method | Path | Description |
|---|---|---|
| GET | `/health` | Server + timestamp |

---

## Response Format

All endpoints return a consistent envelope:

```json
{
  "success": true,
  "message": "Login successful",
  "data": { ... }
}
```

Errors:
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": { "username": ["Required"] }
}
```

---

## Adding New Modules

Follow this pattern for each module (students, finance, etc.):

1. Add models to `prisma/schema.prisma`
2. Run `npm run prisma:migrate`
3. Create `src/validators/{module}.validator.ts`
4. Create `src/services/{module}.service.ts`
5. Create `src/controllers/{module}.controller.ts`
6. Create `src/routes/{module}.routes.ts`
7. Register in `src/routes/index.ts`

---

## Roles (from schema)

| Role | Scope |
|---|---|
| `org_super_admin` | All schools in the org |
| `school_admin` | Full access to one school |
| `accountant` | Finance & fees |
| `teacher` | Attendance, class roster |
| `receptionist` | Enquiries, admissions |
| `hr_manager` | HR, payroll, leave |
| `parent` | Read-only portal |
| `transport_manager` | Vehicles, routes, drivers |
