import type { WorkspaceShareSnapshot } from "../entities/WorkspaceShare";

export interface WorkspaceShareRepository {
  findById(shareId: string): Promise<WorkspaceShareSnapshot | null>;
  findByWorkspaceId(workspaceId: string): Promise<WorkspaceShareSnapshot[]>;
  save(share: WorkspaceShareSnapshot): Promise<void>;
  delete(shareId: string): Promise<void>;
}
