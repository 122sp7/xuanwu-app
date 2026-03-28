"use server";

/**
 * Module: content
 * Layer: interfaces/_actions
 * Purpose: Next.js Server Actions for Content domain mutations.
 */

import { commandFailureFrom, type CommandResult } from "@shared-types";

import {
  CreateContentPageUseCase,
  RenameContentPageUseCase,
  MoveContentPageUseCase,
  ArchiveContentPageUseCase,
  ReorderContentPageBlocksUseCase,
  ApproveContentPageUseCase,
} from "../../application/use-cases/content-page.use-cases";
import {
  AddContentBlockUseCase,
  UpdateContentBlockUseCase,
  DeleteContentBlockUseCase,
} from "../../application/use-cases/content-block.use-cases";
import { FirebaseContentPageRepository } from "../../infrastructure/firebase/FirebaseContentPageRepository";
import { FirebaseContentBlockRepository } from "../../infrastructure/firebase/FirebaseContentBlockRepository";
import { InMemoryEventStoreRepository, NoopEventBusRepository } from "@/modules/shared/api";
import type {
  CreateContentPageDto,
  RenameContentPageDto,
  MoveContentPageDto,
  ArchiveContentPageDto,
  ReorderContentPageBlocksDto,
  AddContentBlockDto,
  UpdateContentBlockDto,
  DeleteContentBlockDto,
  CreateContentVersionDto,
  ApproveContentPageDto,
} from "../../application/dto/content.dto";

function makePageRepo() {
  return new FirebaseContentPageRepository();
}

function makeBlockRepo() {
  return new FirebaseContentBlockRepository();
}

export async function createContentPage(input: CreateContentPageDto): Promise<CommandResult> {
  try {
    return await new CreateContentPageUseCase(makePageRepo()).execute(input);
  } catch (err) {
    return commandFailureFrom(
      "CONTENT_PAGE_CREATE_FAILED",
      err instanceof Error ? err.message : "Unexpected error",
    );
  }
}

export async function renameContentPage(input: RenameContentPageDto): Promise<CommandResult> {
  try {
    return await new RenameContentPageUseCase(makePageRepo()).execute(input);
  } catch (err) {
    return commandFailureFrom(
      "CONTENT_PAGE_RENAME_FAILED",
      err instanceof Error ? err.message : "Unexpected error",
    );
  }
}

export async function moveContentPage(input: MoveContentPageDto): Promise<CommandResult> {
  try {
    return await new MoveContentPageUseCase(makePageRepo()).execute(input);
  } catch (err) {
    return commandFailureFrom(
      "CONTENT_PAGE_MOVE_FAILED",
      err instanceof Error ? err.message : "Unexpected error",
    );
  }
}

export async function archiveContentPage(input: ArchiveContentPageDto): Promise<CommandResult> {
  try {
    return await new ArchiveContentPageUseCase(makePageRepo()).execute(input);
  } catch (err) {
    return commandFailureFrom(
      "CONTENT_PAGE_ARCHIVE_FAILED",
      err instanceof Error ? err.message : "Unexpected error",
    );
  }
}

export async function reorderContentPageBlocks(
  input: ReorderContentPageBlocksDto,
): Promise<CommandResult> {
  try {
    return await new ReorderContentPageBlocksUseCase(makePageRepo()).execute(input);
  } catch (err) {
    return commandFailureFrom(
      "CONTENT_PAGE_REORDER_FAILED",
      err instanceof Error ? err.message : "Unexpected error",
    );
  }
}

export async function addContentBlock(input: AddContentBlockDto): Promise<CommandResult> {
  try {
    return await new AddContentBlockUseCase(makeBlockRepo()).execute(input);
  } catch (err) {
    return commandFailureFrom(
      "CONTENT_BLOCK_ADD_FAILED",
      err instanceof Error ? err.message : "Unexpected error",
    );
  }
}

export async function updateContentBlock(input: UpdateContentBlockDto): Promise<CommandResult> {
  try {
    return await new UpdateContentBlockUseCase(makeBlockRepo()).execute(input);
  } catch (err) {
    return commandFailureFrom(
      "CONTENT_BLOCK_UPDATE_FAILED",
      err instanceof Error ? err.message : "Unexpected error",
    );
  }
}

export async function deleteContentBlock(input: DeleteContentBlockDto): Promise<CommandResult> {
  try {
    return await new DeleteContentBlockUseCase(makeBlockRepo()).execute(input);
  } catch (err) {
    return commandFailureFrom(
      "CONTENT_BLOCK_DELETE_FAILED",
      err instanceof Error ? err.message : "Unexpected error",
    );
  }
}

export async function publishContentVersion(
  _input: CreateContentVersionDto,
): Promise<CommandResult> {
  return commandFailureFrom(
    "CONTENT_VERSION_NOT_IMPLEMENTED",
    "Version persistence is not yet implemented.",
  );
}

export async function approveContentPage(input: ApproveContentPageDto): Promise<CommandResult> {
  try {
    return await new ApproveContentPageUseCase(
      makePageRepo(),
      new InMemoryEventStoreRepository(),
      new NoopEventBusRepository(),
    ).execute(input);
  } catch (err) {
    return commandFailureFrom(
      "CONTENT_PAGE_APPROVE_FAILED",
      err instanceof Error ? err.message : "Unexpected error",
    );
  }
}
