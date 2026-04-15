/**
 * @module workspace-flow/application/dto
 * @file resolve-issue.dto.ts
 * @description Command DTO for resolving an issue (retest passed → resolved).
 * @author workspace-flow
 * @since 2026-03-24
 */

export interface ResolveIssueDto {
  readonly issueId: string;
  readonly resolutionNote?: string;
}
 
