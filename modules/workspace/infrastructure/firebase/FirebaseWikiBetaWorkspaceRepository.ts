import { getWorkspacesForAccount } from "@/modules/workspace/api";

import type { WikiBetaWorkspaceRepository } from "../../domain/repositories/WikiBetaWorkspaceRepository";
import type { WikiBetaWorkspaceRef } from "../../domain/entities/WikiBetaContentTree";

export class FirebaseWikiBetaWorkspaceRepository implements WikiBetaWorkspaceRepository {
  async listByAccountId(accountId: string): Promise<WikiBetaWorkspaceRef[]> {
    const workspaces = await getWorkspacesForAccount(accountId);
    return workspaces.map((workspace) => ({
      id: workspace.id,
      name: workspace.name,
    }));
  }
}
