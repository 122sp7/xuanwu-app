"use server";

import { commandFailureFrom, type CommandResult } from "@shared-types";

import {
  CreateKnowledgeCollectionUseCase,
  RenameKnowledgeCollectionUseCase,
  AddPageToCollectionUseCase,
  RemovePageFromCollectionUseCase,
  AddCollectionColumnUseCase,
  ArchiveKnowledgeCollectionUseCase,
} from "../../application/use-cases/knowledge-collection.use-cases";
import { FirebaseKnowledgeCollectionRepository } from "../../infrastructure/firebase/FirebaseContentCollectionRepository";
import type {
  CreateKnowledgeCollectionDto,
  RenameKnowledgeCollectionDto,
  AddPageToCollectionDto,
  RemovePageFromCollectionDto,
  AddCollectionColumnDto,
  ArchiveKnowledgeCollectionDto,
} from "../../application/dto/knowledge.dto";

function makeCollectionRepo() {
  return new FirebaseKnowledgeCollectionRepository();
}

export async function createKnowledgeCollection(input: CreateKnowledgeCollectionDto): Promise<CommandResult> {
  try {
    return await new CreateKnowledgeCollectionUseCase(makeCollectionRepo()).execute(input);
  } catch (err) {
    return commandFailureFrom("COLLECTION_CREATE_FAILED", err instanceof Error ? err.message : "Unexpected error");
  }
}

export async function renameKnowledgeCollection(input: RenameKnowledgeCollectionDto): Promise<CommandResult> {
  try {
    return await new RenameKnowledgeCollectionUseCase(makeCollectionRepo()).execute(input);
  } catch (err) {
    return commandFailureFrom("COLLECTION_RENAME_FAILED", err instanceof Error ? err.message : "Unexpected error");
  }
}

export async function addPageToCollection(input: AddPageToCollectionDto): Promise<CommandResult> {
  try {
    return await new AddPageToCollectionUseCase(makeCollectionRepo()).execute(input);
  } catch (err) {
    return commandFailureFrom("COLLECTION_ADD_PAGE_FAILED", err instanceof Error ? err.message : "Unexpected error");
  }
}

export async function removePageFromCollection(input: RemovePageFromCollectionDto): Promise<CommandResult> {
  try {
    return await new RemovePageFromCollectionUseCase(makeCollectionRepo()).execute(input);
  } catch (err) {
    return commandFailureFrom("COLLECTION_REMOVE_PAGE_FAILED", err instanceof Error ? err.message : "Unexpected error");
  }
}

export async function addCollectionColumn(input: AddCollectionColumnDto): Promise<CommandResult> {
  try {
    return await new AddCollectionColumnUseCase(makeCollectionRepo()).execute(input);
  } catch (err) {
    return commandFailureFrom("COLLECTION_ADD_COLUMN_FAILED", err instanceof Error ? err.message : "Unexpected error");
  }
}

export async function archiveKnowledgeCollection(input: ArchiveKnowledgeCollectionDto): Promise<CommandResult> {
  try {
    return await new ArchiveKnowledgeCollectionUseCase(makeCollectionRepo()).execute(input);
  } catch (err) {
    return commandFailureFrom("COLLECTION_ARCHIVE_FAILED", err instanceof Error ? err.message : "Unexpected error");
  }
}
