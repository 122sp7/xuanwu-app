import type { TaskMaterializationJobRepository } from "../../../domain/repositories/TaskMaterializationJobRepository";
import type { TaskMaterializationJobSnapshot, CompleteJobInput } from "../../../domain/entities/TaskMaterializationJob";

export interface FirestoreLike {
  get(collection: string, id: string): Promise<Record<string, unknown> | null>;
  set(collection: string, id: string, data: Record<string, unknown>): Promise<void>;
  query(collection: string, filters: Array<{ field: string; op: string; value: unknown }>): Promise<Record<string, unknown>[]>;
}

export class FirestoreJobRepository implements TaskMaterializationJobRepository {
  private readonly collection = "task_materialization_jobs";

  constructor(private readonly db: FirestoreLike) {}

  async findById(jobId: string): Promise<TaskMaterializationJobSnapshot | null> {
    const doc = await this.db.get(this.collection, jobId);
    return doc ? (doc as unknown as TaskMaterializationJobSnapshot) : null;
  }

  async findByWorkspaceId(workspaceId: string): Promise<TaskMaterializationJobSnapshot[]> {
    const docs = await this.db.query(this.collection, [{ field: "workspaceId", op: "==", value: workspaceId }]);
    return docs as unknown as TaskMaterializationJobSnapshot[];
  }

  async save(job: TaskMaterializationJobSnapshot): Promise<void> {
    await this.db.set(this.collection, job.id, job as unknown as Record<string, unknown>);
  }

  async markRunning(jobId: string): Promise<TaskMaterializationJobSnapshot | null> {
    const existing = await this.db.get(this.collection, jobId);
    if (!existing) return null;
    const updated = { ...existing, status: "running", startedAtISO: new Date().toISOString(), updatedAtISO: new Date().toISOString() };
    await this.db.set(this.collection, jobId, updated);
    return updated as unknown as TaskMaterializationJobSnapshot;
  }

  async markCompleted(jobId: string, input: CompleteJobInput): Promise<TaskMaterializationJobSnapshot | null> {
    const existing = await this.db.get(this.collection, jobId);
    if (!existing) return null;
    const finalStatus = input.failedItems > 0 && input.succeededItems > 0 ? "partially_succeeded" : input.failedItems === 0 ? "succeeded" : "failed";
    const now = new Date().toISOString();
    const updated = { ...existing, ...input, status: finalStatus, completedAtISO: now, updatedAtISO: now };
    await this.db.set(this.collection, jobId, updated);
    return updated as unknown as TaskMaterializationJobSnapshot;
  }

  async markFailed(jobId: string, errorCode: string, errorMessage: string): Promise<TaskMaterializationJobSnapshot | null> {
    const existing = await this.db.get(this.collection, jobId);
    if (!existing) return null;
    const now = new Date().toISOString();
    const updated = { ...existing, status: "failed", errorCode, errorMessage, completedAtISO: now, updatedAtISO: now };
    await this.db.set(this.collection, jobId, updated);
    return updated as unknown as TaskMaterializationJobSnapshot;
  }
}
