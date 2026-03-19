import type { WorkspaceScheduleItem } from "../../domain/entities/ScheduleItem";
import type { ScheduleRepository, ScheduleScope } from "../../domain/repositories/ScheduleRepository";

export class ListWorkspaceScheduleItemsUseCase {
  constructor(private readonly scheduleRepository: ScheduleRepository) {}

  async execute(scope: ScheduleScope): Promise<readonly WorkspaceScheduleItem[]> {
    if (!scope.workspaceId.trim()) {
      return [];
    }

    return this.scheduleRepository.listByWorkspace(scope);
  }
}
