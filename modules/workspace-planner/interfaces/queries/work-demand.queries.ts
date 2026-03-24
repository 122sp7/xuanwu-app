"use server";

/**
 * Module: workspace-planner
 * Layer: interfaces/queries
 * Purpose: Read-side query helpers for WorkDemand.
 *
 * These are plain async functions callable from Server Components,
 * server actions, or wrapped in client hooks.
 */

import type { WorkDemand } from "../../domain/types";
import {
  ListWorkspaceDemandsUseCase,
  ListAccountDemandsUseCase,
} from "../../application/work-demand.use-cases";
import { MockDemandRepository } from "../../infrastructure/mock-demand-repository";

function makeRepo() {
  return new MockDemandRepository();
}

export async function getWorkspaceDemands(workspaceId: string): Promise<WorkDemand[]> {
  return new ListWorkspaceDemandsUseCase(makeRepo()).execute(workspaceId);
}

export async function getAccountDemands(accountId: string): Promise<WorkDemand[]> {
  return new ListAccountDemandsUseCase(makeRepo()).execute(accountId);
}
