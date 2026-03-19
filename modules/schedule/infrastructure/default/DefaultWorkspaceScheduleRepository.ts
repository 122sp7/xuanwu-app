import type { WorkspaceEntity } from "@/modules/workspace";

import type { WorkspaceScheduleItem } from "../../domain/entities/ScheduleItem";
import type {
  ScheduleRepository,
  ScheduleScope,
} from "../../domain/repositories/ScheduleRepository";
import {
  createScheduleWorkspaceSnapshot,
  deriveScheduleItems,
  type ScheduleWorkspaceSnapshotSource,
} from "../../domain/services/derive-schedule-items";

function toScheduleSnapshotSource(
  workspace: WorkspaceEntity,
  finance: ScheduleWorkspaceSnapshotSource["finance"],
): ScheduleWorkspaceSnapshotSource {
  return {
    createdAt: workspace.createdAt.toDate(),
    address: workspace.address,
    personnel: workspace.personnel,
    hasBetaCapability: workspace.capabilities.some((capability) => capability.status === "beta"),
    finance,
  };
}

export class DefaultWorkspaceScheduleRepository implements ScheduleRepository {
  constructor(
    private readonly workspace: WorkspaceEntity,
    private readonly finance: ScheduleWorkspaceSnapshotSource["finance"],
  ) {}

  listByWorkspace(scope: ScheduleScope): readonly WorkspaceScheduleItem[] {
    if (scope.workspaceId !== this.workspace.id) {
      return [];
    }

    return deriveScheduleItems(
      createScheduleWorkspaceSnapshot(
        toScheduleSnapshotSource(this.workspace, this.finance),
      ),
    );
  }
}
