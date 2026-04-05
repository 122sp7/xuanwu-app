"use server";

/**
 * Module: knowledge
 * Layer: interfaces/_actions
 * Purpose: Next.js Server Actions for Content domain mutations.
 */

import { commandFailureFrom, type CommandResult } from "@shared-types";

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
} from "../../application/use-cases/knowledge-page.use-cases";
import {
  AddKnowledgeBlockUseCase,
  UpdateKnowledgeBlockUseCase,
  DeleteKnowledgeBlockUseCase,
} from "../../application/use-cases/knowledge-block.use-cases";
import {
  CreateKnowledgeCollectionUseCase,
  RenameKnowledgeCollectionUseCase,
  AddPageToCollectionUseCase,
  RemovePageFromCollectionUseCase,
  AddCollectionColumnUseCase,
  ArchiveKnowledgeCollectionUseCase,
} from "../../application/use-cases/knowledge-collection.use-cases";
import { FirebaseKnowledgePageRepository } from "../../infrastructure/firebase/FirebaseContentPageRepository";
import { FirebaseKnowledgeBlockRepository } from "../../infrastructure/firebase/FirebaseContentBlockRepository";
import { FirebaseKnowledgeCollectionRepository } from "../../infrastructure/firebase/FirebaseContentCollectionRepository";
import { InMemoryEventStoreRepository, NoopEventBusRepository } from "@/modules/shared/api";
import { v7 as generateId } from "@lib-uuid";
import type {
  CreateKnowledgePageDto,
  RenameKnowledgePageDto,
  MoveKnowledgePageDto,
  ArchiveKnowledgePageDto,
  ReorderKnowledgePageBlocksDto,
  AddKnowledgeBlockDto,
  UpdateKnowledgeBlockDto,
  DeleteKnowledgeBlockDto,
  CreateKnowledgeVersionDto,
  ApproveKnowledgePageDto,
  CreateKnowledgeCollectionDto,
  RenameKnowledgeCollectionDto,
  AddPageToCollectionDto,
  RemovePageFromCollectionDto,
  AddCollectionColumnDto,
  ArchiveKnowledgeCollectionDto,
  VerifyKnowledgePageDto,
  RequestPageReviewDto,
  AssignPageOwnerDto,
} from "../../application/dto/knowledge.dto";

function makePageRepo() {
  return new FirebaseKnowledgePageRepository();
}

function makeBlockRepo() {
  return new FirebaseKnowledgeBlockRepository();
}

function makeCollectionRepo() {
  return new FirebaseKnowledgeCollectionRepository();
}

export async function createKnowledgePage(input: CreateKnowledgePageDto): Promise<CommandResult> {
  try {
    return await new CreateKnowledgePageUseCase(makePageRepo()).execute(input);
  } catch (err) {
    return commandFailureFrom(
      "CONTENT_PAGE_CREATE_FAILED",
      err instanceof Error ? err.message : "Unexpected error",
    );
  }
}

export async function renameKnowledgePage(input: RenameKnowledgePageDto): Promise<CommandResult> {
  try {
    return await new RenameKnowledgePageUseCase(makePageRepo()).execute(input);
  } catch (err) {
    return commandFailureFrom(
      "CONTENT_PAGE_RENAME_FAILED",
      err instanceof Error ? err.message : "Unexpected error",
    );
  }
}

export async function moveKnowledgePage(input: MoveKnowledgePageDto): Promise<CommandResult> {
  try {
    return await new MoveKnowledgePageUseCase(makePageRepo()).execute(input);
  } catch (err) {
    return commandFailureFrom(
      "CONTENT_PAGE_MOVE_FAILED",
      err instanceof Error ? err.message : "Unexpected error",
    );
  }
}

export async function archiveKnowledgePage(input: ArchiveKnowledgePageDto): Promise<CommandResult> {
  try {
    return await new ArchiveKnowledgePageUseCase(makePageRepo()).execute(input);
  } catch (err) {
    return commandFailureFrom(
      "CONTENT_PAGE_ARCHIVE_FAILED",
      err instanceof Error ? err.message : "Unexpected error",
    );
  }
}

export async function reorderKnowledgePageBlocks(
  input: ReorderKnowledgePageBlocksDto,
): Promise<CommandResult> {
  try {
    return await new ReorderKnowledgePageBlocksUseCase(makePageRepo()).execute(input);
  } catch (err) {
    return commandFailureFrom(
      "CONTENT_PAGE_REORDER_FAILED",
      err instanceof Error ? err.message : "Unexpected error",
    );
  }
}

export async function addKnowledgeBlock(input: AddKnowledgeBlockDto): Promise<CommandResult> {
  try {
    return await new AddKnowledgeBlockUseCase(makeBlockRepo()).execute(input);
  } catch (err) {
    return commandFailureFrom(
      "CONTENT_BLOCK_ADD_FAILED",
      err instanceof Error ? err.message : "Unexpected error",
    );
  }
}

export async function updateKnowledgeBlock(input: UpdateKnowledgeBlockDto): Promise<CommandResult> {
  try {
    return await new UpdateKnowledgeBlockUseCase(makeBlockRepo()).execute(input);
  } catch (err) {
    return commandFailureFrom(
      "CONTENT_BLOCK_UPDATE_FAILED",
      err instanceof Error ? err.message : "Unexpected error",
    );
  }
}

export async function deleteKnowledgeBlock(input: DeleteKnowledgeBlockDto): Promise<CommandResult> {
  try {
    return await new DeleteKnowledgeBlockUseCase(makeBlockRepo()).execute(input);
  } catch (err) {
    return commandFailureFrom(
      "CONTENT_BLOCK_DELETE_FAILED",
      err instanceof Error ? err.message : "Unexpected error",
    );
  }
}

export async function publishKnowledgeVersion(
  _input: CreateKnowledgeVersionDto,
): Promise<CommandResult> {
  return commandFailureFrom(
    "CONTENT_VERSION_NOT_IMPLEMENTED",
    "Version persistence is not yet implemented.",
  );
}

export async function approveKnowledgePage(input: ApproveKnowledgePageDto): Promise<CommandResult> {
  try {
    // causationId is generated at the action layer (command origin) to ensure
    // proper command-event causality tracing as described in ADR-001.
    const causationId = input.causationId ?? generateId();
    return await new ApproveKnowledgePageUseCase(
      makePageRepo(),
      new InMemoryEventStoreRepository(),
      new NoopEventBusRepository(),
    ).execute({ ...input, causationId });
  } catch (err) {
    return commandFailureFrom(
      "CONTENT_PAGE_APPROVE_FAILED",
      err instanceof Error ? err.message : "Unexpected error",
    );
  }
}

// ── Collection actions ────────────────────────────────────────────────────────

export async function createKnowledgeCollection(
  input: CreateKnowledgeCollectionDto,
): Promise<CommandResult> {
  try {
    return await new CreateKnowledgeCollectionUseCase(makeCollectionRepo()).execute(input);
  } catch (err) {
    return commandFailureFrom(
      "COLLECTION_CREATE_FAILED",
      err instanceof Error ? err.message : "Unexpected error",
    );
  }
}

export async function renameKnowledgeCollection(
  input: RenameKnowledgeCollectionDto,
): Promise<CommandResult> {
  try {
    return await new RenameKnowledgeCollectionUseCase(makeCollectionRepo()).execute(input);
  } catch (err) {
    return commandFailureFrom(
      "COLLECTION_RENAME_FAILED",
      err instanceof Error ? err.message : "Unexpected error",
    );
  }
}

export async function addPageToCollection(
  input: AddPageToCollectionDto,
): Promise<CommandResult> {
  try {
    return await new AddPageToCollectionUseCase(makeCollectionRepo()).execute(input);
  } catch (err) {
    return commandFailureFrom(
      "COLLECTION_ADD_PAGE_FAILED",
      err instanceof Error ? err.message : "Unexpected error",
    );
  }
}

export async function removePageFromCollection(
  input: RemovePageFromCollectionDto,
): Promise<CommandResult> {
  try {
    return await new RemovePageFromCollectionUseCase(makeCollectionRepo()).execute(input);
  } catch (err) {
    return commandFailureFrom(
      "COLLECTION_REMOVE_PAGE_FAILED",
      err instanceof Error ? err.message : "Unexpected error",
    );
  }
}

export async function addCollectionColumn(
  input: AddCollectionColumnDto,
): Promise<CommandResult> {
  try {
    return await new AddCollectionColumnUseCase(makeCollectionRepo()).execute(input);
  } catch (err) {
    return commandFailureFrom(
      "COLLECTION_ADD_COLUMN_FAILED",
      err instanceof Error ? err.message : "Unexpected error",
    );
  }
}

export async function archiveKnowledgeCollection(
  input: ArchiveKnowledgeCollectionDto,
): Promise<CommandResult> {
  try {
    return await new ArchiveKnowledgeCollectionUseCase(makeCollectionRepo()).execute(input);
  } catch (err) {
    return commandFailureFrom(
      "COLLECTION_ARCHIVE_FAILED",
      err instanceof Error ? err.message : "Unexpected error",
    );
  }
}

// ── Wiki / Knowledge Base verification actions ────────────────────────────────

export async function verifyKnowledgePage(input: VerifyKnowledgePageDto): Promise<CommandResult> {
  try {
    return await new VerifyKnowledgePageUseCase(makePageRepo()).execute(input);
  } catch (err) {
    return commandFailureFrom(
      "CONTENT_PAGE_VERIFY_FAILED",
      err instanceof Error ? err.message : "Unexpected error",
    );
  }
}

export async function requestKnowledgePageReview(
  input: RequestPageReviewDto,
): Promise<CommandResult> {
  try {
    return await new RequestPageReviewUseCase(makePageRepo()).execute(input);
  } catch (err) {
    return commandFailureFrom(
      "CONTENT_PAGE_REVIEW_REQUEST_FAILED",
      err instanceof Error ? err.message : "Unexpected error",
    );
  }
}

export async function assignKnowledgePageOwner(
  input: AssignPageOwnerDto,
): Promise<CommandResult> {
  try {
    return await new AssignPageOwnerUseCase(makePageRepo()).execute(input);
  } catch (err) {
    return commandFailureFrom(
      "CONTENT_PAGE_ASSIGN_OWNER_FAILED",
      err instanceof Error ? err.message : "Unexpected error",
    );
  }
}
