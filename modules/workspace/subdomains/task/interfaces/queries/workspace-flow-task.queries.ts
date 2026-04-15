import type { Task } from "../../application/dto/workflow.dto";
import { makeTaskRepo } from "../../api/factories";

export async function getWorkspaceFlowTasks(workspaceId: string): Promise<Task[]> {
  return makeTaskRepo().findByWorkspaceId(workspaceId);
}

export async function getWorkspaceFlowTask(taskId: string): Promise<Task | null> {
  return makeTaskRepo().findById(taskId);
}
