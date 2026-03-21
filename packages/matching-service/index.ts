/**
 * @package matching-service
 * Matching application service — orchestrates repositories + pure matching engine.
 *
 * This package bridges the pure `@matching-engine` logic and the persistence layer.
 * It provides use-cases that:
 *   1. Load tasks, skills, and account-skill profiles via repository ports
 *   2. Call the pure matching engine to score and rank candidates
 *   3. Persist results (assignments, projections) via repository ports
 *   4. Return `CommandResult` for every write operation
 *
 * Dependency rule:
 *   - @matching-engine  — pure scoring + domain contracts
 *   - @task-core        — WorkspaceTaskEntity, TaskRepository
 *   - @skill-core       — SkillEntity, AccountSkillEntity, SkillRepository, AccountSkillRepository
 *   - @shared-types     — CommandResult, commandSuccess, commandFailureFrom
 *   - NO Firebase, NO HTTP, NO React, NO Next.js
 *
 * Usage:
 *   const useCase = new MatchTaskUseCase(taskRepo, skillRepo, accountSkillRepo, assignmentRepo, projectionRepo);
 *   const scores  = await useCase.execute(requestId, request);
 */

export { MatchTaskUseCase } from "./use-cases/match-task.use-case";
export { AssignTaskUseCase } from "./use-cases/assign-task.use-case";

// Re-export types consumers will need
export type {
  MatchTaskInput,
  MatchTaskResult,
} from "./use-cases/match-task.use-case";
export type { AssignTaskInput } from "./use-cases/assign-task.use-case";
