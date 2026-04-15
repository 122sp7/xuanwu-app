import type { CachePort } from '../../../application/ports/outbound/CachePort';

interface CacheEntry<T = unknown> {
  value: T;
  expiresAt?: number;
}

/**
 * In-memory reference implementation of CachePort.
 * Swap for Redis/Memcached adapter at the composition root if needed.
 */
export class TemplateCacheAdapter implements CachePort {
  private readonly store = new Map<string, CacheEntry>();

  async get<T>(key: string): Promise<T | null> {
    const entry = this.store.get(key);
    if (!entry) return null;
    if (entry.expiresAt && entry.expiresAt < Date.now()) {
      this.store.delete(key);
      return null;
    }
    return entry.value as T;
  }

  async set<T>(key: string, value: T, ttlSeconds?: number): Promise<void> {
    this.store.set(key, {
      value,
      expiresAt: ttlSeconds ? Date.now() + ttlSeconds * 1000 : undefined,
    });
  }

  async delete(key: string): Promise<void> {
    this.store.delete(key);
  }
}
