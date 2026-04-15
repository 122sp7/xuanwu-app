import type { WorkspaceShareRepository } from "../../../domain/repositories/WorkspaceShareRepository";
import type { WorkspaceShareSnapshot } from "../../../domain/entities/WorkspaceShare";

export interface FirestoreLike {
  get(collection: string, id: string): Promise<Record<string, unknown> | null>;
  set(collection: string, id: string, data: Record<string, unknown>): Promise<void>;
  delete(collection: string, id: string): Promise<void>;
  query(collection: string, filters: Array<{ field: string; op: string; value: unknown }>): Promise<Record<string, unknown>[]>;
}

export class FirestoreShareRepository implements WorkspaceShareRepository {
  private readonly collection = "workspace_shares";

  constructor(private readonly db: FirestoreLike) {}

  async findById(shareId: string): Promise<WorkspaceShareSnapshot | null> {
    const doc = await this.db.get(this.collection, shareId);
    return doc ? (doc as unknown as WorkspaceShareSnapshot) : null;
  }

  async findByWorkspaceId(workspaceId: string): Promise<WorkspaceShareSnapshot[]> {
    const docs = await this.db.query(this.collection, [{ field: "workspaceId", op: "==", value: workspaceId }]);
    return docs as unknown as WorkspaceShareSnapshot[];
  }

  async save(share: WorkspaceShareSnapshot): Promise<void> {
    await this.db.set(this.collection, share.id, share as unknown as Record<string, unknown>);
  }

  async delete(shareId: string): Promise<void> {
    await this.db.delete(this.collection, shareId);
  }
}
