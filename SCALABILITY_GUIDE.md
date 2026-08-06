# KAEVY STUDIO — Cloud Run Horizontal Scalability Guide

## Overview

This guide details how KAEVY STUDIO scales horizontally across multiple container instances on Google Cloud Run or Kubernetes.

---

## 🏛 Stateless Architecture

```
                       ┌─────────────────────────┐
                       │  Cloud Run Load Balancer│
                       └────────────┬────────────┘
                                    │
         ┌──────────────────────────┼──────────────────────────┐
         │                          │                          │
         ▼                          ▼                          ▼
┌──────────────────┐       ┌──────────────────┐       ┌──────────────────┐
│ Cloud Run Inst A │       │ Cloud Run Inst B │       │ Cloud Run Inst C │
└────────┬─────────┘       └────────┬─────────┘       └────────┬─────────┘
         │                          │                          │
         ├──────────────────────────┼──────────────────────────┤
         │                          │                          │
         ▼                          ▼                          ▼
┌──────────────────┐       ┌──────────────────┐       ┌──────────────────┐
│ Cloud SQL (Post) │       │ Redis Cluster    │       │ Cloud Storage    │
└──────────────────┘       └──────────────────┘       └──────────────────┘
```

---

## 🔑 Key Scalability Foundations

1. **Stateless API Process**: No session state is held on container local disks. User sessions rely on JWT cookies and Redis.
2. **Distributed Socket.IO Sync**: Socket.IO rooms and messaging sync across container instances using Redis Pub/Sub.
3. **Database Connection Pooling**: PostgreSQL connections are managed via Drizzle ORM and Cloud SQL Auth Proxy connection pooling.
4. **Asynchronous Background Processing**: Offloads heavy tasks (email, escrow, thumbnails, virus scans) to queue workers.
5. **Graceful Instance Termination**: Reacts to `SIGTERM` signals within 10 seconds, finishing active HTTP requests before exiting.
