/**
 * Module: workspace/subdomains/scheduling
 * Layer: domain/repository
 * Purpose: IDemandRepository port — implemented by infrastructure adapters.
 */

import type { WorkDemand } from "./types";

export interface IDemandRepository {
  listByWorkspace(workspaceId: string): Promise<WorkDemand[]>;
  listByAccount(accountId: string): Promise<WorkDemand[]>;
  save(demand: WorkDemand): Promise<void>;
  update(demand: WorkDemand): Promise<void>;
  findById(id: string): Promise<WorkDemand | null>;
}

