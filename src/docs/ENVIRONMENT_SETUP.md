# KAEVY STUDIO — ENVIRONMENT SETUP GUIDE (RC1)

**Version**: 1.0.0 (Release Candidate 1)

---

## ⚙️ Environment Variables Reference

KAEVY STUDIO uses environment variables for database connections, server configuration, JWT secrets, and API routing.

| Variable Name | Required | Default Value | Description |
|---|---|---|---|
| `DATABASE_URL` | Optional | `postgres://postgres:password@localhost:5432/kaevy_studio` | PostgreSQL connection URI. If absent or unreachable, system automatically uses mock fallback. |
| `NODE_ENV` | Yes | `production` | Node environment (`development` or `production`). |
| `PORT` | Yes | `3000` | HTTP server port (hardcoded container port 3000). |
| `JWT_SECRET` | Yes | `kaevy-studio-jwt-secret-key-change-me` | Secret key used for signing and verifying authorization tokens. |
| `VITE_API_URL` | Yes | `/api/v1` | Relative path prefix for frontend API calls. |
| `GEMINI_API_KEY` | Optional | `""` | Gemini API key for server-side AI features. |

---

## 🛠️ Local PostgreSQL Setup Instructions

If you wish to run a local PostgreSQL server:

1. **Start PostgreSQL Instance**:
   ```bash
   docker run --name kaevy-postgres -e POSTGRES_PASSWORD=password -e POSTGRES_DB=kaevy_studio -p 5432:5432 -d postgres:16
   ```

2. **Configure `.env`**:
   ```env
   DATABASE_URL=postgres://postgres:password@localhost:5432/kaevy_studio
   ```

3. **Run Migrations & Seed Data**:
   ```bash
   npx tsx ./src/db/seed.ts
   ```

4. **Verify Connection & Rules**:
   ```bash
   npx tsx ./src/db/tests/dbRules.test.ts
   ```
