/**
 * @module workspace-flow/application/dto
 * @file issue-query.dto.ts
 * @description Query parameters DTO for listing issues.
 * @author workspace-flow
 * @since 2026-03-24
 * @todo Add pagination support when issue lists grow large
 */

export interface IssueQueryDto {
  /** Filter issues by task. */
  readonly taskId: string;
  /** Optional status filter. */
  readonly status?: string;
}
 
