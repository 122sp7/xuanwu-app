import type { WorkspaceEntity } from "@/modules/workspace";
import { getWorkspaceScheduleItems } from "@/modules/workspace/domain/entities/WorkspaceOperationalSignals";

import type {
  WorkspaceFinanceScheduleSnapshot,
  WorkspaceScheduleItem,
} from "../../domain/entities/ScheduleItem";
import type {
  ScheduleRepository,
  ScheduleScope,
} from "../../domain/repositories/ScheduleRepository";

export class LegacyWorkspaceScheduleRepository implements ScheduleRepository {
  constructor(
    private readonly workspace: WorkspaceEntity,
    private readonly finance: WorkspaceFinanceScheduleSnapshot | null,
  ) {}

  listByWorkspace(scope: ScheduleScope): readonly WorkspaceScheduleItem[] {
    if (scope.workspaceId !== this.workspace.id) {
      return [];
    }

    return getWorkspaceScheduleItems(this.workspace, this.finance);
  }
}
