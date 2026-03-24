"use server";

/**
 * Module: knowledge
 * Layer: interfaces/_actions
 * Purpose: Next.js Server Actions for Knowledge domain mutations.
 *
 * Each action:
 *  1. Validates input via the DTO schema
 *  2. Delegates to the appropriate use case
 *  3. Returns a CommandResult (never throws to the client)
 */

import { commandFailureFrom, type CommandResult } from "@shared-types";

import {
  CreateKnowledgePageUseCase,
  RenameKnowledgePageUseCase,
  MoveKnowledgePageUseCase,
  ArchiveKnowledgePageUseCase,
  ReorderKnowledgePageBlocksUseCase,
} from "../../application/use-cases/knowledge-page.use-cases";
import {
  AddKnowledgeBlockUseCase,
  UpdateKnowledgeBlockUseCase,
  DeleteKnowledgeBlockUseCase,
} from "../../application/use-cases/knowledge-block.use-cases";
import { FirebaseKnowledgePageRepository } from "../../infrastructure/firebase/FirebaseKnowledgePageRepository";
import { FirebaseKnowledgeBlockRepository } from "../../infrastructure/firebase/FirebaseKnowledgeBlockRepository";
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
} from "../../application/dto/knowledge.dto";

// ── Repository factories ──────────────────────────────────────────────────────

function makePageRepo() {
  return new FirebaseKnowledgePageRepository();
}

function makeBlockRepo() {
  return new FirebaseKnowledgeBlockRepository();
}

// ── Page actions ──────────────────────────────────────────────────────────────

export async function createKnowledgePage(input: CreateKnowledgePageDto): Promise<CommandResult> {
  try {
    return await new CreateKnowledgePageUseCase(makePageRepo()).execute(input);
  } catch (err) {
    return commandFailureFrom(
      "KNOWLEDGE_PAGE_CREATE_FAILED",
      err instanceof Error ? err.message : "Unexpected error",
    );
  }
}

export async function renameKnowledgePage(input: RenameKnowledgePageDto): Promise<CommandResult> {
  try {
    return await new RenameKnowledgePageUseCase(makePageRepo()).execute(input);
  } catch (err) {
    return commandFailureFrom(
      "KNOWLEDGE_PAGE_RENAME_FAILED",
      err instanceof Error ? err.message : "Unexpected error",
    );
  }
}

export async function moveKnowledgePage(input: MoveKnowledgePageDto): Promise<CommandResult> {
  try {
    return await new MoveKnowledgePageUseCase(makePageRepo()).execute(input);
  } catch (err) {
    return commandFailureFrom(
      "KNOWLEDGE_PAGE_MOVE_FAILED",
      err instanceof Error ? err.message : "Unexpected error",
    );
  }
}

export async function archiveKnowledgePage(input: ArchiveKnowledgePageDto): Promise<CommandResult> {
  try {
    return await new ArchiveKnowledgePageUseCase(makePageRepo()).execute(input);
  } catch (err) {
    return commandFailureFrom(
      "KNOWLEDGE_PAGE_ARCHIVE_FAILED",
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
      "KNOWLEDGE_PAGE_REORDER_FAILED",
      err instanceof Error ? err.message : "Unexpected error",
    );
  }
}

// ── Block actions ─────────────────────────────────────────────────────────────

export async function addKnowledgeBlock(input: AddKnowledgeBlockDto): Promise<CommandResult> {
  try {
    return await new AddKnowledgeBlockUseCase(makeBlockRepo()).execute(input);
  } catch (err) {
    return commandFailureFrom(
      "KNOWLEDGE_BLOCK_ADD_FAILED",
      err instanceof Error ? err.message : "Unexpected error",
    );
  }
}

export async function updateKnowledgeBlock(input: UpdateKnowledgeBlockDto): Promise<CommandResult> {
  try {
    return await new UpdateKnowledgeBlockUseCase(makeBlockRepo()).execute(input);
  } catch (err) {
    return commandFailureFrom(
      "KNOWLEDGE_BLOCK_UPDATE_FAILED",
      err instanceof Error ? err.message : "Unexpected error",
    );
  }
}

export async function deleteKnowledgeBlock(input: DeleteKnowledgeBlockDto): Promise<CommandResult> {
  try {
    return await new DeleteKnowledgeBlockUseCase(makeBlockRepo()).execute(input);
  } catch (err) {
    return commandFailureFrom(
      "KNOWLEDGE_BLOCK_DELETE_FAILED",
      err instanceof Error ? err.message : "Unexpected error",
    );
  }
}

// ── Version actions ───────────────────────────────────────────────────────────

/**
 * Note: Version creation requires a KnowledgeVersionRepository implementation.
 * This action returns a not-implemented error until FirebaseKnowledgeVersionRepository
 * is added to the infrastructure layer.
 */
export async function publishKnowledgeVersion(
  _input: CreateKnowledgeVersionDto,
): Promise<CommandResult> {
  return commandFailureFrom(
    "KNOWLEDGE_VERSION_NOT_IMPLEMENTED",
    "Version persistence is not yet implemented.",
  );
}
