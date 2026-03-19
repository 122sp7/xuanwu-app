import type { WorkspaceEntity } from "@/modules/workspace";

import { ListWorkspaceScheduleItemsUseCase } from "../../application/use-cases/list-workspace-schedule-items.use-case";
import type {
  WorkspaceFinanceScheduleSnapshot,
  WorkspaceScheduleItem,
} from "../../domain/entities/ScheduleItem";
import { DefaultWorkspaceScheduleRepository } from "../../infrastructure/default/DefaultWorkspaceScheduleRepository";

export function getWorkspaceSchedule(
  workspace: WorkspaceEntity,
  finance: WorkspaceFinanceScheduleSnapshot | null,
): readonly WorkspaceScheduleItem[] {
  const useCase = new ListWorkspaceScheduleItemsUseCase(
    new DefaultWorkspaceScheduleRepository(workspace, finance),
  );

  return useCase.execute({ workspaceId: workspace.id });
}
