import type { TaskRepository } from "../../../domain/repositories/TaskRepository";
import type { TaskSnapshot } from "../../../domain/entities/Task";
import type { TaskStatus } from "../../../domain/value-objects/TaskStatus";

export interface FirestoreLike {
  get(collection: string, id: string): Promise<Record<string, unknown> | null>;
  set(collection: string, id: string, data: Record<string, unknown>): Promise<void>;
  delete(collection: string, id: string): Promise<void>;
  query(
    collection: string,
    filters: Array<{ field: string; op: string; value: unknown }>,
  ): Promise<Record<string, unknown>[]>;
}

export class FirestoreTaskRepository implements TaskRepository {
  private readonly collection = "tasks";

  constructor(private readonly db: FirestoreLike) {}

  async findById(taskId: string): Promise<TaskSnapshot | null> {
    const doc = await this.db.get(this.collection, taskId);
    if (!doc) return null;
    return doc as unknown as TaskSnapshot;
  }

  async findByWorkspaceId(workspaceId: string): Promise<TaskSnapshot[]> {
    const docs = await this.db.query(this.collection, [
      { field: "workspaceId", op: "==", value: workspaceId },
    ]);
    return docs as unknown as TaskSnapshot[];
  }

  async save(task: TaskSnapshot): Promise<void> {
    await this.db.set(this.collection, task.id, task as unknown as Record<string, unknown>);
  }

  async updateStatus(
    taskId: string,
    to: TaskStatus,
    nowISO: string,
  ): Promise<TaskSnapshot | null> {
    const existing = await this.db.get(this.collection, taskId);
    if (!existing) return null;
    const updated = {
      ...existing,
      status: to,
      ...(to === "accepted" ? { acceptedAtISO: nowISO } : {}),
      ...(to === "archived" ? { archivedAtISO: nowISO } : {}),
      updatedAtISO: nowISO,
    };
    await this.db.set(this.collection, taskId, updated);
    return updated as unknown as TaskSnapshot;
  }

  async delete(taskId: string): Promise<void> {
    await this.db.delete(this.collection, taskId);
  }
}
