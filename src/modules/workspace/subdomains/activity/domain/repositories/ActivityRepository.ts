import type { ActivityEventSnapshot } from "../entities/ActivityEvent";

export interface ActivityRepository {
  save(entry: ActivityEventSnapshot): Promise<void>;
  listByWorkspace(workspaceId: string, limit?: number): Promise<ActivityEventSnapshot[]>;
  listByResource(workspaceId: string, resourceType: string, resourceId: string): Promise<ActivityEventSnapshot[]>;
}
