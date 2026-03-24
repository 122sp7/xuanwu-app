/**
 * @module workspace-flow/application/dto
 * @file create-task.dto.ts
 * @description Command DTO for creating a new task.
 * @author workspace-flow
 * @created 2026-03-24
 * @todo Add Zod schema when validation layer is wired in
 */

export interface CreateTaskDto {
  readonly workspaceId: string;
  readonly title: string;
  readonly description?: string;
  readonly assigneeId?: string;
  readonly dueDateISO?: string;
}
