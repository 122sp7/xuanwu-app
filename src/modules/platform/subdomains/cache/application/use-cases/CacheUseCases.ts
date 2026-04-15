import type { CacheEntry } from "../../domain/entities/CacheEntry";
import type { CacheRepository } from "../../domain/repositories/CacheRepository";

export interface WriteCacheEntryInput {
  readonly key: string;
  readonly value: unknown;
  readonly ttlSeconds?: number;
}

export interface ReadCacheEntryInput {
  readonly key: string;
}

export interface RemoveCacheEntryInput {
  readonly key: string;
}

export class WriteCacheEntryUseCase {
  constructor(private readonly repository: CacheRepository) {}

  async execute(input: WriteCacheEntryInput): Promise<void> {
    const now = new Date().toISOString();
    const expiresAtISO =
      input.ttlSeconds && input.ttlSeconds > 0
        ? new Date(Date.now() + input.ttlSeconds * 1000).toISOString()
        : null;

    const entry: CacheEntry = {
      key: input.key,
      value: input.value,
      expiresAtISO,
      createdAtISO: now,
      updatedAtISO: now,
    };

    await this.repository.set(entry);
  }
}

export class ReadCacheEntryUseCase {
  constructor(private readonly repository: CacheRepository) {}

  async execute(input: ReadCacheEntryInput): Promise<CacheEntry | null> {
    const entry = await this.repository.get(input.key);
    if (!entry) return null;
    if (entry.expiresAtISO && new Date(entry.expiresAtISO).getTime() <= Date.now()) {
      await this.repository.delete(input.key);
      return null;
    }
    return entry;
  }
}

export class RemoveCacheEntryUseCase {
  constructor(private readonly repository: CacheRepository) {}

  async execute(input: RemoveCacheEntryInput): Promise<void> {
    await this.repository.delete(input.key);
  }
}
