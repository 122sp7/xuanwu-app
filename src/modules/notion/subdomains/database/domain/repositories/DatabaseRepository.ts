import type { DatabaseSnapshot } from "../entities/Database";

export interface DatabaseRepository {
  save(snapshot: DatabaseSnapshot): Promise<void>;
  findById(id: string): Promise<DatabaseSnapshot | null>;
  findByPageId(pageId: string): Promise<DatabaseSnapshot[]>;
  findByWorkspaceId(workspaceId: string): Promise<DatabaseSnapshot[]>;
  delete(id: string): Promise<void>;
}
