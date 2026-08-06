# KAEVY STUDIO — Queue Architecture Specification

## Overview

The Central Queue Architecture in KAEVY STUDIO provides asynchronous job dispatching, priority execution, delayed retries, and dead-letter queue (DLQ) handling.

---

## 🏗 System Components

```
[ Controller / Event ]
          │
   (enqueue Job)
          ▼
   ┌──────────────┐      Redis Available?
   │ QueueManager │─────────────────────────────┐
   └──────────────┘                             │
          │                                     │
    (Select Queue)                              │
          ▼                                     │
   ┌──────────────┐           YES               ▼
   │ QueueFactory │───────────────► ┌──────────────────────┐
   └──────────────┘                 │ Redis Queue Adapter  │
          │                         └──────────────────────┘
          │ NO                                  │
          ▼                                     ▼
 ┌───────────────────┐               ┌──────────────────┐
 │ In-Memory Fallback│               │ BullMQ Processing│
 └───────────────────┘               └──────────────────┘
          │                                     │
          └─────────────────┬───────────────────┘
                            │
                            ▼
                    ┌──────────────┐
                    │ Worker Engine│
                    └──────────────┘
                            │
               ┌────────────┴────────────┐
               │                         │
            Success                   Failed
               │                         │
               ▼                         ▼
      ┌────────────────┐        ┌─────────────────┐
      │ Emit Completed │        │  Retry / DLQ    │
      └────────────────┘        └─────────────────┘
```

---

## 📜 Named Queue Registry

1. `EMAIL_QUEUE`: Transactional email delivery and templates.
2. `NOTIFICATION_QUEUE`: Socket and push notifications.
3. `ESCROW_QUEUE`: Asynchronous escrow releases and wallet balance updates.
4. `PAYMENT_QUEUE`: Payment gateway callback processing.
5. `UPLOAD_QUEUE`: File upload processing pipeline.
6. `THUMBNAIL_QUEUE`: Image resizing and thumbnail generation.
7. `ASSET_SCAN_QUEUE`: Security and virus scanning.
8. `AUDIT_QUEUE`: Enterprise audit log entries.
9. `WEBHOOK_QUEUE`: Third-party webhook handlers (Midtrans, Stripe, Discord).

---

## ⚡ Dead Letter Queue (DLQ)

When a job exceeds its maximum retry attempts (`attempts: 3` by default), it is automatically transferred to the Dead Letter Queue:
- **Payload Preserved**: Preserves job ID, original data, failure reason, and stack trace.
- **Admin Inspection**: Exposed via `queueManager.getDLQManager()`.
