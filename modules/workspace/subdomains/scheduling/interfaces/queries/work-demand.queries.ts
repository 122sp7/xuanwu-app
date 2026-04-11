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
  const normalizedWorkspaceId = workspaceId.trim();
  if (!normalizedWorkspaceId) {
    return [];
  }
  return new ListWorkspaceDemandsUseCase(makeRepo()).execute(normalizedWorkspaceId);
}

export async function getAccountDemands(accountId: string): Promise<WorkDemand[]> {
  const normalizedAccountId = accountId.trim();
  if (!normalizedAccountId) {
    return [];
  }
  return new ListAccountDemandsUseCase(makeRepo()).execute(normalizedAccountId);
}
