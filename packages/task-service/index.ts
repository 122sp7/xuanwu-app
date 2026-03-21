/**
 * @package task-service
 * Task application service — pure use-case orchestration.
 *
 * This package IS the source of truth for task use-cases.
 * It depends only on @task-core (domain contracts) and @shared-types.
 *
 * Dependency rule:
 *   - @task-core    — TaskRepository port, entity types
 *   - @shared-types — CommandResult
 *   - NO Firebase, NO HTTP, NO React, NO Next.js
 *
 * Infrastructure adapters, server actions, server queries, and UI components
 * are NOT exported from this package. Access them from the modules/task/ layer:
 *
 *   - FirebaseTaskRepository → @/modules/task/infrastructure/firebase/FirebaseTaskRepository
 *   - Server actions         → @/modules/task/interfaces/_actions/task.actions
 *   - Server queries         → @/modules/task/interfaces/queries/task.queries
 *   - WorkspaceTaskTab       → @/modules/task/interfaces/components/WorkspaceTaskTab
 *   - All of the above       → @/modules/task (barrel)
 *
 * Usage:
 *   import { CreateWorkspaceTaskUseCase } from "@task-service";
 *   const useCase = new CreateWorkspaceTaskUseCase(repo);
 *   const result = await useCase.execute(input);
 */

export {
  CreateWorkspaceTaskUseCase,
  UpdateWorkspaceTaskUseCase,
  DeleteWorkspaceTaskUseCase,
  ListWorkspaceTasksUseCase,
} from "./use-cases";
