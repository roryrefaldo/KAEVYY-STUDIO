# KAEVY STUDIO — Background Workers Specification

## Overview

Background Workers process enqueued jobs asynchronously without blocking HTTP response cycles.

---

## 🛠 Worker Implementations

Located in `/src/server/workers/`:

| Worker Class | Queue | Purpose |
|--------------|-------|---------|
| `EmailWorker` | `EMAIL_QUEUE` | Dispatches transactional emails asynchronously. |
| `NotificationWorker` | `NOTIFICATION_QUEUE` | Sends real-time socket and push notifications. |
| `EscrowWorker` | `ESCROW_QUEUE` | Releases escrow funds and updates developer balances. |
| `WebhookWorker` | `WEBHOOK_QUEUE` | Handles Midtrans, Stripe, Discord webhooks with idempotency. |
| `AssetProcessingWorker` | `UPLOAD_QUEUE` | Coordinates file upload processing pipelines. |
| `VirusScanWorker` | `ASSET_SCAN_QUEUE` | Scans uploaded files for malicious signatures. |
| `ThumbnailWorker` | `THUMBNAIL_QUEUE` | Resizes images into thumbnail previews. |
| `AuditWorker` | `AUDIT_QUEUE` | Records high-volume audit logs without DB contention. |

---

## 🔁 Worker Resilience & Recovery

- **Unkillable Host**: Errors within job execution trigger worker retries with exponential backoff and never crash the primary Express API process.
- **Automatic Reconnection**: Reconnects gracefully if Redis connection temporarily drops.
- **Worker Registry**: Initialized at application startup via `WorkerRegistry.initializeAllWorkers()`.
