import type { AuditRepository } from "../../../domain/repositories/AuditRepository";
import type { AuditEntrySnapshot } from "../../../domain/entities/AuditEntry";

export interface FirestoreLike {
  get(collection: string, id: string): Promise<Record<string, unknown> | null>;
  set(collection: string, id: string, data: Record<string, unknown>): Promise<void>;
  query(collection: string, filters: Array<{ field: string; op: string; value: unknown }>): Promise<Record<string, unknown>[]>;
}

export class FirestoreAuditRepository implements AuditRepository {
  private readonly collection = "audit_entries";

  constructor(private readonly db: FirestoreLike) {}

  async save(entry: AuditEntrySnapshot): Promise<void> {
    await this.db.set(this.collection, entry.id, entry as unknown as Record<string, unknown>);
  }

  async findByWorkspaceId(workspaceId: string): Promise<AuditEntrySnapshot[]> {
    const docs = await this.db.query(this.collection, [{ field: "workspaceId", op: "==", value: workspaceId }]);
    return docs as unknown as AuditEntrySnapshot[];
  }

  async findByWorkspaceIds(workspaceIds: string[], maxCount = 100): Promise<AuditEntrySnapshot[]> {
    const docs = await this.db.query(this.collection, [{ field: "workspaceId", op: "in", value: workspaceIds }]);
    return (docs as unknown as AuditEntrySnapshot[]).slice(0, maxCount);
  }
}
