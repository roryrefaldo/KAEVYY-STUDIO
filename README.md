# KAEVY STUDIO — Release Candidate 1 (RC1)

> **Enterprise Freelance & Developer Marketplace Platform for Premium Tech Services & Digital Assets**

KAEVY STUDIO is an enterprise-grade web application powering developer profiles, service catalogs, custom software ordering, milestone-based escrow payments, 30-day post-delivery warranty guarantees, and digital asset trading with full dual-mode support (PostgreSQL Live DB & Local In-Memory Fallback).

---

## 🚀 Quick Start & Local Development

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm** or **bun**
- *(Optional)* **PostgreSQL**: v16+ (If running live PostgreSQL mode)

### Installation
```bash
# Clone the repository and install dependencies
npm install
```

### Environment Configuration
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

Default `.env` contents:
```env
# Database
DATABASE_URL=postgres://postgres:password@localhost:5432/kaevy_studio

# Server & Runtime
NODE_ENV=production
PORT=3000
JWT_SECRET=kaevy-studio-production-jwt-secret-key-change-me

# Frontend API Endpoint
VITE_API_URL=/api/v1

# AI Studio Capabilities
GEMINI_API_KEY=
```

### Run Dev Server
```bash
npm run dev
```
The application will start on `http://localhost:3000`.

---

## 🏗️ Infrastructure & DevOps (`/infra`)

KAEVY STUDIO includes an enterprise production infrastructure suite located in `/infra`:

- **`/infra/docker/`**: Development and production Dockerfiles (`Dockerfile.dev`, `Dockerfile.prod`) and Compose manifests (`docker-compose.dev.yml`, `docker-compose.prod.yml`).
- **`/infra/cloudrun/`**: Google Cloud Run service manifests and automated deployment scripts.
- **`/infra/github/`**: GitHub Actions CI/CD workflows.
- **`/infra/postgres/`**: Production PostgreSQL configurations (`postgresql.conf`, `pg_hba.conf`).
- **`/infra/redis/`**: Production Redis configuration (`redis.conf`).
- **`/infra/monitoring/`**: Observability suite for Prometheus, Grafana, Loki, and Alertmanager.
- **`/infra/storage/`**: Object storage policies for Google Cloud Storage and AWS S3.
- **`/infra/terraform/`**: Terraform IaC templates for GCP infrastructure provisioning.
- **`/scripts/`**: Production operational scripts (`start-dev.sh`, `start-prod.sh`, `backup-db.sh`, `restore-db.sh`, `migrate.sh`, `seed.sh`).

For detailed infrastructure guides:
- [Infrastructure Overview](infra/README.md)
- [DevOps Playbook](DEVOPS.md)
- [Deployment Guide](DEPLOYMENT.md)
- [Docker Management Guide](DOCKER.md)
- [Database Backup & Restore Guide](BACKUP.md)
- [Monitoring & Observability Spec](MONITORING.md)

---

## 📚 Documentation Index

All architectural specifications, guides, and API contracts are maintained in `src/docs/`:

1. [Database Implementation Guide](src/docs/DATABASE_IMPLEMENTATION.md) — PostgreSQL schema, Drizzle ORM, DAG migration order, and database rules.
2. [Database Architecture & Specifications](src/docs/DATABASE_ARCHITECTURE.md) — Relational mappings, foreign keys, constraints, and audit log immutability.
3. [API Documentation](src/docs/API_DOCUMENTATION.md) — RESTful API endpoints, request/response DTO contracts, and authentication header specs.
4. [Deployment Guide](src/docs/DEPLOYMENT_GUIDE.md) — Cloud Run / container deployment instructions, build pipeline, and environment setup.
5. [Environment Setup Guide](src/docs/ENVIRONMENT_SETUP.md) — Environment variable specifications and local PostgreSQL database setup.
6. [Migration Guide](src/docs/MIGRATION_GUIDE.md) — Drizzle schema migration execution, zero-downtime updates, and rollback procedures.
7. [Seed Guide](src/docs/SEED_GUIDE.md) — Seeding development data, demo accounts, service catalog, and test datasets.

---

## 🛠️ Testing & Quality Assurance

### Linting & Type Checking
```bash
npm run lint
```

### Production Build & Bundling
```bash
npm run build
```

### Database Rule Validation Suite
```bash
npx tsx ./src/db/tests/dbRules.test.ts
```

### API Integration Test Suite
```bash
npx tsx ./src/server/tests/api.test.ts
```

### Database Seeding
```bash
npx tsx ./src/db/seed.ts
```

---

## 🏛️ System Architecture Summary

- **Frontend**: React 18, TypeScript, Tailwind CSS, Lucide Icons, Responsive Mobile/Desktop UI.
- **Backend**: Node.js, Express, RESTful API endpoints with standardized `{ success, data, error }` envelope format.
- **Database Layer**: PostgreSQL 16+, Drizzle ORM, row-locking triggers for developer capacity limits, automated 30-day warranty triggers, and immutable audit logs.
- **Dual-Mode Persistence**: Automatically operates with live PostgreSQL when `DATABASE_URL` is reachable, and seamlessly falls back to high-fidelity in-memory state without crashing if PostgreSQL is unreachable.

---

## 🔒 Security & Compliance

- **Role-Based Access Control (RBAC)**: `CLIENT`, `DEVELOPER`, `ADMIN` role guards on protected endpoints.
- **Security Headers**: Standard security headers and CORS configurations.
- **Input Sanitization**: Express request validation on all mutable endpoints.
- **Audit Immutability**: PostgreSQL triggers preventing modification or deletion of system audit logs.

---

© 2026 KAEVY STUDIO. All rights reserved.
