"use server";

import { commandFailureFrom, type CommandResult } from "@shared-types";
import { FirebaseKnowledgeCollectionRepository } from "../../infrastructure/firebase/FirebaseKnowledgeCollectionRepository";
import {
  CreateKnowledgeCollectionUseCase,
  RenameKnowledgeCollectionUseCase,
  AddPageToCollectionUseCase,
  RemovePageFromCollectionUseCase,
  AddCollectionColumnUseCase,
  ArchiveKnowledgeCollectionUseCase,
} from "../../application/use-cases/KnowledgeCollectionUseCases";
import type {
  CreateKnowledgeCollectionDto,
  RenameKnowledgeCollectionDto,
  AddPageToCollectionDto,
  RemovePageFromCollectionDto,
  AddCollectionColumnDto,
  ArchiveKnowledgeCollectionDto,
} from "../../application/dto/KnowledgeCollectionDto";

const makeCollRepo = () => new FirebaseKnowledgeCollectionRepository();

export async function createKnowledgeCollection(input: CreateKnowledgeCollectionDto): Promise<CommandResult> {
  try { return await new CreateKnowledgeCollectionUseCase(makeCollRepo()).execute(input); }
  catch (e) { return commandFailureFrom("COLLECTION_CREATE_FAILED", (e as Error)?.message ?? "Unknown"); }
}

export async function renameKnowledgeCollection(input: RenameKnowledgeCollectionDto): Promise<CommandResult> {
  try { return await new RenameKnowledgeCollectionUseCase(makeCollRepo()).execute(input); }
  catch (e) { return commandFailureFrom("COLLECTION_RENAME_FAILED", (e as Error)?.message ?? "Unknown"); }
}

export async function addPageToCollection(input: AddPageToCollectionDto): Promise<CommandResult> {
  try { return await new AddPageToCollectionUseCase(makeCollRepo()).execute(input); }
  catch (e) { return commandFailureFrom("COLLECTION_ADD_PAGE_FAILED", (e as Error)?.message ?? "Unknown"); }
}

export async function removePageFromCollection(input: RemovePageFromCollectionDto): Promise<CommandResult> {
  try { return await new RemovePageFromCollectionUseCase(makeCollRepo()).execute(input); }
  catch (e) { return commandFailureFrom("COLLECTION_REMOVE_PAGE_FAILED", (e as Error)?.message ?? "Unknown"); }
}

export async function addCollectionColumn(input: AddCollectionColumnDto): Promise<CommandResult> {
  try { return await new AddCollectionColumnUseCase(makeCollRepo()).execute(input); }
  catch (e) { return commandFailureFrom("COLLECTION_ADD_COLUMN_FAILED", (e as Error)?.message ?? "Unknown"); }
}

export async function archiveKnowledgeCollection(input: ArchiveKnowledgeCollectionDto): Promise<CommandResult> {
  try { return await new ArchiveKnowledgeCollectionUseCase(makeCollRepo()).execute(input); }
  catch (e) { return commandFailureFrom("COLLECTION_ARCHIVE_FAILED", (e as Error)?.message ?? "Unknown"); }
}
