# KAEVY STUDIO — Phase 10.2 Production Cloud Stack & Runtime Architecture

Welcome to the **KAEVY STUDIO Enterprise Runtime Architecture Specification**. This document outlines the cloud-native runtime lifecycle, process management, health probes, structured logging, auto-downgrade resilience, and graceful shutdown handling.

---

## 🏗️ Architectural Overview

The KAEVY STUDIO runtime engine is designed for zero-downtime Cloud Run containerized deployments. It guarantees high availability, automatic fallbacks for optional services (e.g., Redis), strict environment validation, and orderly connection draining upon container teardown.

```
                  ┌─────────────────────────────────────┐
                  │          RuntimeManager             │
                  │   (Central Process Coordinator)     │
                  └──────────────────┬──────────────────┘
                                     │
         ┌───────────────────────────┼───────────────────────────┐
         ▼                           ▼                           ▼
┌──────────────────┐       ┌──────────────────┐       ┌──────────────────┐
│  envValidator    │       │   DbManager      │       │   RedisManager   │
│  (Startup Gate)  │       │  (PostgreSQL/    │       │ (Auto-Downgrade  │
└──────────────────┘       │   Cloud SQL)     │       │   In-Memory)     │
                           └──────────────────┘       └──────────────────┘
                                     │                           │
         ┌───────────────────────────┼───────────────────────────┘
         ▼                           ▼
┌──────────────────┐       ┌──────────────────┐
│  StorageManager  │       │  HealthService   │
│ (GCS/S3/Local)   │       │ (Probes/Metrics) │
└──────────────────┘       └──────────────────┘
```

---

## 🚀 Startup Lifecycle

1. **Environment Validation (`envValidator`)**:
   - Validates existence and integrity of required environment variables (`DATABASE_URL`, `JWT_SECRET`, `NODE_ENV`, `PORT`, `REDIS_URL`, `STORAGE_PROVIDER`, `STORAGE_BUCKET_NAME`).
   - In production (`NODE_ENV=production`), fails fast if critical database or security credentials are missing.

2. **PostgreSQL / Cloud SQL Initialization (`dbManager`)**:
   - Connects to PostgreSQL connection pool.
   - Performs initial `SELECT 1` readiness verification probe.

3. **Redis Runtime Initialization (`redisManager`)**:
   - Attempts Redis client connection.
   - **Auto-Downgrade Resilience**: If Redis is unreachable, logs a warning and automatically downgrades caching, rate limiting, and session queues to in-memory fallback without throwing an exception or crashing the container.

4. **Storage Manager Setup (`storageManager`)**:
   - Initializes cloud object storage provider abstraction (`gcs`, `s3`, or `local`) based on configuration.

5. **HTTP & Socket.IO Binding**:
   - Creates HTTP server instance and attaches Socket.IO real-time event gateway.
   - Binds server to `0.0.0.0:${PORT}`.

---

## 🛑 Graceful Shutdown Lifecycle

Upon receiving `SIGINT` or `SIGTERM` signals from Cloud Run / Kubernetes / Docker:

1. **Phase 1 (Ingress Drain)**:
   - `httpServer.close()` stops receiving new HTTP connections and allows in-flight HTTP requests to complete.

2. **Phase 2 (Real-Time Disconnect)**:
   - `socketServer.close()` closes active WebSocket rooms and disconnects connected clients gracefully.

3. **Phase 3 (Database Pool End)**:
   - `dbManager.disconnect()` drains active database connection pool handles and closes client sockets.

4. **Phase 4 (Redis Client Clean-up)**:
   - `redisManager.disconnect()` flushes in-memory queues and closes Redis socket connections.

5. **Phase 5 (Process Exit)**:
   - Process exits cleanly with exit code `0`.

---

## 📊 Health & Observability System

The runtime exposes standardized health and telemetry probes accessible directly or via `/api/v1`:

| Endpoint | Method | Purpose | Response |
| :--- | :--- | :--- | :--- |
| `/health` | `GET` | High-level status summary | `{ status: "ready", service: "KAEVY STUDIO API v1" }` |
| `/live` | `GET` | Container Liveness probe | `{ status: "alive", uptimeSeconds: 120 }` |
| `/ready` | `GET` | Container Readiness probe | `{ status: "ready", services: { postgres: "healthy", redis: "PONG" } }` |
| `/metrics` | `GET` | Prometheus & Grafana metrics | Memory RSS/Heap, DB connection pool stats, uptime |
| `/version` | `GET` | Build & runtime info | App version, git commit hash, Node version, environment |

---

## 📝 Structured JSON Logging

All logs in production use structured JSON output via `Logger` (`src/server/utils/logger.ts`):

```json
{
  "timestamp": "2026-08-03T10:00:00.000Z",
  "level": "info",
  "message": "KAEVY STUDIO API Server & Real-Time Socket.IO listening on http://0.0.0.0:3000",
  "service": "kaevy-studio-api",
  "environment": "production",
  "requestId": "req_123456789"
}
```

---

## 🔄 Dependency Graph

- `server.ts` -> `runtimeManager` -> [`envValidator`, `dbManager`, `redisManager`, `storageManager`, `logger`]
- `app.ts` -> `healthService` -> [`dbManager`, `redisManager`, `storageManager`]
