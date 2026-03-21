/**
 * @package task-core
 * Task domain — pure types, entity contracts, and repository ports.
 *
 * This package contains the core domain contracts for the task module:
 *   - Task entity types and value types
 *   - Repository port interface (TaskRepository)
 *   - Input/output contracts for task operations
 *
 * Dependency rule: This package has NO dependencies on infrastructure,
 * UI, or framework-specific code. It depends only on @shared-types.
 *
 * Usage:
 *   import type { WorkspaceTaskEntity, TaskRepository } from "@task-core";
 */

// ── Entity types ──────────────────────────────────────────────────────────
export type {
  WorkspaceTaskEntity,
  WorkspaceTaskStatus,
  WorkspaceTaskPriority,
  CreateWorkspaceTaskInput,
  UpdateWorkspaceTaskInput,
} from "@/modules/task/domain/entities/Task";

// ── Repository port ───────────────────────────────────────────────────────
export type { TaskRepository } from "@/modules/task/domain/repositories/TaskRepository";
