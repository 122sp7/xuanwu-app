import type { TaskEntity } from "../../domain/entities/Task";
import { ListTasksUseCase } from "../../application/use-cases/task.use-cases";
import { FirebaseTaskRepository } from "../../infrastructure/firebase/FirebaseTaskRepository";

export async function getTasks(workspaceId: string): Promise<TaskEntity[]> {
  return new ListTasksUseCase(new FirebaseTaskRepository()).execute(workspaceId);
}
