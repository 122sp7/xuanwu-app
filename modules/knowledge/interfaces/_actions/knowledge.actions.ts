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
} from "../../application/use-cases/knowledge-page.use-cases";
import {
  AddKnowledgeBlockUseCase,
  UpdateKnowledgeBlockUseCase,
  DeleteKnowledgeBlockUseCase,
} from "../../application/use-cases/knowledge-block.use-cases";
import { FirebaseKnowledgePageRepository } from "../../infrastructure/firebase/FirebaseKnowledgePageRepository";
import { FirebaseKnowledgeBlockRepository } from "../../infrastructure/firebase/FirebaseKnowledgeBlockRepository";
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
} from "../../application/dto/knowledge.dto";

function makePageRepo() {
  return new FirebaseKnowledgePageRepository();
}

function makeBlockRepo() {
  return new FirebaseKnowledgeBlockRepository();
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
