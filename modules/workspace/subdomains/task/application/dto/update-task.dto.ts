/**
 * @module workspace-flow/application/dto
 * @file update-task.dto.ts
 * @description Command DTO for updating mutable fields on an existing task.
 * @author workspace-flow
 * @since 2026-03-24
 */

export interface UpdateTaskDto {
  readonly title?: string;
  readonly description?: string;
  readonly assigneeId?: string;
  readonly dueDateISO?: string;
}
