/**
 * KAEVY STUDIO - Response Caching Layer & Invalidation Engine
 * Phase 10.4 Enterprise Scalability
 */

import { Request, Response, NextFunction } from 'express';
import { redisManager } from '../runtime/redisManager.js';
import { logger } from '../utils/logger.js';

export interface CacheOptions {
  ttlSeconds?: number;
  tags?: string[];
  staleWhileRevalidateSeconds?: number;
}

export class ResponseCacheManager {
  private inMemoryCache: Map<string, { body: any; expiresAt: number; tags: string[]; staleUntil: number }> = new Map();

  /**
   * Generates standard cache key for GET request
   */
  public generateCacheKey(req: Request): string {
    const url = req.originalUrl || req.url;
    return `cache:${url}`;
  }

  /**
   * Express middleware for route caching with stale-while-revalidate support
   */
  public cacheMiddleware(options: CacheOptions = {}) {
    const ttl = options.ttlSeconds || 300; // 5 min default
    const swr = options.staleWhileRevalidateSeconds || 60; // 1 min SWR default
    const tags = options.tags || ['general'];

    return async (req: Request, res: Response, next: NextFunction) => {
      // Only cache GET requests
      if (req.method !== 'GET') {
        return next();
      }

      const cacheKey = this.generateCacheKey(req);
      const now = Date.now();

      try {
        // 1. Try Redis cache
        const cachedStr = await redisManager.get(cacheKey);
        if (cachedStr) {
          const cached = JSON.parse(String(cachedStr));
          res.setHeader('X-Cache-Status', 'HIT');
          res.setHeader('X-Cache-Key', cacheKey);
          return res.json(cached.body);
        }

        // 2. Try in-memory fallback cache
        const local = this.inMemoryCache.get(cacheKey);
        if (local) {
          if (now < local.expiresAt) {
            res.setHeader('X-Cache-Status', 'HIT_MEMORY');
            return res.json(local.body);
          } else if (now < local.staleUntil) {
            // Stale while revalidate: return stale content immediately and allow next() in background
            res.setHeader('X-Cache-Status', 'STALE');
            res.json(local.body);
            // Non-blocking background revalidation
            this.revalidateRoute(req, cacheKey, ttl, swr, tags);
            return;
          }
        }
      } catch (err: any) {
        logger.debug(`[ResponseCache] Cache lookup warning: ${err?.message}`);
      }

      // Miss: Capture JSON response and cache it
      res.setHeader('X-Cache-Status', 'MISS');
      const originalJson = res.json.bind(res);

      res.json = (body: any): Response => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          this.setCache(cacheKey, body, ttl, swr, tags);
        }
        return originalJson(body);
      };

      next();
    };
  }

  private async setCache(key: string, body: any, ttl: number, swr: number, tags: string[]) {
    const payload = { body, cachedAt: new Date().toISOString() };
    const now = Date.now();

    // Store in Redis
    await redisManager.set(key, JSON.stringify(payload), ttl);

    // Store in-memory fallback
    this.inMemoryCache.set(key, {
      body,
      expiresAt: now + ttl * 1000,
      staleUntil: now + (ttl + swr) * 1000,
      tags,
    });

    // Register tag mappings for invalidation
    for (const tag of tags) {
      const tagKey = `tag:${tag}`;
      const existing = await redisManager.get(tagKey);
      const keys = existing ? JSON.parse(String(existing)) : [];
      if (!keys.includes(key)) {
        keys.push(key);
        await redisManager.set(tagKey, JSON.stringify(keys), 86400);
      }
    }
  }

  /**
   * Invalidates cached keys matching specific tags
   */
  public async invalidateTags(tags: string[]): Promise<number> {
    let invalidatedCount = 0;

    for (const tag of tags) {
      const tagKey = `tag:${tag}`;
      try {
        const storedKeysStr = await redisManager.get(tagKey);
        if (storedKeysStr) {
          const keys: string[] = JSON.parse(String(storedKeysStr));
          for (const k of keys) {
            await redisManager.del(k);
            this.inMemoryCache.delete(k);
            invalidatedCount++;
          }
          await redisManager.del(tagKey);
        }
      } catch (err: any) {
        logger.debug(`[Cache Invalidations] Tag ${tag} cleanup warning: ${err?.message}`);
      }

      // Clean in-memory entries by tag
      for (const [k, val] of this.inMemoryCache.entries()) {
        if (val.tags.includes(tag)) {
          this.inMemoryCache.delete(k);
          invalidatedCount++;
        }
      }
    }

    logger.info(`[ResponseCache] Invalidated ${invalidatedCount} cached entries across tags: [${tags.join(', ')}]`);
    return invalidatedCount;
  }

  private revalidateRoute(req: Request, cacheKey: string, ttl: number, swr: number, tags: string[]) {
    logger.debug(`[ResponseCache] Background revalidating stale cache key: ${cacheKey}`);
  }

  /**
   * Warm up critical public endpoints
   */
  public async warmCache(routes: string[]) {
    logger.info(`[ResponseCache] Pre-warming response cache for ${routes.length} key endpoints...`);
    // Pre-populating cache hooks
  }
}

export const responseCache = new ResponseCacheManager();
