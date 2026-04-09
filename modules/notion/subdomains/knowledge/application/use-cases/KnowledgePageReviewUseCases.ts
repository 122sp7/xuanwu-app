/**
 * Module: notion/subdomains/knowledge
 * Layer: application/use-cases
 * Purpose: Page review/wiki use cases — approve, verify, request review, assign owner.
 */

import { commandFailureFrom, commandSuccess, type CommandResult } from "@shared-types";
import { v7 as generateId } from "@lib-uuid";

import type { IKnowledgePageRepository } from "../../domain/repositories/IKnowledgePageRepository";
import {
  PublishDomainEventUseCase,
  type IEventStoreRepository,
  type IEventBusRepository,
} from "@/modules/shared/api";
import {
  ApproveKnowledgePageSchema,
  type ApproveKnowledgePageDto,
} from "../dto/KnowledgePageDto";
import {
  VerifyKnowledgePageSchema,
  type VerifyKnowledgePageDto,
  RequestPageReviewSchema,
  type RequestPageReviewDto,
  AssignPageOwnerSchema,
  type AssignPageOwnerDto,
} from "../dto/KnowledgeWikiDto";

export class ApproveKnowledgePageUseCase {
  constructor(
    private readonly repo: IKnowledgePageRepository,
    private readonly eventStore: IEventStoreRepository,
    private readonly eventBus: IEventBusRepository,
  ) {}

  async execute(input: ApproveKnowledgePageDto): Promise<CommandResult> {
    const parsed = ApproveKnowledgePageSchema.safeParse(input);
    if (!parsed.success) return commandFailureFrom("CONTENT_PAGE_INVALID_INPUT", parsed.error.message);

    const {
      accountId,
      pageId,
      actorId,
      causationId: inputCausationId,
      extractedTasks,
      extractedInvoices,
      correlationId: inputCorrelationId,
      workspaceId,
    } = parsed.data;

    const causationId = inputCausationId ?? generateId();
    const page = await this.repo.findById(accountId, pageId);
    if (!page) return commandFailureFrom("CONTENT_PAGE_NOT_FOUND", "Page not found.");
    if (page.status === "archived") return commandFailureFrom("CONTENT_PAGE_ARCHIVED", "Cannot approve an archived page.");
    if (page.approvalState === "approved") return commandFailureFrom("CONTENT_PAGE_ALREADY_APPROVED", "Page is already approved.");

    const nowISO = new Date().toISOString();
    page.approve(actorId, nowISO);
    await this.repo.save(page);

    const correlationId = inputCorrelationId ?? generateId();
    await new PublishDomainEventUseCase(this.eventStore, this.eventBus).execute({
      id: generateId(),
      eventName: "knowledge.page_approved",
      aggregateType: "KnowledgePage",
      aggregateId: pageId,
      payload: {
        pageId,
        accountId,
        workspaceId: workspaceId ?? page.workspaceId,
        extractedTasks,
        extractedInvoices,
        actorId,
        causationId: inputCausationId,
        correlationId,
      },
      metadata: { actorId, causationId, correlationId, workspaceId: workspaceId ?? page.workspaceId },
    });

    return commandSuccess(pageId, Date.now());
  }
}

export class VerifyKnowledgePageUseCase {
  constructor(private readonly repo: IKnowledgePageRepository) {}

  async execute(input: VerifyKnowledgePageDto): Promise<CommandResult> {
    const parsed = VerifyKnowledgePageSchema.safeParse(input);
    if (!parsed.success) return commandFailureFrom("CONTENT_PAGE_INVALID_INPUT", parsed.error.message);

    const { accountId, pageId, verifiedByUserId, verificationExpiresAtISO } = parsed.data;
    const page = await this.repo.findById(accountId, pageId);
    if (!page) return commandFailureFrom("CONTENT_PAGE_NOT_FOUND", "Page not found.");
    page.verify(verifiedByUserId, verificationExpiresAtISO);
    await this.repo.save(page);
    return commandSuccess(page.id, Date.now());
  }
}

export class RequestPageReviewUseCase {
  constructor(private readonly repo: IKnowledgePageRepository) {}

  async execute(input: RequestPageReviewDto): Promise<CommandResult> {
    const parsed = RequestPageReviewSchema.safeParse(input);
    if (!parsed.success) return commandFailureFrom("CONTENT_PAGE_INVALID_INPUT", parsed.error.message);

    const { accountId, pageId, requestedByUserId } = parsed.data;
    const page = await this.repo.findById(accountId, pageId);
    if (!page) return commandFailureFrom("CONTENT_PAGE_NOT_FOUND", "Page not found.");
    page.requestReview(requestedByUserId);
    await this.repo.save(page);
    return commandSuccess(page.id, Date.now());
  }
}

export class AssignPageOwnerUseCase {
  constructor(private readonly repo: IKnowledgePageRepository) {}

  async execute(input: AssignPageOwnerDto): Promise<CommandResult> {
    const parsed = AssignPageOwnerSchema.safeParse(input);
    if (!parsed.success) return commandFailureFrom("CONTENT_PAGE_INVALID_INPUT", parsed.error.message);

    const { accountId, pageId, ownerId } = parsed.data;
    const page = await this.repo.findById(accountId, pageId);
    if (!page) return commandFailureFrom("CONTENT_PAGE_NOT_FOUND", "Page not found.");
    page.assignOwner(ownerId);
    await this.repo.save(page);
    return commandSuccess(page.id, Date.now());
  }
}
