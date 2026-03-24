/**
 * @module workspace-flow/application/dto
 * @file open-issue.dto.ts
 * @description Command DTO for opening a new issue against a task.
 * @author workspace-flow
 * @created 2026-03-24
 * @todo Add Zod schema when validation layer is wired in
 */

import type { IssueStage } from "../../domain/value-objects/IssueStage";

export interface OpenIssueDto {
  readonly taskId: string;
  readonly stage: IssueStage;
  readonly title: string;
  readonly description?: string;
  readonly createdBy: string;
  readonly assignedTo?: string;
}
