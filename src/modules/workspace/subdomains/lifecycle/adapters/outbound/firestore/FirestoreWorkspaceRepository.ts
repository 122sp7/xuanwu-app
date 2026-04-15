import type { WorkspaceRepository } from "../../../domain/repositories/WorkspaceRepository";
import type { WorkspaceSnapshot } from "../../../domain/entities/Workspace";

export interface FirestoreLike {
  get(collection: string, id: string): Promise<Record<string, unknown> | null>;
  set(collection: string, id: string, data: Record<string, unknown>): Promise<void>;
  delete(collection: string, id: string): Promise<void>;
  query(collection: string, filters: Array<{ field: string; op: string; value: unknown }>): Promise<Record<string, unknown>[]>;
}

export class FirestoreWorkspaceRepository implements WorkspaceRepository {
  private readonly collection = "workspaces";

  constructor(private readonly db: FirestoreLike) {}

  async findById(workspaceId: string): Promise<WorkspaceSnapshot | null> {
    const doc = await this.db.get(this.collection, workspaceId);
    return doc ? (doc as unknown as WorkspaceSnapshot) : null;
  }

  async findByAccountId(accountId: string): Promise<WorkspaceSnapshot[]> {
    const docs = await this.db.query(this.collection, [{ field: "accountId", op: "==", value: accountId }]);
    return docs as unknown as WorkspaceSnapshot[];
  }

  async save(workspace: WorkspaceSnapshot): Promise<void> {
    await this.db.set(this.collection, workspace.id, workspace as unknown as Record<string, unknown>);
  }

  async delete(workspaceId: string): Promise<void> {
    await this.db.delete(this.collection, workspaceId);
  }
}
