import type { WorkspaceTaskEntity } from "../../domain/entities/Task";
import { ListWorkspaceTasksUseCase } from "../../application/use-cases/task.use-cases";
import { FirebaseTaskRepository } from "../../infrastructure/firebase/FirebaseTaskRepository";

const taskRepository = new FirebaseTaskRepository();
const listWorkspaceTasksUseCase = new ListWorkspaceTasksUseCase(taskRepository);

export async function getWorkspaceTasks(workspaceId: string): Promise<WorkspaceTaskEntity[]> {
  return listWorkspaceTasksUseCase.execute(workspaceId);
}
