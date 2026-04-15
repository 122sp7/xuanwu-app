import type { WorkspaceSnapshot } from "../entities/Workspace";

export interface WorkspaceRepository {
  findById(workspaceId: string): Promise<WorkspaceSnapshot | null>;
  findByAccountId(accountId: string): Promise<WorkspaceSnapshot[]>;
  save(workspace: WorkspaceSnapshot): Promise<void>;
  delete(workspaceId: string): Promise<void>;
}
