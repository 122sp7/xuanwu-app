import type { CacheEntry } from "../entities/CacheEntry";

export interface CacheRepository {
  get(key: string): Promise<CacheEntry | null>;
  set(entry: CacheEntry): Promise<void>;
  delete(key: string): Promise<void>;
}
