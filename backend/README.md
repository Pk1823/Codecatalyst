# MISSIONWELL AI — Backend Service

**AI-Based Predictive Personnel Stress and Welfare Monitoring System for Uniformed Forces**  
*Organization: Ministry of Home Affairs | Department: CRPF, Police II Division*

---

## Overview
The **MISSIONWELL AI** Backend Service is a production-grade REST API built using **Node.js, TypeScript, Express, Prisma ORM, and PostgreSQL/SQLite**. It handles:
- Real authentication with bcrypt password hashing and signed HTTP-only JWT session cookies.
- Server-side Role-Based Access Control (RBAC) across 4 roles: `PERSONNEL`, `WELFARE_OFFICER`, `COMMANDER`, `ADMIN`.
- Data privacy boundaries enforcing DPDP Act 2023 principles (Commanders receive aggregated unit metrics; private survey responses are redacted).
- Comprehensive audit logging for all sensitive operations.
- Direct integration with the Python ML Microservice (`ml-service`) for predictive stress estimation and SHAP factor attribution.

---

## Directory Structure
```
backend/
├── prisma/
│   ├── schema.prisma             # SQLite schema for zero-config local dev
│   ├── schema.postgresql.prisma  # PostgreSQL schema for Docker/production
│   ├── seed.ts                   # Synthetic demo seeder across all 4 roles
│   └── dev.db                    # Active SQLite database
├── src/
│   ├── controllers/              # Request handling & orchestration
│   ├── services/                 # Core business logic (auth, wellness, welfare, reports, audit)
│   ├── routes/                   # Express modular REST endpoints
│   ├── middleware/               # Auth, session, and role guardrails
│   ├── lib/                      # DB singleton, JWT, bcrypt, and ML client
│   └── server.ts                 # Server entry point
├── Dockerfile
├── package.json
└── tsconfig.json
```

---

## Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Generate Prisma Client & Push DB
```bash
npx prisma generate
npx prisma db push
```

### 3. Seed Synthetic Demo Data
```bash
npm run db:seed
```

### 4. Start Development Server
```bash
npm run dev
# Server runs on http://localhost:5000
```
