"use server";

import type { WorkDemand } from "../../application/dto/work-demand.dto";
import {
  ListWorkspaceDemandsUseCase,
  ListAccountDemandsUseCase,
} from "../../application/work-demand.use-cases";
import { makeDemandRepo } from "../../api/factories";

function makeRepo() {
  return makeDemandRepo();
}

export async function getWorkspaceDemands(workspaceId: string): Promise<WorkDemand[]> {
  return new ListWorkspaceDemandsUseCase(makeRepo()).execute(workspaceId);
}

export async function getAccountDemands(accountId: string): Promise<WorkDemand[]> {
  return new ListAccountDemandsUseCase(makeRepo()).execute(accountId);
}
