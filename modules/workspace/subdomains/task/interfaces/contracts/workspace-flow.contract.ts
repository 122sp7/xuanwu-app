import type { Task } from "../../application/dto/workflow.dto";

export interface TaskSummary {
  readonly id: string;
  readonly workspaceId: string;
  readonly title: string;
  readonly status: Task["status"];
  readonly assigneeId?: string;
}

export function toTaskSummary(task: Task): TaskSummary {
  return {
    id: task.id,
    workspaceId: task.workspaceId,
    title: task.title,
    status: task.status,
    assigneeId: task.assigneeId,
  };
}
