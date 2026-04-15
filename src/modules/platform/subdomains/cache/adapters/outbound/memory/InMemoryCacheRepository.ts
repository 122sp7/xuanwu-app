import type { CacheEntry } from "../../../domain/entities/CacheEntry";
import type { CacheRepository } from "../../../domain/repositories/CacheRepository";

export class InMemoryCacheRepository implements CacheRepository {
  private readonly store = new Map<string, CacheEntry>();

  async get(key: string): Promise<CacheEntry | null> {
    return this.store.get(key) ?? null;
  }

  async set(entry: CacheEntry): Promise<void> {
    this.store.set(entry.key, entry);
  }

  async delete(key: string): Promise<void> {
    this.store.delete(key);
  }
}
