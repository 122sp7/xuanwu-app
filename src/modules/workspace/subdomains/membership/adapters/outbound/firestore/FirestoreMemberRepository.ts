import type { WorkspaceMemberRepository } from "../../../domain/repositories/WorkspaceMemberRepository";
import type { WorkspaceMemberSnapshot } from "../../../domain/entities/WorkspaceMember";

export interface FirestoreLike {
  get(collection: string, id: string): Promise<Record<string, unknown> | null>;
  set(collection: string, id: string, data: Record<string, unknown>): Promise<void>;
  delete(collection: string, id: string): Promise<void>;
  query(collection: string, filters: Array<{ field: string; op: string; value: unknown }>): Promise<Record<string, unknown>[]>;
}

export class FirestoreMemberRepository implements WorkspaceMemberRepository {
  private readonly collection = "workspace_members";

  constructor(private readonly db: FirestoreLike) {}

  async findById(memberId: string): Promise<WorkspaceMemberSnapshot | null> {
    const doc = await this.db.get(this.collection, memberId);
    return doc ? (doc as unknown as WorkspaceMemberSnapshot) : null;
  }

  async findByWorkspaceId(workspaceId: string): Promise<WorkspaceMemberSnapshot[]> {
    const docs = await this.db.query(this.collection, [{ field: "workspaceId", op: "==", value: workspaceId }]);
    return docs as unknown as WorkspaceMemberSnapshot[];
  }

  async findByActorAndWorkspace(actorId: string, workspaceId: string): Promise<WorkspaceMemberSnapshot | null> {
    const docs = await this.db.query(this.collection, [
      { field: "actorId", op: "==", value: actorId },
      { field: "workspaceId", op: "==", value: workspaceId },
    ]);
    return docs.length > 0 ? (docs[0] as unknown as WorkspaceMemberSnapshot) : null;
  }

  async save(member: WorkspaceMemberSnapshot): Promise<void> {
    await this.db.set(this.collection, member.id, member as unknown as Record<string, unknown>);
  }

  async delete(memberId: string): Promise<void> {
    await this.db.delete(this.collection, memberId);
  }
}
