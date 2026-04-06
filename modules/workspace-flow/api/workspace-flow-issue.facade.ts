/**
 * @module workspace-flow/api
 * @file workspace-flow-issue.facade.ts
 * @description Focused facade for Issue aggregate write and summary-read operations.
 *
 * Consumers that only need Issue operations should use this class directly
 * instead of the composite {@link WorkspaceFlowFacade}.
 *
 * @author workspace-flow
 * @since 2026-04-06
 */

import type { IssueRepository } from "../domain/repositories/IssueRepository";

import { OpenIssueUseCase } from "../application/use-cases/open-issue.use-case";
import { StartIssueUseCase } from "../application/use-cases/start-issue.use-case";
import { FixIssueUseCase } from "../application/use-cases/fix-issue.use-case";
import { SubmitIssueRetestUseCase } from "../application/use-cases/submit-issue-retest.use-case";
import { PassIssueRetestUseCase } from "../application/use-cases/pass-issue-retest.use-case";
import { FailIssueRetestUseCase } from "../application/use-cases/fail-issue-retest.use-case";
import { ResolveIssueUseCase } from "../application/use-cases/resolve-issue.use-case";
import { CloseIssueUseCase } from "../application/use-cases/close-issue.use-case";

import type { OpenIssueDto } from "../application/dto/open-issue.dto";
import type { ResolveIssueDto } from "../application/dto/resolve-issue.dto";
import type { IssueQueryDto } from "../application/dto/issue-query.dto";
import type { PaginationDto, PagedResult } from "../application/dto/pagination.dto";

import type { IssueSummary } from "../interfaces/contracts/workspace-flow.contract";
import { toIssueSummary } from "../interfaces/contracts/workspace-flow.contract";

import type { CommandResult } from "@shared-types";

// ── Pagination helper ─────────────────────────────────────────────────────────

function toPagedResult<T>(items: T[], pagination?: PaginationDto): PagedResult<T> {
  const page = pagination?.page ?? 1;
  const pageSize = pagination?.pageSize ?? (items.length || 20);
  const start = (page - 1) * pageSize;
  const paged = items.slice(start, start + pageSize);
  return { items: paged, total: items.length, page, pageSize, hasMore: start + pageSize < items.length };
}

/**
 * WorkspaceFlowIssueFacade
 *
 * Single entry point for all Issue write and summary-read operations.
 * Requires only IssueRepository — no cross-aggregate dependencies.
 */
export class WorkspaceFlowIssueFacade {
  constructor(private readonly issueRepository: IssueRepository) {}

  // ── Write operations ─────────────────────────────────────────────────────────

  async openIssue(dto: OpenIssueDto): Promise<CommandResult> {
    return new OpenIssueUseCase(this.issueRepository).execute(dto);
  }

  async startIssue(issueId: string): Promise<CommandResult> {
    return new StartIssueUseCase(this.issueRepository).execute(issueId);
  }

  async fixIssue(issueId: string): Promise<CommandResult> {
    return new FixIssueUseCase(this.issueRepository).execute(issueId);
  }

  async submitIssueRetest(issueId: string): Promise<CommandResult> {
    return new SubmitIssueRetestUseCase(this.issueRepository).execute(issueId);
  }

  async passIssueRetest(issueId: string): Promise<CommandResult> {
    return new PassIssueRetestUseCase(this.issueRepository).execute(issueId);
  }

  async failIssueRetest(issueId: string): Promise<CommandResult> {
    return new FailIssueRetestUseCase(this.issueRepository).execute(issueId);
  }

  async resolveIssue(dto: ResolveIssueDto): Promise<CommandResult> {
    return new ResolveIssueUseCase(this.issueRepository).execute(dto);
  }

  async closeIssue(issueId: string): Promise<CommandResult> {
    return new CloseIssueUseCase(this.issueRepository).execute(issueId);
  }

  // ── Read operations ──────────────────────────────────────────────────────────

  async listIssues(query: IssueQueryDto, pagination?: PaginationDto): Promise<PagedResult<IssueSummary>> {
    const all = await this.issueRepository.findByTaskId(query.taskId);
    const filtered = query.status ? all.filter((i) => i.status === query.status) : all;
    return toPagedResult(filtered.map(toIssueSummary), pagination);
  }

  async getIssueSummary(issueId: string): Promise<IssueSummary | null> {
    const issue = await this.issueRepository.findById(issueId);
    return issue ? toIssueSummary(issue) : null;
  }
}
