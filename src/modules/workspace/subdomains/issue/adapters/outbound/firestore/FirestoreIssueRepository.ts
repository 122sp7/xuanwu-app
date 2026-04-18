import type { IssueRepository } from "../../../domain/repositories/IssueRepository";
import type { IssueSnapshot } from "../../../domain/entities/Issue";
import type { IssueStatus } from "../../../domain/value-objects/IssueStatus";
import type { IssueStage } from "../../../domain/value-objects/IssueStage";

export interface FirestoreLike {
  get(collection: string, id: string): Promise<Record<string, unknown> | null>;
  set(collection: string, id: string, data: Record<string, unknown>): Promise<void>;
  delete(collection: string, id: string): Promise<void>;
  query(
    collection: string,
    filters: Array<{ field: string; op: string; value: unknown }>,
  ): Promise<Record<string, unknown>[]>;
}

export class FirestoreIssueRepository implements IssueRepository {
  private readonly collection = "issues";

  constructor(private readonly db: FirestoreLike) {}

  async findById(issueId: string): Promise<IssueSnapshot | null> {
    const doc = await this.db.get(this.collection, issueId);
    return doc ? (doc as unknown as IssueSnapshot) : null;
  }

  async findByTaskId(taskId: string): Promise<IssueSnapshot[]> {
    const docs = await this.db.query(this.collection, [
      { field: "taskId", op: "==", value: taskId },
    ]);
    return docs as unknown as IssueSnapshot[];
  }

  async findByWorkspaceId(workspaceId: string): Promise<IssueSnapshot[]> {
    const docs = await this.db.query(this.collection, [
      { field: "workspaceId", op: "==", value: workspaceId },
    ]);
    return docs as unknown as IssueSnapshot[];
  }

  async findByTaskIdAndStage(taskId: string, stage: IssueStage): Promise<IssueSnapshot[]> {
    const docs = await this.db.query(this.collection, [
      { field: "taskId", op: "==", value: taskId },
      { field: "stage", op: "==", value: stage },
    ]);
    return docs as unknown as IssueSnapshot[];
  }

  async countOpenByTaskId(taskId: string): Promise<number> {
    const docs = await this.db.query(this.collection, [
      { field: "taskId", op: "==", value: taskId },
      { field: "status", op: "in", value: ["open", "investigating", "fixing", "retest"] },
    ]);
    return docs.length;
  }

  async countOpenByTaskIdAndStage(taskId: string, stage: IssueStage): Promise<number> {
    const docs = await this.db.query(this.collection, [
      { field: "taskId", op: "==", value: taskId },
      { field: "stage", op: "==", value: stage },
      { field: "status", op: "in", value: ["open", "investigating", "fixing", "retest"] },
    ]);
    return docs.length;
  }

  async save(issue: IssueSnapshot): Promise<void> {
    await this.db.set(this.collection, issue.id, issue as unknown as Record<string, unknown>);
  }

  async updateStatus(
    issueId: string,
    to: IssueStatus,
    nowISO: string,
  ): Promise<IssueSnapshot | null> {
    const existing = await this.db.get(this.collection, issueId);
    if (!existing) return null;
    const updated = {
      ...existing,
      status: to,
      ...(to === "resolved" ? { resolvedAtISO: nowISO } : {}),
      updatedAtISO: nowISO,
    };
    await this.db.set(this.collection, issueId, updated);
    return updated as unknown as IssueSnapshot;
  }

  async delete(issueId: string): Promise<void> {
    await this.db.delete(this.collection, issueId);
  }
}
