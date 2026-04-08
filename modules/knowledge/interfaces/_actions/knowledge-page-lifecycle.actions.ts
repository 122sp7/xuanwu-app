"use server";

import { commandFailureFrom, type CommandResult } from "@shared-types";

import {
  CreateKnowledgePageUseCase,
  RenameKnowledgePageUseCase,
  MoveKnowledgePageUseCase,
  ArchiveKnowledgePageUseCase,
  ReorderKnowledgePageBlocksUseCase,
} from "../../application/use-cases/knowledge-page.use-cases";
import { FirebaseKnowledgePageRepository } from "../../infrastructure/firebase/FirebaseKnowledgePageRepository";
import type {
  CreateKnowledgePageDto,
  RenameKnowledgePageDto,
  MoveKnowledgePageDto,
  ArchiveKnowledgePageDto,
  ReorderKnowledgePageBlocksDto,
  CreateKnowledgeVersionDto,
} from "../../application/dto/knowledge.dto";

function makePageRepo() {
  return new FirebaseKnowledgePageRepository();
}

export async function createKnowledgePage(input: CreateKnowledgePageDto): Promise<CommandResult> {
  try {
    if (!input.workspaceId?.trim()) {
      return commandFailureFrom("CONTENT_PAGE_INVALID_SCOPE", "workspaceId 為必填，請先選定工作區再建立頁面。");
    }
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
