# KAEVY STUDIO — Health Monitoring & Observability Spec

---

## 1. Probes & Health Endpoints

KAEVY STUDIO exposes 3 standard Kubernetes-compatible monitoring probes:

1. **`GET /api/health`**
   - General status endpoint
   - Returns status 200 `{ "status": "ok", "service": "KAEVY STUDIO API v1" }`

2. **`GET /api/liveness`**
   - Container liveness probe
   - Confirms process event loop responsiveness & process uptime

3. **`GET /api/readiness`**
   - Readiness probe for load balancers & ingress routers
   - Validates heap memory allocations, database pool connectivity, and runtime metrics
   - Returns HTTP 200 when operational, or HTTP 503 if unhealthy

---

## 2. Structured JSON Logging

Logs are formatted in structured JSON containing:
- `timestamp`: ISO 8601 string
- `requestId`: Unique string attached by `requestIdMiddleware` (`X-Request-Id`)
- `method` & `url`: Request routing info
- `statusCode` & `responseTimeMs`: Performance timing
- `userId` (if authenticated): User traceability

---

## 3. Metrics Telemetry

The Admin Console **Section 12 (System Health)** polls real-time metrics:
- API response latency (ms)
- Database active pool connections
- Socket.IO connected clients & active collaboration rooms
- Redis cache hit ratio (%)
- RAM heap usage & CPU utilization (%)
