/**
 * @module workspace-flow/domain/repositories
 * @file IssueRepository.ts
 * @description Repository port interface for Issue persistence.
 * @author workspace-flow
 * @since 2026-03-24
 * @todo Implement in infrastructure/repositories/FirebaseIssueRepository
 */

import type { Issue, OpenIssueInput, UpdateIssueInput } from "../entities/Issue";
import type { IssueStatus } from "../value-objects/IssueStatus";

export interface IssueRepository {
  /** Persist a new issue and return the created aggregate. */
  create(input: OpenIssueInput): Promise<Issue>;
  /** Update mutable fields on an existing issue. Returns null if not found. */
  update(issueId: string, input: UpdateIssueInput): Promise<Issue | null>;
  /** Hard-delete an issue by id. */
  delete(issueId: string): Promise<void>;
  /** Retrieve an issue by its id. Returns null if not found. */
  findById(issueId: string): Promise<Issue | null>;
  /** List all issues for a given task. */
  findByTaskId(taskId: string): Promise<Issue[]>;
  /** Count open issues for a given task (used in guard conditions). */
  countOpenByTaskId(taskId: string): Promise<number>;
  /** Persist a lifecycle status transition and stamp resolvedAtISO if to==="resolved". */
  transitionStatus(issueId: string, to: IssueStatus, nowISO: string): Promise<Issue | null>;
}
 
