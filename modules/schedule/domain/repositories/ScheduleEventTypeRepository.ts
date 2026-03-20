import type { ScheduleEventType } from "../entities/ScheduleEventType";

export interface ScheduleEventTypeScope {
  readonly organizationId: string;
  /** When provided, includes workspace-specific types on top of org-wide ones. */
  readonly workspaceId?: string;
}

export interface ScheduleEventTypeRepository {
  listByScope(scope: ScheduleEventTypeScope): Promise<readonly ScheduleEventType[]>;
}
