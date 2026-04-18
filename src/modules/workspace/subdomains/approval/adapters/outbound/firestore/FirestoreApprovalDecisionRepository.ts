import type { ApprovalDecisionRepository } from "../../../domain/repositories/ApprovalDecisionRepository";
import type { ApprovalDecisionSnapshot } from "../../../domain/entities/ApprovalDecision";

export interface FirestoreLike {
  get(collection: string, id: string): Promise<Record<string, unknown> | null>;
  set(collection: string, id: string, data: Record<string, unknown>): Promise<void>;
  delete(collection: string, id: string): Promise<void>;
  query(collection: string, filters: Array<{ field: string; op: string; value: unknown }>): Promise<Record<string, unknown>[]>;
}

export class FirestoreApprovalDecisionRepository implements ApprovalDecisionRepository {
  private readonly collection = "approval_decisions";

  constructor(private readonly db: FirestoreLike) {}

  async findById(decisionId: string): Promise<ApprovalDecisionSnapshot | null> {
    const doc = await this.db.get(this.collection, decisionId);
    return doc ? (doc as unknown as ApprovalDecisionSnapshot) : null;
  }

  async findByTaskId(taskId: string): Promise<ApprovalDecisionSnapshot[]> {
    const docs = await this.db.query(this.collection, [
      { field: "taskId", op: "==", value: taskId },
    ]);
    return docs as unknown as ApprovalDecisionSnapshot[];
  }

  async findByWorkspaceId(workspaceId: string): Promise<ApprovalDecisionSnapshot[]> {
    const docs = await this.db.query(this.collection, [
      { field: "workspaceId", op: "==", value: workspaceId },
    ]);
    return docs as unknown as ApprovalDecisionSnapshot[];
  }

  async save(decision: ApprovalDecisionSnapshot): Promise<void> {
    await this.db.set(this.collection, decision.id, decision as unknown as Record<string, unknown>);
  }

  async delete(decisionId: string): Promise<void> {
    await this.db.delete(this.collection, decisionId);
  }
}
