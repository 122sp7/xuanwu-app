import type { WorkspaceScheduleItem } from "../entities/ScheduleItem";

export interface ScheduleScope {
  readonly workspaceId: string;
}

export interface ScheduleRepository {
  listByWorkspace(scope: ScheduleScope): readonly WorkspaceScheduleItem[];
}
