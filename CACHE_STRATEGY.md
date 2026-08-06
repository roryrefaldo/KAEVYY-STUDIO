# KAEVY STUDIO — Response Caching & Invalidation Strategy

## Overview

The Response Cache Layer (`src/server/cache/responseCache.ts`) provides high-performance Redis caching with in-memory fallbacks and tag-based invalidation.

---

## 🎯 Cached Endpoints

- `GET /services` (TTL: 300s, Tags: `services`, `categories`)
- `GET /services/:id` (TTL: 300s, Tags: `services`)
- `GET /developers` (TTL: 300s, Tags: `developers`)
- `GET /developers/:id` (TTL: 300s, Tags: `developers`)
- `GET /share-assets` (TTL: 300s, Tags: `share-assets`)
- `GET /currencies` (TTL: 600s, Tags: `currencies`)
- `GET /exchange-rates` (TTL: 600s, Tags: `exchange-rates`)

---

## 🏷 Tag-Based Invalidation

When an entity is updated or created (e.g., a service is updated or published):
```ts
await responseCache.invalidateTags(['services', 'categories']);
```
All cached responses associated with these tags are purged instantly from Redis and memory.

---

## ⚡ Stale-While-Revalidate (SWR)

- Cached entries support non-blocking background revalidation.
- If data is slightly stale, it is returned immediately to the user while revalidation executes in the background.
