"use server";

import { commandFailureFrom, type CommandResult } from "@shared-types";
import { v7 as generateId } from "@lib-uuid";

import {
  CreateKnowledgePageUseCase,
  RenameKnowledgePageUseCase,
  MoveKnowledgePageUseCase,
  ArchiveKnowledgePageUseCase,
  ReorderKnowledgePageBlocksUseCase,
  ApproveKnowledgePageUseCase,
  VerifyKnowledgePageUseCase,
  RequestPageReviewUseCase,
  AssignPageOwnerUseCase,
  UpdatePageIconUseCase,
  UpdatePageCoverUseCase,
} from "../../application/use-cases/knowledge-page.use-cases";
import { FirebaseKnowledgePageRepository } from "../../infrastructure/firebase/FirebaseKnowledgePageRepository";
import { InMemoryEventStoreRepository, NoopEventBusRepository, QStashEventBusRepository } from "@/modules/shared/api";
import type {
  CreateKnowledgePageDto,
  RenameKnowledgePageDto,
  MoveKnowledgePageDto,
  ArchiveKnowledgePageDto,
  ReorderKnowledgePageBlocksDto,
  ApproveKnowledgePageDto,
  CreateKnowledgeVersionDto,
  VerifyKnowledgePageDto,
  RequestPageReviewDto,
  AssignPageOwnerDto,
  UpdatePageIconDto,
  UpdatePageCoverDto,
} from "../../application/dto/knowledge.dto";

function makePageRepo() {
  return new FirebaseKnowledgePageRepository();
}

export async function createKnowledgePage(input: CreateKnowledgePageDto): Promise<CommandResult> {
  try {
    return await new CreateKnowledgePageUseCase(makePageRepo()).execute(input);
  } catch (err) {
    return commandFailureFrom("CONTENT_PAGE_CREATE_FAILED", err instanceof Error ? err.message : "Unexpected error");
  }
}

export async function renameKnowledgePage(input: RenameKnowledgePageDto): Promise<CommandResult> {
  try {
    return await new RenameKnowledgePageUseCase(makePageRepo()).execute(input);
  } catch (err) {
    return commandFailureFrom("CONTENT_PAGE_RENAME_FAILED", err instanceof Error ? err.message : "Unexpected error");
  }
}

export async function moveKnowledgePage(input: MoveKnowledgePageDto): Promise<CommandResult> {
  try {
    return await new MoveKnowledgePageUseCase(makePageRepo()).execute(input);
  } catch (err) {
    return commandFailureFrom("CONTENT_PAGE_MOVE_FAILED", err instanceof Error ? err.message : "Unexpected error");
  }
}

export async function archiveKnowledgePage(input: ArchiveKnowledgePageDto): Promise<CommandResult> {
  try {
    return await new ArchiveKnowledgePageUseCase(makePageRepo()).execute(input);
  } catch (err) {
    return commandFailureFrom("CONTENT_PAGE_ARCHIVE_FAILED", err instanceof Error ? err.message : "Unexpected error");
  }
}

export async function reorderKnowledgePageBlocks(input: ReorderKnowledgePageBlocksDto): Promise<CommandResult> {
  try {
    return await new ReorderKnowledgePageBlocksUseCase(makePageRepo()).execute(input);
  } catch (err) {
    return commandFailureFrom("CONTENT_PAGE_REORDER_FAILED", err instanceof Error ? err.message : "Unexpected error");
  }
}

export async function publishKnowledgeVersion(_input: CreateKnowledgeVersionDto): Promise<CommandResult> {
  return commandFailureFrom("CONTENT_VERSION_NOT_IMPLEMENTED", "Version persistence is not yet implemented.");
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

export async function updateKnowledgePageIcon(input: UpdatePageIconDto): Promise<CommandResult> {
  try {
    return await new UpdatePageIconUseCase(makePageRepo()).execute(input);
  } catch (err) {
    return commandFailureFrom("CONTENT_PAGE_ICON_UPDATE_FAILED", err instanceof Error ? err.message : "Unexpected error");
  }
}

export async function updateKnowledgePageCover(input: UpdatePageCoverDto): Promise<CommandResult> {
  try {
    return await new UpdatePageCoverUseCase(makePageRepo()).execute(input);
  } catch (err) {
    return commandFailureFrom("CONTENT_PAGE_COVER_UPDATE_FAILED", err instanceof Error ? err.message : "Unexpected error");
  }
}
