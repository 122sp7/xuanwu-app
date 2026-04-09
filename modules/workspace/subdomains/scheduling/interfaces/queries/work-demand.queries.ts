"use server";

import type { WorkDemand } from "../../domain/types";
import {
  ListWorkspaceDemandsUseCase,
  ListAccountDemandsUseCase,
} from "../../application/work-demand.use-cases";
import { FirebaseDemandRepository } from "../../infrastructure/firebase/FirebaseDemandRepository";

function makeRepo() {
  return new FirebaseDemandRepository();
}

export async function getWorkspaceDemands(workspaceId: string): Promise<WorkDemand[]> {
  return new ListWorkspaceDemandsUseCase(makeRepo()).execute(workspaceId);
}

export async function getAccountDemands(accountId: string): Promise<WorkDemand[]> {
  return new ListAccountDemandsUseCase(makeRepo()).execute(accountId);
}

