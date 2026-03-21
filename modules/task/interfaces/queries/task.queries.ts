import type { WorkspaceTaskEntity } from "@task-core";
import { ListWorkspaceTasksUseCase } from "@task-service";
import { FirebaseTaskRepository } from "../../infrastructure/firebase/FirebaseTaskRepository";

const taskRepository = new FirebaseTaskRepository();
const listWorkspaceTasksUseCase = new ListWorkspaceTasksUseCase(taskRepository);

export async function getWorkspaceTasks(workspaceId: string): Promise<WorkspaceTaskEntity[]> {
  return listWorkspaceTasksUseCase.execute(workspaceId);
}
