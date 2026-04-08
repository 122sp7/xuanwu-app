"use server";

import { commandFailureFrom, type CommandResult } from "@shared-types";
import { v7 as generateId } from "@lib-uuid";

import {
  ApproveKnowledgePageUseCase,
  VerifyKnowledgePageUseCase,
  RequestPageReviewUseCase,
  AssignPageOwnerUseCase,
} from "../../application/use-cases/knowledge-page-review.use-cases";
import { FirebaseKnowledgePageRepository } from "../../infrastructure/firebase/FirebaseKnowledgePageRepository";
import { InMemoryEventStoreRepository, NoopEventBusRepository, QStashEventBusRepository } from "@/modules/shared/api";
import type {
  ApproveKnowledgePageDto,
  VerifyKnowledgePageDto,
  RequestPageReviewDto,
  AssignPageOwnerDto,
} from "../../application/dto/knowledge.dto";

function makePageRepo() {
  return new FirebaseKnowledgePageRepository();
}

export async function approveKnowledgePage(input: ApproveKnowledgePageDto): Promise<CommandResult> {
  try {
    const causationId = input.causationId ?? generateId();
    const eventBus = process.env.QSTASH_TOKEN
      ? new QStashEventBusRepository()
      : new NoopEventBusRepository();
    return await new ApproveKnowledgePageUseCase(
      makePageRepo(),
      new InMemoryEventStoreRepository(),
      eventBus,
    ).execute({ ...input, causationId });
  } catch (err) {
    return commandFailureFrom("CONTENT_PAGE_APPROVE_FAILED", err instanceof Error ? err.message : "Unexpected error");
  }
}

export async function verifyKnowledgePage(input: VerifyKnowledgePageDto): Promise<CommandResult> {
  try {
    return await new VerifyKnowledgePageUseCase(makePageRepo()).execute(input);
  } catch (err) {
    return commandFailureFrom("CONTENT_PAGE_VERIFY_FAILED", err instanceof Error ? err.message : "Unexpected error");
  }
}

export async function requestKnowledgePageReview(input: RequestPageReviewDto): Promise<CommandResult> {
  try {
    return await new RequestPageReviewUseCase(makePageRepo()).execute(input);
  } catch (err) {
    return commandFailureFrom("CONTENT_PAGE_REVIEW_REQUEST_FAILED", err instanceof Error ? err.message : "Unexpected error");
  }
}

export async function assignKnowledgePageOwner(input: AssignPageOwnerDto): Promise<CommandResult> {
  try {
    return await new AssignPageOwnerUseCase(makePageRepo()).execute(input);
  } catch (err) {
    return commandFailureFrom("CONTENT_PAGE_ASSIGN_OWNER_FAILED", err instanceof Error ? err.message : "Unexpected error");
  }
}
