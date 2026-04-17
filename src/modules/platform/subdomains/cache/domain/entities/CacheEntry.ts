export interface CacheEntry {
  readonly key: string;
  readonly value: unknown;
  readonly expiresAtISO: string | null;
  readonly createdAtISO: string;
  readonly updatedAtISO: string;
}
