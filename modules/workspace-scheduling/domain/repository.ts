/**
 * Module: workspace-scheduling
 * Layer: domain/repository
 * Purpose: IDemandRepository port — implemented by infrastructure adapters.
 *
 * Domain must NOT depend on Firebase SDK, HTTP clients, or any framework.
 */

import type { WorkDemand } from "./types";

export interface IDemandRepository {
  /** List all demands for a specific workspace (tenant view). */
  listByWorkspace(workspaceId: string): Promise<WorkDemand[]>;
  /** List all demands across all workspaces for an account (manager view). */
  listByAccount(accountId: string): Promise<WorkDemand[]>;
  /** Persist a new demand. */
  save(demand: WorkDemand): Promise<void>;
  /** Update an existing demand. */
  update(demand: WorkDemand): Promise<void>;
  /** Find a single demand by ID. */
  findById(id: string): Promise<WorkDemand | null>;
}
