import type { TaskFormationJobRepository } from "../../../domain/repositories/TaskFormationJobRepository";
import type { TaskFormationJobSnapshot, CompleteTaskFormationJobInput } from "../../../domain/entities/TaskFormationJob";

export interface FirestoreLike {
  get(collection: string, id: string): Promise<Record<string, unknown> | null>;
  set(collection: string, id: string, data: Record<string, unknown>): Promise<void>;
  query(collection: string, filters: Array<{ field: string; op: string; value: unknown }>): Promise<Record<string, unknown>[]>;
}

export class FirestoreTaskFormationJobRepository implements TaskFormationJobRepository {
  private readonly collection = "task_formation_jobs";

  constructor(private readonly db: FirestoreLike) {}

  async findById(jobId: string): Promise<TaskFormationJobSnapshot | null> {
    const doc = await this.db.get(this.collection, jobId);
    if (!doc) return null;
    const snapshot = doc as unknown as TaskFormationJobSnapshot;
    // Backward compat: old docs may lack `candidates` field.
    return { ...snapshot, candidates: snapshot.candidates ?? [] };
  }

  async findByWorkspaceId(workspaceId: string): Promise<TaskFormationJobSnapshot[]> {
    const docs = await this.db.query(this.collection, [{ field: "workspaceId", op: "==", value: workspaceId }]);
    return docs.map((d) => {
      const snapshot = d as unknown as TaskFormationJobSnapshot;
      return { ...snapshot, candidates: snapshot.candidates ?? [] };
    });
  }

  async save(job: TaskFormationJobSnapshot): Promise<void> {
    await this.db.set(this.collection, job.id, job as unknown as Record<string, unknown>);
  }

  async markRunning(jobId: string): Promise<TaskFormationJobSnapshot | null> {
    const existing = await this.db.get(this.collection, jobId);
    if (!existing) return null;
    const now = new Date().toISOString();
    const updated = { ...existing, status: "running", startedAtISO: now, updatedAtISO: now };
    await this.db.set(this.collection, jobId, updated);
    return updated as unknown as TaskFormationJobSnapshot;
  }

  async markCompleted(jobId: string, input: CompleteTaskFormationJobInput): Promise<TaskFormationJobSnapshot | null> {
    const existing = await this.db.get(this.collection, jobId);
    if (!existing) return null;
    const now = new Date().toISOString();
    const finalStatus = input.failedItems > 0 && input.succeededItems > 0 ? "partially_succeeded" : input.failedItems === 0 ? "succeeded" : "failed";
    const updated = { ...existing, ...input, status: finalStatus, completedAtISO: now, updatedAtISO: now };
    await this.db.set(this.collection, jobId, updated);
    return updated as unknown as TaskFormationJobSnapshot;
  }

  async markFailed(jobId: string, errorCode: string, errorMessage: string): Promise<TaskFormationJobSnapshot | null> {
    const existing = await this.db.get(this.collection, jobId);
    if (!existing) return null;
    const now = new Date().toISOString();
    const updated = { ...existing, status: "failed", errorCode, errorMessage, completedAtISO: now, updatedAtISO: now };
    await this.db.set(this.collection, jobId, updated);
    return updated as unknown as TaskFormationJobSnapshot;
  }
}
