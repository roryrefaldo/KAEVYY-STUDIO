# KAEVY STUDIO — Phase 10.3 Enterprise Observability Architecture

This specification outlines the **Enterprise Observability & Distributed Tracing Engine** for KAEVY STUDIO, detailing telemetry collection, request tracing, metrics aggregation, error summary tracking, and OpenTelemetry compatibility.

---

## 🔍 Distributed Request Tracing & Context Flow

Every incoming HTTP request passes through `requestLoggerMiddleware` (`src/server/middleware/requestLogger.ts`), which injects standard trace context into both request state and response headers:

```
[ HTTP Request ]
      │
      ├──> Injects X-Request-Id (req_12345678) & X-Trace-Id (tr_12345678)
      ├──> Starts OpenTelemetry Span via DistributedTracer
      ├──> Tracks Authenticated User ID, Remote IP, and User-Agent
      │
[ Middleware / Controller / DB Query ]
      │
      ├──> Executes application & database logic
      ├──> Measures execution duration
      │
[ Response Finish ]
      │
      ├──> Completes OpenTelemetry Span (OK / ERROR)
      ├──> Records HTTP metrics in MetricsTracker
      └──> Emits structured JSON log entry via Logger
```

### Standard Header Specifications

- `X-Request-Id`: Unique request execution correlation ID.
- `X-Trace-Id`: W3C compliant distributed trace transaction identifier.

---

## 📊 Telemetry & Performance Metrics Models

The telemetry system exposes a unified JSON model via `GET /metrics` (`GET /api/v1/metrics`), returning an `ObservabilityDashboardDTO` object:

```json
{
  "health": {
    "status": "healthy",
    "version": "1.0.0-RC1",
    "environment": "production",
    "uptimeSeconds": 3600
  },
  "runtime": {
    "cpuUsagePercent": 2.4,
    "memoryRssMb": 128,
    "memoryHeapTotalMb": 85,
    "memoryHeapUsedMb": 54,
    "eventLoopDelayMs": 1,
    "nodeVersion": "v20.x"
  },
  "database": {
    "activeConnections": 2,
    "idleConnections": 8,
    "waitingClients": 0,
    "queryCountTotal": 1420,
    "averageQueryDurationMs": 4,
    "slowQueryCount": 0,
    "status": "healthy"
  },
  "redis": {
    "connected": true,
    "mode": "redis-cluster",
    "cacheHits": 850,
    "cacheMisses": 42,
    "hitRatioPercent": 95.29,
    "latencyMs": 1
  },
  "socket": {
    "connectedClients": 14,
    "activeRoomsCount": 5,
    "eventsPerSecond": 0.8,
    "messagesTotal": 320
  },
  "requests": {
    "totalRequests": 5400,
    "requestsPerMinute": 90,
    "averageResponseTimeMs": 18,
    "statusCodes": {
      "2xx": 5280,
      "3xx": 40,
      "4xx": 75,
      "5xx": 5
    },
    "errorRatePercent": 1.48
  },
  "errors": {
    "totalErrors": 80,
    "code401Count": 25,
    "code403Count": 10,
    "code404Count": 35,
    "code429Count": 5,
    "code500Count": 5,
    "recentErrors": []
  }
}
```

---

## 🛡️ Error Aggregation Engine

Errors occurring anywhere across HTTP controllers, unhandled exceptions, promise rejections, or database queries are intercepted and buffered by `MetricsTracker`:

1. **HTTP Status Code Summaries**: Aggregates `401 Unauthorized`, `403 Forbidden`, `404 Not Found`, `429 Rate Limited`, and `500 Internal Server Error`.
2. **Circular Buffer**: Retains the 20 most recent runtime errors with complete diagnostic metadata (timestamp, route path, status code, error message, and associated `requestId`).
3. **Fatal Exception Isolation**: Tracks process-level `uncaughtException` and `unhandledRejection` counts without causing ungraceful process crashes.

---

## ☁️ Cloud & Observability Platform Compatibility

- **Google Cloud Trace**: Compatible via `X-Trace-Id` correlation.
- **Prometheus & Grafana**: Data structure formatted for seamless Grafana dashboard visualization (pre-built in `/infra/monitoring/grafana/dashboards/kaevy-dashboard.json`).
- **Cloud Run / Kubernetes**: Standardized `GET /live` and `GET /ready` probes ensure container orchestration readiness.
