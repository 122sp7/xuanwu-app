import type { ActivityRepository } from "../../../domain/repositories/ActivityRepository";
import type { ActivityEventSnapshot } from "../../../domain/entities/ActivityEvent";

export interface FirestoreLike {
  get(collection: string, id: string): Promise<Record<string, unknown> | null>;
  set(collection: string, id: string, data: Record<string, unknown>): Promise<void>;
  query(collection: string, filters: Array<{ field: string; op: string; value: unknown }>): Promise<Record<string, unknown>[]>;
}

export class FirestoreActivityRepository implements ActivityRepository {
  private readonly collection = "activity_events";

  constructor(private readonly db: FirestoreLike) {}

  async save(entry: ActivityEventSnapshot): Promise<void> {
    await this.db.set(this.collection, entry.id, entry as unknown as Record<string, unknown>);
  }

  async listByWorkspace(workspaceId: string, limit = 50): Promise<ActivityEventSnapshot[]> {
    const docs = await this.db.query(this.collection, [{ field: "workspaceId", op: "==", value: workspaceId }]);
    return (docs as unknown as ActivityEventSnapshot[]).slice(0, limit);
  }

  async listByResource(workspaceId: string, resourceType: string, resourceId: string): Promise<ActivityEventSnapshot[]> {
    const docs = await this.db.query(this.collection, [
      { field: "workspaceId", op: "==", value: workspaceId },
      { field: "resourceType", op: "==", value: resourceType },
      { field: "resourceId", op: "==", value: resourceId },
    ]);
    return docs as unknown as ActivityEventSnapshot[];
  }
}
