import { ListWorkspaceScheduleItemsUseCase } from "../../application/use-cases/list-workspace-schedule-items.use-case";
import type { WorkspaceScheduleItem } from "../../domain/entities/ScheduleItem";
import { FirebaseWorkspaceScheduleRepository } from "../../infrastructure/firebase/FirebaseWorkspaceScheduleRepository";

const scheduleRepository = new FirebaseWorkspaceScheduleRepository();
const listWorkspaceScheduleItemsUseCase = new ListWorkspaceScheduleItemsUseCase(scheduleRepository);

export async function getWorkspaceSchedule(
  workspaceId: string,
): Promise<readonly WorkspaceScheduleItem[]> {
  return listWorkspaceScheduleItemsUseCase.execute({ workspaceId });
}
