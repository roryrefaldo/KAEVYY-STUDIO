# KAEVY STUDIO — DEPLOYMENT GUIDE (RC1)

**Version**: 1.0.0 (Release Candidate 1)  
**Target Environment**: Docker Container / Cloud Run / Kubernetes / Standalone Node.js

---

## 📦 Production Container Build Pipeline

KAEVY STUDIO is configured with single-command esbuild bundling that compiles `server.ts` into a self-contained CJS bundle `dist/server.cjs` and Vite static assets into `dist/`.

### 1. Build Command
```bash
npm run build
```
This executes:
1. `vite build` → Builds client SPA bundle into `dist/`
2. `esbuild server.ts ...` → Bundles the Express server into `dist/server.cjs`

### 2. Production Start Command
```bash
npm run start
```
This runs:
`node dist/server.cjs`

---

## ☁️ Cloud Run & Docker Environment Setup

### Port & Networking Configuration
- Container must bind to host `0.0.0.0` and port `3000` (or `process.env.PORT`).
- Nginx / Cloud Run proxies all incoming HTTP requests to port `3000`.

### Required Environment Variables in Production
```env
NODE_ENV=production
PORT=3000
DATABASE_URL=postgres://user:password@cloudsql-instance:5432/kaevystudio?sslmode=require
JWT_SECRET=production-secure-random-jwt-secret-string
VITE_API_URL=/api/v1
```

---

## 🗄️ Database Provisioning & Migrations in Deployment

1. **Provision PostgreSQL 16+** (e.g. Google Cloud SQL PostgreSQL).
2. **Execute Drizzle Migrations**:
   ```bash
   npx tsx ./src/db/seed.ts # Seed initial roles, permissions, categories, demo users
   ```
3. **Verify Database Health**:
   ```bash
   npx tsx ./src/db/tests/dbRules.test.ts
   ```

---

## 🛡️ Health Checks & Monitoring

- **HTTP Liveness / Readiness Probe**: `GET /api/v1/health`
- **Expected Status**: `200 OK`
- **Payload**: `{ "success": true, "data": { "status": "ok", ... } }`

---

## 🔄 Dual-Mode Fallback Resilience

In the event of a transient PostgreSQL database network interruption, KAEVY STUDIO automatically falls back to high-fidelity mock store handling via `safeDbExecute()`, preventing HTTP 500 downtime or container crashes.
