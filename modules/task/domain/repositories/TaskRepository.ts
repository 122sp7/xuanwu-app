import type {
  CreateWorkspaceTaskInput,
  UpdateWorkspaceTaskInput,
  WorkspaceTaskEntity,
} from "../entities/Task";

export interface TaskRepository {
  create(input: CreateWorkspaceTaskInput): Promise<WorkspaceTaskEntity>;
  update(taskId: string, input: UpdateWorkspaceTaskInput): Promise<WorkspaceTaskEntity | null>;
  delete(taskId: string): Promise<void>;
  findByWorkspaceId(workspaceId: string): Promise<WorkspaceTaskEntity[]>;
}
