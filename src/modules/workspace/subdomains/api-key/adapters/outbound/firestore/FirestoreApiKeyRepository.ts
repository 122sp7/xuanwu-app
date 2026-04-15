import type { ApiKeyRepository } from "../../../domain/repositories/ApiKeyRepository";
import type { ApiKeySnapshot } from "../../../domain/entities/ApiKey";

export interface FirestoreLike {
  get(collection: string, id: string): Promise<Record<string, unknown> | null>;
  set(collection: string, id: string, data: Record<string, unknown>): Promise<void>;
  query(collection: string, filters: Array<{ field: string; op: string; value: unknown }>): Promise<Record<string, unknown>[]>;
}

export class FirestoreApiKeyRepository implements ApiKeyRepository {
  private readonly collection = "api_keys";

  constructor(private readonly db: FirestoreLike) {}

  async findById(keyId: string): Promise<ApiKeySnapshot | null> {
    const doc = await this.db.get(this.collection, keyId);
    return doc ? (doc as unknown as ApiKeySnapshot) : null;
  }

  async findByWorkspaceId(workspaceId: string): Promise<ApiKeySnapshot[]> {
    const docs = await this.db.query(this.collection, [{ field: "workspaceId", op: "==", value: workspaceId }]);
    return docs as unknown as ApiKeySnapshot[];
  }

  async findByHash(keyHash: string): Promise<ApiKeySnapshot | null> {
    const docs = await this.db.query(this.collection, [{ field: "keyHash", op: "==", value: keyHash }]);
    return docs.length > 0 ? (docs[0] as unknown as ApiKeySnapshot) : null;
  }

  async save(key: ApiKeySnapshot): Promise<void> {
    await this.db.set(this.collection, key.id, key as unknown as Record<string, unknown>);
  }

  async revoke(keyId: string, nowISO: string): Promise<void> {
    const existing = await this.db.get(this.collection, keyId);
    if (existing) {
      await this.db.set(this.collection, keyId, { ...existing, status: "revoked", updatedAtISO: nowISO });
    }
  }
}
