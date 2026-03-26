import { FirebaseWorkspaceRepository } from "./FirebaseWorkspaceRepository";

import type { WikiBetaWorkspaceRepository } from "../../domain/repositories/WikiBetaWorkspaceRepository";
import type { WikiBetaWorkspaceRef } from "../../domain/entities/WikiBetaContentTree";

const workspaceRepo = new FirebaseWorkspaceRepository();

export class FirebaseWikiBetaWorkspaceRepository implements WikiBetaWorkspaceRepository {
  async listByAccountId(accountId: string): Promise<WikiBetaWorkspaceRef[]> {
    const workspaces = await workspaceRepo.findAllByAccountId(accountId);
    return workspaces.map((workspace) => ({
      id: workspace.id,
      name: workspace.name,
    }));
  }
}
