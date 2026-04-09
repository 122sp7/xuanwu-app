import { FirebaseWorkspaceRepository } from "./FirebaseWorkspaceRepository";

import type { WikiWorkspaceRepository } from "../../ports/output/WikiWorkspaceRepository";
import type { WikiWorkspaceRef } from "../../application/dtos/wiki-content-tree.dto";

const workspaceRepo = new FirebaseWorkspaceRepository();

export class FirebaseWikiWorkspaceRepository implements WikiWorkspaceRepository {
  async listByAccountId(accountId: string): Promise<WikiWorkspaceRef[]> {
    const workspaces = await workspaceRepo.findAllByAccountId(accountId);
    return workspaces.map((workspace) => ({
      id: workspace.id,
      name: workspace.name,
    }));
  }
}
