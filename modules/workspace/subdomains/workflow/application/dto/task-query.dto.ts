/**
 * @module workspace-flow/application/dto
 * @file task-query.dto.ts
 * @description Query parameters DTO for listing tasks.
 * @author workspace-flow
 * @since 2026-03-24
 * @todo Add pagination support when task lists grow large
 */

export interface TaskQueryDto {
  /** Filter tasks by workspace. Required for scoped queries. */
  readonly workspaceId: string;
  /** Optional status filter. */
  readonly status?: string;
  /** Optional assignee filter. */
  readonly assigneeId?: string;
}
 
