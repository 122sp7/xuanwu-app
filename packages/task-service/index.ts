/**
 * @package task-service
 * Task application service — use-cases and business workflows.
 *
 * This package exposes the executable task business logic:
 *   - CreateWorkspaceTaskUseCase
 *   - UpdateWorkspaceTaskUseCase
 *   - DeleteWorkspaceTaskUseCase
 *   - ListWorkspaceTasksUseCase
 *
 * All use-cases are framework-agnostic and depend only on the
 * TaskRepository port (from @task-core) and @shared-types.
 *
 * Usage:
 *   import { CreateWorkspaceTaskUseCase } from "@task-service";
 *   const useCase = new CreateWorkspaceTaskUseCase(repo);
 *   const result = await useCase.execute(input);
 */

// ── Use-cases ─────────────────────────────────────────────────────────────
export {
  CreateWorkspaceTaskUseCase,
  UpdateWorkspaceTaskUseCase,
  DeleteWorkspaceTaskUseCase,
  ListWorkspaceTasksUseCase,
} from "@/modules/task/application/use-cases/task.use-cases";

// ── Infrastructure adapter (concrete implementation) ─────────────────────
export { FirebaseTaskRepository } from "@/modules/task/infrastructure/firebase/FirebaseTaskRepository";

// ── Interface layer ───────────────────────────────────────────────────────
export {
  createWorkspaceTask,
  updateWorkspaceTask,
  deleteWorkspaceTask,
} from "@/modules/task/interfaces/_actions/task.actions";
export { getWorkspaceTasks } from "@/modules/task/interfaces/queries/task.queries";

// ── UI components ─────────────────────────────────────────────────────────
export { WorkspaceTaskTab } from "@/modules/task/interfaces/components/WorkspaceTaskTab";
