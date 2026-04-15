/**
 * @module workspace-flow/application/ports
 * @file IssueService.ts
 * @description Application-layer port interface for Issue operations.
 *
 * @applicationPort This is an Application-layer Port (not a Domain-layer Port) because
 * its method signatures depend on application DTOs (OpenIssueDto, IssueQueryDto) defined
 * in application/dto/. It must remain in application/ports/ and must NOT be moved to
 * domain/ports/. See ADR-1102 §3.
 *
 * @author workspace-flow
 * @since 2026-03-24
 * @todo Wire use cases and implement concrete adapters
 */

import type { Issue } from "../../domain/entities/Issue";
import type { IssueStatus } from "../../domain/value-objects/IssueStatus";
import type { OpenIssueDto } from "../dto/open-issue.dto";
import type { IssueQueryDto } from "../dto/issue-query.dto";

export interface IssueService {
  openIssue(dto: OpenIssueDto): Promise<Issue>;
  transitionStatus(issueId: string, to: IssueStatus): Promise<Issue>;
  listIssues(query: IssueQueryDto): Promise<Issue[]>;
  getIssue(issueId: string): Promise<Issue | null>;
}
 
