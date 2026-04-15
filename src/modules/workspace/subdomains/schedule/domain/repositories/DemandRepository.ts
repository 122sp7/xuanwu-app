import type { WorkDemandSnapshot } from "../entities/WorkDemand";

export interface DemandRepository {
  findById(id: string): Promise<WorkDemandSnapshot | null>;
  listByWorkspace(workspaceId: string): Promise<WorkDemandSnapshot[]>;
  listByAccount(accountId: string): Promise<WorkDemandSnapshot[]>;
  save(demand: WorkDemandSnapshot): Promise<void>;
  update(demand: WorkDemandSnapshot): Promise<void>;
}
