import type { DemandRepository } from "../../../domain/repositories/DemandRepository";
import type { WorkDemandSnapshot } from "../../../domain/entities/WorkDemand";

export interface FirestoreLike {
  get(collection: string, id: string): Promise<Record<string, unknown> | null>;
  set(collection: string, id: string, data: Record<string, unknown>): Promise<void>;
  query(collection: string, filters: Array<{ field: string; op: string; value: unknown }>): Promise<Record<string, unknown>[]>;
}

export class FirestoreDemandRepository implements DemandRepository {
  private readonly collection = "work_demands";

  constructor(private readonly db: FirestoreLike) {}

  async findById(id: string): Promise<WorkDemandSnapshot | null> {
    const doc = await this.db.get(this.collection, id);
    return doc ? (doc as unknown as WorkDemandSnapshot) : null;
  }

  async listByWorkspace(workspaceId: string): Promise<WorkDemandSnapshot[]> {
    const docs = await this.db.query(this.collection, [{ field: "workspaceId", op: "==", value: workspaceId }]);
    return docs as unknown as WorkDemandSnapshot[];
  }

  async listByAccount(accountId: string): Promise<WorkDemandSnapshot[]> {
    const docs = await this.db.query(this.collection, [{ field: "accountId", op: "==", value: accountId }]);
    return docs as unknown as WorkDemandSnapshot[];
  }

  async save(demand: WorkDemandSnapshot): Promise<void> {
    await this.db.set(this.collection, demand.id, demand as unknown as Record<string, unknown>);
  }

  async update(demand: WorkDemandSnapshot): Promise<void> {
    await this.db.set(this.collection, demand.id, demand as unknown as Record<string, unknown>);
  }
}
